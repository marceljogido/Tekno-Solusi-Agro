"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const METODE_TANAM_OPTIONS = [
  'Semaian Langsung',
  'Semaian di Tray, Transplantasi di Lahan',
  'Transplantasi',
  'Kontainer',
  'Ditanam di Tray',
  'Stek Akar',
  'Umbi',
  'Okulasi',
  'Lainnya',
];

const SATUAN_PANEN_OPTIONS = [
  'bal',
  'barel',
  'ikat',
  'bushel',
  'lusin',
  'gram',
  'ekor',
  'kilogram',
  'kiloliter',
  'liter',
  'mililiter',
  'kuantitas',
  'ton',
  'tonne',
];

const KONDISI_TANAH_OPTIONS = [
  'Lempung',
  'Berpasir',
  'Liat',
  'Lanau',
  'Gambut',
  'Berbatu',
  'Lainnya',
];

const PROFIL_CAHAYA_OPTIONS = [
  'Matahari Penuh',
  'Setengah Matahari',
  'Setengah Teduh',
  'Teduh Penuh',
];

const defaultFormData = {
  name: '',
  variety: '',
  daysToEmerge: '0',
  plantSpacing: '0',
  rowSpacing: '0',
  plantingDepth: '0',
  averageHeight: '0',
  startMethod: METODE_TANAM_OPTIONS[0],
  germinationRate: '100',
  seedPerCell: '1',
  lightProfile: PROFIL_CAHAYA_OPTIONS[0],
  soilCondition: KONDISI_TANAH_OPTIONS[0],
  daysToFlower: '0',
  daysToMaturity: '0',
  harvestWindow: '0',
  lossRate: '0',
  harvestUnit: SATUAN_PANEN_OPTIONS[0],
  estimatedRevenue: '0',
  expectedYieldPer3048m: '0',
  expectedYieldPerHectare: '0',
  description: '',
  botanicalName: '',
  isPerennial: false,
  autoCreateTasks: true
};

export default function NewCropForm({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || defaultFormData);

  useEffect(() => {
    console.log("Initial data received:", initialData);
    if (initialData) {
      const processedData = {
        ...defaultFormData,
        name: initialData.name || '',
        variety: initialData.variety || '',
        startMethod: initialData.startMethod || initialData.start_method || defaultFormData.startMethod,
        lightProfile: initialData.lightProfile || initialData.light_profile || defaultFormData.lightProfile,
        soilCondition: initialData.soilCondition || initialData.soil_condition || defaultFormData.soilCondition,
        harvestUnit: initialData.harvestUnit || initialData.harvest_unit || defaultFormData.harvestUnit,
        description: initialData.description || '',
        botanicalName: initialData.botanicalName || initialData.botanical_name || '',
        isPerennial: initialData.isPerennial === true,
        autoCreateTasks: initialData.autoCreateTasks === true,
        daysToEmerge: Math.round(Number(initialData.daysToEmerge || 0)).toString(),
        plantSpacing: Math.round(Number(initialData.plantSpacing || 0)).toString(),
        rowSpacing: Math.round(Number(initialData.rowSpacing || 0)).toString(),
        plantingDepth: Math.round(Number(initialData.plantingDepth || 0)).toString(),
        averageHeight: Math.round(Number(initialData.averageHeight || 0)).toString(),
        germinationRate: Math.round(Number(initialData.germinationRate || 100)).toString(),
        seedPerCell: Math.round(Number(initialData.seedPerCell || 1)).toString(),
        daysToFlower: Math.round(Number(initialData.daysToFlower || 0)).toString(),
        daysToMaturity: Math.round(Number(initialData.daysToMaturity || 0)).toString(),
        harvestWindow: Math.round(Number(initialData.harvestWindow || 0)).toString(),
        lossRate: Math.round(Number(initialData.lossRate || 0)).toString(),
        estimatedRevenue: Math.round(Number(initialData.estimatedRevenue || 0)).toString(),
        expectedYieldPer3048m: Math.round(Number(initialData.expectedYieldPer3048m || 0)).toString(),
        expectedYieldPerHectare: Math.round(Number(initialData.expectedYieldPerHectare || 0)).toString()
      };
      console.log("Processed form data:", processedData);
      setFormData(processedData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Field ${name} changed:`, { value, type, checked });
    setFormData(prevState => {
      const newState = {
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      };
      console.log('New form state:', newState);
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data before submit:", formData);
    // Validate required fields
    if (!formData.name) {
      alert('Nama tanaman harus diisi');
      return;
    }
    onSave(formData);
  };

  const isEditing = !!initialData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-transparent flex justify-center items-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-green-700">{isEditing ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informasi Dasar */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Nama Tanaman</label>
                <input value={formData.name} onChange={handleChange} type="text" id="name" name="name" placeholder="Contoh: Jagung" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="variety" className="block text-sm font-medium text-gray-600 mb-1">Varietas</label>
                <input value={formData.variety} onChange={handleChange} type="text" id="variety" name="variety" placeholder="Contoh: Hibrida" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
          </div>

          {/* Detail Penanaman */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Detail Penanaman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="daysToEmerge" className="block text-sm font-medium text-gray-600 mb-1">Hari Muncul</label>
                <div className="relative">
                  <input value={formData.daysToEmerge} onChange={handleChange} type="number" id="daysToEmerge" name="daysToEmerge" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" step="1" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">hari</span>
                </div>
              </div>
              <div>
                <label htmlFor="plantSpacing" className="block text-sm font-medium text-gray-600 mb-1">Jarak Tanam</label>
                <div className="relative">
                  <input value={formData.plantSpacing} onChange={handleChange} type="number" id="plantSpacing" name="plantSpacing" step="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">cm</span>
                </div>
              </div>
              <div>
                <label htmlFor="rowSpacing" className="block text-sm font-medium text-gray-600 mb-1">Jarak Baris</label>
                <div className="relative">
                  <input value={formData.rowSpacing} onChange={handleChange} type="number" id="rowSpacing" name="rowSpacing" step="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">cm</span>
                </div>
              </div>
              <div>
                <label htmlFor="plantingDepth" className="block text-sm font-medium text-gray-600 mb-1">Kedalaman Tanam</label>
                <div className="relative">
                  <input value={formData.plantingDepth} onChange={handleChange} type="number" id="plantingDepth" name="plantingDepth" step="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">cm</span>
                </div>
              </div>
              <div>
                <label htmlFor="averageHeight" className="block text-sm font-medium text-gray-600 mb-1">Tinggi Rata-rata</label>
                <div className="relative">
                  <input value={formData.averageHeight} onChange={handleChange} type="number" id="averageHeight" name="averageHeight" step="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">cm</span>
                </div>
              </div>
              <div>
                <label htmlFor="startMethod" className="block text-sm font-medium text-gray-600 mb-1">Metode Tanam</label>
                <select value={formData.startMethod} onChange={handleChange} id="startMethod" name="startMethod" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white">
                  {METODE_TANAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="germinationRate" className="block text-sm font-medium text-gray-600 mb-1">Perkiraan Tingkat Perkecambahan</label>
                <div className="relative">
                  <input value={formData.germinationRate} onChange={handleChange} type="number" id="germinationRate" name="germinationRate" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" step="1" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">%</span>
                </div>
              </div>
              <div>
                <label htmlFor="seedPerCell" className="block text-sm font-medium text-gray-600 mb-1">Benih per Lubang/Sel</label>
                <input value={formData.seedPerCell} onChange={handleChange} type="number" id="seedPerCell" name="seedPerCell" min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" step="1" />
              </div>
              <div>
                <label htmlFor="lightProfile" className="block text-sm font-medium text-gray-600 mb-1">Profil Cahaya</label>
                <select value={formData.lightProfile} onChange={handleChange} id="lightProfile" name="lightProfile" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white">
                  {PROFIL_CAHAYA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="soilCondition" className="block text-sm font-medium text-gray-600 mb-1">Kondisi Tanah</label>
                <select value={formData.soilCondition} onChange={handleChange} id="soilCondition" name="soilCondition" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white">
                  {KONDISI_TANAH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Deskripsi</label>
                <textarea value={formData.description} onChange={handleChange} id="description" name="description" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" rows="2" placeholder="Deskripsi tanaman..." />
              </div>
            </div>
          </div>

          {/* Detail Panen */}
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Detail Panen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="daysToFlower" className="block text-sm font-medium text-gray-600 mb-1">Hari Berbunga</label>
                <div className="relative">
                  <input value={formData.daysToFlower} onChange={handleChange} type="number" id="daysToFlower" name="daysToFlower" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" step="1" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">hari</span>
                </div>
              </div>
              <div>
                <label htmlFor="daysToMaturity" className="block text-sm font-medium text-gray-600 mb-1">Hari Menuai</label>
                <div className="relative">
                  <input value={formData.daysToMaturity} onChange={handleChange} type="number" id="daysToMaturity" name="daysToMaturity" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" step="1" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">hari</span>
                </div>
              </div>
              <div>
                <label htmlFor="harvestWindow" className="block text-sm font-medium text-gray-600 mb-1">Jendela Panen</label>
                <div className="relative">
                  <input value={formData.harvestWindow} onChange={handleChange} type="number" id="harvestWindow" name="harvestWindow" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" step="1" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">hari</span>
                </div>
              </div>
              <div>
                <label htmlFor="lossRate" className="block text-sm font-medium text-gray-600 mb-1">Perkiraan Tingkat Kehilangan</label>
                <div className="relative">
                  <input value={formData.lossRate} onChange={handleChange} type="number" id="lossRate" name="lossRate" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12" step="1" />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">%</span>
                </div>
              </div>
              <div>
                <label htmlFor="harvestUnit" className="block text-sm font-medium text-gray-600 mb-1">Satuan Panen</label>
                <select value={formData.harvestUnit} onChange={handleChange} id="harvestUnit" name="harvestUnit" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-12">
                  {SATUAN_PANEN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="estimatedRevenue" className="block text-sm font-medium text-gray-600 mb-1">Perkiraan Pendapatan</label>
                <div className="flex items-center w-full min-w-0">
                  <div className="relative flex-1 min-w-0">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs">Rp.</span>
                    <input
                      value={formData.estimatedRevenue}
                      onChange={handleChange}
                      type="number"
                      id="estimatedRevenue"
                      name="estimatedRevenue"
                      placeholder="1.000.000"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-2"
                    />
                  </div>
                  <span className="ml-2 text-gray-500 text-xs whitespace-nowrap flex-shrink-0">per satuan panen</span>
                </div>
              </div>
              <div>
                <label htmlFor="expectedYieldPer3048m" className="block text-sm font-medium text-gray-600 mb-1">Hasil Per 30,48m</label>
                <input value={formData.expectedYieldPer3048m} onChange={handleChange} type="number" id="expectedYieldPer3048m" name="expectedYieldPer3048m" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label htmlFor="expectedYieldPerHectare" className="block text-sm font-medium text-gray-600 mb-1">Hasil Per Hektar</label>
                <input value={formData.expectedYieldPerHectare} onChange={handleChange} type="number" id="expectedYieldPerHectare" name="expectedYieldPerHectare" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isEditing ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 