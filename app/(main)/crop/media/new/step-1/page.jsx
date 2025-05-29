"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import PageHeader from "@/components/layout/PageHeader";
import {
  IconAlertTriangle,
  IconDice4,
  IconDice6,
  IconMenu,
  IconMenu2,
} from "@tabler/icons-react";

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
    type: "bedengan",
    jumlahBedengan: "",
    panjangBedengan: "",
    lebarBedengan: "",
    jarakKelompokLegowo: "",
    jarakDalamLegowo: "",
    jarakBarisLegowo: "",
    luasLahan: "",
    panjangLahan: "",
    lebarLahan: "",
    nilaiTanah: "",
    paparan: sunExposureOptions[0],
    deskripsi: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const generateInternalId = async () => {
    if (form.internalId) return form.internalId;

    const prefix = form.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 4); // misalnya COFI

    let index = 1;
    let candidate = "";

    while (true) {
      candidate = `${prefix}${String(index).padStart(2, "0")}`;
      const res = await fetch(`/api/media/check-id?value=${candidate}`);
      const { exists } = await res.json();
      if (!exists) break;
      index++;
    }

    return candidate;
  };

  const validateForm = () => {
    const panjangLahan = parseFloat(form.panjangLahan) || 0;
    const lebarLahan = parseFloat(form.lebarLahan) || 0;
    const luasLahan = panjangLahan * lebarLahan;

    if (form.type === "bedengan") {
      const totalBedengan =
        form.jumlahBedengan * form.panjangBedengan * form.lebarBedengan;
      if (totalBedengan > luasLahan) {
        setError("Total luas bedengan tidak boleh melebihi luas lahan");
        return false;
      }
    } else if (form.type === "legowo") {
      const jarakKelompok = parseFloat(form.jarakKelompokLegowo) || 0; // in cm
      const jarakDalam = parseFloat(form.jarakDalamLegowo) || 0; // in cm
      const panjangLahan = parseFloat(form.panjangLahan) || 0; // in m
      const lebarLahan = parseFloat(form.lebarLahan) || 0; // in m
      const luasLahan = panjangLahan * lebarLahan; // in m²

      // Convert to meters
      const lebarPerUnit = (2 * jarakDalam + jarakKelompok) / 100; // in m

      // Validation checks
      if (lebarPerUnit > lebarLahan) {
        setError(
          `Lebar lahan tidak cukup. Dibutuhkan minimal ${lebarPerUnit.toFixed(2)}m per unit, lebar lahan hanya ${lebarLahan}m. Tambahkan lebar lahan atau atur Jarak legowo dan jarak tanaman jajar`,
        );
        return false;
      }

      if (lebarPerUnit <= 0) {
        setError("Konfigurasi jarak tidak valid (harus > 0)");
        return false;
      }

      const jumlahUnit = Math.floor(lebarLahan / lebarPerUnit);
      const luasDigunakan = jumlahUnit * lebarPerUnit * panjangLahan;

      console.log("Detail Perhitungan Legowo:");
      console.log("- Lebar per unit legowo:", lebarPerUnit, "m");
      console.log("- Jumlah unit legowo:", jumlahUnit);
      console.log("- Luas digunakan:", luasDigunakan.toFixed(2), "m²");
      console.log("- Luas lahan:", luasLahan.toFixed(2), "m²");
      console.log(
        "- Efisiensi:",
        ((luasDigunakan / luasLahan) * 100).toFixed(2),
        "%",
      );

      if (jumlahUnit < 1) {
        setError(
          "Tidak ada unit legowo yang bisa dibuat dengan konfigurasi ini",
        );
        return false;
      }

      if (luasDigunakan > luasLahan) {
        setError(
          `Konfigurasi legowo memerlukan ${luasDigunakan.toFixed(2)}m² (melebihi luas lahan ${luasLahan}m²)`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const internalId = await generateInternalId();

    const finalForm = {
      ...form,
      internalId, // overwrite kalau awalnya kosong
    };
    // Simpan data
    localStorage.setItem("media-step1", JSON.stringify(finalForm));
    router.push("/crop/media/new/step-2");
  };

  // luasJajarLegowo
  const calculateLegowoArea = () => {
    if (form.type !== "legowo") return { value: 0, warning: null };

    // Parse values
    const panjangLahan = parseFloat(form.panjangLahan) || 0;
    const lebarLahan = parseFloat(form.lebarLahan) || 0;
    const jarakKelompok = parseFloat(form.jarakKelompokLegowo) || 0;
    const jarakDalam = parseFloat(form.jarakDalamLegowo) || 0;

    // Check for missing values
    if (!panjangLahan || !lebarLahan || !jarakKelompok || !jarakDalam) {
      return {
        value: 0,
        warning: "Masukkan semua ukuran untuk menghitung luas",
      };
    }

    // Calculate width per unit
    const lebarPerUnit = (2 * jarakDalam + jarakKelompok) / 100;

    // Validate field width
    if (lebarPerUnit > lebarLahan) {
      return {
        value: 0,
        warning: `Lebar lahan tidak cukup. Dibutuhkan minimal ${lebarPerUnit.toFixed(2)}m`,
      };
    }

    // Calculate area
    const jumlahUnit = Math.floor(lebarLahan / lebarPerUnit);
    const luasDigunakan = jumlahUnit * lebarPerUnit * panjangLahan;

    return {
      value: luasDigunakan,
      warning: null,
    };
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
                <IconDice4 className="text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-600 md:text-base">
                  Tanam Berbaris
                </h3>
                <p className="hidden md:mt-1 md:block md:text-xs md:text-slate-500">
                  Satu tanaman yang ditanam dalam barisan yang cukup lebar.
                  Contoh: Jagung, Kacang Kedelai, Rami, Kentang, dll.
                </p>
              </button>

              {/* Opsi Baru: Jajar Legowo */}
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: "legowo" }))}
                className={clsx(
                  "space-y-2 rounded-lg border p-4 text-left shadow-sm transition hover:shadow-md",
                  form.type === "legowo"
                    ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                    : "border-slate-300 bg-white",
                )}
              >
                <IconDice6 className="text-slate-600" />{" "}
                <h3 className="text-sm font-semibold text-slate-600 md:text-base">
                  Jajar Legowo
                </h3>
                <p className="hidden md:mt-1 md:block md:text-xs md:text-slate-500">
                  Pola tanam dengan kelompok baris (contoh: 2 baris tanaman + 1
                  baris kosong). Cocok untuk padi dan jagung.
                </p>
              </button>
            </div>
          </div>

          {/* Tambahan jika bedengan */}
          {form.type === "bedengan" && (
            <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="label">Panjang lahan (m)</label>
                <input
                  name="panjangLahan"
                  type="number"
                  value={form.panjangLahan}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "bedengan"}
                />
              </div>
              <div>
                <label className="label">Lebar lahan (m)</label>
                <input
                  name="lebarLahan"
                  type="number"
                  value={form.lebarLahan}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "bedengan"}
                />
              </div>
              <div>
                <label className="label">Luas Lahan (m²)</label>
                <p className="input bg-slate-100">
                  {form.type === "bedengan"
                    ? form.panjangLahan * form.lebarLahan
                    : form.luasLahan}
                </p>
              </div>
              <div>
                <label className="label">Jumlah Bedengan</label>
                <input
                  name="jumlahBedengan"
                  type="number"
                  value={form.jumlahBedengan}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "bedengan"}
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
                  required={form.type === "bedengan"}
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
                  required={form.type === "bedengan"}
                />
              </div>
              <div className="md:col-span-3">
                <label className="label">Total Luas Bedengan (m²)</label>
                <p className="input bg-slate-100">
                  {form.jumlahBedengan *
                    form.panjangBedengan *
                    form.lebarBedengan}
                </p>
              </div>
            </div>
          )}

          {/* Tambahan jika baris*/}
          {form.type === "baris" && (
            <div>
              <label className="label">Luas Area (m²)</label>
              <input
                name="luasLahan"
                type="number"
                value={form.luasLahan}
                onChange={handleChange}
                className="input"
              />
              {/* Jika dikosongkan akan otomatis diisi ketika map telah di gambar */}
            </div>
          )}

          {/* Tambahan jika jajar legowo */}

          {form.type === "legowo" && (
            <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="label">Panjang Lahan(m)</label>
                <input
                  name="panjangLahan"
                  type="number"
                  value={form.panjangLahan}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "legowo"}
                />
              </div>
              <div>
                <label className="label">Lebar Lahan(m)</label>
                <input
                  name="lebarLahan"
                  type="number"
                  value={form.lebarLahan}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "legowo"}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Luas Lahan (m²)</label>
                <p className="input bg-slate-100">
                  {form.type === "legowo"
                    ? form.panjangLahan * form.lebarLahan
                    : form.luasLahan}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="label">Jarak Legowo (cm)</label>
                <input
                  name="jarakKelompokLegowo"
                  type="number"
                  value={form.jarakKelompokLegowo}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "legowo"}
                />
              </div>
              <div>
                <label className="label">Jarak Tanaman Jajar (cm)</label>
                <input
                  name="jarakDalamLegowo"
                  type="number"
                  value={form.jarakDalamLegowo}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "legowo"}
                />
              </div>
              <div>
                <label className="label">Jarak Baris Jajar (cm)</label>
                <input
                  name="jarakBarisLegowo"
                  type="number"
                  value={form.jarakBarisLegowo}
                  onChange={handleChange}
                  className="input"
                  required={form.type === "legowo"}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Luas Total Jajar Legowo (m²)</label>
                {(() => {
                  const result = calculateLegowoArea();
                  return (
                    <>
                      <p className="input bg-slate-100">
                        {result.value.toFixed(2) || "0.00"}
                      </p>
                      {result.warning && (
                        <p className="mt-1 text-sm text-red-600">
                          ⚠️ {result.warning}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}

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
              value={form.paparan}
              onChange={handleChange}
              required
              className="input text-slate-600"
            >
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
          {error && (
            <div className="mb-4 flex max-w-2xl items-center gap-2 rounded-md bg-red-100 p-3 text-red-700">
              <IconAlertTriangle size={24} className="flex-shrink-0" /> {error}
            </div>
          )}

          {/* Button */}
          <div className="mt-6 flex max-w-2xl items-center gap-2">
            <Link
              href="/crop/media"
              className="rounded-md border border-slate-300 bg-slate-100 px-6 py-2 text-sm font-semibold text-gray-500 hover:bg-slate-200"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Lanjut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
