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
  const formatArea = (area) => {
    if (!area) return '-';
    // Convert to number and remove trailing zeros
    const formattedNumber = Math.round(Number(area));
    return `${formattedNumber} m²`;
  };

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
          <li><b>Luas Area:</b> {formatArea(selectedLocation?.area)}</li>
          <li><b>Jumlah Penanaman:</b> {Math.round(form.plantingQuantity)}</li>
          <li><b>Metode Tanam:</b> {form.plantingMethod}</li>
          <li><b>Tanggal Tanam:</b> {form.plantingDate}</li>
          <li><b>Rencana Panen Pertama:</b> {form.harvestPlan}</li>
          <li><b>Rata-rata Hasil per Tanaman (kg):</b> {Math.round(rataRataHasil)}</li>
          <li><b>Perkiraan Jumlah Panen (kg):</b> {Math.round(perkiraanPanenBersih).toLocaleString('id-ID')}</li>
          <li><b>Perkiraan Hasil Keuntungan (Rp):</b> {Math.round(perkiraanKeuntungan).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}</li>
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
    status: 'active',
    // field bedengan
    panjang_lahan: '',
    lebar_lahan: '',
    bed_length: '',
    bed_width: '',
    number_of_beds: '',
    luas_area_perhitungan: '',
    total_ukuran_bedengan: '',
    jumlah_tanaman_per_baris: '',
    total_per_bedengan: '',
    jumlah_baris_per_bedengan: '',
    jumlah_baris_keseluruhan: '',
    lebar_unit_legowo: '',
    jumlah_unit_legowo: '',
    tanaman_per_baris_legowo: '',
    tanaman_per_unit_legowo: '',
    total_tanaman_legowo: '',
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
        // field bedengan
        panjang_lahan: initialData.panjang_lahan || '',
        lebar_lahan: initialData.lebar_lahan || '',
        bed_length: initialData.bed_length || '',
        bed_width: initialData.bed_width || '',
        number_of_beds: initialData.number_of_beds || '',
        luas_area_perhitungan: initialData.luas_area_perhitungan || '',
        total_ukuran_bedengan: initialData.total_ukuran_bedengan || '',
        jumlah_baris_per_bedengan: '',
        jumlah_baris_keseluruhan: '',
        lebar_unit_legowo: '',
        jumlah_unit_legowo: '',
        tanaman_per_baris_legowo: '',
        tanaman_per_unit_legowo: '',
        total_tanaman_legowo: '',
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

  // Tambahkan useEffect untuk debugging selected data
  useEffect(() => {
    console.log("Selected Crop:", selectedCrop);
    console.log("Selected Location:", selectedLocation);
    console.log("Current Form State:", form);
  }, [selectedCrop, selectedLocation, form]);

  // Tambahkan mapping otomatis data lokasi bedengan ke form state
  useEffect(() => {
    if (selectedLocation && selectedLocation.plantingFormat === 'bedengan') {
      setForm(prev => ({
        ...prev,
        panjang_lahan: selectedLocation.panjangLahan || '',
        lebar_lahan: selectedLocation.lebarLahan || '',
        bed_length: selectedLocation.bedLength || '',
        bed_width: selectedLocation.bedWidth || '',
        number_of_beds: selectedLocation.numberOfBeds || '',
        luas_area_perhitungan: selectedLocation.luasTotalBedengan ||
          (selectedLocation.bedLength && selectedLocation.bedWidth && selectedLocation.numberOfBeds
            ? selectedLocation.bedLength * selectedLocation.bedWidth * selectedLocation.numberOfBeds
            : ''),
        total_ukuran_bedengan: selectedLocation.luasTotalBedengan ||
          (selectedLocation.bedLength && selectedLocation.bedWidth && selectedLocation.numberOfBeds
            ? selectedLocation.bedLength * selectedLocation.bedWidth * selectedLocation.numberOfBeds
            : ''),
      }));
    }
  }, [selectedLocation]);

  // Autofill dari media management untuk jajar legowo (pastikan jarak_antar_jajar diisi dari lebarLegowo)
  useEffect(() => {
    if (selectedLocation && selectedLocation.plantingFormat === 'jajar_legowo') {
      setForm(prev => ({
        ...prev,
        panjang_lahan: selectedLocation.panjangLahan || '',
        lebar_lahan: selectedLocation.lebarLahan || '',
        jumlah_baris_per_legowo: selectedLocation.jumlahBarisPerLegowo || '',
        jarak_antar_jajar: selectedLocation.lebarLegowo || '',
        plantSpacing: selectedLocation.plantSpacing || '',
        rowSpacing: selectedLocation.rowSpacing || '',
      }));
    }
  }, [selectedLocation]);

  // Fungsi untuk menghitung jumlah tanaman berdasarkan format penanaman
  const calculatePlantingQuantity = (format, params) => {
    const {
      panjangLahan,
      lebarLahan,
      panjangBedengan,
      lebarBedengan,
      jumlahBedengan,
      plantSpacing,
      rowSpacing,
      jarakAntarJajar,
      jumlahBarisPerLegowo = 2
    } = params;

    console.log("Calculating planting quantity with params:", {
      format,
      panjangBedengan,
      lebarBedengan,
      jumlahBedengan,
      plantSpacing,
      rowSpacing
    });

    let result = {
      totalTanaman: 0,
      barisPerBedengan: null,
      tanamanPerBarisBedengan: null,
      jumlahUnitLegowo: null,
      tanamanPerBarisLegowo: null,
      calculationDetails: null
    };

    switch(format) {
      case 'bedengan':
        // Perhitungan format bedengan
        // Konversi jarak dari cm ke meter
        const plantSpacingMeters = plantSpacing / 100;
        const rowSpacingMeters = rowSpacing / 100;
        
        // Hitung jumlah baris per bedengan
        result.barisPerBedengan = Math.floor(lebarBedengan / rowSpacingMeters);
        
        // Hitung jumlah tanaman per baris
        result.tanamanPerBarisBedengan = Math.floor(panjangBedengan / plantSpacingMeters);
        
        // Hitung total tanaman
        result.totalTanaman = result.barisPerBedengan * result.tanamanPerBarisBedengan * jumlahBedengan;

        // Tambahkan detail perhitungan
        result.calculationDetails = {
          plantSpacingMeters,
          rowSpacingMeters,
          barisPerBedengan: result.barisPerBedengan,
          tanamanPerBarisBedengan: result.tanamanPerBarisBedengan,
          totalPerBedengan: result.barisPerBedengan * result.tanamanPerBarisBedengan,
          totalTanaman: result.totalTanaman
        };

        console.log("Bedengan calculation result:", result.calculationDetails);
        break;

      case 'row':
        // Perhitungan format row crop
        const luasLahan = panjangLahan * lebarLahan;
        const luasSpaceTanaman = plantSpacing * rowSpacing;
        result.totalTanaman = Math.floor(luasLahan / luasSpaceTanaman);
        break;

      case 'jajar_legowo':
        // Perhitungan format jajar legowo
        const lebarUnit = (jumlahBarisPerLegowo * rowSpacing) + jarakAntarJajar;
        result.jumlahUnitLegowo = Math.floor(lebarLahan / lebarUnit);
        result.tanamanPerBarisLegowo = Math.floor(panjangLahan / plantSpacing);
        result.totalTanaman = result.jumlahUnitLegowo * result.tanamanPerBarisLegowo * jumlahBarisPerLegowo;
        break;
    }

    return result;
  };

  // Fungsi untuk menghitung perkiraan panen dan keuntungan
  const calculateYieldAndProfit = (plantingQuantity, cropData) => {
    const {
      germinationRate = 100,
      lossRate = 0,
      estimatedRevenue = 0,
      expectedYield = 0
    } = cropData;

    // 1. Tanaman Tumbuh
    const tanamanTumbuh = plantingQuantity * (germinationRate / 100);
    
    // 2. Panen Kotor
    const panenKotor = tanamanTumbuh * expectedYield;
    
    // 3. Kehilangan
    const kehilangan = panenKotor * (lossRate / 100);
    
    // 4. Panen Bersih
    const panenBersih = panenKotor - kehilangan;
    
    // 5. Perkiraan Keuntungan
    const perkiraanKeuntungan = panenBersih * estimatedRevenue;

    return {
      tanamanTumbuh,
      panenKotor,
      kehilangan,
      panenBersih,
      perkiraanKeuntungan
    };
  };

  // Normalisasi plantingFormat agar bisa membaca camelCase atau snake_case
  const plantingFormat = selectedLocation?.plantingFormat || selectedLocation?.planting_format;

  // Update useEffect untuk perhitungan otomatis
  useEffect(() => {
    if (selectedCrop && selectedLocation) {
      console.log("Selected data for calculation:", {
        crop: {
          name: selectedCrop.name,
          plantSpacing: selectedCrop.plantSpacing,
          rowSpacing: selectedCrop.rowSpacing,
          germinationRate: selectedCrop.germinationRate,
          lossRate: selectedCrop.lossRate,
          expectedYield: selectedCrop.expectedYield,
          estimatedRevenue: selectedCrop.estimatedRevenue
        },
        location: {
          name: selectedLocation.name,
          planting_format: selectedLocation.planting_format,
          bedLength: selectedLocation.bedLength,
          bedWidth: selectedLocation.bedWidth,
          numberOfBeds: selectedLocation.numberOfBeds
        }
      });

      // Set nilai default dari data tanaman jika belum diisi
      if (!form.plantSpacing && selectedCrop.plantSpacing) {
        setForm(prev => ({
          ...prev,
          plantSpacing: selectedCrop.plantSpacing
        }));
      }
      if (!form.rowSpacing && selectedCrop.rowSpacing) {
        setForm(prev => ({
          ...prev,
          rowSpacing: selectedCrop.rowSpacing
        }));
      }

      const plantSpacingMeters = Number(form.plantSpacing || selectedCrop.plantSpacing);
      const rowSpacingMeters = Number(form.rowSpacing || selectedCrop.rowSpacing);
      
      try {
        let result = {
          totalTanaman: 0,
          barisPerBedengan: null,
          tanamanPerBarisBedengan: null,
          jumlahUnitLegowo: null,
          tanamanPerBarisLegowo: null,
          calculationDetails: null
        };
        
        switch(selectedLocation.plant_format) {
          case 'bedengan':
            if (selectedLocation.bedLength && selectedLocation.bedWidth && selectedLocation.numberOfBeds) {
              result = calculatePlantingQuantity('bedengan', {
                panjangLahan: Number(selectedLocation.bedLength),
                lebarLahan: Number(selectedLocation.bedWidth),
                panjangBedengan: Number(selectedLocation.bedLength),
                lebarBedengan: Number(selectedLocation.bedWidth),
                jumlahBedengan: Number(selectedLocation.numberOfBeds),
                plantSpacing: plantSpacingMeters,
                rowSpacing: rowSpacingMeters
              });

              // Hitung perkiraan panen dan keuntungan
              const germinationRate = Number(selectedCrop.germinationRate) || 100;
              const lossRate = Number(selectedCrop.lossRate) || 0;
              const expectedYield = Number(selectedCrop.expectedYield) || 0;
              const estimatedRevenue = Number(selectedCrop.estimatedRevenue) || 0;

              // 1. Tanaman Tumbuh
              const tanamanTumbuh = result.totalTanaman * (germinationRate / 100);
              
              // 2. Panen Kotor
              const panenKotor = tanamanTumbuh * expectedYield;
              
              // 3. Kehilangan
              const kehilangan = panenKotor * (lossRate / 100);
              
              // 4. Panen Bersih
              const panenBersih = panenKotor - kehilangan;
              
              // 5. Perkiraan Keuntungan
              const perkiraanKeuntungan = panenBersih * estimatedRevenue;

              // Update form dengan hasil perhitungan
              setForm(prev => ({
                ...prev,
                plantingQuantity: result.totalTanaman,
                estimatedYield: panenBersih,
                estimatedProfit: perkiraanKeuntungan,
                plantingInfo: `Format: Bedengan
                  Jumlah Baris per Bedengan: ${result.calculationDetails.barisPerBedengan}
                  Jumlah Tanaman per Baris: ${result.calculationDetails.tanamanPerBarisBedengan}
                  Total per Bedengan: ${result.calculationDetails.totalPerBedengan}
                  Total Tanaman: ${result.totalTanaman}`
              }));

              // Update state untuk tampilan
              setPerkiraanPanenBersih(panenBersih);
              setPerkiraanKeuntungan(perkiraanKeuntungan);
            }
            break;
            
          case 'row':
            if (selectedLocation.area) {
              result = calculatePlantingQuantity('row', {
                panjangLahan: Number(selectedLocation.panjangLahan),
                lebarLahan: Number(selectedLocation.lebarLahan),
                plantSpacing: plantSpacingMeters,
                rowSpacing: rowSpacingMeters
              });
            }
            break;
            
          case 'jajar_legowo':
            if (selectedLocation.panjangLahan && selectedLocation.lebarLahan) {
              result = calculatePlantingQuantity('jajar_legowo', {
                panjangLahan: Number(selectedLocation.panjangLahan),
                lebarLahan: Number(selectedLocation.lebarLahan),
                jarakAntarJajar: Number(selectedLocation.jarakAntarJajar) / 100, // convert cm to m
                plantSpacing: plantSpacingMeters,
                rowSpacing: rowSpacingMeters,
                jumlahBarisPerLegowo: Number(selectedLocation.jumlahBarisPerLegowo) || 2
              });
            }
            break;
        }
      } catch (error) {
        console.error('Error calculating planting quantity:', error);
        setError(error.message);
      }
    }
  }, [selectedCrop, selectedLocation, form.plantSpacing, form.rowSpacing, rataRataHasil]);

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

  // Autofill otomatis field bedengan sesuai rumus yang benar
  useEffect(() => {
    if (
      selectedLocation?.plantingFormat === 'bedengan' &&
      form.bed_length && form.bed_width && form.number_of_beds &&
      form.plantSpacing && form.rowSpacing &&
      rataRataHasil
    ) {
      const panjangBedengan = Number(form.bed_length);
      const lebarBedengan = Number(form.bed_width);
      const jumlahBedengan = Number(form.number_of_beds);
      const jarakBaris = Number(form.rowSpacing) / 100;
      const jarakTanam = Number(form.plantSpacing) / 100;
      const jumlahBarisPerBedengan = Math.floor(lebarBedengan / jarakBaris);
      const jumlahBarisKeseluruhan = jumlahBarisPerBedengan * jumlahBedengan;
      const jumlahTanamanPerBaris = Math.floor(panjangBedengan / jarakTanam);
      const totalPerBedengan = jumlahBarisPerBedengan * jumlahTanamanPerBaris;
      const totalKeseluruhan = jumlahBedengan * totalPerBedengan;

      // Ambil data crop
      const germinationRate = selectedCrop && !isNaN(Number(selectedCrop.germinationRate)) ? Number(selectedCrop.germinationRate) : 100;
      const lossRate = selectedCrop && !isNaN(Number(selectedCrop.lossRate)) ? Number(selectedCrop.lossRate) : 0;
      const expectedYield = selectedCrop && !isNaN(Number(selectedCrop.expectedYield)) ? Number(selectedCrop.expectedYield) : 0;
      const estimatedRevenue = selectedCrop && !isNaN(Number(selectedCrop.estimatedRevenue)) ? Number(selectedCrop.estimatedRevenue) : 0;

      // Jalankan perhitungan hanya jika semua data valid
      if (
        totalKeseluruhan > 0 &&
        expectedYield > 0 &&
        germinationRate > 0 &&
        estimatedRevenue > 0
      ) {
        const tanamanTumbuh = totalKeseluruhan * (germinationRate / 100);
        const panenKotor = tanamanTumbuh * expectedYield;
        const kehilangan = panenKotor * (lossRate / 100);
        const panenBersih = panenKotor - kehilangan;
        const perkiraanKeuntungan = panenBersih * estimatedRevenue;
        setPerkiraanPanenBersih(panenBersih);
        setPerkiraanKeuntungan(perkiraanKeuntungan);
        setForm(prev => ({
          ...prev,
          estimatedYield: panenBersih.toString(),
          estimatedProfit: perkiraanKeuntungan.toString()
        }));
      }

      setForm(prev => ({
        ...prev,
        rowLength: panjangBedengan.toString(),
        jumlah_baris_per_bedengan: jumlahBarisPerBedengan,
        jumlah_baris_keseluruhan: jumlahBarisKeseluruhan,
        numberOfRows: jumlahBarisKeseluruhan,
        jumlah_tanaman_per_baris: jumlahTanamanPerBaris,
        total_per_bedengan: totalPerBedengan,
        plantingQuantity: totalKeseluruhan,
        plantingInfo: `Format: Bedengan\n        Panjang Bedengan: ${panjangBedengan} m\n        Lebar Bedengan: ${lebarBedengan} m\n        Jumlah Bedengan: ${jumlahBedengan}\n        Jumlah Baris per Bedengan: ${jumlahBarisPerBedengan}\n        Jumlah Tanaman per Baris: ${jumlahTanamanPerBaris}\n        Total per Bedengan: ${totalPerBedengan}\n        Total Tanaman: ${totalKeseluruhan}`
      }));
    }
  }, [
    selectedLocation,
    form.bed_length,
    form.bed_width,
    form.number_of_beds,
    form.plantSpacing,
    form.rowSpacing,
    selectedCrop,
    rataRataHasil
  ]);

  // Autofill otomatis field jajar legowo dengan rumus yang benar
  useEffect(() => {
    if (
      selectedLocation?.plantingFormat === 'jajar_legowo' &&
      form.panjang_lahan && form.lebar_lahan &&
      form.plantSpacing && form.rowSpacing &&
      form.jumlah_baris_per_legowo && form.jarak_antar_jajar &&
      rataRataHasil
    ) {
      const panjangLahan = Number(form.panjang_lahan);
      const lebarLahan = Number(form.lebar_lahan);
      const plantSpacing = Number(form.plantSpacing) / 100;
      const rowSpacing = Number(form.rowSpacing) / 100;
      const jumlahBarisPerLegowo = Number(form.jumlah_baris_per_legowo);
      const jarakAntarJajar = Number(form.jarak_antar_jajar); // diasumsikan meter
      const lebarUnitLegowo = (2 * rowSpacing) + jarakAntarJajar;
      const jumlahUnitLegowo = Math.floor(lebarLahan / lebarUnitLegowo);
      const tanamanPerBaris = Math.floor(panjangLahan / plantSpacing);
      const tanamanPerUnitLegowo = jumlahBarisPerLegowo * tanamanPerBaris;
      const totalTanaman = jumlahUnitLegowo * tanamanPerUnitLegowo;
      const jumlahBaris = jumlahUnitLegowo * jumlahBarisPerLegowo;

      // Ambil data crop
      // Hitung perkiraan panen dan keuntungan
      if (selectedCrop) {
        const germinationRate = Number(selectedCrop.germinationRate) || 100;
        const lossRate = Number(selectedCrop.lossRate) || 0;
        const expectedYield = Number(selectedCrop.expectedYield) || 0;
        const estimatedRevenue = Number(selectedCrop.estimatedRevenue) || 0;

        // 1. Tanaman Tumbuh
        const tanamanTumbuh = totalTanaman * (germinationRate / 100);
        
        // 2. Panen Kotor
        const panenKotor = tanamanTumbuh * expectedYield;
        
        // 3. Kehilangan
        const kehilangan = panenKotor * (lossRate / 100);
        
        // 4. Panen Bersih
        const panenBersih = panenKotor - kehilangan;
        
        // 5. Perkiraan Keuntungan
        const perkiraanKeuntungan = panenBersih * estimatedRevenue;

        setPerkiraanPanenBersih(panenBersih);
        setPerkiraanKeuntungan(perkiraanKeuntungan);
        setForm(prev => ({
          ...prev,
          estimatedYield: panenBersih.toString(),
          estimatedProfit: perkiraanKeuntungan.toString()
        }));
      }

      setForm(prev => ({
        ...prev,
        lebar_unit_legowo: lebarUnitLegowo,
        jumlah_unit_legowo: jumlahUnitLegowo,
        tanaman_per_baris_legowo: tanamanPerBaris,
        tanaman_per_unit_legowo: tanamanPerUnitLegowo,
        total_tanaman_legowo: totalTanaman,
        plantingQuantity: totalTanaman,
        numberOfRows: jumlahBaris,
        rowLength: panjangLahan.toString(),
        plantingInfo: `Format: Jajar Legowo
          Panjang Lahan: ${panjangLahan} m
          Lebar Lahan: ${lebarLahan} m
          Lebar Unit Legowo: ${lebarUnitLegowo.toFixed(2)} m
          Jumlah Unit Legowo: ${jumlahUnitLegowo}
          Tanaman per Baris: ${tanamanPerBaris}
          Tanaman per Unit Legowo: ${tanamanPerUnitLegowo}
          Total Tanaman: ${totalTanaman}`
      }));
    }
  }, [
    selectedLocation,
    form.panjang_lahan,
    form.lebar_lahan,
    form.plantSpacing,
    form.rowSpacing,
    form.jumlah_baris_per_legowo,
    form.jarak_antar_jajar,
    selectedCrop,
    rataRataHasil
  ]);

  // Update infoPenanaman agar menampilkan hasil perhitungan baru
  const infoPenanaman = () => {
    if (selectedLocation?.plantingFormat === 'jajar_legowo') {
      const panjangLahan = Number(form.panjang_lahan);
      const lebarLahan = Number(form.lebar_lahan);
      const plantSpacing = Number(form.plantSpacing) / 100;
      const rowSpacing = Number(form.rowSpacing) / 100;
      const jumlahBarisPerLegowo = Number(form.jumlah_baris_per_legowo);
      const jarakAntarJajar = Number(form.jarak_antar_jajar); // diasumsikan meter
      const lebarUnitLegowo = (2 * rowSpacing) + jarakAntarJajar;
      const jumlahUnitLegowo = Math.floor(lebarLahan / lebarUnitLegowo);
      const tanamanPerBaris = Math.floor(panjangLahan / plantSpacing);
      const tanamanPerUnitLegowo = jumlahBarisPerLegowo * tanamanPerBaris;
      const totalTanaman = jumlahUnitLegowo * tanamanPerUnitLegowo;
      const jumlahBaris = jumlahUnitLegowo * jumlahBarisPerLegowo;
      return (
        <div>
          <div>Luas: {panjangLahan && lebarLahan ? Math.round(panjangLahan * lebarLahan) : '-'} m²</div>
          <div>Lebar Unit Legowo: {lebarUnitLegowo ? lebarUnitLegowo.toFixed(2) : '-'} m</div>
          <div>Jumlah Unit Legowo: {jumlahUnitLegowo}</div>
          <div>Tanaman per Baris: {tanamanPerBaris}</div>
          <div>Tanaman per Unit Legowo: {tanamanPerUnitLegowo}</div>
          <div>Total Tanaman: {totalTanaman}</div>
        </div>
      );
    }
    if (selectedLocation?.plantingFormat === 'bedengan' && form.panjang_lahan && form.lebar_lahan) {
      const panjangLahan = Number(form.panjang_lahan);
      const lebarLahan = Number(form.lebar_lahan);
      const luas = Math.round(panjangLahan * lebarLahan);
      const jumlahBaris = form.numberOfRows || '-';
      const jumlahTanam = form.plantingQuantity || '-';
      return `Luas: ${luas} m², Jumlah Baris: ${jumlahBaris}, Jumlah Saat Ini Ditanam: ${jumlahTanam}`;
    }
    const isRow = selectedLocation?.plantingFormat === 'baris';
    if (isRow) {
      const luas = selectedLocation && selectedLocation.area ? Number(selectedLocation.area).toString() : '-';
      const jumlahTanam = form.plantingQuantity || '-';
      return `Luas: ${luas} m², Jumlah Penanaman: ${jumlahTanam}`;
    }
    // fallback lama
    const panjangBaris = Number(form.rowLength);
    const jarakBaris = Number(form.rowSpacing);
    const jarakTanam = Number(form.plantSpacing);
    const benihPerLubang = selectedCrop && selectedCrop.seedPerCell ? Number(selectedCrop.seedPerCell) : 1;
    const jumlahBaris = (panjangBaris && jarakBaris) ? Math.floor(panjangBaris / (jarakBaris / 100)) : '-';
    const tanamanPerBaris = (panjangBaris && jarakTanam) ? Math.floor(panjangBaris / (jarakTanam / 100)) : '-';
    const jumlahTanam = (jumlahBaris !== '-' && tanamanPerBaris !== '-') ? jumlahBaris * tanamanPerBaris * benihPerLubang : '-';
    const luas = selectedLocation && selectedLocation.area ? Number(selectedLocation.area).toString() : '-';
    return `Luas: ${luas} m², Jumlah Baris: ${jumlahBaris}, Jumlah Saat Ini Ditanam: ${jumlahTanam}`;
  };

  // Tambahkan info perhitungan kasar panen
  const infoPerhitunganPanen = () => {
    const jumlahTanam = Number(form.plantingQuantity);
    const tingkatPerkecambahan = selectedCrop && selectedCrop.germinationRate ? Number(selectedCrop.germinationRate) : 100;
    const tingkatKehilangan = selectedCrop && selectedCrop.lossRate ? Number(selectedCrop.lossRate) : 0;
    const hasilPerTanaman = Number(rataRataHasil);

    const tanamanTumbuh = Math.round(jumlahTanam * (tingkatPerkecambahan / 100));
    const panenKotor = Math.round(tanamanTumbuh * hasilPerTanaman);
    const kehilangan = Math.round(panenKotor * (tingkatKehilangan / 100));
    const panenBersih = panenKotor - kehilangan;

    return (
      <div className="text-xs text-gray-700 bg-gray-50 border-l-4 border-gray-300 p-3 mt-2 rounded">
        <div><b>Perhitungan Kasar Panen:</b></div>
        <div>1. Tanaman Tumbuh = {jumlahTanam.toLocaleString('id-ID')} × {tingkatPerkecambahan}% = <b>{tanamanTumbuh.toLocaleString('id-ID')}</b></div>
        <div>2. Panen Kotor = {tanamanTumbuh.toLocaleString('id-ID')} × {hasilPerTanaman} kg = <b>{panenKotor.toLocaleString('id-ID')} kg</b></div>
        <div>3. Kehilangan = {panenKotor.toLocaleString('id-ID')} × {tingkatKehilangan}% = <b>{kehilangan.toLocaleString('id-ID')} kg</b></div>
        <div>4. Panen Bersih = {panenKotor.toLocaleString('id-ID')} - {kehilangan.toLocaleString('id-ID')} = <b>{panenBersih.toLocaleString('id-ID')} kg</b></div>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      // Luas Area = panjang_lahan * lebar_lahan (selalu integer)
      if (name === 'panjang_lahan' || name === 'lebar_lahan') {
        const panjangLahan = Number(name === 'panjang_lahan' ? value : updated.panjang_lahan);
        const lebarLahan = Number(name === 'lebar_lahan' ? value : updated.lebar_lahan);
        updated.luas_area_perhitungan = panjangLahan && lebarLahan ? Math.round(panjangLahan * lebarLahan) : '';
      }
      // Total Ukuran Bedengan = bed_length * bed_width * number_of_beds (selalu integer)
      if (name === 'bed_length' || name === 'bed_width' || name === 'number_of_beds') {
        const bedLength = Number(name === 'bed_length' ? value : updated.bed_length);
        const bedWidth = Number(name === 'bed_width' ? value : updated.bed_width);
        const numberOfBeds = Number(name === 'number_of_beds' ? value : updated.number_of_beds);
        updated.total_ukuran_bedengan = bedLength && bedWidth && numberOfBeds ? Math.round(bedLength * bedWidth * numberOfBeds) : '';
      }
      return updated;
    });
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
      // Hitung ulang estimatedYield dan estimatedProfit sebelum submit
      const jumlahTanam = Number(form.plantingQuantity);
      const tingkatPerkecambahan = selectedCrop && selectedCrop.germinationRate ? Number(selectedCrop.germinationRate) : 100;
      const tingkatKehilangan = selectedCrop && selectedCrop.lossRate ? Number(selectedCrop.lossRate) : 0;
      const hasilPerTanaman = Number(rataRataHasil);
      const hargaJual = selectedCrop && selectedCrop.estimatedRevenue ? Number(selectedCrop.estimatedRevenue) : 0;
      const tanamanTumbuh = jumlahTanam * (tingkatPerkecambahan / 100);
      const panenKotor = tanamanTumbuh * hasilPerTanaman;
      const kehilangan = panenKotor * (tingkatKehilangan / 100);
      const panenBersih = panenKotor - kehilangan;
      const keuntungan = panenBersih * hargaJual;

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
        estimatedYield: panenBersih,
        estimatedProfit: keuntungan,
        plantingInfo: form.plantingInfo,
        status: form.status || 'active',
        // field bedengan
        panjang_lahan: form.panjang_lahan,
        lebar_lahan: form.lebar_lahan,
        bed_length: form.bed_length,
        bed_width: form.bed_width,
        number_of_beds: form.number_of_beds,
        luas_area_perhitungan: form.luas_area_perhitungan,
        total_ukuran_bedengan: form.total_ukuran_bedengan,
        jumlah_tanaman_per_baris: form.jumlah_tanaman_per_baris,
        total_per_bedengan: form.total_per_bedengan,
        jumlah_baris_per_bedengan: form.jumlah_baris_per_bedengan,
        jumlah_baris_keseluruhan: form.jumlah_baris_keseluruhan,
        lebar_unit_legowo: form.lebar_unit_legowo,
        jumlah_unit_legowo: form.jumlah_unit_legowo,
        tanaman_per_baris_legowo: form.tanaman_per_baris_legowo,
        tanaman_per_unit_legowo: form.tanaman_per_unit_legowo,
        total_tanaman_legowo: form.total_tanaman_legowo,
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

  // Perhitungan otomatis jumlah tanaman untuk format baris
  const isRow = selectedLocation?.plantingFormat === 'baris';
  useEffect(() => {
    if (isRow) {
      const luasArea = Number(selectedLocation.area) || 0;
      const jarakTanam = Number(form.plantSpacing) || 0;
      const jarakBaris = Number(form.rowSpacing) || 0;

      if (luasArea && jarakTanam && jarakBaris) {
        const jarakTanamMeter = jarakTanam / 100;
        const jarakBarisMeter = jarakBaris / 100;
        const jumlahTanaman = Math.floor(luasArea / (jarakTanamMeter * jarakBarisMeter));
        setForm(prev => ({
          ...prev,
          plantingQuantity: jumlahTanaman ? jumlahTanaman.toString() : '0'
        }));
      }
    }
  }, [form.plantSpacing, form.rowSpacing, selectedLocation]);

  // Perhitungan otomatis Perkiraan Jumlah Panen (kg) dan Perkiraan Hasil Keuntungan
  useEffect(() => {
    // Jangan override saat edit (initialData ada)
    if (initialData) return;

    // Validasi field yang dibutuhkan
    if (
      !form.plantingQuantity ||
      !selectedCrop ||
      !rataRataHasil ||
      isNaN(Number(form.plantingQuantity)) ||
      isNaN(Number(rataRataHasil))
    ) return;

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
    setForm(prev => ({
      ...prev,
      estimatedYield: panenBersih.toString() // Store as string for input value
    }));

  }, [form.plantingQuantity, selectedCrop, rataRataHasil, initialData]);

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center p-4 z-50">
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
                      {selectedLocation?.plantingFormat === 'bedengan' || selectedLocation?.plantingFormat === 'jajar_legowo' ? (
                        <span className="ml-2 text-xs text-gray-400">
                          Luas Area: {form.panjang_lahan && form.lebar_lahan ? Math.round(Number(form.panjang_lahan) * Number(form.lebar_lahan)) : '-'} m²
                        </span>
                      ) : (
                        <span className="ml-2 text-xs text-gray-400">
                          {selectedLocation.area ? parseInt(selectedLocation.area) : '-'} m²
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Field hasil perhitungan jajar legowo di bagian paling atas */}
              {selectedLocation?.plantingFormat === 'jajar_legowo' && (
                <>
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Panjang Lahan (m)</label>
                      <Input
                        type="number"
                        name="panjang_lahan"
                        value={form.panjang_lahan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Lebar Lahan (m)</label>
                      <Input
                        type="number"
                        name="lebar_lahan"
                        value={form.lebar_lahan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Pola Legowo (Baris per Unit)</label>
                      <Input
                        type="number"
                        name="jumlah_baris_per_legowo"
                        value={form.jumlah_baris_per_legowo || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Jarak Antar Kelompok (m)</label>
                      <Input
                        type="number"
                        name="jarak_antar_jajar"
                        value={form.jarak_antar_jajar || ''}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              {/* Bedengan Info Section */}
              {selectedLocation?.plantingFormat === 'bedengan' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Panjang Lahan (m)</label>
                    <Input
                      type="number"
                      name="panjang_lahan"
                      value={form.panjang_lahan}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Lebar Lahan (m)</label>
                    <Input
                      type="number"
                      name="lebar_lahan"
                      value={form.lebar_lahan}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Panjang Bedengan (m)</label>
                    <Input
                      type="number"
                      name="bed_length"
                      value={form.bed_length}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Lebar Bedengan (m)</label>
                    <Input
                      type="number"
                      name="bed_width"
                      value={form.bed_width}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Jumlah Bedengan</label>
                    <Input
                      type="number"
                      name="number_of_beds"
                      value={form.number_of_beds}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Luas Area (m²)</label>
                    <Input
                      type="number"
                      name="luas_area_perhitungan"
                      value={form.panjang_lahan && form.lebar_lahan ? Math.round(Number(form.panjang_lahan) * Number(form.lebar_lahan)) : ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Total Ukuran Bedengan (m²)</label>
                    <Input
                      type="number"
                      name="total_ukuran_bedengan"
                      value={form.total_ukuran_bedengan || ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Jumlah Baris per Bedengan</label>
                    <Input
                      type="number"
                      name="jumlah_baris_per_bedengan"
                      value={form.jumlah_baris_per_bedengan || ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Jumlah Baris (Keseluruhan)</label>
                    <Input
                      type="number"
                      name="jumlah_baris_keseluruhan"
                      value={form.jumlah_baris_keseluruhan || ''}
                      readOnly
                    />
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
                  step="1"
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
                    step="1"
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
                    step="1"
                    required
                  />
                </div>
              </div>
              {selectedLocation?.plantingFormat !== 'baris' && (
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
              )}
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
                  value={(() => {
                    const jumlahTanam = Number(form.plantingQuantity);
                    const tingkatPerkecambahan = selectedCrop && selectedCrop.germinationRate ? Number(selectedCrop.germinationRate) : 100;
                    const tingkatKehilangan = selectedCrop && selectedCrop.lossRate ? Number(selectedCrop.lossRate) : 0;
                    const hasilPerTanaman = Number(rataRataHasil);
                    const tanamanTumbuh = jumlahTanam * (tingkatPerkecambahan / 100);
                    const panenKotor = tanamanTumbuh * hasilPerTanaman;
                    const kehilangan = panenKotor * (tingkatKehilangan / 100);
                    const panenBersih = panenKotor - kehilangan;
                    return Math.round(panenBersih).toLocaleString('id-ID');
                  })()}
                  readOnly
                  className="bg-gray-100"
                />
                {infoPerhitunganPanen()}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Perkiraan Hasil Keuntungan (Rp)</label>
                <Input
                  type="text"
                  value={(() => {
                    const jumlahTanam = Number(form.plantingQuantity);
                    const tingkatPerkecambahan = selectedCrop && selectedCrop.germinationRate ? Number(selectedCrop.germinationRate) : 100;
                    const tingkatKehilangan = selectedCrop && selectedCrop.lossRate ? Number(selectedCrop.lossRate) : 0;
                    const hasilPerTanaman = Number(rataRataHasil);
                    const hargaJual = selectedCrop && selectedCrop.estimatedRevenue ? Number(selectedCrop.estimatedRevenue) : 0;
                    const tanamanTumbuh = jumlahTanam * (tingkatPerkecambahan / 100);
                    const panenKotor = tanamanTumbuh * hasilPerTanaman;
                    const kehilangan = panenKotor * (tingkatKehilangan / 100);
                    const panenBersih = panenKotor - kehilangan;
                    const keuntungan = panenBersih * hargaJual;
                    return Math.round(keuntungan).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
                  })()}
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