"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Polygon, Rectangle, Circle, InfoWindow } from "@react-google-maps/api";
import { MapPin, Ruler, Layers } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const centerConst = {
  lat: -6.6459349365974125,
  lng: 107.68577750858339,
};

const libraries = ["drawing", "geometry"];

const AREA_TYPE_OPTIONS = [
  { value: 'Lahan', label: 'Lahan', color: '#10b981' },      // hijau
  { value: 'Irigasi', label: 'Irigasi', color: '#3b82f6' },  // biru
  { value: 'Gudang', label: 'Gudang', color: '#f59e42' }     // oranye
];

export default function MediaMap({ mediaData, onMediaClick, mapCenter, zoom = 17 }) {
  const [map, setMap] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [center, setCenter] = useState(mapCenter || centerConst);
  const [bounds, setBounds] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && mediaData && mediaData.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      
      mediaData.forEach(media => {
        if (media.geometry) {
          if (media.geometry.type === 'Polygon' && media.geometry.coordinates) {
            media.geometry.coordinates[0].forEach(coord => {
              bounds.extend({ lat: coord[1], lng: coord[0] });
            });
          } else if (media.geometry.type === 'Rectangle' && media.geometry.coordinates) {
            const [sw, ne] = media.geometry.coordinates;
            bounds.extend({ lat: sw[1], lng: sw[0] });
            bounds.extend({ lat: ne[1], lng: ne[0] });
          } else if (media.geometry.type === 'Circle' && media.geometry.coordinates) {
            const center = { lat: media.geometry.coordinates[1], lng: media.geometry.coordinates[0] };
            bounds.extend(center);
          }
        }
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { top: 100, bottom: 100, left: 100, right: 100 });
        setBounds(bounds);
        // Fallback: jika zoom terlalu dekat, paksa zoom out
        window.setTimeout(() => {
          if (map.getZoom() > 18) {
            map.setZoom(18);
          }
          if (map.getZoom() > 16) {
            map.setZoom(map.getZoom() - 1);
          }
        }, 300);
      }
    }
  }, [map, mediaData]);

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const getPolygonCenter = (coordinates) => {
    const coords = coordinates[0];
    const avgLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
    const avgLng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
    return { lat: avgLat, lng: avgLng };
  };

  const getRectangleCenter = (coordinates) => {
    const [sw, ne] = coordinates;
    return {
      lat: (sw[1] + ne[1]) / 2,
      lng: (sw[0] + ne[0]) / 2
    };
  };

  const getCircleCenter = (coordinates) => {
    return { lat: coordinates[0][1], lng: coordinates[0][0] };
  };

  const renderInfo = (media) => (
    <div className="min-w-[180px] p-2 rounded-lg shadow bg-white border border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="text-green-500" size={18} />
        <span className="font-bold text-green-700 text-base">{media.name}</span>
      </div>
      <div className="flex items-center text-xs text-gray-600 mb-1 gap-1">
        <Layers size={14} className="text-green-400" />
        <span className="font-semibold">Tipe:</span> {media.locationType || '-'}
      </div>
      <div className="flex items-center text-xs text-gray-600 mb-1 gap-1">
        <Ruler size={14} className="text-green-400" />
        <span className="font-semibold">Format:</span> {media.plantingFormat || '-'}
      </div>
      <div className="flex items-center text-xs text-gray-600 gap-1">
        <Ruler size={14} className="text-green-400" />
        <span className="font-semibold">Luas:</span> {media.area ? `${media.area} m²` : '-'}
      </div>
    </div>
  );

  const renderShape = (media) => {
    const { geometry, id, locationType } = media;
    if (!geometry || !geometry.type) return null;

    // Get color based on location type
    const color = AREA_TYPE_OPTIONS.find(opt => opt.value === locationType)?.color || '#10b981';

    const commonProps = {
      options: {
        fillColor: color,
        fillOpacity: 0.35,
        strokeColor: color,
        strokeOpacity: 1.2,
        strokeWeight: 4,
        clickable: true,
        draggable: false,
        editable: false,
        visible: true,
        zIndex: 1,
      },
      onClick: () => setSelectedMedia(media),
    };

    switch (geometry.type.toLowerCase()) {
      case "polygon":
        return (
          <React.Fragment key={id}>
            <Polygon
              {...commonProps}
              paths={geometry.coordinates[0].map((coord) => ({
                lat: coord[1],
                lng: coord[0],
              }))}
            />
            {selectedMedia?.id === id && (
              <InfoWindow
                position={getPolygonCenter(geometry.coordinates)}
                onCloseClick={() => setSelectedMedia(null)}
              >
                {renderInfo(media)}
              </InfoWindow>
            )}
          </React.Fragment>
        );
      case "rectangle":
        const bounds = new window.google.maps.LatLngBounds(
          { lat: geometry.coordinates[0][1], lng: geometry.coordinates[0][0] },
          { lat: geometry.coordinates[1][1], lng: geometry.coordinates[1][0] }
        );
        return (
          <React.Fragment key={id}>
            <Rectangle {...commonProps} bounds={bounds} />
            {selectedMedia?.id === id && (
              <InfoWindow
                position={getRectangleCenter(geometry.coordinates)}
                onCloseClick={() => setSelectedMedia(null)}
              >
                {renderInfo(media)}
              </InfoWindow>
            )}
          </React.Fragment>
        );
      case "circle":
        return (
          <React.Fragment key={id}>
            <Circle
              {...commonProps}
              center={{
                lat: geometry.coordinates[0][1],
                lng: geometry.coordinates[0][0],
              }}
              radius={geometry.radius}
            />
            {selectedMedia?.id === id && (
              <InfoWindow
                position={getCircleCenter(geometry.coordinates)}
                onCloseClick={() => setSelectedMedia(null)}
              >
                {renderInfo(media)}
              </InfoWindow>
            )}
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  return (
    <GoogleMap
      key={center.lat + '-' + center.lng + '-' + zoom}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapTypeId: 'satellite',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {mediaData?.map((media) => renderShape(media))}
    </GoogleMap>
  );
} 