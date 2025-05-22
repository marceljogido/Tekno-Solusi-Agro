"use client";

import { useState } from "react";
import MapPolygonManager from "@/components/maps/MapPolygonManager";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { IconInfoCircle } from "@tabler/icons-react";

export default function Step2Page() {
  const [polygon, setPolygon] = useState(null);
  const router = useRouter();

  const handleNext = () => {
    if (!polygon) return alert("Silakan gambar area terlebih dahulu");
    localStorage.setItem("media-step2", JSON.stringify(polygon));
    router.push("/media/new/step-3");
  };

  // const handleDone = (data) => {
  //   localStorage.setItem("media-step2", JSON.stringify(data));
  //   router.push("/media/new/step-3");
  // };

  return (
    <div>
      <PageHeader title="Area Mapping" />

      <div className="px-4 pt-18 pb-4 md:pt-14">
        <h1 className="my-4 text-xl font-bold text-slate-700">
          Tambah media - Step 2
        </h1>

        <div className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-4">
          <div className="flex w-full items-center gap-4">
            <div className="h-fit w-fit rounded-full bg-yellow-500 p-2">
              <IconInfoCircle className="text-white" size={24} />
            </div>
            <p className="text-slate-600">
              <span className="font-bold">Petunjuk : </span>
              Gambar area pada map dengan cara klik beberapa titik. Untuk
              menyelesaikan gambar, pastikan titik awal dan akhir bertemu.
            </p>
          </div>

          <MapPolygonManager />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!polygon}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:bg-slate-400"
            >
              Lanjut ke Step 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
