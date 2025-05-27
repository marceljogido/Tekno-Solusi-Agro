"use client";

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polygon, Rectangle, Circle } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: -6.6459349365974125,
  lng: 107.68577750858339,
};

const libraries = ["drawing", "geometry"];

export default function MediaMap({ mediaData, onMediaClick }) {
  const [map, setMap] = useState(null);

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const renderShape = (media) => {
    const { geometry, id } = media;
    const commonProps = {
      key: id,
      onClick: () => onMediaClick?.(media),
      options: {
        fillColor: "#10b981",
        fillOpacity: 0.35,
        strokeColor: "#10b981",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: true,
        draggable: false,
        editable: false,
        visible: true,
        zIndex: 1,
      },
    };

    switch (geometry.type) {
      case "polygon":
        return (
          <Polygon
            {...commonProps}
            paths={geometry.coordinates[0].map((coord) => ({
              lat: coord[1],
              lng: coord[0],
            }))}
          />
        );
      case "rectangle":
        const bounds = new window.google.maps.LatLngBounds(
          { lat: geometry.coordinates[0][1], lng: geometry.coordinates[0][0] },
          { lat: geometry.coordinates[1][1], lng: geometry.coordinates[1][0] }
        );
        return <Rectangle {...commonProps} bounds={bounds} />;
      case "circle":
        return (
          <Circle
            {...commonProps}
            center={{
              lat: geometry.coordinates[0][1],
              lng: geometry.coordinates[0][0],
            }}
            radius={geometry.radius}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={handleMapLoad}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }}
      >
        {mediaData?.map((media) => renderShape(media))}
      </GoogleMap>
    </LoadScript>
  );
} 