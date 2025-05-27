import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

const TAHAP_PERTUMBUHAN_OPTIONS = [
  'Benih',
  'Perkecambahan',
  'Vegetatif',
  'Berbunga',
  'Berbuah',
  'Panen',
];

const GROWTH_STAGE_OPTIONS = [
  'Benih',
  'Perkecambahan',
  'Vegetatif',
  'Berbunga',
  'Berbuah',
  'Panen',
];

function Step3Summary({ selectedCrop, selectedLocation, form, rataRataHasil, perkiraanPanenBersih, perkiraanKeuntungan }) {
  if (!selectedCrop || !selectedLocation) {
    return <div className="text-red-600">Data tanaman atau lokasi tidak ditemukan. Silakan kembali dan lengkapi data.</div>;
  }
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-gray-700">Konfirmasi Rencana Tanam</h3>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2">Ringkasan Data</h4>
        <ul className="text-sm text-gray-700">
          <li><b>Tanaman:</b> {selectedCrop?.name}</li>
          <li><b>Lokasi:</b> {selectedLocation?.name}</li>
          <li><b>Jumlah Penanaman:</b> {form.plantingQuantity}</li>
          <li><b>Metode Tanam:</b> {form.plantingMethod}</li>
          <li><b>Tanggal Tanam:</b> {form.plantingDate}</li>
          <li><b>Rencana Panen Pertama:</b> {form.harvestPlan}</li>
          <li><b>Rata-rata Hasil per Tanaman (kg):</b> {rataRataHasil}</li>
          <li><b>Perkiraan Jumlah Panen (kg):</b> {perkiraanPanenBersih.toLocaleString('id-ID', { maximumFractionDigits: 2 })}</li>
          <li><b>Perkiraan Hasil Keuntungan (Rp):</b> {perkiraanKeuntungan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</li>
        </ul>
      </div>
    </div>
  );
}

export default function AddNewPlanForm({ onClose, onSuccess, initialData }) {
  const [step, setStep] = useState(1);
  const [crops, setCrops] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for form fields
  const [form, setForm] = useState({
    cropId: '',
    locationId: '',
    plantingQuantity: '',
    plantingMethod: METODE_TANAM_OPTIONS[0],
    plantingDate: '',
    seedingDate: '',
    plantSpacing: '',
    rowSpacing: '',
    rowLength: '',
    numberOfRows: '',
    electronicId: '',
    currentlyPlanted: false,
    harvestPlan: '',
    estimatedYield: '',
    estimatedProfit: '',
    plantingInfo: '',
    status: 'active'
  });

  // Tambahkan state baru untuk growthStage dan perkiraan keuntungan
  const [growthStage, setGrowthStage] = useState(GROWTH_STAGE_OPTIONS[0]);
  const [perkiraanKeuntungan, setPerkiraanKeuntungan] = useState(0);

  // Tambahkan state untuk rata-rata hasil per tanaman
  const [rataRataHasil, setRataRataHasil] = useState('0.5');
  const [perkiraanPanenBersih, setPerkiraanPanenBersih] = useState(0);

  // Perbaiki pencarian id agar membandingkan sebagai string
  const selectedCrop = crops.find(c => String(c.id) === String(form.cropId));
  const selectedLocation = locations.find(l => String(l.id) === String(form.locationId));

  // Jika initialData ada (edit mode), set form dengan initialData
  useEffect(() => {
    if (initialData) {
      console.log("Initial data for edit:", initialData);
      // Copy existing form state and then apply initialData
      setForm(prevForm => ({
        ...prevForm, // Keep existing state like step
        cropId: initialData.cropId || '',
        locationId: initialData.locationId || '',
        plantingQuantity: initialData.plantingQuantity || '',
        plantingMethod: initialData.plantingMethod || METODE_TANAM_OPTIONS[0],
        // Format tanggal ke YYYY-MM-DD
        plantingDate: initialData.plantingDate ? new Date(initialData.plantingDate).toISOString().split('T')[0] : '',
        seedingDate: initialData.seedingDate ? new Date(initialData.seedingDate).toISOString().split('T')[0] : '',
        plantSpacing: initialData.plantSpacing || '',
        rowSpacing: initialData.rowSpacing || '',
        rowLength: initialData.rowLength || '',
        numberOfRows: initialData.numberOfRows || '',
        electronicId: initialData.electronicId || '',
        currentlyPlanted: initialData.currentlyPlanted || false,
        harvestPlan: initialData.harvestPlan ? new Date(initialData.harvestPlan).toISOString().split('T')[0] : '',
        estimatedYield: initialData.estimatedYield || '',
        estimatedProfit: initialData.estimatedProfit || '',
        plantingInfo: initialData.plantingInfo || '',
        status: initialData.status || 'active',
      }));
      // Set perkiraan keuntungan dan panen bersih jika data edit ada
      setPerkiraanKeuntungan(Number(initialData.estimatedProfit) || 0);
      setPerkiraanPanenBersih(Number(initialData.estimatedYield) || 0); // Assuming estimatedYield is panen bersih
    }
  }, [initialData]);

  // Fetch crops and locations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching crops and locations...");
        const [cropsRes, locationsRes] = await Promise.all([
          fetch('/api/crops'),
          fetch('/api/media_locations')
        ]);
        
        console.log("Crops response status:", cropsRes.status);
        console.log("Locations response status:", locationsRes.status);
        
        if (!cropsRes.ok || !locationsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const cropsData = await cropsRes.json();
        const locationsData = await locationsRes.json();

        console.log("Crops data:", cropsData);
        console.log("Locations data:", locationsData);

        setCrops(cropsData);
        setLocations(locationsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data. Silakan coba lagi.');
      }
    };

    fetchData();
  }, []);

  // Otomatisasi pengisian field dari crop dan lokasi
  useEffect(() => {
    if (selectedCrop && selectedLocation) {
      setForm(prev => ({
        ...prev,
        plantingMethod: selectedCrop.startMethod || prev.plantingMethod,
        plantSpacing: selectedCrop.plantSpacing || prev.plantSpacing,
        rowSpacing: selectedCrop.rowSpacing || prev.rowSpacing,
        rowLength: selectedLocation.area || selectedLocation.bedLength || prev.rowLength,
        numberOfRows: selectedLocation.numberOfBeds || prev.numberOfRows,
        plantingQuantity: (selectedCrop.seedPerCell && (selectedLocation.numberOfBeds)) ? (Number(selectedCrop.seedPerCell) * Number(selectedLocation.numberOfBeds)) : prev.plantingQuantity,
        estimatedYield: selectedCrop.expectedYield || prev.estimatedYield,
      }));
    }
  }, [selectedCrop, selectedLocation]);

  // Otomatisasi pengisian rencana panen pertama
  useEffect(() => {
    if (form.plantingDate && selectedCrop && selectedCrop.daysToMaturity) {
      const tanamDate = new Date(form.plantingDate);
      tanamDate.setDate(tanamDate.getDate() + Number(selectedCrop.daysToMaturity));
      setForm(prev => ({
        ...prev,
        harvestPlan: tanamDate.toISOString().slice(0, 10)
      }));
    }
  }, [form.plantingDate, selectedCrop]);

  // Otomatisasi perkiraan hasil keuntungan
  useEffect(() => {
    if (form.estimatedYield && selectedCrop && selectedCrop.estimatedRevenue) {
      setPerkiraanKeuntungan(Number(form.estimatedYield) * Number(selectedCrop.estimatedRevenue));
    } else {
      setPerkiraanKeuntungan(0);
    }
  }, [form.estimatedYield, selectedCrop]);

  // Perhitungan otomatis jumlah baris dan jumlah saat ini ditanam
  useEffect(() => {
    const panjangBaris = Number(form.rowLength);
    const jarakBaris = Number(form.rowSpacing);
    const jarakTanam = Number(form.plantSpacing);
    const benihPerLubang = selectedCrop && selectedCrop.seedPerCell ? Number(selectedCrop.seedPerCell) : 1;

    const jumlahBaris = (panjangBaris && jarakBaris) ? Math.floor(panjangBaris / (jarakBaris / 100)) : '';
    const tanamanPerBaris = (panjangBaris && jarakTanam) ? Math.floor(panjangBaris / (jarakTanam / 100)) : '';
    const jumlahTanam = (jumlahBaris && tanamanPerBaris) ? jumlahBaris * tanamanPerBaris * benihPerLubang : '';

    setForm(prev => ({
      ...prev,
      numberOfRows: jumlahBaris,
      plantingQuantity: jumlahTanam
    }));
  }, [form.rowLength, form.rowSpacing, form.plantSpacing, selectedCrop]);

  // Perhitungan otomatis Perkiraan Jumlah Panen (kg) dan Perkiraan Hasil Keuntungan
  useEffect(() => {
    const jumlahTanam = Number(form.plantingQuantity);
    const tingkatPerkecambahan = selectedCrop && selectedCrop.germinationRate ? Number(selectedCrop.germinationRate) : 100;
    const tingkatKehilangan = selectedCrop && selectedCrop.lossRate ? Number(selectedCrop.lossRate) : 0;
    const hasilPerTanaman = Number(rataRataHasil);
    const hargaJual = selectedCrop && selectedCrop.estimatedRevenue ? Number(selectedCrop.estimatedRevenue) : 0;

    // 1. Tanaman Tumbuh
    const tanamanTumbuh = jumlahTanam * (tingkatPerkecambahan / 100);
    // 2. Panen Kotor
    const panenKotor = tanamanTumbuh * hasilPerTanaman;
    // 3. Kehilangan
    const kehilangan = panenKotor * (tingkatKehilangan / 100);
    // 4. Panen Bersih
    const panenBersih = panenKotor - kehilangan;

    setPerkiraanPanenBersih(panenBersih);
    setPerkiraanKeuntungan(panenBersih * hargaJual);
  }, [form.plantingQuantity, selectedCrop, rataRataHasil]);

  // Info Penanaman otomatis
  const infoPenanaman = () => {
    const panjangBaris = Number(form.rowLength);
    const jarakBaris = Number(form.rowSpacing);
    const jarakTanam = Number(form.plantSpacing);
    const benihPerLubang = selectedCrop && selectedCrop.seedPerCell ? Number(selectedCrop.seedPerCell) : 1;

    const jumlahBaris = (panjangBaris && jarakBaris) ? Math.floor(panjangBaris / (jarakBaris / 100)) : '-';
    const tanamanPerBaris = (panjangBaris && jarakTanam) ? Math.floor(panjangBaris / (jarakTanam / 100)) : '-';
    const jumlahTanam = (jumlahBaris !== '-' && tanamanPerBaris !== '-') ? jumlahBaris * tanamanPerBaris * benihPerLubang : '-';
    const luas = selectedLocation && selectedLocation.area ? Number(selectedLocation.area).toFixed(2) : '-';

    return `Luas: ${luas} m², Jumlah Baris: ${jumlahBaris}, Jumlah Saat Ini Ditanam: ${jumlahTanam}`;
  };

  // Tambahkan info perhitungan kasar panen
  const infoPerhitunganPanen = () => {
    const jumlahTanam = Number(form.plantingQuantity);
    const tingkatPerkecambahan = selectedCrop && selectedCrop.germinationRate ? Number(selectedCrop.germinationRate) : 100;
    const tingkatKehilangan = selectedCrop && selectedCrop.lossRate ? Number(selectedCrop.lossRate) : 0;
    const hasilPerTanaman = Number(rataRataHasil);

    const tanamanTumbuh = jumlahTanam * (tingkatPerkecambahan / 100);
    const panenKotor = tanamanTumbuh * hasilPerTanaman;
    const kehilangan = panenKotor * (tingkatKehilangan / 100);
    const panenBersih = panenKotor - kehilangan;

    return (
      <div className="text-xs text-gray-700 bg-gray-50 border-l-4 border-gray-300 p-3 mt-2 rounded">
        <div><b>Perhitungan Kasar Panen:</b></div>
        <div>1. Tanaman Tumbuh = {jumlahTanam.toLocaleString('id-ID')} × {tingkatPerkecambahan}% = <b>{tanamanTumbuh.toLocaleString('id-ID', { maximumFractionDigits: 2 })}</b></div>
        <div>2. Panen Kotor = {tanamanTumbuh.toLocaleString('id-ID', { maximumFractionDigits: 2 })} × {hasilPerTanaman} kg = <b>{panenKotor.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg</b></div>
        <div>3. Kehilangan = {panenKotor.toLocaleString('id-ID', { maximumFractionDigits: 2 })} × {tingkatKehilangan}% = <b>{kehilangan.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg</b></div>
        <div>4. Panen Bersih = {panenKotor.toLocaleString('id-ID', { maximumFractionDigits: 2 })} - {kehilangan.toLocaleString('id-ID', { maximumFractionDigits: 2 })} = <b>{panenBersih.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg</b></div>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit called", e);
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi field yang diperlukan
    const requiredFields = ['cropId', 'locationId', 'plantingQuantity', 'plantingMethod'];
    const missingFields = requiredFields.filter(field => !form[field]);
    
    if (missingFields.length > 0) {
      setError(`Mohon lengkapi field berikut: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      // Siapkan data untuk dikirim ke API
      const dataToSend = {
        crop_id: form.cropId,
        location_id: form.locationId,
        plantingQuantity: Number(form.plantingQuantity) || 0,
        plantingMethod: form.plantingMethod,
        plantingDate: form.plantingDate,
        seedingDate: form.seedingDate,
        plantSpacing: Number(form.plantSpacing) || 0,
        rowSpacing: Number(form.rowSpacing) || 0,
        rowLength: Number(form.rowLength) || 0,
        numberOfRows: Number(form.numberOfRows) || 0,
        electronicId: form.electronicId,
        currentlyPlanted: form.currentlyPlanted,
        harvestPlan: form.harvestPlan,
        estimatedYield: Number(form.estimatedYield) || 0,
        estimatedProfit: Number(perkiraanKeuntungan) || 0,
        plantingInfo: form.plantingInfo,
        status: form.status || 'active',
      };

      let response;
      if (initialData && initialData.id) {
        console.log("Submitting data for PUT:", dataToSend);
        response = await fetch(`/api/plantings/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      } else {
        console.log("Submitting data for POST:", dataToSend);
        response = await fetch('/api/plantings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save planting plan');
      }

      const result = await response.json();
      console.log('Success:', result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-green-700">
            {initialData ? 'Edit Rencana Tanam' : 'Tambah Rencana Tanam'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="flex justify-center my-6 gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step===1?'bg-green-600 text-white':'bg-gray-200 text-gray-600'}`}>1</div>
          <div className="w-16 h-1 bg-gray-300 mt-3" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step===2?'bg-green-600 text-white':'bg-gray-200 text-gray-600'}`}>2</div>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={e => {
            if ((step === 1 || step === 2) && e.key === 'Enter') {
              e.preventDefault();
            }
          }}
          className="p-6 space-y-6"
        >
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">Pilih Tanaman & Lokasi</h3>
              <div className="mb-4">
                <label className="block mb-1">Tanaman</label>
                <select 
                  name="cropId" 
                  value={form.cropId} 
                  onChange={handleChange} 
                  className="border rounded px-3 py-2 w-full"
                  required
                >
                  <option value="">Pilih Tanaman</option>
                  {crops.map(crop => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} {crop.variety ? `(${crop.variety})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Lokasi/Bed</label>
                <select 
                  name="locationId" 
                  value={form.locationId} 
                  onChange={handleChange} 
                  className="border rounded px-3 py-2 w-full"
                  required
                >
                  <option value="">Pilih Lokasi</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.locationType})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">Detail Penanaman</h3>
              {/* Summary crop/location */}
              {selectedCrop && selectedLocation && (
                <div className="flex items-center gap-4 bg-gray-50 rounded p-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center text-2xl font-bold">🌽</div>
                  <div>
                    <div className="font-bold text-lg">{selectedCrop.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedLocation.name}
                      <span className="ml-2 text-xs text-gray-400">{form.electronicId}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-1">Jumlah Penanaman</label>
                <Input
                  type="number"
                  name="plantingQuantity"
                  value={form.plantingQuantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Metode Tanam</label>
                  <select
                    name="plantingMethod"
                    value={form.plantingMethod}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 w-full"
                    required
                  >
                    {METODE_TANAM_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Tahap Pertumbuhan</label>
                  <select
                    value={growthStage}
                    onChange={e => setGrowthStage(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  >
                    {GROWTH_STAGE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Tanggal Semai</label>
                  <Input
                    type="date"
                    name="seedingDate"
                    value={form.seedingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Tanggal Tanam</label>
                  <Input
                    type="date"
                    name="plantingDate"
                    value={form.plantingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Jarak Tanam (cm)</label>
                  <Input
                    type="number"
                    name="plantSpacing"
                    value={form.plantSpacing}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Jarak Baris (cm)</label>
                  <Input
                    type="number"
                    name="rowSpacing"
                    value={form.rowSpacing}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Panjang Baris Ditanam (Meter)</label>
                  <Input
                    type="number"
                    name="rowLength"
                    value={form.rowLength}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Jumlah Baris</label>
                  <Input
                    type="number"
                    name="numberOfRows"
                    value={form.numberOfRows}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">ID Elektronik</label>
                <Input
                  type="text"
                  name="electronicId"
                  value={form.electronicId}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="currentlyPlanted"
                    checked={form.currentlyPlanted}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Sedang Ditanam</span>
                </label>
              </div>
              {/* Planting Info otomatis */}
              <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800">
                Info Penanaman:<br />
                {infoPenanaman()}
              </div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">Rencana Panen</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1">Rencana Panen Pertama</label>
                  <Input
                    type="date"
                    name="harvestPlan"
                    value={form.harvestPlan}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Rata-rata Hasil per Tanaman (kg)</label>
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    value={rataRataHasil}
                    onChange={e => setRataRataHasil(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Perkiraan Jumlah Panen (kg)</label>
                <Input
                  type="text"
                  value={perkiraanPanenBersih.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                  readOnly
                  className="bg-gray-100"
                />
                {infoPerhitunganPanen()}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Perkiraan Hasil Keuntungan (Rp)</label>
                <Input
                  type="text"
                  value={perkiraanKeuntungan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step-1)}
                disabled={loading}
              >
                Kembali
              </Button>
            )}
            <div className="flex-1" />
            {step < 2 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setStep(step + 1);
                }}
                disabled={loading}
              >
                Berikutnya
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan Rencana'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 