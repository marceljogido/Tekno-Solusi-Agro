"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const GanttTooltipPortal = dynamic(() => import("./GanttTooltipPortal"), { ssr: false });

// Helper untuk format tanggal
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Hitung tanggal panen
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

export default function CropTrackingPage() {
  const [plantings, setPlantings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: null });

  const today = new Date();
  const currentMonth = today.getMonth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data crop planning dan lokasi
        const [plantingsRes, locationsRes] = await Promise.all([
          fetch("/api/plantings"),
          fetch("/api/media-locations")
        ]);
        if (!plantingsRes.ok || !locationsRes.ok) throw new Error("Gagal fetch data");
        const plantingsData = await plantingsRes.json();
        const locationsData = await locationsRes.json();
        setPlantings(plantingsData);
        setLocations(locationsData);
      } catch (err) {
        setError("Gagal memuat data crop tracking");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Gabungkan data planting dengan lokasi
  const rows = plantings.map((p) => {
    const loc = locations.find((l) => l.id === p.locationId);
    return {
      cropType: p.crop?.name || p.cropName || p.cropType || "-",
      planted: p.plantingQuantity,
      locationName: loc ? loc.name : "-",
      locationArea: loc && loc.area ? `${Number(loc.area).toLocaleString()} sqm` : "",
      start: p.plantingDate,
      daysToMaturity: p.daysToMaturity || (p.crop && p.crop.daysToMaturity) || 80,
    };
  });

  // Untuk Gantt: hitung posisi bar berdasarkan bulan
  function getBarPosition(startDate, days) {
    if (!startDate) return { startIdx: 0, endIdx: 0 };
    const start = new Date(startDate);
    const end = addDays(startDate, days);
    const startIdx = start.getMonth();
    const endIdx = end.getMonth();
    return { startIdx, endIdx, start, end };
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      <PageHeader title="Crop Tracking" />
      <div className="container mx-auto p-4 md:p-8 pt-24 md:pt-20">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <span className="text-gray-500 hover:text-gray-700">Crop Production</span>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-700 font-medium">Crop Tracking</span>
            </li>
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Crop Tracking Gantt Chart</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Update</button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-lg shadow-lg overflow-x-auto p-0 md:p-6">
          <div className="flex items-center mb-4 px-4 md:px-0 pt-4 md:pt-0">
            <button className="border px-3 py-1 rounded flex items-center text-gray-700"><span className="mr-2">Filter</span> <svg width="16" height="16" fill="none" stroke="currentColor"><path d="M3 6h10M6 9h4M8 12h0"/></svg></button>
          </div>
          <div className="w-full min-w-[900px]">
            {/* Header grid dengan garis vertikal */}
            <div className="grid grid-cols-15 gap-0 border-b text-xs font-semibold text-gray-500" style={{borderRight: '1px solid #e5e7eb'}}>
              <div className="col-span-1 py-2 px-2 border-r">Crop Type</div>
              <div className="col-span-1 py-2 px-2 border-r">#Planted</div>
              <div className="col-span-1 py-2 px-2 border-r">Location</div>
              {MONTHS.map((m, i) => (
                <div key={m} className={`col-span-1 py-2 px-2 text-center border-r last:border-r-0 ${i === currentMonth ? 'bg-green-50 font-bold text-green-700' : ''}`} style={{borderRight: i === 11 ? 'none' : '1px solid #e5e7eb'}}>{m}</div>
              ))}
            </div>
            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-600">{error}</div>
            ) : (
              <AnimatePresence>
                {rows.map((row, idx) => {
                  const { startIdx, endIdx, start, end } = getBarPosition(row.start, row.daysToMaturity);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`grid grid-cols-15 gap-0 border-b text-sm items-center relative min-h-[48px] ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}
                      style={{borderRight: '1px solid #e5e7eb'}}>
                      <div className="col-span-1 py-2 px-2 border-r truncate font-medium flex items-center gap-2" title={row.cropType}>
                        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-tr from-green-400 to-green-600"></span>
                        {row.cropType}
                      </div>
                      <div className="col-span-1 py-2 px-2 border-r">{Number(row.planted).toLocaleString()}</div>
                      <div className="col-span-1 py-2 px-2 border-r whitespace-normal break-words">
                        <div className="font-medium text-gray-900 leading-tight">{row.locationName}</div>
                        {row.locationArea && <div className="text-xs text-gray-500 leading-tight">{row.locationArea}</div>}
                      </div>
                      {Array.from({ length: 12 }).map((_, i) => {
                        if (i === startIdx) {
                          return (
                            <div
                              key={i}
                              className="col-span-1 py-2 px-2 relative border-r last:border-r-0 flex items-center h-full"
                              style={{ borderRight: i === 11 ? 'none' : '1px solid #e5e7eb', gridColumn: `span ${endIdx - startIdx + 1}` }}
                              onMouseEnter={e => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltip({
                                  visible: true,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top + rect.height + 8,
                                  content: (
                                    <div className="flex flex-col gap-1 bg-white border border-green-200 shadow-xl rounded-xl p-4 min-w-[200px] text-xs text-gray-700 animate-fade-in">
                                      <div className="font-bold text-green-700 mb-1 flex items-center gap-1"><svg width='16' height='16' fill='none' stroke='currentColor'><circle cx='8' cy='8' r='7' strokeWidth='2' className='text-green-400'/></svg> Crop Info</div>
                                      <div><b>Start:</b> {formatDate(row.start)}</div>
                                      <div><b>Days to Maturity:</b> {row.daysToMaturity} days</div>
                                      <div><b>Estimated Harvest date:</b> {formatDate(end)}</div>
                                    </div>
                                  )
                                });
                              }}
                              onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                            >
                              <div className="h-7 rounded-lg bg-gradient-to-r from-green-400 to-green-500 shadow-md relative cursor-pointer group/bar w-full transition-transform duration-200 hover:scale-105 hover:shadow-lg" style={{ minWidth: 0, width: '100%' }} />
                            </div>
                          );
                        } else if (i > startIdx && i <= endIdx) {
                          return null;
                        } else {
                          return (
                            <div key={i} className={`col-span-1 py-2 px-2 relative border-r last:border-r-0 ${i === currentMonth ? 'bg-green-50' : ''}`} style={{borderRight: i === 11 ? 'none' : '1px solid #e5e7eb'}}></div>
                          );
                        }
                      })}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
      {/* Tooltip Portal */}
      <GanttTooltipPortal x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
        {tooltip.content}
      </GanttTooltipPortal>
    </div>
  );
} 