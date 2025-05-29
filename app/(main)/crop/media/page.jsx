"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        setMedia(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Gagal ambil data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader title="Media Management" />

      <div className="px-4 pt-24 md:pt-20">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-slate-700 dark:text-white">
            Daftar Media Tanam
          </h1>
          <Link
            href="media/new/step-1"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
          >
            + Tambah Media
          </Link>
        </div>

        <div className="bg-white p-4 rounded-md border">

        {loading ? (
          <p className="text-center text-slate-500">Memuat data...</p>
        ) : media.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-white">
              Belum ada media tanam
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Klik tombol “+ Tambah Media” di kanan atas untuk mulai menambahkan
              area tanam.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={media} />
        )}
        </div>

      </div>
    </div>
  );
}
