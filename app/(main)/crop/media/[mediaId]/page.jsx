"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, MoreVertical, Plus } from "lucide-react";
import React from "react";

function ModalTambahPenanaman({ open, onClose, kebunNama }) {
  const [cropType, setCropType] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-lg font-bold mb-2">Tambah Penanaman</h2>
        <p className="text-sm text-gray-600 mb-4">Tambahkan tanaman baru ke {kebunNama}</p>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Jenis Tanaman</label>
            <Input
              value={cropType}
              onChange={e => setCropType(e.target.value)}
              placeholder="Contoh: Jalapeno"
            />
            <Button variant="outline" size="sm" className="w-full" disabled>
              Tambah Jenis Tanaman Baru
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Lokasi Penanaman</label>
            <Input value={kebunNama} disabled />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button className="w-full sm:w-auto">
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DetailKebun({ params }) {
  const { mediaId } = React.use(params);
  const router = useRouter();
  const [kebun, setKebun] = useState({ nama: "-", plantings: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchKebun() {
      setLoading(true);
      try {
        const res = await fetch(`/api/media_locations/${mediaId}`);
        if (!res.ok) throw new Error("Gagal mengambil data lahan");
        const data = await res.json();
        setKebun({
          nama: data.name || "-",
          plantings: data.plantings || [],
        });
      } catch (e) {
        setKebun({ nama: "-", plantings: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchKebun();
  }, [mediaId]);

  return (
    <div className="p-4 sm:p-8">
      <ModalTambahPenanaman 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        kebunNama={kebun.nama} 
      />
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2">
          <li className="flex items-center">
            <span className="text-gray-500 hover:text-gray-700">Crop Production</span>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-gray-500 hover:text-gray-700">Media Management</span>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">{kebun.nama}</span>
          </li>
        </ol>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{kebun.nama}</h1>
      
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
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
           
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Penanaman
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Opsi Media
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input
              placeholder="Cari di sini..."
              className="w-full sm:w-64"
            />
            <Button variant="outline" className="w-full sm:w-auto">
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Tanaman</TableHead>
                  <TableHead>Luas Ditanam</TableHead>
                  <TableHead>Mulai</TableHead>
                  <TableHead>Panen</TableHead>
                  <TableHead className="w-[50px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : kebun.plantings.length > 0 ? (
                  kebun.plantings.map((t, i) => (
                    <TableRow 
                      key={i} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/crop/media/${mediaId}/${t.id}`)}
                    >
                      <TableCell>{t.cropName || '-'}</TableCell>
                      <TableCell>{t.plantingQuantity || '-'}</TableCell>
                      <TableCell>{t.plantingDate ? new Date(t.plantingDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{t.harvestPlan || '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Belum ada tanaman yang ditambahkan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 