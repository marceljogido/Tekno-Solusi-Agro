"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, Plus, Calendar, Seed } from "lucide-react";
import React, { useState, useEffect } from "react";

function InfoCard({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function HistoryItem({ label, date, loss }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mt-1">
        <Calendar className="h-4 w-4" />
      </div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{date}</div>
        {loss && <div className="text-xs text-muted-foreground">{loss}</div>}
      </div>
    </div>
  );
}

export default function DetailTanaman({ params }) {
  const router = useRouter();
  const { mediaId, cropId } = React.use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fallbackCrop, setFallbackCrop] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/plantings/${cropId}`);
        if (res.ok) {
          const detail = await res.json();
          setData(detail);
        } else {
          // Jika gagal, coba fetch dari crops (mycrop)
          const cropRes = await fetch(`/api/crops/${cropId}`);
          if (cropRes.ok) {
            const cropData = await cropRes.json();
            setFallbackCrop(cropData);
          }
          setData(null);
        }
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [cropId]);

  // Breadcrumb
  const namaLahan = data?.location?.name || "-";
  const namaTanaman = data?.crop?.name || fallbackCrop?.name || "-";

  if (loading) return <div className="p-8">Memuat data...</div>;
  if (!data && !fallbackCrop) return <div className="p-8 text-red-600">Data tidak ditemukan</div>;

  // Gunakan data dari fallbackCrop jika data utama tidak ada
  const detailData = data || fallbackCrop;

  return (
    <div className="p-4 sm:p-8">
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2">
          <li className="flex items-center">
            <span className="text-gray-500 hover:text-gray-700">Crop Production</span>
          </li>
          <li><span className="text-gray-400">/</span></li>
          <li className="flex items-center">
            <span className="text-gray-500 hover:text-gray-700">Media Management</span>
          </li>
          <li><span className="text-gray-400">/</span></li>
          <li className="flex items-center">
            <span className="text-gray-500 hover:text-gray-700">{namaLahan}</span>
          </li>
          <li><span className="text-gray-400">/</span></li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">{namaTanaman}</span>
          </li>
        </ol>
      </nav>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">
            {namaLahan} • {namaTanaman}
          </h1>
        </div>
        <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Update Pertumbuhan
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Ringkasan">
            <InfoItem label="Tanaman" value={namaTanaman} />
            <InfoItem label="Lokasi" value={namaLahan} />
            <InfoItem label="ID Internal" value={detailData.electronicId || detailData.id || "-"} />
            <InfoItem label="Luas Ditanam" value={detailData.plantingQuantity || "-"} />
            <InfoItem label="Tahap Pertumbuhan" value={detailData.status || "-"} />
            <InfoItem label="Nilai Pasar" value={detailData.estimatedProfit || "-"} />
          </InfoCard>
          <InfoCard title="Detail Penanaman">
            <InfoItem label="Metode Awal" value={detailData.plantingMethod || detailData.startMethod || "-"} />
            <InfoItem label="Benih Disemai" value={detailData.seedingDate ? new Date(detailData.seedingDate).toLocaleDateString() : "-"} />
            <InfoItem label="Tanggal Tanam" value={detailData.plantingDate ? new Date(detailData.plantingDate).toLocaleDateString() : "-"} />
            <InfoItem label="Ukuran Tray" value={detailData.traySize || "-"} />
            <InfoItem label="Perkiraan Awal per Tray" value={detailData.estStartsPerTray || "-"} />
            <InfoItem label="Jumlah Tray" value={detailData.numberOfTrays || "-"} />
            <InfoItem label="Tingkat Perkecambahan" value={detailData.germination || detailData.germinationRate || "-"} />
            <InfoItem label="Info Penanaman" value={detailData.plantingInfo || detailData.plantingDetails || "-"} />
          </InfoCard>
          <InfoCard title="Informasi Panen">
            <InfoItem label="Rencana Panen Pertama" value={detailData.harvestPlan || "-"} />
            <InfoItem label="Panen Pertama" value={detailData.firstHarvest || "-"} />
            <InfoItem label="Panen Terakhir" value={detailData.lastHarvest || "-"} />
            <InfoItem label="Jumlah Dipanen" value={detailData.amountHarvested || "-"} />
          </InfoCard>
          <InfoCard title="Detail Benih">
            <InfoItem label="Perusahaan Benih" value={detailData.seedCompany || "-"} />
            <InfoItem label="Jenis Benih" value={detailData.seedType || "-"} />
            <InfoItem label="Nomor Lot" value={detailData.lotNumber || "-"} />
            <InfoItem label="Asal" value={detailData.origin || "-"} />
          </InfoCard>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Penanaman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-muted-foreground text-sm">Belum ada riwayat penanaman.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 