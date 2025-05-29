"use client";

import { ColumnDef } from "@tanstack/react-table";

export const columns = [
  {
    accessorKey: "name",
    header: "Nama Media",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "internalId",
    header: "Internal ID",
  },
  {
    accessorKey: "type",
    header: "Format",
    cell: ({ row }) => row.getValue("type")?.toUpperCase(),
  },
  {
    header: "Luas Area (m²)",
    accessorKey: "luasLahan",
    cell: ({ row }) => {
      const media = row.original;
      const luasManual = media.luasLahan;
      const kalkulasi = media.panjangLahan && media.lebarLahan
        ? media.panjangLahan * media.lebarLahan
        : null;
      const polygonArea = media.polygons?.[0]?.area;
  
      const luas = luasManual ?? kalkulasi ?? polygonArea;
  
      return luas ? `${luas} m²` : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Dibuat",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
];
