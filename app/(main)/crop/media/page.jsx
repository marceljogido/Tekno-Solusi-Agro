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

const GOOGLE_MAPS_LIBRARIES = ["drawing", "geometry"];

function TabelMedia({ onAdd, mediaList, onEdit, onDelete, isMapScriptLoaded, mapScriptLoadError }) {
  const router = useRouter();
  const [showMap, setShowMap] = useState(true);

  console.log("TabelMedia received mediaList:", mediaList);

  const mappedMedia = mediaList.map(media => ({
    ...media,
    name: media.name,
    locationType: media.location_type,
    area: media.area,
    status: media.status,
  }));

  console.log("Mapped media data:", mappedMedia);

  return (
    <div className="p-4 md:p-8">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Manajemen Media</h1>
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

      <div className="bg-white shadow-lg rounded-lg p-6">
         {/* Search and Filter - Simplified for now */}
         <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Cari di sini..."
              className="w-full md:w-64"
            />
             <Button variant="outline" className="w-full md:w-auto">Filter</Button>
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
               <GoogleMap
                 mapContainerStyle={{
                   width: '100%',
                   height: '100%',
                 }}
                 center={{ lat: -7.4355904, lng: 112.7164527 }}
                 zoom={17}
                 options={{
                   mapTypeId: 'satellite',
                   streetViewControl: false,
                   fullscreenControl: false,
                   mapTypeControl: true,
                   zoomControl: true,
                 }}
               >
                 {/* Render existing polygons, rectangles, circles for mediaList */}
                 {mediaList.map(media => {
                   if (!media.geometry) return null;
                   const areaTypeOption = AREA_TYPE_OPTIONS.find(opt => opt.value === media.location_type);
                   const displayColor = areaTypeOption ? areaTypeOption.color : '#10b981';

                   switch(media.geometry.type) {
                     case 'Polygon':
                       const polygonPath = media.geometry.coordinates[0].map(coord => ({ lat: coord[1], lng: coord[0] }));
                       return <Polygon key={media.id} paths={[polygonPath]} options={{ fillColor: displayColor, strokeColor: displayColor, fillOpacity: 0.5, strokeWeight: 2 }} />;
                     case 'Rectangle':
                       if (media.geometry.coordinates && media.geometry.coordinates.length === 2) {
                          const bounds = new window.google.maps.LatLngBounds(
                             { lat: media.geometry.coordinates[0][1], lng: media.geometry.coordinates[0][0] },
                             { lat: media.geometry.coordinates[1][1], lng: media.geometry.coordinates[1][0] }
                          );
                          return <Rectangle key={media.id} bounds={bounds} options={{ fillColor: displayColor, strokeColor: displayColor, fillOpacity: 0.5, strokeWeight: 2 }} />;
                       } else {
                         console.error('Unexpected rectangle coordinates format:', media.geometry.coordinates);
                         return null;
                       }
                     case 'Circle':
                       if (media.geometry.coordinates && media.geometry.coordinates.length === 1 && media.geometry.radius !== undefined) {
                           const center = { lat: media.geometry.coordinates[0][1], lng: media.geometry.coordinates[0][0] };
                           return <Circle key={media.id} center={center} radius={media.geometry.radius} options={{ fillColor: displayColor, strokeColor: displayColor, fillOpacity: 0.5, strokeWeight: 2 }} />;
                       } else {
                          console.error('Unexpected circle coordinates/radius format:', media.geometry);
                          return null;
                       }
                     default:
                       return null;
                   }
                 })}
               </GoogleMap>
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
                {mappedMedia && mappedMedia.length > 0 ? (
                  mappedMedia.map((media) => (
                    <tr 
                      key={media.id} 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => router.push(`/crop-production/media/${media.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{media.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{media.locationType || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{media.area || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{media.status || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <div onClick={e => e.stopPropagation()}>
                               <Button variant="ghost" size="icon" className="h-8 w-8">
                                 <MoreVertical className="h-4 w-4" />
                               </Button>
                             </div>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(media); }}>Edit</DropdownMenuItem>
                             <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(media.id); }}>Hapus</DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
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
      </div>
    </div>
  );
}

function FormMedia({ onBack, onSuccess, initialData, isMapScriptLoaded, mapScriptLoadError }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialData || {});
  const [plantingFormat, setPlantingFormat] = useState(initialData?.planting_format || '');
  const [areaGeometry, setAreaGeometry] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedDrawingMode, setSelectedDrawingMode] = useState(null);
  const [selectedAreaType, setSelectedAreaType] = useState('Lahan');
  const [pricePerM2, setPricePerM2] = useState(initialData?.price_per_m2 || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [drawnOverlay, setDrawnOverlay] = useState(null);

  // Add state for Area Type options
  const AREA_TYPE_OPTIONS = [
    { value: 'Lahan', label: 'Lahan', color: '#10b981' }, // Green
    { value: 'Gudang', label: 'Gudang', color: '#f97316' }, // Orange
    { value: 'Irigasi', label: 'Irigasi', color: '#3b82f6' }, // Blue
  ];

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPlantingFormat(initialData.planting_format || '');
      // TODO: Load areaGeometry from initialData if available
       setPricePerM2(initialData.price_per_m2 || '');
    }
  }, [initialData]);

  // Effect to calculate estimated land value when area or price changes
  useEffect(() => {
     const areaSize = form.areaSize || form.area || 0; // Use areaSize from form state
     const price = pricePerM2 || 0;
     const estimated = Math.round(areaSize) * price;
     // Only update if the calculated value is different to avoid infinite loops
     if (form.estimatedLandValue !== estimated) {
        setForm(f => ({ ...f, estimatedLandValue: estimated }));
     }
  }, [form.areaSize, form.area, pricePerM2, setForm, form.estimatedLandValue]); // Dependencies

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
      value: 'none',
      label: 'Tidak Ada',
      desc: 'Tidak ada format penanaman (misal: Gudang).'
    }
  ];

  const areaType = form.location_type || form.area?.type || '';
  const hidePlantingFormat = areaType === 'Gudang'; // Assuming 'Gudang' means no planting format

  const parseNum = val => Number(String(val || '0').replace(',', '.'));

  const handleNext = () => {
    // Validate based on step before moving next
    if (step === 1) {
       if (!areaGeometry) {
          alert('Mohon gambar area di peta terlebih dahulu.');
          return;
       }
        // Validation for selectedAreaType is now tied to drawing completion
        // and will be saved with the geometry in handleAreaComplete
        // No separate check needed here if areaGeometry implies type is set
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

    // Clear previous shape if any
    if (drawnOverlay) {
        drawnOverlay.setMap(null);
    }

    // Store the new drawn shape (overlay object)
    setDrawnOverlay(shape);

    // Extract coordinates based on shape type
    let geometry = null;
    let areaSize = 0;

    if (shape instanceof window.google.maps.Polygon) {
      const path = shape.getPath().getArray().map(latLng => [latLng.lng(), latLng.lat()]);
      geometry = { type: 'Polygon', coordinates: [path] };
      if (window.google.maps.geometry) {
         areaSize = window.google.maps.geometry.spherical.computeArea(shape.getPath());
      }
    } else if (shape instanceof window.google.maps.Rectangle) {
       const bounds = shape.getBounds();
       const ne = bounds.getNorthEast();
       const sw = bounds.getSouthWest();
       // Store rectangle as two points or a polygon depending on backend needs
       geometry = { type: 'Rectangle', coordinates: [[sw.lng(), sw.lat()], [ne.lng(), ne.lat()]] };
       if (window.google.maps.geometry) {
           areaSize = window.google.maps.geometry.spherical.computeArea(shape.getBounds());
       }
    } else if (shape instanceof window.google.maps.Circle) {
       const center = shape.getCenter();
       const radius = shape.getRadius();
       geometry = { type: 'Circle', coordinates: [center.lng(), center.lat()], radius: radius };
        areaSize = Math.PI * Math.pow(radius, 2); // Simple circle area formula
    }

    if (geometry) {
      setAreaGeometry(geometry);
       // Calculate estimated land value when area geometry is set or price changes
       const estimated = Math.round(areaSize) * (pricePerM2 || 0);
       setForm(f => ({
         ...f,
         areaSize: Math.round(areaSize),
         location_type: selectedAreaType,
         estimatedLandValue: estimated, // Update estimated land value
       }));
    }
  };

   const handleDrawingModeChange = (mode) => {
     if (drawingManager) {
        drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType[mode.toUpperCase()]);
         setSelectedDrawingMode(mode);
     }
   };

   const handleResetArea = () => {
      // Remove the drawn overlay from the map
      if (drawnOverlay) {
          drawnOverlay.setMap(null);
      }
      setDrawnOverlay(null);

      // Reset geometry and form data
      setAreaGeometry(null);
      setForm(f => ({ ...f, areaSize: 0 }));

      // Reset drawing manager mode
       if (drawingManager) {
         drawingManager.setDrawingMode(null);
         setSelectedDrawingMode(null);
       }
   };

   const handleAreaTypeChange = (type) => {
      setSelectedAreaType(type);
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

    if (!areaGeometry) {
      setError('Area peta harus digambar terlebih dahulu');
      setIsSubmitting(false);
      return;
    }

    if (!pricePerM2) {
      setError('Harga per meter persegi harus diisi');
      setIsSubmitting(false);
      return;
    }

    const dataToSend = {
      name: form.name || '',
      internal_id: form.internalId || form.internal_id || '',
      electronic_id: form.electronicId || form.electronic_id || '',
      location_type: form.location_type || '',
      planting_format: plantingFormat || '',
      number_of_beds: parseNum(form.numberOfBeds || ''),
      bed_length: parseNum(form.bedLength || ''),
      bed_width: parseNum(form.bedWidth || ''),
      area: parseNum(form.areaSize || ''),
      estimated_land_value: parseNum(form.estimatedLandValue || ''),
      price_per_m2: parseNum(pricePerM2 || ''),
      status: form.status || '',
      light_profile: form.lightProfile || '',
      grazing_rest_days: parseNum(form.grazingRestDays || ''),
      description: form.description || '',
    };

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
        // Try to parse JSON first, but fallback to text if it fails (HTML response)
        let errorDetail = 'Failed to save media location';
        try {
          const errorData = await res.json();
          errorDetail = errorData.message || JSON.stringify(errorData);
        } catch (jsonError) {
          // If JSON parsing fails, read as text (likely HTML error page)
          try {
            const errorText = await res.text();
            errorDetail = `Server Error (Status: ${res.status}): ${errorText.substring(0, 200)}...`; // Limit text
          } catch (textError) {
            // Fallback
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Area Peta</h2>
            <p className="text-sm text-muted-foreground">Pilih tipe area lalu gambar polanya dengan klik tiap sudut pada peta.</p>

            {/* Kontrol Area - Reorganized and styled */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="grid gap-2 flex-grow">
                   <label htmlFor="areaType">Tipe Area</label>
                   <select
                       id="areaType"
                       value={selectedAreaType}
                       onChange={e => handleAreaTypeChange(e.target.value)}
                       className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   >
                       {AREA_TYPE_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                       ))}
                   </select>
                </div>

                {/* Group drawing buttons */}          
                <div className="flex gap-2">
                   <Button 
                      variant={selectedDrawingMode === 'polygon' ? 'default' : 'outline'} // Default color when active
                      onClick={() => handleDrawingModeChange('polygon')}
                      className={`w-full sm:w-auto ${selectedDrawingMode === 'polygon' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                      disabled={!!areaGeometry} // Disable if area is already drawn
                   >
                     Gambar Polygon
                   </Button>
                    <Button 
                      variant={selectedDrawingMode === 'rectangle' ? 'default' : 'outline'}
                      onClick={() => handleDrawingModeChange('rectangle')}
                       className={`w-full sm:w-auto ${selectedDrawingMode === 'rectangle' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                      disabled={!!areaGeometry} // Disable if area is already drawn
                   >
                     Gambar Kotak
                   </Button>
                    <Button 
                      variant={selectedDrawingMode === 'circle' ? 'default' : 'outline'}
                      onClick={() => handleDrawingModeChange('circle')}
                       className={`w-full sm:w-auto ${selectedDrawingMode === 'circle' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                      disabled={!!areaGeometry} // Disable if area is already drawn
                   >
                     Gambar Lingkaran
                   </Button>
                </div>

                 <Button 
                   variant="outline"
                   onClick={handleResetArea}
                   className="w-full sm:w-auto text-red-600 border-red-300 hover:bg-red-50"
                   disabled={!areaGeometry} // Disable if no area is drawn
                 >
                   Reset Area
                 </Button>
            </div>

            <div className="rounded-lg overflow-hidden border h-[400px] sm:h-[500px] relative">
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
                  mapContainerStyle={{
                    width: '100%',
                    height: '100%',
                  }}
                  center={{ lat: -7.4355904, lng: 112.7164527 }}
                  zoom={17}
                  onLoad={map => {
                    const drawingManager = new window.google.maps.drawing.DrawingManager({
                       drawingMode: null, // Start with no drawing mode
                       drawingControl: false, // We will use our own buttons
                       polygonOptions: { fillColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981', strokeColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981', fillOpacity: 0.5, strokeWeight: 2, clickable: true, editable: true, zIndex: 1 },
                       rectangleOptions: { fillColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981', strokeColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981', fillOpacity: 0.5, strokeWeight: 2, clickable: true, editable: true, zIndex: 1 },
                       circleOptions: { fillColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981', strokeColor: AREA_TYPE_OPTIONS.find(opt => opt.value === selectedAreaType)?.color || '#10b981', fillOpacity: 0.5, strokeWeight: 2, clickable: true, editable: true, zIndex: 1 },
                    });
                     drawingManager.setMap(map);
                    setDrawingManager(drawingManager);

                    window.google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                       handleAreaComplete(event);
                    });
                  }}
                  onUnmount={() => {
                     if (drawingManager) {
                        drawingManager.setMap(null);
                     }
                  }}
                   options={{
                     mapTypeId: 'satellite', // Set to satellite view to show land
                     streetViewControl: false,
                     fullscreenControl: false,
                     mapTypeControl: true,
                     zoomControl: true,
                   }}
                >
                   {/* Render the drawn geometry if exists, for editing */}
                   {/* We will now render the drawnOverlay object directly if it exists */}
                   {/* Bentuk akan otomatis tetap di peta karena tidak dihapus di handleAreaComplete */}
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
                 {/* TODO: Add Tipe Lokasi selection */}
                <Input
                  type="text"
                  value={form.location_type || form.area?.type || ''}
                   onChange={(e) => setForm({ ...form, location_type: e.target.value })}
                   placeholder="Contoh: Lahan, Irigasi, Gudang"
                />
              </div>
            </div>

            {!hidePlantingFormat && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Format Penanaman</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {plantingFormat === 'bedengan' && (
                 <>
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Jumlah Bedengan</label>
                      <Input
                         type="number"
                         value={form.numberOfBeds || form.number_of_beds || ''}
                         onChange={(e) => setForm({ ...form, numberOfBeds: e.target.value })}
                      />
                   </div>
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
                 </>
               )}
                <div className="sm:col-span-1">
                   <label className="block text-sm font-medium text-gray-700">Luas Area (m²)</label>
                   <Input
                      type="number"
                      value={form.areaSize || form.area || ''}
                      onChange={(e) => setForm({ ...form, areaSize: e.target.value })}
                       disabled // Area size is calculated from map
                   />
                </div>
                <div className="sm:col-span-1">
                   <label className="block text-sm font-medium text-gray-700">Harga per meter persegi</label>
                   <Input
                      type="number"
                      value={pricePerM2 || ''}
                      onChange={(e) => setPricePerM2(e.target.valueAsNumber || '')}
                      placeholder="Contoh: 100000"
                   />
                </div>
                <div className="sm:col-span-2">
                   <label className="block text-sm font-medium text-gray-700">Estimasi Nilai Lahan</label>
                   <Input
                      type="text"
                      value={form.estimatedLandValue ? `Rp. ${form.estimatedLandValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}` : ''}
                      disabled
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
                  value={form.status || ''}
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
                  value={form.lightProfile || form.light_profile || ''}
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
                    value={form.grazingRestDays || form.grazing_rest_days || ''}
                    onChange={(e) => setForm({ ...form, grazingRestDays: e.target.value })}
                 />
              </div>
               <div className="sm:col-span-2">
                 <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                 {/* TODO: Change to textarea */}
                 <Input
                    type="text"
                    value={form.description || ''}
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
                  variant="default" 
                  onClick={handleNext} 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Berikutnya
                </Button>
              )}
              {step === 3 && (
                <Button 
                  type="submit" 
                  variant="default" 
                  className="w-full sm:w-auto"
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
  const router = useRouter();

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
      console.log("Received data:", data);
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error(data.error || 'Gagal menghapus media');
      }
      
      await fetchMedia();
      alert('Media berhasil dihapus');
    } catch (err) {
      console.error('Error deleting media:', err);
      setError(err.message);
      alert(err.message);
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
        />
      </div>
    </div>
  );
} 