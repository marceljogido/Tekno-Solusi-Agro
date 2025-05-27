'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddNewPlanForm from '@/components/crop-production/AddNewPlanForm';
import PageHeader from '@/components/layout/PageHeader';

export default function CropPlanningDetailPage({ params }) {
  const { cropId } = params;
  const router = useRouter();
  const [crop, setCrop] = useState(null);
  const [plantings, setPlantings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    return `${formatNumber(area)} m²`;
  };

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