import PageHeader from "@/components/layout/PageHeader";
import React from "react";
import Link from "next/link";

const page = () => {
  const media = [];

  return (
    <div className="space-y-4">
      <PageHeader title="Media Management" />

      {/* Content Container */}
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

        {/* List or Empty */}
        {media.length === 0 ? (
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
          <div>{/* TODO: Tampilkan tabel */}</div>
        )}
      </div>
    </div>
  );
};

export default page;
