import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddNewPlanForm from './AddNewPlanForm';

export default function CropPlanningTable({ plantings, onRefresh }) {
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPlanting, setSelectedPlanting] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rencana tanam ini?')) {
      console.log('Attempting to delete planting with ID:', id);
      try {
        const response = await fetch(`/api/plantings/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorDetail = await response.text();
          console.error('Delete failed with status:', response.status, 'Response:', errorDetail);
          throw new Error(`Failed to delete planting: ${response.status} ${response.statusText}`);
        }

        console.log('Delete successful for ID:', id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting planting:', error);
        alert('Gagal menghapus rencana tanam: ' + error.message);
      }
    }
  };

  const handleEdit = (planting) => {
    setSelectedPlanting(planting);
    setShowEditForm(true);
  };

  const handleFormClose = () => {
    setSelectedPlanting(null);
    setShowEditForm(false);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    onRefresh();
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
    return Number(number).toLocaleString('id-ID');
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanaman</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Tanam</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rencana Panen</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Tanam</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perkiraan Hasil</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plantings.map((planting) => (
              <tr key={planting.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div 
                    className="text-green-700 hover:underline cursor-pointer"
                    onClick={() => router.push(`/crop/crop-planning/${planting.cropId}`)}
                  >
                    {planting.crop?.name || '-'}
                  </div>
                  <div className="text-sm text-gray-500">{planting.crop?.variety || '-'}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{planting.location?.name || '-'}</div>
                  <div className="text-sm text-gray-500">{planting.location?.locationType || '-'}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(planting.plantingDate)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(planting.harvestPlan)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatNumber(planting.plantingQuantity)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatNumber(planting.estimatedYield)} kg</div>
                  <div className="text-sm text-gray-500">
                    Rp {formatNumber(planting.estimatedProfit)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
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
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => router.push(`/crop/crop-planning/${planting.cropId}`)}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleEdit(planting)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(planting.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditForm && (
        <AddNewPlanForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          initialData={selectedPlanting}
        />
      )}
    </div>
  );
} 