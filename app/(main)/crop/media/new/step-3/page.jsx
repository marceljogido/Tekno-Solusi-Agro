"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";

export default function Step3Page() {
  const [media, setMedia] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const m = localStorage.getItem("media-step1");
    const p = localStorage.getItem("media-polygon");

    if (m && p) {
      setMedia(JSON.parse(m));
      setPolygon(JSON.parse(p));
      const parsedMedia = JSON.parse(m);
      const parsedPolygon = JSON.parse(p);

      console.log("[Preview Payload ke DB]:", {
        media: parsedMedia,
        polygon: parsedPolygon,
      });
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: JSON.stringify({ media, polygon }),
      });

      if (!res.ok) throw new Error("Gagal simpan");

      alert("Horeee Berhasil menyimpan data!");

      // bersihkan localStorage & redirect
      localStorage.removeItem("media-step1");
      localStorage.removeItem("media-polygon");
      router.push("/crop/media");
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  if (!media || !polygon) return <p className="p-4">Memuat data...</p>;
  return (
    <div>
      <PageHeader title="Simpan Media Tanam" />

      <div className="px-4 pt-18 pb-4 md:pt-14">
        <h1 className="my-4 text-xl font-bold text-slate-700">
          Overview - Step 3
        </h1>

        <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4">
          <div className="flex w-full flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* kolom 1 */}
              <div>
                <h3 className="rounded-md bg-slate-100 p-3 text-center font-mono font-semibold text-slate-700 uppercase">
                  informasi media
                </h3>
                <div className="w-full space-y-4 p-4 text-sm text-slate-600">
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Nama Media</span>
                    <span className="value-detail">{media.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">ID Internal</span>
                    <span className="value-detail">
                      {media.internalId || "(otomatis)"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Format Penanaman</span>
                    <span className="value-detail">{media.type}</span>
                  </div>

                  {/* Jika format penanaman bedengan */}
                  {media.type == "bedengan" && (
                    <div className="w-full space-y-4 px-4 text-sm text-slate-600">
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Panjang Lahan</span>
                        <span className="value-detail">
                          {media.panjangLahan} m
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Lebar Lahan</span>
                        <span className="value-detail">
                          {media.lebarLahan} m
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Jumlah Bedengan</span>
                        <span className="value-detail">
                          {media.jumlahBedengan} bedengan
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Panjang Bedengan</span>
                        <span className="value-detail">
                          {media.panjangBedengan} m
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Lebar Bedengan</span>
                        <span className="value-detail">
                          {media.lebarBedengan} m
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Jika format penanaman baris */}
                  {media.type == "baris" && (
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-right">Luas Lahan</span>
                      <span className="value-detail">
                        {media.luasLahan || "Menggunakan Luas Polygon"}
                      </span>
                    </div>
                  )}

                  {/* Jika format penanaman jajar legowo */}
                  {media.type == "legowo" && (
                    <div className="w-full space-y-4 px-4 text-sm text-slate-600">
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Panjang Lahan</span>
                        <span className="value-detail">
                          {media.panjangLahan} m
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Lebar Lahan</span>
                        <span className="value-detail">
                          {media.lebarLahan} m
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Jarak Legowo</span>
                        <span className="value-detail">
                          {media.jarakKelompokLegowo} cm
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Jarak dalam Kelompok</span>
                        <span className="value-detail">
                          {media.jarakDalamLegowo} cm
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-right">Jarak baris Kelompok</span>
                        <span className="value-detail">
                          {media.jarakBarisLegowo} cm
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Nilai Tanah</span>
                    <span className="value-detail">
                      Rp {media.nilaiTanah?.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Paparan Sinar</span>
                    <span className="value-detail">{media.paparan}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Deskripsi</span>
                    <span className="value-detail">
                      {media.deskripsi || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* kolom 2 */}
              <div>
                <h3 className="rounded-md bg-slate-100 p-3 text-center font-mono font-semibold text-slate-700 uppercase">
                  Area Mapping
                </h3>
                <div className="w-full space-y-3 p-4 text-sm text-slate-600">
                  {media.type === "baris" && (
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-right">Luas Polygon</span>
                      <span className="value-detail">{polygon.area} m²</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Koordinat Latitude</span>
                    <span className="value-detail">{polygon.center.lat}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Koordinat Longitude</span>
                    <span className="value-detail">{polygon.center.lng}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-right">Jumlah Titik</span>
                    <span className="value-detail">
                      {polygon.path.length} titik
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-2 h-[1px] w-full bg-slate-300"></div>
            {/* Confirmation section */}
            <div className="flex w-full justify-end">
              <div className="flex w-full max-w-2xl flex-col gap-8 md:flex md:flex-row md:justify-between md:gap-4">
                <div className="space-y-4">
                  <div className="font-bold text-slate-700">Perhatian</div>
                  <div className="text-slate-500">
                    Data diatas akan disimpan,<br></br>pastikan semuanya sudah
                    sesuai ya bro!
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 sm:justify-center md:w-48 md:flex-col-reverse">
                  <Link
                    href="/crop/media/new/step-2"
                    className="flex h-fit w-fit justify-center rounded-md border border-slate-300 bg-slate-100 px-6 py-2 text-base font-semibold text-gray-500 hover:bg-slate-200 md:w-full"
                  >
                    Kembali
                  </Link>
                  <button onClick={handleSubmit}
                  className="flex h-fit w-fit justify-center rounded-md bg-green-600 px-4 py-2 text-base font-semibold text-white hover:bg-green-700 md:w-full">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
