"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MediaMap from '@/components/maps/MediaMap';
import { GoogleMap, Polygon, Rectangle, Circle, useLoadScript, DrawingManager } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, MoreVertical, Plus, Map as MapIcon, List as ListIcon } from "lucide-react";
import PageHeader from '@/components/layout/PageHeader';
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_MAPS_LIBRARIES = ["drawing", "geometry"];

// Add state for Area Type options - Move this outside components
const AREA_TYPE_OPTIONS = [
  { value: 'Lahan', label: 'Lahan', color: '#10b981' },      // hijau
  { value: 'Irigasi', label: 'Irigasi', color: '#3b82f6' },  // biru
  { value: 'Gudang', label: 'Gudang', color: '#f59e42' }     // oranye
];

function getGeometryCenter(geometry) {
  if (!geometry) return { lat: -6.645365862602853, lng: 107.68567603382922 };
  if (geometry.type === 'Polygon' && geometry.coordinates && geometry.coordinates[0].length > 0) {
    const coords = geometry.coordinates[0];
    const avgLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
    const avgLng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    return { lat: avgLat, lng: avgLng };
  }
  if (geometry.type === 'Rectangle' && geometry.coordinates && geometry.coordinates.length === 2) {
    const [sw, ne] = geometry.coordinates;
    return {
      lat: (sw[1] + ne[1]) / 2,
      lng: (sw[0] + ne[0]) / 2
    };
  }
  if (geometry.type === 'Circle' && geometry.coordinates && geometry.coordinates.length === 2) {
    return { lat: geometry.coordinates[1], lng: geometry.coordinates[0] };
  }
  return { lat: -6.645365862602853, lng: 107.68567603382922 };
}

function TabelMedia({ onAdd, mediaList, onEdit, onDelete, isMapScriptLoaded, mapScriptLoadError, setMapCenter }) {
  const router = useRouter();
  const [showMap, setShowMap] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [mapZoom, setMapZoom] = useState(17);

  const formatArea = (area) => {
    if (!area) return '-';
    return Number(area).toString();
  };

  // Normalize the data before filtering
  const mappedMedia = mediaList.map(media => {
    // Normalize locationType to lowercase for consistent comparison
    const locationType = (media.locationType || '').toLowerCase().trim();
    const areaTypeOption = AREA_TYPE_OPTIONS.find(opt => 
      opt.value.toLowerCase() === locationType
    );
    
    return {
      ...media,
      name: media.name || '',
      locationType: areaTypeOption ? areaTypeOption.value : locationType,
      area: media.area,
      status: media.status,
      geometry: media.geometry
    };
  });

  // Enhanced filter logic with case-insensitive comparison
  const filteredMedia = mappedMedia.filter(media => {
    // Filter berdasarkan nama (case insensitive)
    const nameMatch = !searchTerm || 
      (media.name && media.name.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    
    // Filter berdasarkan tipe lokasi (case insensitive)
    const typeMatch = !filterType || 
      media.locationType.toLowerCase() === filterType.toLowerCase();
    
    // Debug logs
    console.log('Filtering media:', {
      mediaName: media.name,
      mediaLocationType: media.locationType,
      filterType: filterType,
      nameMatch,
      typeMatch
    });
    
    return nameMatch && typeMatch;
  });

  // Function to handle search and zoom
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    // If there's a search term and filtered results, zoom to the first result
    if (searchValue && filteredMedia.length > 0) {
      const firstResult = filteredMedia[0];
      if (firstResult.geometry) {
        let center = getGeometryCenter(firstResult.geometry);
        setMapCenter(center);
        setMapZoom(19); // Zoom in closer when searching
        setShowMap(true); // Switch to map view when searching
      }
    } else {
      // Reset zoom when search is cleared
      setMapZoom(17);
    }
  };

  // Handler untuk Enter pada input pencarian
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filteredMedia.length > 0 && filteredMedia[0].geometry) {
      const geometry = filteredMedia[0].geometry;
      let center = getGeometryCenter(geometry);
      setMapCenter(center);
      setMapZoom(19); // Zoom in closer when searching
      setShowMap(true);
    }
  };

  return (
    <>
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex space-x-2">
          <li className="flex items-center">
            <span className="text-gray-500 hover:text-gray-700">Crop Production</span>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">Media Management</span>
          </li>
        </ol>
      </nav>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manajemen Media</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
           <Button
             onClick={onAdd}
             className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
           >
             <Plus className="h-4 w-4 mr-2" />
             Tambah Media
           </Button>
           {/* Toggle View Button */}
           <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowMap(!showMap)}>
              {showMap ? <ListIcon className="h-4 w-4 mr-2" /> : <MapIcon className="h-4 w-4 mr-2" />}
              {showMap ? 'Lihat Tabel' : 'Lihat Peta'}
            </Button>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white shadow-lg rounded-lg p-6">
         {/* Search and Filter - Updated UI */}
         <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Cari berdasarkan nama..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full md:w-64"
            />
            <select
              value={filterType}
              onChange={e => {
                console.log('Filter type changed to:', e.target.value);
                setFilterType(e.target.value);
                // If filtering by type and there are results, zoom to first result
                if (e.target.value && filteredMedia.length > 0) {
                  const firstResult = filteredMedia[0];
                  if (firstResult.geometry) {
                    let center = getGeometryCenter(firstResult.geometry);
                    setMapCenter(center);
                    setMapZoom(19);
                    setShowMap(true);
                  }
                } else {
                  setMapZoom(17);
                }
              }}
              className="w-full md:w-64 border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Semua Tipe</option>
              {AREA_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
         </div>

        {showMap ? (
           <div className="rounded-lg overflow-hidden border h-[400px] sm:h-[600px] relative">
             {mapScriptLoadError && (
               <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 z-10">
                 Error loading Google Maps: {mapScriptLoadError.message}
               </div>
             )}
             {!isMapScriptLoaded && !mapScriptLoadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  <p className="ml-4">Loading Map...</p>
                </div>
             )}
             {isMapScriptLoaded && !mapScriptLoadError && (
               <MediaMap 
                 mediaData={filteredMedia} 
                 setMapCenter={setMapCenter}
                 zoom={mapZoom}
               />
             )}
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tanaman</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas (m²)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedia && filteredMedia.length > 0 ? (
                  filteredMedia.map((media, index) => (
                    <tr 
                      key={media.id} 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => router.push(`/crop-production/media/${media.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{media.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{media.locationType || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatArea(media.area)} m²</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{media.status || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <button
                           onClick={(e) => { e.stopPropagation(); onEdit(media); }}
                           className="text-blue-600 hover:text-blue-900 mr-4"
                         >
                           Edit
                         </button>
                         <button
                           onClick={(e) => { e.stopPropagation(); onDelete(media.id); }}
                           className="text-red-600 hover:text-red-900"
                         >
                           Hapus
                         </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Belum ada media yang ditambahkan
                    </td>
                  </tr>
                )}
              </tbody >
            </table>
          </div>
        )}
      </motion.div>
    </>
  );
}

function FormMedia({ onBack, onSuccess, initialData, isMapScriptLoaded, mapScriptLoadError, mediaList }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData || {});
  const [plantingFormat, setPlantingFormat] = useState(initialData?.planting_format || initialData?.Planting_format || '');
  const [areaGeometry, setAreaGeometry] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedAreaType, setSelectedAreaType] = useState(initialData?.locationType || 'Lahan');
  const [pricePerM2, setPricePerM2] = useState(initialData?.price_per_m2 || initialData?.Price_per_m2 || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isPolygonEditable, setIsPolygonEditable] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [polygonInstance, setPolygonInstance] = useState(null);
  const [drawingKey, setDrawingKey] = useState(0);

  const formatArea = (area) => {
    if (!area) return '';
    // Convert to number and remove trailing zeros
    return Number(area).toString();
  };

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPlantingFormat(initialData.planting_format || initialData.Planting_format || '');
      // TODO: Load areaGeometry from initialData if available
       setPricePerM2(initialData.price_per_m2 || initialData.Price_per_m2 || '');
    }
  }, [initialData]);

  // Effect to calculate estimated land value when area or price changes
  useEffect(() => {
     const price = parseFloat(pricePerM2) || 0;
     let areaToUse = 0;

     const panjangLahan = parseFloat(form.panjangLahan) || 0;
     const lebarLahan = parseFloat(form.lebarLahan) || 0;

     if (plantingFormat === 'bedengan' || plantingFormat === 'jajar_legowo') {
       // Use calculated land area for bedengan and jajar_legowo
       areaToUse = panjangLahan * lebarLahan;
     } else {
       // Use area from map (areaSize) for other formats (like 'baris')
       areaToUse = form.areaSize || form.area || 0;
     }

     const estimated = Math.round(areaToUse) * price;

     // Only update if the calculated value is different to avoid infinite loops
     if (form.estimatedLandValue !== estimated) {
        setForm(f => ({ ...f, estimatedLandValue: estimated }));
     }
  }, [form.areaSize, form.area, pricePerM2, setForm, form.estimatedLandValue]); // Dependencies

  useEffect(() => {
    const panjangLahan = parseFloat(form.panjangLahan) || 0;
    const lebarLahan = parseFloat(form.lebarLahan) || 0;
    const luasArea = panjangLahan * lebarLahan;
    setForm(f => ({ ...f, luasArea }));
  }, [form.panjangLahan, form.lebarLahan]);

  useEffect(() => {
    if (plantingFormat === 'bedengan') {
      const panjangLahan = parseFloat(form.panjangLahan) || 0;
      const lebarLahan = parseFloat(form.lebarLahan) || 0;
      const panjangBed = parseFloat(form.bedLength || form.bed_length) || 0;
      const lebarBed = parseFloat(form.bedWidth || form.bed_width) || 0;
      const jumlahBed = parseFloat(form.numberOfBeds || form.number_of_beds) || 0;

      // Calculate total land area
      const luasArea = panjangLahan * lebarLahan;

      // Calculate total bedengan area
      const luasTotalBedengan = panjangBed * lebarBed * jumlahBed;

      setForm(f => ({
        ...f,
        luasArea,
        luasTotalBedengan
      }));
    }
  }, [
    form.panjangLahan,
    form.lebarLahan,
    form.bedLength,
    form.bed_length,
    form.bedWidth,
    form.bed_width,
    form.numberOfBeds,
    form.number_of_beds,
    plantingFormat
  ]);

  useEffect(() => {
    if (plantingFormat === 'jajar_legowo') {
      const panjangLahan = parseFloat(form.panjangLahan) || 0;
      const lebarLahan = parseFloat(form.lebarLahan) || 0;
      const lebarLegowo = parseFloat(form.lebarLegowo) || 0;
      const jarakAntarBaris = parseFloat(form.jarakAntarBaris) || 0;
      const jumlahBarisPerLegowo = parseFloat(form.jumlahBarisPerLegowo) || 0;
      const jarakAntarTanaman = parseFloat(form.jarakAntarTanaman) || 0;

      // Calculate total land area
      const luasArea = panjangLahan * lebarLahan;

      // Calculate number of legowo units
      const lebarUnitLegowo = (jumlahBarisPerLegowo * jarakAntarBaris) + lebarLegowo;
      const jumlahUnitLegowo = Math.floor(lebarLahan / lebarUnitLegowo);

      // Calculate total plants
      const tanamanPerBaris = Math.floor(panjangLahan / jarakAntarTanaman);
      const tanamanPerUnit = tanamanPerBaris * jumlahBarisPerLegowo;
      const totalTanaman = jumlahUnitLegowo * tanamanPerUnit;

      setForm(f => ({
        ...f,
        luasArea,
        jumlahUnitLegowo,
        totalTanaman
      }));
    }
  }, [
    form.panjangLahan,
    form.lebarLahan,
    form.lebarLegowo,
    form.jarakAntarBaris,
    form.jarakAntarTanaman,
    form.jumlahBarisPerLegowo,
    plantingFormat
  ]);

  const STATUS_OPTIONS = [
    'Aktif',
    'Ladang Menganggur',
    'Disewakan',
    'Lainnya',
  ];

  const LIGHT_PROFILE_OPTIONS = [
    'Matahari Penuh',
    'Matahari ke Setengah',
    'Setengah Matahari',
    'Matahari ke Teduh',
    'Setengah Teduh',
    'Teduh Penuh',
  ];

  const plantingFormats = [
    {
      value: 'bedengan',
      label: 'Ditanam di bedengan',
      desc: 'Jumlah bedengan untuk berbagai tanaman. Contoh: Wortel, Tomat, Bayam, dll.'
    },
    {
      value: 'baris',
      label: 'Baris tanaman',
      desc: 'Satu jenis tanaman dalam baris. Contoh: Jagung, Kedelai, Kentang, dll.'
    },
    {
      value: 'jajar_legowo',
      label: 'Jajar Legowo',
      desc: 'Sistem tanam padi dengan pola jarak tanam yang berbeda. Contoh: Padi.'
    },
    {
      value: 'none',
      label: 'Tidak Ada',
      desc: 'Tidak ada format penanaman (misal: Gudang).'
    }
  ];

  const areaType = form.locationType || form.area?.type || selectedAreaType || '';
  const hidePlantingFormat = areaType === 'Gudang' || areaType === 'Irigasi'; // Updated condition to hide for both Gudang and Irigasi

  const parseNum = val => Number(String(val || '0').replace(',', '.'));

  const handleNext = () => {
    // Validate based on step before moving next
    if (step === 1) {
      // Only validate area geometry when trying to proceed to step 2
      if (!areaGeometry) {
        alert('Mohon gambar area di peta terlebih dahulu.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleAreaComplete = (event) => {
    const shape = event.overlay;
    let geometry = null;
    let areaSize = 0;

    // Hapus overlay lama jika ada
    if (polygonInstance) {
      polygonInstance.setMap(null);
      setPolygonInstance(null);
    }

    if (drawingManager) {
      drawingManager.setDrawingMode(null);
      drawingManager.setOptions({ drawingControl: false });
    }

    if (shape instanceof window.google.maps.Polygon) {
      setPolygonInstance(shape);
      const path = shape.getPath().getArray().map(latLng => [latLng.lng(), latLng.lat()]);
      geometry = { type: 'Polygon', coordinates: [path] };
      if (window.google.maps.geometry) {
        areaSize = window.google.maps.geometry.spherical.computeArea(shape.getPath());
      }
    }

    if (geometry) {
      setAreaGeometry(geometry);
      const estimated = Math.round(areaSize) * (pricePerM2 || 0);
      setForm(f => ({
        ...f,
        areaSize: Math.round(areaSize),
        locationType: selectedAreaType,
        estimatedLandValue: estimated,
      }));
      setIsPolygonEditable(true);
    }

    // Hapus overlay dari map (prevent double render)
    shape.setMap(null);
  };

  const handleResetArea = () => {
    // Hapus overlay instance
    if (polygonInstance) {
      polygonInstance.setMap(null);
      setPolygonInstance(null);
    }
    if (drawingManager) {
      drawingManager.setDrawingMode(null);
      drawingManager.setOptions({ drawingControl: true });
    }
    setAreaGeometry(null);
    setForm(f => ({ 
      ...f, 
      areaSize: 0,
      estimatedLandValue: 0
    }));
    setDrawingKey(prev => prev + 1);
    setDrawingManager(null);
  };

  const handleAreaTypeChange = (type) => {
      // Reset area if already drawn
      if (areaGeometry) {
        setAreaGeometry(null);
        setForm(f => ({ 
          ...f, 
          areaSize: 0,
          estimatedLandValue: 0
        }));
      }
      setSelectedAreaType(type);
      // Update drawing manager options with new color if it exists
      if (drawingManager) {
        const color = AREA_TYPE_OPTIONS.find(opt => opt.value === type)?.color || '#10b981';
        drawingManager.setOptions({
          polygonOptions: {
            fillColor: color,
            strokeColor: color,
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: 1
          },
          rectangleOptions: {
            fillColor: color,
            strokeColor: color,
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: 1
          },
          circleOptions: {
            fillColor: color,
            strokeColor: color,
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: true,
            editable: false,
            draggable: false,
            zIndex: 1
          }
        });
      }
   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    if (!form.name) {
      setError('Nama media harus diisi');
      setIsSubmitting(false);
      return;
    }

    if (!form.locationType) {
      setError('Tipe lokasi harus dipilih');
      setIsSubmitting(false);
      return;
    }

    if (!areaGeometry) {
      setError('Area peta harus digambar terlebih dahulu');
      setIsSubmitting(false);
      return;
    }

    // Log geometry data before sending
    console.log("Area geometry before sending:", areaGeometry);
    console.log("Geometry type:", areaGeometry.type);
    console.log("Geometry coordinates:", areaGeometry.coordinates);

    if (!pricePerM2) {
      setError('Harga per meter persegi harus diisi');
      setIsSubmitting(false);
      return;
    }

    // Calculate jajar legowo area if planting format is jajar_legowo
    let calculatedLuasTotalJajarLegowo = null;
    if (plantingFormat === 'jajar_legowo') {
      const panjang = parseNum(form.panjangLahan);
      const lebar = parseNum(form.lebarLahan);
      if (panjang && lebar) {
        calculatedLuasTotalJajarLegowo = panjang * lebar;
      }
    }

    const dataToSend = {
      name: form.name || '',
      internalId: form.internalId || form.internal_id || '',
      electronicId: form.electronicId || form.electronic_id || '',
      locationType: form.locationType || selectedAreaType || '',
      plantingFormat: plantingFormat || '',
      numberOfBeds: parseNum(form.numberOfBeds || form.number_of_beds || ''),
      bedLength: parseNum(form.bedLength || form.bed_length || ''),
      bedWidth: parseNum(form.bedWidth || form.bed_width || ''),
      panjangLahan: parseNum(form.panjangLahan || ''),
      lebarLahan: parseNum(form.lebarLahan || ''),
      lebarLegowo: parseNum(form.lebarLegowo || ''),
      jarakAntarTanaman: parseNum(form.jarakAntarTanaman || ''),
      jarakAntarBaris: parseNum(form.jarakAntarBaris || ''),
      jumlahBarisPerLegowo: parseNum(form.jumlahBarisPerLegowo || ''),
      luasTotalBedengan: parseNum(form.luasTotalBedengan || ''),
      luasTotalJajarLegowo: calculatedLuasTotalJajarLegowo || parseNum(form.luasTotalJajarLegowo || ''),
      pricePerM2: parseNum(pricePerM2 || ''),
      area: parseNum(form.areaSize || form.area || ''),
      estimatedLandValue: parseNum(form.estimatedLandValue || form.estimated_land_value || ''),
      status: form.status || '',
      lightProfile: form.lightProfile || form.light_profile || '',
      grazingRestDays: parseNum(form.grazingRestDays || form.grazing_rest_days || ''),
      description: form.description || '',
    };

    // Add geometry to dataToSend if available
    if (areaGeometry) {
        dataToSend.geometry = areaGeometry;
    }

    console.log("Sending data to server:", dataToSend);

    try {
      let res;
      if (form.id) {
        res = await fetch(`/api/media_locations/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      } else {
        res = await fetch('/api/media_locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend),
        });
      }

      if (!res.ok) {
        let errorDetail = 'Failed to save media location';
        try {
          const errorData = await res.json();
          errorDetail = errorData.message || JSON.stringify(errorData);
        } catch (jsonError) {
          try {
            const errorText = await res.text();
            errorDetail = `Server Error (Status: ${res.status}): ${errorText.substring(0, 200)}...`;
          } catch (textError) {
            errorDetail = `Server Error (Status: ${res.status})`;
          }
        }
        throw new Error(errorDetail);
      }

      const data = await res.json();
      onSuccess(data);
    } catch (error) {
      console.error('Error saving media location:', error);
      setError(error.message || 'Failed to save media location');
      alert('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk konversi geometry ke path/props Google Maps
  const getPolygonPath = (geometry) => geometry?.coordinates?.[0]?.map(coord => ({ lat: coord[1], lng: coord[0] })) || [];
  const getRectangleBounds = (geometry) => {
    if (!geometry?.coordinates) return null;
    const [sw, ne] = geometry.coordinates;
    return {
      south: sw[1],
      west: sw[0],
      north: ne[1],
      east: ne[0],
    };
  };
  const getCircleProps = (geometry) => {
    if (!geometry?.coordinates) return null;
    return {
      center: { lat: geometry.coordinates[1], lng: geometry.coordinates[0] },
      radius: geometry.radius,
    };
  };

  // Handler untuk update geometry saat overlay diedit
  const handlePolygonEdit = () => {
    if (!polygonInstance) return;
    const path = polygonInstance.getPath().getArray().map(latLng => [latLng.lng(), latLng.lat()]);
    const geometry = { type: 'Polygon', coordinates: [path] };
    setAreaGeometry(geometry);
    if (window.google?.maps?.geometry) {
      const areaSize = window.google.maps.geometry.spherical.computeArea(polygonInstance.getPath());
      setForm(f => ({ ...f, areaSize: Math.round(areaSize) }));
    }
  };

  const handleDrawingModeChange = (mode) => {
    if (drawingManager) {
      // Update warna sesuai tipe area
      const color = AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981';
      drawingManager.setOptions({
        polygonOptions: {
          fillColor: color,
          strokeColor: color,
          fillOpacity: 0.35,
          strokeWeight: 2,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1
        },
        rectangleOptions: {
          fillColor: color,
          strokeColor: color,
          fillOpacity: 0.35,
          strokeWeight: 2,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1
        },
        circleOptions: {
          fillColor: color,
          strokeColor: color,
          fillOpacity: 0.35,
          strokeWeight: 2,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1
        }
      });
      // Set mode gambar
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType[mode.toUpperCase()]);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Area Peta</h2>
            <p className="text-sm text-muted-foreground">
              Pilih tipe area lalu gambar polanya dengan klik tiap sudut pada peta.
              {!areaGeometry && (
                <span className="text-red-500 ml-2">
                  *Area harus digambar sebelum melanjutkan
                </span>
              )}
            </p>
            {/* Kontrol Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col justify-end h-full">
                <label htmlFor="areaType" className="text-sm font-medium text-gray-700 mb-1">Tipe Area</label>
                <select
                  id="areaType"
                  value={selectedAreaType}
                  onChange={e => handleAreaTypeChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-sm"
                  style={{height: '42px'}}
                >
                  {AREA_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end h-full">
                <Button
                  variant="outline"
                  onClick={handleResetArea}
                  className="block w-full px-3 py-2 border border-red-300 text-red-600 bg-white hover:bg-red-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm text-sm"
                  disabled={!areaGeometry}
                  style={{height: '42px'}}
                >
                  Reset Area
                </Button>
              </div>
            </div>
            {/* Ganti MediaMap dengan GoogleMap langsung */}
            <div className="rounded-lg overflow-hidden border h-[400px] sm:h-[600px] relative">
              {mapScriptLoadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 z-10">
                  Error loading Google Maps: {mapScriptLoadError.message}
                </div>
              )}
              {!isMapScriptLoaded && !mapScriptLoadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  <p className="ml-4">Loading Map...</p>
                </div>
              )}
              {isMapScriptLoaded && !mapScriptLoadError && (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={areaGeometry ? (areaGeometry.type === 'Polygon' ? getPolygonPath(areaGeometry)[0] : areaGeometry.type === 'Rectangle' ? { lat: getRectangleBounds(areaGeometry).south, lng: getRectangleBounds(areaGeometry).west } : areaGeometry.type === 'Circle' ? getCircleProps(areaGeometry).center : { lat: -6.6459, lng: 107.6857 }) : { lat: -6.6459, lng: 107.6857 }}
                  zoom={17}
                  onLoad={setMapInstance}
                  options={{ mapTypeId: 'satellite', mapTypeControl: false, streetViewControl: false, fullscreenControl: false }}
                >
                  {/* Render overlay editable jika areaGeometry ada */}
                  {!areaGeometry && drawingManager && (
                    drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON)
                  )}
                  {areaGeometry && areaGeometry.type === 'Polygon' && (
                    <Polygon
                      paths={getPolygonPath(areaGeometry)}
                      options={{
                        editable: true,
                        draggable: false,
                        fillColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981',
                        strokeColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981',
                        fillOpacity: 0.35,
                        strokeWeight: 2
                      }}
                      onLoad={poly => setPolygonInstance(poly)}
                      onMouseUp={handlePolygonEdit}
                      onDragEnd={handlePolygonEdit}
                    />
                  )}
                  {!areaGeometry && (
                    <DrawingManager
                      key={drawingKey}
                      onLoad={dm => setDrawingManager(dm)}
                      onOverlayComplete={handleAreaComplete}
                      options={{
                        drawingControl: false,
                        drawingModes: ['polygon'],
                        polygonOptions: {
                          editable: true,
                          draggable: false,
                          fillColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981',
                          strokeColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981',
                          fillOpacity: 0.35,
                          strokeWeight: 2
                        }
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Informasi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <Input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Internal</label>
                <Input
                  type="text"
                  value={form.internalId || form.internal_id || ''}
                  onChange={(e) => setForm({ ...form, internalId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ID Elektronik</label>
                <Input
                  type="text"
                  value={form.electronicId || form.electronic_id || ''}
                  onChange={(e) => setForm({ ...form, electronicId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipe Lokasi</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={form.locationType || selectedAreaType || ''}
                  onChange={(e) => setForm({ ...form, locationType: e.target.value })}
                >
                  <option value="">Pilih Tipe Lokasi</option>
                  {AREA_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!hidePlantingFormat && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Format Penanaman</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plantingFormats.map(format => (
                    <Card 
                      key={format.value} 
                      className={
                         `cursor-pointer ${plantingFormat === format.value ? 'border-green-500 ring-2 ring-green-500' : ''}`
                      }
                      onClick={() => setPlantingFormat(format.value)}
                    >
                      <CardContent className="p-4">
                         <h3 className="font-semibold">{format.label}</h3>
                         <p className="text-sm text-muted-foreground mt-1">{format.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

             {/* Input fields based on Planting Format */}
             {plantingFormat === 'bedengan' && (
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Panjang Lahan (m)</label>
                     <Input
                       type="number"
                       value={form.panjangLahan || ''}
                       onChange={(e) => setForm({ ...form, panjangLahan: e.target.value })}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Lebar Lahan (m)</label>
                     <Input
                       type="number"
                       value={form.lebarLahan || ''}
                       onChange={(e) => setForm({ ...form, lebarLahan: e.target.value })}
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Panjang Bedengan (m)</label>
                     <Input
                       type="number"
                       value={form.bedLength || form.bed_length || ''}
                       onChange={(e) => setForm({ ...form, bedLength: e.target.value })}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Lebar Bedengan (m)</label>
                     <Input
                       type="number"
                       value={form.bedWidth || form.bed_width || ''}
                       onChange={(e) => setForm({ ...form, bedWidth: e.target.value })}
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Jumlah Bedengan</label>
                     <Input
                       type="number"
                       value={form.numberOfBeds || form.number_of_beds || ''}
                       onChange={(e) => setForm({ ...form, numberOfBeds: e.target.value })}
                     />
                   </div>
                 </div>
               </div>
             )}

             {plantingFormat === 'jajar_legowo' && (
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Panjang Lahan (m)</label>
                     <Input
                       type="number"
                       value={form.panjangLahan || ''}
                       onChange={(e) => setForm({ ...form, panjangLahan: e.target.value })}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Lebar Lahan (m)</label>
                     <Input
                       type="number"
                       value={form.lebarLahan || ''}
                       onChange={(e) => setForm({ ...form, lebarLahan: e.target.value })}
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Lebar Legowo (m)</label>
                     <Input
                       type="number"
                       value={form.lebarLegowo || ''}
                       onChange={(e) => setForm({ ...form, lebarLegowo: e.target.value })}
                       placeholder="Contoh: 0.8"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Jumlah Baris per Legowo</label>
                     <Input
                       type="number"
                       value={form.jumlahBarisPerLegowo || ''}
                       onChange={(e) => setForm({ ...form, jumlahBarisPerLegowo: e.target.value })}
                       placeholder="Contoh: 2"
                     />
                   </div>
                 </div>
               </div>
             )}

             {/* Informasi Luas Area - Combined and simplified */}
             <div className="border-t pt-4 mt-4">
                 <h3 className="text-sm font-medium text-gray-700 mb-4">Informasi Luas Area</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {/* Show calculated area for all types except when planting format is 'baris' */}
                   {(!hidePlantingFormat && plantingFormat !== 'baris') && (
                     <div>
                       <label className="block text-sm font-medium text-gray-700">Luas Area dari Perhitungan (m²)</label>
                       <Input
                         type="number"
                         value={form.luasArea || ''}
                         onChange={() => {}} // Empty handler for controlled component
                         readOnly
                       />
                     </div>
                   )}
                   <div>
                     <label className="block text-sm font-medium text-gray-700">Luas Area dari Peta (m²)</label>
                     <Input
                       type="number"
                       value={form.areaSize || ''}
                       onChange={(e) => {
                         if (!hidePlantingFormat && plantingFormat !== 'baris') {
                           setForm(prev => ({ ...prev, areaSize: e.target.value }));
                         }
                       }}
                       readOnly={!hidePlantingFormat && plantingFormat !== 'baris'}
                     />
                   </div>
                   {/* Add Luas Total Bedengan for bedengan format */}
                   {plantingFormat === 'bedengan' && (
                     <div>
                       <label className="block text-sm font-medium text-gray-700">Luas Total Bedengan (m²)</label>
                       <Input
                         type="number"
                         value={form.luasTotalBedengan || ''}
                         onChange={() => {}} // Empty handler for controlled component
                         readOnly
                       />
                     </div>
                   )}
                 </div>
               </div>

             {/* Harga per meter persegi and Estimasi Nilai Lahan - Always visible */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700">Harga per meter persegi</label>
                   <Input
                      type="number"
                      value={pricePerM2 || ''}
                      onChange={(e) => setPricePerM2(e.target.valueAsNumber || '')}
                      placeholder="Contoh: 100000"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Estimasi Nilai Lahan</label>
                   <Input
                      type="text"
                      value={form.estimatedLandValue ? `Rp. ${form.estimatedLandValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}` : ''}
                      onChange={() => {}} // Empty handler for controlled component
                      readOnly
                   />
                </div>
             </div>

          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Detail Lanjut</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={form.status || initialData?.status || ''}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Pilih Status</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Profil Cahaya</label>
                <select
                  value={form.lightProfile || initialData?.light_profile || initialData?.Light_profile || ''}
                  onChange={(e) => setForm({ ...form, lightProfile: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Pilih Profil Cahaya</option>
                  {LIGHT_PROFILE_OPTIONS.map((profile) => (
                    <option key={profile} value={profile}>
                      {profile}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700">Hari Istirahat Penggembalaan</label>
                 <Input
                    type="number"
                    value={form.grazingRestDays || initialData?.grazing_rest_days || initialData?.Grazing_rest_days || ''}
                    onChange={(e) => setForm({ ...form, grazingRestDays: e.target.value })}
                 />
              </div>
               <div className="sm:col-span-2">
                 <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                 {/* TODO: Change to textarea */}
                 <Input
                    type="text"
                    value={form.description || initialData?.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                 />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Update drawing color when selectedAreaType changes
  useEffect(() => {
    if (drawingManager) {
      const color = AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981';
      drawingManager.setOptions({
        polygonOptions: {
          fillColor: color,
          strokeColor: color,
          fillOpacity: 0.35,
          strokeWeight: 2,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1
        },
        rectangleOptions: {
          fillColor: color,
          strokeColor: color,
          fillOpacity: 0.35,
          strokeWeight: 2,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1
        },
        circleOptions: {
          fillColor: color,
          strokeColor: color,
          fillOpacity: 0.35,
          strokeWeight: 2,
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1
        }
      });
    }
  }, [selectedAreaType, drawingManager]);

  useEffect(() => {
    return () => {
      setDrawingManager(null);
    };
  }, []);

  return (
    <div className="p-4 sm:p-8">
       <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Lokasi Media Baru</h1>
          {/* Step Indicator */}
          <div className="flex items-center gap-2 ml-auto">
             {[1, 2, 3].map(s => (
               <div 
                 key={s} 
                 className={
                   `w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border ${step === s ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-500'}`
                 }
               >
                 {s}
               </div>
             ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-end gap-4">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack} 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Kembali
                </Button>
              )}
              {step < 3 && (
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  Berikutnya
                </Button>
              )}
              {step === 3 && (
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MediaManagement() {
  const [mediaList, setMediaList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  // Load Google Maps script once
  const { isLoaded: isMapScriptLoaded, loadError: mapScriptLoadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching media locations...");
      const res = await fetch('/api/media_locations', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
      });
      
      console.log("Response status:", res.status);
      if (!res.ok) {
        // Try to parse JSON first, but fallback to text if it fails (HTML response)
        let errorDetail = 'Failed to fetch media locations';
        try {
          const errorData = await res.json();
          console.log("Error data:", errorData);
          errorDetail = errorData.message || JSON.stringify(errorData);
        } catch (jsonError) {
          // If JSON parsing fails, read as text (likely HTML error page)
          try {
            const errorText = await res.text();
            console.log("Error text:", errorText);
            errorDetail = `Server Error (Status: ${res.status}): ${errorText.substring(0, 200)}...`; // Limit text
          } catch (textError) {
            // Fallback
            errorDetail = `Server Error (Status: ${res.status})`;
          }
        }
        
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error(errorDetail);
      }

      const data = await res.json();
      // Parse geometry if still string
      data.forEach(media => {
        if (typeof media.geometry === 'string') {
          try {
            media.geometry = JSON.parse(media.geometry);
          } catch (e) {
            media.geometry = null;
          }
        }
      });
      // Add detailed geometry logging
      data.forEach((media, index) => {
        console.log(`Media ${index + 1} geometry:`, {
          id: media.id,
          name: media.name,
          geometry: media.geometry,
          geometryType: media.geometry?.type,
          coordinates: media.geometry?.coordinates
        });
      });
      if (!Array.isArray(data)) {
        console.error("Invalid data format:", data);
        throw new Error('Invalid data format received from server');
      }
      console.log("Setting media list with data:", data);
      setMediaList(data);
    } catch (error) {
      console.error('Error fetching media locations:', error);
      setError(error.message || 'Failed to load media locations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus media ini?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/media_locations/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        
        // Show error message to user
        const errorMessage = data.error || 'Gagal menghapus media';
        alert(errorMessage);
        return;
      }
      
      // Success - refresh the media list
      await fetchMedia();
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-500 ease-in-out';
      notification.textContent = 'Media berhasil dihapus!';
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
      console.error('Error deleting media:', error);
      alert('Terjadi kesalahan saat menghapus media. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (media) => {
    if (!media || !media.id) {
      setError('Data media tidak valid untuk diedit');
      return;
    }
    setSelectedMedia(media);
    setShowForm(true);
  };

  const handleSuccess = (data) => {
    setShowForm(false);
    setSelectedMedia(null);
    fetchMedia();
    // Show success message
    alert(data.id ? 'Media berhasil diperbarui' : 'Media berhasil ditambahkan');
  };

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
        
        if (!res.ok) {
          router.push('/auth/login');
          return;
        }
        
        const data = await res.json();
        if (!data.authenticated) {
          router.push('/auth/login');
          return;
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/auth/login');
      }
    };
    checkSession();
  }, []);

  if (showForm) {
    return (
      <FormMedia
        onBack={() => setShowForm(false)}
        onSuccess={handleSuccess}
        initialData={selectedMedia}
        isMapScriptLoaded={isMapScriptLoaded}
        mapScriptLoadError={mapScriptLoadError}
        mediaList={mediaList}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading media data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button
            onClick={() => fetchMedia()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      <PageHeader title="Manajemen Media" />
      <div className="container mx-auto p-4 md:p-8 pt-24 md:pt-20">
        <TabelMedia
          onAdd={() => setShowForm(true)}
          mediaList={mediaList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isMapScriptLoaded={isMapScriptLoaded}
          mapScriptLoadError={mapScriptLoadError}
          setMapCenter={setMapCenter}
        />
      </div>
    </div>
  );
}