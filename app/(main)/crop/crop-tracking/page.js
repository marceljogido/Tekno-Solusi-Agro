"use client";

import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const months = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

function getMonthIndex(date) {
  return date.getMonth();
}

function getBarStyle(start, end) {
  const startIdx = getMonthIndex(start);
  const endIdx = getMonthIndex(end);
  const left = (startIdx / 12) * 100;
  const width = ((endIdx - startIdx + 1) / 12) * 100;
  return { left: `${left}%`, width: `${width}%` };
}

export default function CropTrackingPage() {
  const [hovered, setHovered] = useState(null);
  const [plantings, setPlantings] = useState([]);
  useEffect(() => {
    fetch('/api/plantings')
      .then(res => res.json())
      .then(setPlantings);
  }, []);
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
        <span>Crop Production</span>
        <span>/</span>
        <span className="font-semibold text-gray-700">Crop Tracking</span>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Crop Tracking Gantt Chart</h1>
        <div className="flex gap-2">
          <button className="flex items-center border px-4 py-2 rounded shadow-sm bg-white hover:bg-gray-50 text-gray-700">
            <FaFilter className="mr-2" /> Filter
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 font-semibold">Update</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left font-semibold text-gray-700">Jenis Tanaman</th>
              <th className="p-3 text-left font-semibold text-gray-700">Jumlah Ditanam</th>
              <th className="p-3 text-left font-semibold text-gray-700">Lokasi</th>
              {months.map((m, i) => (
                <th key={i} className="p-3 text-center font-normal text-gray-500 border-r last:border-none">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plantings.map((row, i) => {
              const start = row.start_date ? new Date(row.start_date) : null;
              const end = row.estimated_harvest_date ? new Date(row.estimated_harvest_date) : null;
              const daysToMaturity = start && end ? Math.round((end - start) / (1000 * 60 * 60 * 24)) : '-';
              const startIdx = start ? getMonthIndex(start) : -1;
              const endIdx = end ? getMonthIndex(end) : -1;
              return (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{row.crop_type}</td>
                  <td className="p-3">{row.amount_planted}</td>
                  <td className="p-3">{row.media_name}</td>
                  {months.map((_, idx) => (
                    <td key={idx} className="relative h-12 w-16 border-r last:border-none">
                      {idx === startIdx && start && end && (
                        <div
                          className="absolute top-2 h-7 rounded-lg bg-gradient-to-r from-green-500 to-green-400 shadow-md cursor-pointer transition-transform hover:scale-105"
                          style={{ width: `calc(${(endIdx - startIdx + 1) * 100}% / 12)`, left: 0 }}
                          onMouseEnter={() => setHovered(i)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          {hovered === i && (
                            <div className="absolute z-10 left-1/2 -translate-x-1/2 top-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm min-w-[200px] text-gray-700 animate-fade-in">
                              <div className="mb-1">Mulai: <b>{start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</b></div>
                              <div className="mb-1">Hari ke Matang: <b>{daysToMaturity} hari</b></div>
                              <div>Estimasi Panen: <b>{end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</b></div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 