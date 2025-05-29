"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  DrawingManager,
  InfoWindow,
} from "@react-google-maps/api";
import { IconTrash } from "@tabler/icons-react";

const containerStyle = {
  width: "100%",
  height: "500px",
  position: "relative",
};

const center = {
  lat: -6.6459349365974125,
  lng: 107.68577750858339,
};

const libraries = ["drawing", "geometry"];

export default function MapDraw({ onPolygonComplete }) {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygon, setPolygon] = useState(null);
  const [mode, setMode] = useState("move");
  const labelMarkerRef = useRef(null);
  const [popupState, setPopupState] = useState({
    visible: false,
    position: null,
    area: 0,
  });
  const [name, setName] = useState("");

  // Ambil nama dari localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("media-step1"));
    if (savedData?.name) {
      setName(savedData.name);
    }
  }, []);

  const updatePolygonData = (poly) => {
    const google = window.google;
    const path = poly.getPath();
    const areaInMeters = google.maps.geometry.spherical.computeArea(path);
    const bounds = new google.maps.LatLngBounds();
    path.forEach((latLng) => bounds.extend(latLng));
    const center = bounds.getCenter();

    const updatedPolygon = {
      instance: poly,
      area: Math.round(areaInMeters),
      center: center.toJSON(),
      path: path.getArray().map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      })),
    };

    setPolygon(updatedPolygon);
    setPopupState((prev) => ({
      ...prev,
      position: center.toJSON(),
      area: Math.round(areaInMeters),
    }));

    if (labelMarkerRef.current) {
      labelMarkerRef.current.setPosition(center);
    }

    // ✅ Langsung simpan ke localStorage (tanpa instance)
    const { instance, ...safeData } = updatedPolygon;
    localStorage.setItem("media-polygon", JSON.stringify(safeData));
  };

  const handlePolygonComplete = useCallback(
    (polygon) => {
      const google = window.google;
      const path = polygon.getPath();
      const areaInMeters = google.maps.geometry.spherical.computeArea(path);
      const bounds = new google.maps.LatLngBounds();
      path.forEach((latLng) => bounds.extend(latLng));
      const center = bounds.getCenter();

      polygon.setOptions({
        clickable: true,
        fillColor: "#10b981",
        strokeColor: "#10b981",
        fillOpacity: 0.5,
        strokeWeight: 4,
        zIndex: 1,
      });

      // Update saat polygon diedit (geser titik, tambah, hapus)
      path.addListener("set_at", () => updatePolygonData(polygon));
      path.addListener("insert_at", () => updatePolygonData(polygon));
      path.addListener("remove_at", () => updatePolygonData(polygon));

      // Update saat polygon digeser
      google.maps.event.addListener(polygon, "dragend", () => {
        updatePolygonData(polygon);
      });

      // === Tambahkan marker label ===
      const marker = new google.maps.Marker({
        position: center,
        map: map,
        label: {
          text: name,
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,
        },
      });
      labelMarkerRef.current = marker;

      const polygonData = {
        instance: polygon,
        area: Math.round(areaInMeters),
        center: center.toJSON(),
        path: path.getArray().map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        })),
      };

      setPolygon(polygonData);
      setPopupState({
        visible: true,
        position: center.toJSON(),
        area: Math.round(areaInMeters),
      });
      setMode("move");

      if (onPolygonComplete) {
        onPolygonComplete(polygonData);
      }

      // Event saat klik polygon
      google.maps.event.addListener(polygon, "click", (e) => {
        setPopupState({
          visible: true,
          position: e.latLng.toJSON(),
          area: Math.round(areaInMeters),
        });
      });
    },
    [map, name, onPolygonComplete],
  );

  // Update drawing mode when mode changes
  useEffect(() => {
    if (!drawingManager || !map) return;

    if (mode === "draw") {
      drawingManager.setOptions({
        drawingMode: "polygon",
        drawingControl: false,
      });
      map.setOptions({ draggableCursor: "crosshair" });
    } else {
      drawingManager.setOptions({
        drawingMode: null,
        drawingControl: false,
      });
      map.setOptions({ draggableCursor: "grab" });
    }
  }, [mode, drawingManager, map]);

  const handleDelete = () => {
    if (polygon) {
      polygon.instance.setMap(null);
      setPolygon(null);
      setPopupState({ visible: false });
      setMode("draw"); // Kembali ke mode gambar setelah hapus
    }
    if (labelMarkerRef.current) {
      labelMarkerRef.current.setMap(null);
      labelMarkerRef.current = null;
    }
  };

  return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            onClick={() => setMode("move")}
            style={{
              padding: "8px 12px",
              background: mode === "move" ? "#3b82f6" : "white",
              color: mode === "move" ? "white" : "#314158",
              border: "1px solid #fff",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Geser Map
          </button>
          <button
            onClick={() => setMode("draw")}
            disabled={!!polygon}
            style={{
              padding: "8px 12px",
              background: polygon
                ? "#eaeaea"
                : mode === "draw"
                  ? "#3b82f6"
                  : "white",
              color: mode === "draw" ? "white" : "#314158",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: polygon ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Gambar Lahan
          </button>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={20}
          mapTypeId="satellite"
          onLoad={(map) => setMap(map)}
          onClick={() => setPopupState((prev) => ({ ...prev, visible: false }))}
        >
          <DrawingManager
            onLoad={(dm) => setDrawingManager(dm)}
            options={{
              drawingControl: false,
              drawingMode: mode === "draw" ? "polygon" : null,
              polygonOptions: {
                fillColor: "#10b981",
                fillOpacity: 0.5,
                strokeWeight: 4,
                strokeColor: "#10b981",
                clickable: true,
                editable: true,
              },
            }}
            onPolygonComplete={handlePolygonComplete}
          />

          {popupState.visible && (
            <InfoWindow
              position={popupState.position}
              onCloseClick={() =>
                setPopupState({ ...popupState, visible: false })
              }
            >
              <div className="w-60 space-y-3 text-sm">
                <div className="space-y-1 rounded-sm border bg-slate-100 p-2">
                  <p className="font-bold text-slate-700">{name}</p>
                  <p className="font-mono text-xs text-slate-600">
                    Luas: {popupState.area} m²
                  </p>
                </div>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center justify-center gap-1 rounded-sm border border-red-200 bg-red-100 py-1.5 font-sans text-xs font-semibold text-red-600"
                >
                  <IconTrash size={14} /> Hapus Area
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
  );
}
