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

const dummyDetail = {
  jalapeno: {
    crop: "Cabai, Jalapeno",
    lokasi: "Kebun 2",
    id: "COSW-F20",
    luas: "900 m²",
    tahap: "Ditanam",
    nilai: "Rp. 0,00",
    startMethod: "Semai di tray, pindah ke tanah",
    seedStart: "6 Mei 2025",
    plantingDate: "6 Mei 2025",
    traySize: "",
    estStartsPerTray: "",
    numberOfTrays: "",
    germination: "100% dalam 7 hari",
    plantingInfo: "30 cm antar tanaman, 30 cm antar baris.",
    plannedHarvest: "25 Juli 2025 (3 bulan)",
    firstHarvest: "",
    lastHarvest: "",
    amountHarvested: "0,00 kg dipanen",
    seedCompany: "-",
    seedType: "GMO",
    lotNumber: "",
    origin: "",
    plantingHistory: [
      { label: "Benih Disemai", date: "6 Mei 2025" },
      { label: "Ditanam", date: "6 Mei 2025", loss: "0% loss dari Benih Disemai" },
    ],
  },
  padi: {
    crop: "Padi",
    lokasi: "Kebun 3",
    id: "PAD-001",
    luas: "900 m²",
    tahap: "Ditanam",
    nilai: "Rp. 0,00",
    startMethod: "Langsung tanam di lahan",
    seedStart: "10 Mei 2025",
    plantingDate: "10 Mei 2025",
    traySize: "-",
    estStartsPerTray: "-",
    numberOfTrays: "-",
    germination: "95% dalam 10 hari",
    plantingInfo: "20 cm antar tanaman, 25 cm antar baris.",
    plannedHarvest: "10 Agustus 2025 (3 bulan)",
    firstHarvest: "",
    lastHarvest: "",
    amountHarvested: "0,00 kg dipanen",
    seedCompany: "-",
    seedType: "Hibrida",
    lotNumber: "-",
    origin: "-",
    plantingHistory: [
      { label: "Benih Disemai", date: "10 Mei 2025" },
      { label: "Ditanam", date: "10 Mei 2025", loss: "0% loss dari Benih Disemai" },
    ],
  },
};

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
  const data = dummyDetail[params.cropId] || {};

  return (
    <div className="p-4 sm:p-8">
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
            {data.lokasi} • {data.crop}
          </h1>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Update Pertumbuhan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Ringkasan">
            <InfoItem label="Tanaman" value={data.crop} />
            <InfoItem label="Lokasi" value={data.lokasi} />
            <InfoItem label="ID Internal" value={data.id} />
            <InfoItem label="Luas Ditanam" value={data.luas} />
            <InfoItem label="Tahap Pertumbuhan" value={data.tahap} />
            <InfoItem label="Nilai Pasar" value={data.nilai} />
          </InfoCard>

          <InfoCard title="Detail Penanaman">
            <InfoItem label="Metode Awal" value={data.startMethod} />
            <InfoItem label="Benih Disemai" value={data.seedStart} />
            <InfoItem label="Tanggal Tanam" value={data.plantingDate} />
            <InfoItem label="Ukuran Tray" value={data.traySize} />
            <InfoItem label="Perkiraan Awal per Tray" value={data.estStartsPerTray} />
            <InfoItem label="Jumlah Tray" value={data.numberOfTrays} />
            <InfoItem label="Tingkat Perkecambahan" value={data.germination} />
            <InfoItem label="Info Penanaman" value={data.plantingInfo} />
          </InfoCard>

          <InfoCard title="Informasi Panen">
            <InfoItem label="Rencana Panen Pertama" value={data.plannedHarvest} />
            <InfoItem label="Panen Pertama" value={data.firstHarvest} />
            <InfoItem label="Panen Terakhir" value={data.lastHarvest} />
            <InfoItem label="Jumlah Dipanen" value={data.amountHarvested} />
          </InfoCard>

          <InfoCard title="Detail Benih">
            <InfoItem label="Perusahaan Benih" value={data.seedCompany} />
            <InfoItem label="Jenis Benih" value={data.seedType} />
            <InfoItem label="Nomor Lot" value={data.lotNumber} />
            <InfoItem label="Asal" value={data.origin} />
          </InfoCard>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Penanaman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.plantingHistory?.map((h, i) => (
                  <HistoryItem
                    key={i}
                    label={h.label}
                    date={h.date}
                    loss={h.loss}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 