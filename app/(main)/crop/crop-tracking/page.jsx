"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import "./gantt.css";

const GanttTooltipPortal = dynamic(() => import("./GanttTooltipPortal"), { ssr: false });

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

function getKeyDates(row) {
  const start = row.start ? new Date(row.start) : null;
  const plant = start ? new Date(start) : null;
  const flower = start && row.daysToFlower ? addDays(row.start, row.daysToFlower) : null;
  const harvest = start && row.daysToMaturity ? addDays(row.start, row.daysToMaturity) : null;
  return {
    start,
    plant,
    flower,
    harvest,
  };
}

function getMonthIdx(date) {
  return date ? new Date(date).getMonth() : null;
}

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

  const rows = plantings.map((p) => {
    const loc = locations.find((l) => l.id === p.locationId);
    return {
      cropType: p.crop?.name || p.cropName || p.cropType || "-",
      planted: p.plantingQuantity,
      locationName: loc ? loc.name : "-",
      locationArea: loc && loc.area ? `${Number(loc.area).toLocaleString()} sqm` : "",
      start: p.plantingDate,
      seeding: p.seedingDate,
      daysToFlower: p.crop?.daysToFlower || 60,
      daysToMaturity: p.crop?.daysToMaturity || 80,
      harvestWindow: p.crop?.harvestWindow || 30,
    };
  });

  return (
    <div className="space-y-4 overflow-y-auto">
      <PageHeader title="Crop Tracking" />
      <div className="container mx-auto p-4 md:p-8 pt-24 md:pt-20">
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <span className="text-gray-500 hover:text-gray-700">Crop Production</span>
            </li>
            <li><span className="text-gray-400">/</span></li>
            <li className="flex items-center">
              <span className="text-gray-700 font-medium">Crop Tracking</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Crop Tracking Gantt Chart</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Update</button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg overflow-x-auto p-0 md:p-6"
        >
          <div className="flex items-center mb-4 px-4 md:px-0 pt-4 md:pt-0">
            <button className="border px-3 py-1 rounded flex items-center text-gray-700">
              <span className="mr-2">Filter</span>
              <svg width="16" height="16" fill="none" stroke="currentColor">
                <path d="M3 6h10M6 9h4M8 12h0" />
              </svg>
            </button>
          </div>

          <div className="w-full min-w-[1000px]">
            {/* Header grid dengan 17 kolom */}
            <div className="grid grid-cols-17 gap-0 border-b text-xs font-semibold text-gray-500" style={{ borderRight: '1px solid #e5e7eb' }}>
              <div className="col-span-1 py-2 px-2 border-r">Crop Type</div>
              <div className="col-span-1 py-2 px-2 border-r">#Planted</div>
              <div className="col-span-1 py-2 px-2 border-r">Location</div>
              <div className="col-span-2 py-2 px-2 border-r">Key Dates</div>
              {MONTHS.map((m, i) => (
                <div key={m} className={`col-span-1 py-2 px-2 text-center border-r last:border-r-0 ${i === currentMonth ? 'bg-green-50 font-bold text-green-700' : ''}`}>
                  {m}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="py-8 text-center">Loading...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-600">{error}</div>
            ) : (
              <AnimatePresence>
                {rows.map((row, idx) => {
                  const keyDates = getKeyDates(row);
                  const phases = [
                    {
                      phase: 'start',
                      start: row.seeding,
                      end: row.seeding,
                    },
                    {
                      phase: 'plant',
                      color: 'bg-green-500',
                      start: keyDates.plant,
                      end: keyDates.flower,
                    },
                    {
                      phase: 'flower',
                      color: 'bg-purple-500',
                      start: keyDates.flower,
                      end: keyDates.harvest,
                    },
                    {
                      phase: 'harvest',
                      color: 'bg-blue-500',
                      start: keyDates.harvest,
                      end: keyDates.harvest ? addDays(keyDates.harvest, row.harvestWindow) : null,
                    },
                  ];

                  const colorMap = {
                    'start': '#eab308',
                    'plant': '#22c55e',
                    'flower': '#a21caf',
                    'harvest': '#2563eb',
                  };

                  return (
                    <div key={idx} className="grid grid-cols-17 border-b text-sm items-center relative min-h-[48px]" style={{ borderRight: '1px solid #e5e7eb' }}>
                      <div className="col-span-1 py-2 px-2 border-r truncate font-medium flex items-center gap-2" title={row.cropType}>
                        <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-tr from-green-400 to-green-600"></span>
                        {row.cropType}
                      </div>
                      <div className="col-span-1 py-2 px-2 border-r">{Number(row.planted).toLocaleString()}</div>
                      <div className="col-span-1 py-2 px-2 border-r whitespace-normal break-words">
                        <div className="font-medium text-gray-900 leading-tight">{row.locationName}</div>
                        {row.locationArea && <div className="text-xs text-gray-500 leading-tight">{row.locationArea}</div>}
                      </div>
                      <div className="col-span-2 py-2 px-2 border-r">
                        <ul className="space-y-1 text-xs">
                          <li><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1 align-middle"></span>Start: {formatDate(keyDates.start)}</li>
                          <li><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 align-middle"></span>Plant: {formatDate(keyDates.plant)}</li>
                          <li><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1 align-middle"></span>Flower: {formatDate(keyDates.flower)}</li>
                          <li><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1 align-middle"></span>Harvest: {formatDate(keyDates.harvest)}</li>
                        </ul>
                      </div>
                      {/* Timeline Bar Layer - FLEXBOX */}
                      <div className="col-span-12 relative h-8 flex" style={{ width: '100%' }}>
                        {(() => {
                          const keyDates = getKeyDates(row);
                          const phases = [
                            { phase: 'start', start: row.seeding, end: row.seeding },
                            { phase: 'plant', start: keyDates.plant, end: keyDates.flower },
                            { phase: 'flower', start: keyDates.flower, end: keyDates.harvest },
                            { phase: 'harvest', start: keyDates.harvest, end: keyDates.harvest ? addDays(keyDates.harvest, row.harvestWindow) : null },
                          ];
                          const colorMap = {
                            'start': '#eab308',
                            'plant': '#22c55e',
                            'flower': '#a21caf',
                            'harvest': '#2563eb',
                          };
                          return phases.flatMap((phase) => {
                            if (!phase.start || !phase.end) return [];
                            const start = new Date(phase.start);
                            const end = new Date(phase.end);
                            const startMonth = start.getMonth();
                            const endMonth = end.getMonth();
                            const startYear = start.getFullYear();
                            const endYear = end.getFullYear();
                            // Hitung posisi left dan width proporsional terhadap 12 bulan
                            const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
                            const daysInEndMonth = new Date(endYear, endMonth + 1, 0).getDate();
                            const startFraction = (startMonth + (start.getDate() - 1) / daysInStartMonth) / 12;
                            const endFraction = (endMonth + (end.getDate() - 1) / daysInEndMonth) / 12;
                            const leftPercent = startFraction * 100;
                            let widthPercent = (endFraction - startFraction) * 100;
                            if (widthPercent + leftPercent > 100) {
                              widthPercent = 100 - leftPercent;
                            }
                            widthPercent = Math.max(0, widthPercent - 0.1); // Kurangi epsilon agar tidak overflow
                            if (start.getTime() === end.getTime()) {
                              widthPercent = 0.5; // minimal width agar tetap terlihat
                            }
                            return [
                              <div
                                key={phase.phase + '-' + startMonth}
                                className="absolute top-1 h-4 rounded shadow-sm tooltip"
                                style={{
                                  left: `${leftPercent}%`,
                                  width: `${widthPercent}%`,
                                  backgroundColor: colorMap[phase.phase],
                                }}
                                title={`${phase.phase.toUpperCase()} (${formatDate(phase.start)} - ${formatDate(phase.end)})`}
                              />
                            ];
                          });
                        })()}
                      </div>
                    </div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      <GanttTooltipPortal x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
        {tooltip.content}
      </GanttTooltipPortal>
    </div>
  );
}
