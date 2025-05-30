"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import NewCropForm from "@/components/crop-production/NewCropForm";
import PageHeader from "@/components/layout/PageHeader";

export default function MyCrop() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [crops, setCrops] = useState([]);
  const [editingCrop, setEditingCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for cookies
        });
        
        const data = await res.json();
        console.log('Session check response:', data);
        
        if (!res.ok || !data.authenticated) {
          console.log('Session check failed:', data);
          router.push('/auth/login');
          return;
        }
        
        console.log('Session check passed:', data);
        // If we get here, we're authenticated, so fetch crops
        fetchCrops();
      } catch (error) {
        console.error('Error checking session:', error);
        if (error.name === 'TypeError') {
          console.error('Network error during session check');
          setError('Gagal terhubung ke server. Silakan coba lagi.');
          return;
        }
        setError('Terjadi kesalahan saat memeriksa sesi.');
      }
    };
    
    checkSession();
  }, []);

  // Fetch crops from backend
  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/crops', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
      });
      
      const data = await res.json();
      console.log('Crops response:', data);
      
      if (!res.ok) {
        if (res.status === 401 || data.error === 'Unauthorized') {
          console.log('Unauthorized access to crops');
          router.push('/auth/login');
          return;
        }
        throw new Error(data.error || 'Gagal mengambil data tanaman');
      }
      
      if (!Array.isArray(data)) {
        throw new Error('Format data tidak valid');
      }
      
      console.log("Data crops yang diterima:", data);
      setCrops(data);
    } catch (err) {
      console.error("Error fetching crops:", err);
      if (err.name === 'TypeError') {
        setError('Gagal terhubung ke server. Silakan coba lagi.');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleSaveCrop = async (formData) => {
    console.log("handleSaveCrop called with formData:", formData);
    try {
      const formDataToSend = {
        name: formData.name || '',
        variety: formData.variety || '',
        startMethod: formData.startMethod || '',
        germinationRate: formData.germinationRate ? parseFloat(formData.germinationRate) : 0,
        seedPerCell: formData.seedPerCell ? parseFloat(formData.seedPerCell) : 0,
        lightProfile: formData.lightProfile || '',
        soilCondition: formData.soilCondition || '',
        daysToEmerge: formData.daysToEmerge ? parseFloat(formData.daysToEmerge) : 0,
        plantSpacing: formData.plantSpacing ? parseFloat(formData.plantSpacing) : 0,
        rowSpacing: formData.rowSpacing ? parseFloat(formData.rowSpacing) : 0,
        plantingDepth: formData.plantingDepth ? parseFloat(formData.plantingDepth) : 0,
        averageHeight: formData.averageHeight ? parseFloat(formData.averageHeight) : 0,
        daysToFlower: formData.daysToFlower ? parseFloat(formData.daysToFlower) : 0,
        daysToMaturity: formData.daysToMaturity ? parseFloat(formData.daysToMaturity) : 0,
        harvestWindow: formData.harvestWindow ? parseFloat(formData.harvestWindow) : 0,
        lossRate: formData.lossRate ? parseFloat(formData.lossRate) : 0,
        harvestUnit: formData.harvestUnit || '',
        estimatedRevenue: formData.estimatedRevenue ? parseFloat(formData.estimatedRevenue) : 0,
        expectedYieldPer3048m: formData.expectedYieldPer3048m ? parseFloat(formData.expectedYieldPer3048m) : 0,
        expectedYieldPerHectare: formData.expectedYieldPerHectare ? parseFloat(formData.expectedYieldPerHectare) : 0,
        plantingDetails: formData.plantingDetails || '',
        pruningDetails: formData.pruningDetails || '',
        isPerennial: formData.isPerennial === true,
        autoCreateTasks: formData.autoCreateTasks === true
      };

      console.log("Processed form data to send:", formDataToSend);

      let response;
      if (editingCrop) {
        console.log("Updating existing crop with ID:", editingCrop.id);
        response = await fetch('/api/crops', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formDataToSend,
            id: editingCrop.id
          }),
        });
        console.log("Update response status:", response.status);
      } else {
        console.log("Creating new crop");
        response = await fetch('/api/crops', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSend),
        });
        console.log("Create response status:", response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response data:", result);

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      await fetchCrops();
      setIsFormOpen(false);
      setEditingCrop(null);
      
      // Show success notification
      const message = editingCrop ? "Tanaman berhasil diperbarui!" : "Tanaman berhasil ditambahkan!";
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-500 ease-in-out';
      notification.textContent = message;
      document.body.appendChild(notification);

      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
      }, 100);

      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.transform = 'translateY(-100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    } catch (error) {
      console.error("Error saving crop:", error);
      alert("Error saving crop: " + error.message);
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm('Yakin ingin menghapus tanaman ini?')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/crops/${cropId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        // Log the error response details
        console.error('Delete failed:', res.status, res.statusText);

        let errorText = 'Gagal menghapus tanaman';
        try {
          // Try reading as JSON first if Content-Type is application/json
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
             const errorData = await res.json();
             console.error("Error response body (JSON):", errorData);
             errorText = errorData.error || errorText;
          } else {
             // Otherwise, read as text
             const rawErrorText = await res.text();
             console.error("Error response body (text):", rawErrorText);
             errorText = rawErrorText || errorText;
          }
        } catch (e) {
           console.error("Error reading error response body:", e);
           // Fallback to generic error message if reading fails
           errorText = `Gagal menghapus tanaman: ${res.status} ${res.statusText || 'Error'}`;
        }

        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error(errorText);
      }
      
      // If response is OK, only try to read JSON if there is content and it's JSON
      const contentType = res.headers.get("content-type");
      if (res.status !== 204 && contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        console.log("Delete response:", data);
      } else {
        console.log("Delete successful or no content returned.");
      }

      await fetchCrops(); // Refresh the list after successful deletion
    } catch (err) {
      console.error('Error deleting crop (client-side):', err);
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setEditingCrop(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (cropToEdit) => {
    console.log("Opening edit form with data:", cropToEdit);
    setEditingCrop(cropToEdit);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCrop(null);
  };

  // Filter and search
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || crop.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 overflow-y-auto">
      <PageHeader title="My Crop" />

      <div className="container mx-auto p-4 md:p-8 pt-24 md:pt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">My Crop</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenForm}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center shadow-lg"
          >
            <FaPlus className="mr-2" />
            Tambah Tanaman
          </motion.button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Cari tanaman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tanaman</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Varietas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode Tanam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profil Cahaya</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredCrops.length > 0 ? (
                      filteredCrops.map((crop) => (
                        <motion.tr
                          key={crop.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {crop.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {crop.variety || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {crop.startMethod || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {crop.lightProfile || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleOpenEditForm(crop)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCrop(crop.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          Belum ada data tanaman.
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <NewCropForm
                  onClose={handleCloseForm}
                  onSave={handleSaveCrop}
                  initialData={editingCrop}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 