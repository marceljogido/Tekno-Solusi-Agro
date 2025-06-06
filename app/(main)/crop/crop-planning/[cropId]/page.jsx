'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddNewPlanForm from '@/components/crop-production/AddNewPlanForm';
import PageHeader from '@/components/layout/PageHeader';
import dynamic from 'next/dynamic';
import { useLoadScript } from "@react-google-maps/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter } from 'recharts';

const MediaMap = dynamic(() => import('@/components/maps/MediaMap'), { ssr: false });

export default function CropPlanningDetailPage({ params }) {
  const { cropId } = React.use ? React.use(params) : params;
  const router = useRouter();
  const [crop, setCrop] = useState(null);
  const [plantings, setPlantings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropRes, plantingsRes, locationsRes] = await Promise.all([
          fetch(`/api/crops/${cropId}`),
          fetch(`/api/plantings?cropId=${cropId}`),
          fetch('/api/media-locations')
        ]);

        if (!cropRes.ok || !plantingsRes.ok || !locationsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const cropData = await cropRes.json();
        const plantingsData = await plantingsRes.json();
        const locationsData = await locationsRes.json();

        // Parse geometry jika masih string
        locationsData.forEach(loc => {
          if (typeof loc.geometry === 'string') {
            try {
              loc.geometry = JSON.parse(loc.geometry);
            } catch (e) {
              loc.geometry = null;
            }
          }
        });

        setCrop(cropData);
        setPlantings(plantingsData);
        setLocations(locationsData);
      } catch (err) {
        setError('Gagal memuat data. Silakan coba lagi.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cropId]);

  const handleAddNewPlan = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSuccess = async () => {
    try {
      const response = await fetch(`/api/plantings?cropId=${cropId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plantings');
      }
      const data = await response.json();
      setPlantings(data);
    } catch (err) {
      console.error('Error refreshing plantings:', err);
    }
    handleCloseForm();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (number) => {
    if (!number) return '0';
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const formatArea = (area) => {
    if (!area) return '-';
    // Convert to number and remove trailing zeros
    const formattedNumber = Number(area).toString();
    return `${formattedNumber} m²`;
  };

  // Siapkan mediaData untuk MediaMap
  const mediaDataForMap = locations.filter(loc => plantings.some(p => p.locationId === loc.id && loc.geometry && loc.geometry.type && loc.geometry.coordinates));
  console.log('mediaData for MediaMap:', mediaDataForMap);

  // Fungsi bantu untuk group by bulan dan jumlahkan yield
  function getHarvestData(plantings) {
    // Map: { '2025-06': totalYield }
    const monthMap = {};
    plantings.forEach(p => {
      if (p.harvestPlan && p.estimatedYield) {
        const date = new Date(p.harvestPlan);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        if (!monthMap[key]) monthMap[key] = 0;
        monthMap[key] += Number(p.estimatedYield);
      }
    });
    // Convert to array sorted by date
    return Object.entries(monthMap).map(([month, yieldVal]) => ({ month, yield: yieldVal })).sort((a, b) => {
      // Sort by year then month
      const [ma, ya] = a.month.split(' ');
      const [mb, yb] = b.month.split(' ');
      if (ya !== yb) return Number(ya) - Number(yb);
      return new Date(`${ma} 1, 2000`) - new Date(`${mb} 1, 2000`);
    });
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Data tanaman tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      <PageHeader title="Detail Rencana Tanam" />
      
      <div className="container mx-auto p-4 md:p-8 space-y-6 pt-24 md:pt-20">
        {/* DASHBOARD SUMMARY START */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Maps */}
          <div className="bg-white rounded-2xl shadow p-0 overflow-hidden flex flex-col relative">
            <div className="p-4 pb-0 font-semibold text-gray-700">{plantings.length} Location Planted</div>
            <div className="w-full h-64 relative">
              {!isLoaded ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-400">Loading Map...</span>
                </div>
              ) : loadError ? (
                <div className="text-red-500">Failed to load map</div>
              ) : (
                <MediaMap 
                  mediaData={mediaDataForMap}
                />
              )}
              {/* Fullscreen button */}
              <button className="absolute bottom-3 right-3 bg-white shadow rounded-full p-2 hover:bg-gray-100 transition z-10" title="Fullscreen">
                <svg width="20" height="20" fill="none"><rect x="3" y="3" width="14" height="14" rx="3" stroke="#888" strokeWidth="2"/><path d="M7 7h2v2H7V7zm4 4h2v2h-2v-2z" fill="#888"/></svg>
              </button>
            </div>
          </div>
          {/* Harvest */}
          <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
  {/* Header */}
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-gray-800">Harvest</h2>
    <p className="text-sm text-gray-500">Yield bales (%)</p>
  </div>

  {/* Chart Container */}
  <div className="relative flex-1 min-h-[160px] flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
    {/* Line Chart */}
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={[
          { month: '', yield: 0 },
          { month: '', yield: 0 }
        ]}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="month" hide />
        <YAxis hide />
        <Line
          type="linear"
          dataKey="yield"
          stroke="#d1d5db"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>

            ```` {/* Empty Data Info */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white shadow rounded-lg px-4 py-3 text-center">
                  <svg
                    className="w-5 h-5 mx-auto mb-2 text-gray-400 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium leading-tight">
                    Data belum tersedia.<br />Silakan lakukan panen terlebih dahulu.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Summary */}
          <div className="flex flex-col gap-4 h-full justify-center items-center">
            <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-6 w-full text-center">
              <div className="text-xs text-gray-500">Total Land Area</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{
                plantings.reduce((sum, p) => {
                  const loc = locations.find(l => l.id === p.locationId);
                  return sum + (loc?.area ? Number(loc.area) : 0);
                }, 0)
              }sqm</div>
              <div className="text-green-500 text-xs mt-1">100% Planted</div>
              <div className="bg-green-100 text-green-600 rounded-full p-4 mt-4">
                <svg width="24" height="24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center p-6 w-full text-center">
              <div className="text-xs text-gray-500">Revenue</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">Rp. {
                plantings.reduce((sum, p) => sum + (p.estimatedProfit ? Number(p.estimatedProfit) : 0), 0).toLocaleString('id-ID')
              }</div>
              <div className="text-green-500 text-xs mt-1">+12% from last month</div>
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-4 mt-4">
                <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
        </div>
        {/* DASHBOARD SUMMARY END */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{crop.name}</h1>
            <p className="text-gray-600 mt-1">{crop.variety}</p>
          </div>
          <button
            onClick={handleAddNewPlan}
            className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Tambah Rencana Baru
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="font-semibold mb-4">Informasi Tanaman</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Nama Botani</div>
              <div className="font-medium">{crop.botanicalName || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Metode Awal</div>
              <div className="font-medium">{crop.startMethod || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tingkat Perkecambahan</div>
              <div className="font-medium">{crop.germinationRate ? `${crop.germinationRate}%` : '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Jarak Tanam</div>
              <div className="font-medium">{crop.plantSpacing ? `${crop.plantSpacing} cm` : '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Jarak Baris</div>
              <div className="font-medium">{crop.rowSpacing ? `${crop.rowSpacing} cm` : '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Kedalaman Tanam</div>
              <div className="font-medium">{crop.plantingDepth ? `${crop.plantingDepth} cm` : '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tinggi Rata-rata</div>
              <div className="font-medium">{crop.averageHeight ? `${crop.averageHeight} cm` : '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Hari hingga Berbunga</div>
              <div className="font-medium">{crop.daysToFlower ? `${crop.daysToFlower} hari` : '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Hari hingga Panen</div>
              <div className="font-medium">{crop.daysToMaturity ? `${crop.daysToMaturity} hari` : '-'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="font-semibold mb-4">Daftar Media</div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Nama Media</th>
                <th className="py-2 px-4 text-left">Luas</th>
                <th className="py-2 px-4 text-left">Jumlah Ditanam</th>
                <th className="py-2 px-4 text-left">Tanggal Tanam</th>
                <th className="py-2 px-4 text-left">Tanggal Semai</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {plantings.map(planting => {
                const location = locations.find(l => l.id === planting.locationId);
                return (
                  <tr key={planting.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{location?.name || '-'}</td>
                    <td className="py-2 px-4">{formatArea(location?.area)}</td>
                    <td className="py-2 px-4">{formatNumber(planting.plantingQuantity)}</td>
                    <td className="py-2 px-4">{formatDate(planting.plantingDate)}</td>
                    <td className="py-2 px-4">{formatDate(planting.seedingDate)}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        planting.status === 'active' ? 'bg-green-100 text-green-800' :
                        planting.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {planting.status === 'active' ? 'Aktif' :
                         planting.status === 'completed' ? 'Selesai' :
                         planting.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isFormOpen && (
          <AddNewPlanForm 
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
            initialData={{ cropId: parseInt(cropId) }}
          />
        )}
      </div>
    </div>
  );
} 