"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import PageHeader from "@/components/layout/PageHeader";
import { IconDice6, IconMenu, IconMenu2 } from "@tabler/icons-react";

const sunExposureOptions = [
  "Matahari Penuh",
  "Matahari Penuh hingga Sebagian",
  "Matahari Sebagian",
  "Matahari hingga Sebagian Teduh",
  "Sebagian Teduh",
  "Teduh Sepenuhnya",
];

export default function Step1Page() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    internalId: "",
    type: "bedengan", // or 'baris'
    jumlahBedengan: "",
    panjangBedengan: "",
    lebarBedengan: "",
    area: "",
    nilaiTanah: "",
    paparan: "",
    deskripsi: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan ke localStorage atau context nanti
    localStorage.setItem("media-step1", JSON.stringify(form));
    router.push("/crop/media/new/step-2");
  };

  return (
    <div>
      <PageHeader title="Informasi Media" />

      {/* content container */}
      <div className="px-4 pt-18 pb-4 md:pt-14">
        <h1 className="my-4 text-xl font-bold text-slate-700">
          Tambah Media – Step 1
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-md border border-slate-200 bg-white p-4"
        >
          {/* Nama Media */}
          <div>
            <label className="label">Nama Media *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input"
              placeholder="Contoh: Corn Field 1"
            />
          </div>

          {/* Internal ID */}
          <div>
            <label className="label">Internal ID (opsional)</label>
            <input
              name="internalId"
              value={form.internalId}
              onChange={handleChange}
              className="input"
              placeholder="Kosongkan untuk generate otomatis"
            />
          </div>

          {/* Format Penanaman */}
          <div className="max-w-2xl">
            <label className="mb-3 block text-sm font-semibold text-slate-500">
              Format Penanaman
            </label>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, type: "bedengan" }))
                }
                className={clsx(
                  "space-y-2 rounded-lg border p-4 text-left shadow-sm transition hover:shadow-md",
                  form.type === "bedengan"
                    ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                    : "border-slate-300 bg-white",
                )}
              >
                <IconMenu2 className="rotate-90 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-600 md:text-base">
                  Bedengan
                </h3>
                <p className="hidden md:mt-1 md:block md:text-xs md:text-slate-500">
                  Jumlah bedengan yang berbeda untuk berbagai tanaman.
                  Panjangnya sering kali 30 meter. Contoh: Wortel, Tomat, Bayam,
                  dll.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: "baris" }))}
                className={clsx(
                  "space-y-2 rounded-lg border p-4 text-left shadow-sm transition hover:shadow-md",
                  form.type === "baris"
                    ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                    : "border-slate-300 bg-white",
                )}
              >
                <IconDice6 className="text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-600 md:text-base">
                  Tanam Berbaris
                </h3>
                <p className="hidden md:mt-1 md:block md:text-xs md:text-slate-500">
                  Satu tanaman yang ditanam dalam barisan yang cukup lebar.
                  Contoh: Jagung, Kacang Kedelai, Rami, Kentang, dll.
                </p>
              </button>
            </div>
          </div>

          {/* Tambahan jika bedengan */}
          {form.type === "bedengan" && (
            <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="label">Jumlah Bedengan</label>
                <input
                  name="jumlahBedengan"
                  type="number"
                  value={form.jumlahBedengan}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Panjang Bedengan (m)</label>
                <input
                  name="panjangBedengan"
                  type="number"
                  value={form.panjangBedengan}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Lebar Bedengan (m)</label>
                <input
                  name="lebarBedengan"
                  type="number"
                  value={form.lebarBedengan}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          )}

          {/* Luas Area */}
          <div>
            <label className="label">Luas Area (m²)</label>
            <input
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Nilai Tanah */}
          <div>
            <label className="label">Perkiraan Nilai Tanah (Rp)</label>
            <input
              name="nilaiTanah"
              type="number"
              value={form.nilaiTanah}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Paparan sinar matahari */}
          <div>
            <label className="label">Paparan Sinar Matahari</label>
            <select
              name="paparan"
              defaultValue={sunExposureOptions[0]}
              value={form.paparan}
              onChange={handleChange}
              required
              className="input text-slate-600"
            >
              <option value="">Pilih...</option>
              {sunExposureOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="label">Deskripsi (opsional)</label>
            <textarea
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Tambahkan catatan jika perlu..."
            />
          </div>

          {/* Button */}
          <div className="mt-6 flex items-center gap-2">
            <Link
              href="/crop/media"
              className="rounded-md border border-slate-300 bg-slate-100 px-6 py-2 text-sm font-semibold text-gray-500 hover:bg-slate-200"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Lanjut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
