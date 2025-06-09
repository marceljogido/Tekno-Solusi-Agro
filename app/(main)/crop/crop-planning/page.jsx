'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import CropPlanningTable from '@/components/crop-production/CropPlanningTable';
import AddNewPlanForm from '@/components/crop-production/AddNewPlanForm';
import { motion, AnimatePresence } from "framer-motion";

export default function CropPlanningPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [plantings, setPlantings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlantings = async () => {
      try {
        const response = await fetch('/api/plantings');
        if (!response.ok) {
          throw new Error('Failed to fetch plantings');
        }
        const data = await response.json();
        setPlantings(data);
      } catch (err) {
        setError('Gagal memuat data rencana tanam');
        console.error('Error fetching plantings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantings();
  }, []);

  const handleAddNewPlan = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSuccess = async () => {
    try {
      const response = await fetch('/api/plantings');
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

  return (
    <div className="space-y-4 overflow-y-auto">
      <PageHeader title="Crop Planning" />
      <div className="container mx-auto p-4 md:p-8 pt-24 md:pt-20">
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <span className="text-gray-500 hover:text-gray-700">Crop Production</span>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-700 font-medium">Crop Planning</span>
            </li>
          </ol>
        </nav>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rencana Tanam</h1>
          <button
            onClick={handleAddNewPlan}
            className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Tambah Rencana Baru
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">Daftar Rencana Tanam</h2>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <CropPlanningTable 
                plantings={plantings}
                onRefresh={handleFormSuccess}
              />
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <AddNewPlanForm 
                  onClose={handleCloseForm}
                  onSuccess={handleFormSuccess}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 