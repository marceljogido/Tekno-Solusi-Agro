"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { IconInfoCircle } from "@tabler/icons-react";
import MapMediaManager from "@/components/maps/MapMediaManger";
import Link from "next/link";
import MapWrapper from "@/components/maps/MapWrapper";
import MapDraw from "@/components/maps/MapDraw";

export default function Step2Page() {
  const router = useRouter();
  const [hasPolygon, setHasPolygon] = useState(false);
  const [polygonData, setPolygonData] = useState(null);

  const handleContinue = () => {
    if (!polygonData) return;

    const { instance, ...safePolygonData } = polygonData;
    localStorage.setItem("media-polygon", JSON.stringify(safePolygonData));
    router.push("/crop/media/new/step-3");
  };

  return (
    <div>
      <PageHeader title="Area Mapping" />

      <div className="px-4 pt-18 pb-4 md:pt-14">
        <h1 className="my-4 text-xl font-bold text-slate-700">
          Tambah Media - Step 2
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

          <MapWrapper>
            <MapDraw
              onPolygonComplete={(data) => {
                setPolygonData(data);
                setHasPolygon(true);
              }}
            />
          </MapWrapper>

          <div className="flex justify-end gap-2">
            <Link
              href="/crop/media/new/step-1"
              className="rounded-md border border-slate-300 bg-slate-100 px-6 py-2 text-sm font-semibold text-gray-500 hover:bg-slate-200"
            >
              Kembali
            </Link>
            <button
              onClick={handleContinue}
              disabled={!hasPolygon}
              className={`rounded-md px-6 py-2 text-sm font-semibold text-white ${
                hasPolygon
                  ? "bg-green-600 hover:bg-green-700"
                  : "cursor-not-allowed bg-slate-400"
              }`}
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
