"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, MoreVertical, Plus } from "lucide-react";

const dummyKebun = {
  "kebun-1": {
    nama: "Kebun 1",
    tanaman: [
      { id: "jalapeno", nama: "Jalapeno", luas: "1000 m²", mulai: "1 Mei 2025", panen: "1 Juli 2025" },
    ],
  },
  "kebun-2": {
    nama: "Kebun 2",
    tanaman: [
      { id: "jalapeno", nama: "Jalapeno", luas: "900 m²", mulai: "6 Mei 2025", panen: "6 Juli 2025" },
    ],
  },
  "kebun-3": {
    nama: "Kebun 3",
    tanaman: [
      { id: "padi", nama: "Padi", luas: "900 m²", mulai: "10 Mei 2025", panen: "10 Agustus 2025" },
    ],
  },
};

function ModalTambahPenanaman({ open, onClose, kebunNama }) {
  const [cropType, setCropType] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Penanaman</DialogTitle>
          <DialogDescription>
            Tambahkan tanaman baru ke {kebunNama}
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button className="w-full sm:w-auto">
            Berikutnya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DetailKebun({ params }) {
  const router = useRouter();
  const kebun = dummyKebun[params.mediaId] || { nama: "-", tanaman: [] };
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-4 sm:p-8">
      <ModalTambahPenanaman 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        kebunNama={kebun.nama} 
      />
      
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
          <h1 className="text-xl sm:text-2xl font-bold">{kebun.nama}</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto"
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
                {kebun.tanaman.map((t, i) => (
                  <TableRow 
                    key={i} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/crop-production/media/${params.mediaId}/${t.id}`)}
                  >
                    <TableCell>{t.nama}</TableCell>
                    <TableCell>{t.luas}</TableCell>
                    <TableCell>{t.mulai}</TableCell>
                    <TableCell>{t.panen}</TableCell>
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
                ))}
                {kebun.tanaman.length === 0 && (
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