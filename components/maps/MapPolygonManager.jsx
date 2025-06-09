"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  InfoWindow,
} from "@react-google-maps/api";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconArrowUp,
  IconTrash,
} from "@tabler/icons-react";

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

const colorOptions = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function MapPolygonManager() {
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [activePolygonId, setActivePolygonId] = useState(null);
  const [mode, setMode] = useState("move");
  const [popupState, setPopupState] = useState({
    name: "Area 1",
    color: "#10b981",
    area: 0,
    visible: false,
    position: null,
    zIndex: 0,
  });

  const nameInputRef = useRef(null);

  // Get active polygon from polygons array
  const activePolygon = polygons.find((p) => p.id === activePolygonId);

  useEffect(() => {
    if (popupState.visible && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [popupState.visible]);

  useEffect(() => {
    if (!drawingManager) return;

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

  const handlePolygonComplete = useCallback(
    (polygon) => {
      const google = window.google;

      const path = polygon.getPath();
      const areaInMeters = google.maps.geometry.spherical.computeArea(path);
      const bounds = new google.maps.LatLngBounds();
      path.forEach((latLng) => bounds.extend(latLng));
      const center = bounds.getCenter();

      const newId = Date.now().toString();
      const nextZIndex = polygons.length;

      polygon.setOptions({
        clickable: true,
        fillColor: popupState.color,
        strokeColor: popupState.color,
        zIndex: nextZIndex,
      });

      const marker = new google.maps.Marker({
        position: center,
        label: {
          text: popupState.name,
          color: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,
        },
        map: map,
        zIndex: nextZIndex + 1000,
      });

      const newPolygon = {
        id: newId,
        instance: polygon,
        marker,
        zIndex: nextZIndex,
        name: popupState.name,
        color: popupState.color,
        area: Math.round(areaInMeters),
        center: center.toJSON(),
      };

      polygon.addListener("click", () => {
        setActivePolygonId(newId);
        setPopupState({
          name: newPolygon.name,
          color: newPolygon.color,
          area: newPolygon.area,
          visible: true,
          position: newPolygon.center,
          zIndex: newPolygon.zIndex,
        });
      });

      setPolygons((prev) => [...prev, newPolygon]);
      setActivePolygonId(newId);
      setPopupState((prev) => ({
        ...prev,
        area: Math.round(areaInMeters),
        visible: true,
        position: center.toJSON(),
        zIndex: nextZIndex,
      }));

      setMode("move");
    },
    [popupState.color, popupState.name, map, polygons],
  );

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const handleDrawingManagerLoad = (dmInstance) => {
    setDrawingManager(dmInstance);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setPopupState((prev) => ({ ...prev, name: newName }));

    if (activePolygon) {
      setPolygons((prev) =>
        prev.map((p) =>
          p.id === activePolygonId ? { ...p, name: newName } : p,
        ),
      );
      activePolygon.marker.setLabel({
        text: newName,
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "bold",
      });
    }
  };

  const handleColorChange = (color) => {
    setPopupState((prev) => ({ ...prev, color }));

    if (activePolygon) {
      setPolygons((prev) =>
        prev.map((p) => (p.id === activePolygonId ? { ...p, color } : p)),
      );
      activePolygon.instance.setOptions({
        fillColor: color,
        strokeColor: color,
      });
    }
  };

  const handleDelete = () => {
    if (activePolygon) {
      activePolygon.instance.setMap(null);
      activePolygon.marker.setMap(null);
      setPolygons((prev) => prev.filter((p) => p.id !== activePolygonId));
      setActivePolygonId(null);
      setPopupState((prev) => ({ ...prev, visible: false }));
    }
  };

  const updateZIndices = (updatedPolygons) => {
    // Sort by current z-index to maintain relative order
    const sorted = [...updatedPolygons].sort((a, b) => a.zIndex - b.zIndex);

    // Reassign sequential z-indices
    const withNewZIndices = sorted.map((polygon, index) => {
      polygon.zIndex = index;
      polygon.instance.setOptions({ zIndex: index });
      polygon.marker.setOptions({ zIndex: index + 1000 });
      return polygon;
    });

    // Update popup state if active polygon exists
    if (activePolygonId) {
      const active = withNewZIndices.find((p) => p.id === activePolygonId);
      if (active) {
        setPopupState((prev) => ({
          ...prev,
          zIndex: active.zIndex,
        }));
      }
    }

    return withNewZIndices;
  };

  const increaseZIndex = () => {
    if (!activePolygon) return;

    setPolygons((prev) => {
      const currentIndex = activePolygon.zIndex;
      if (currentIndex >= prev.length - 1) return prev;

      const updated = prev.map((p) => {
        if (p.id === activePolygonId) {
          return { ...p, zIndex: currentIndex + 1 };
        } else if (p.zIndex === currentIndex + 1) {
          return { ...p, zIndex: currentIndex };
        }
        return p;
      });

      return updateZIndices(updated);
    });
  };

  const decreaseZIndex = () => {
    if (!activePolygon) return;

    setPolygons((prev) => {
      const currentIndex = activePolygon.zIndex;
      if (currentIndex <= 0) return prev;

      const updated = prev.map((p) => {
        if (p.id === activePolygonId) {
          return { ...p, zIndex: currentIndex - 1 };
        } else if (p.zIndex === currentIndex - 1) {
          return { ...p, zIndex: currentIndex };
        }
        return p;
      });

      return updateZIndices(updated);
    });
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
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
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            geser map
          </button>
          <button
            onClick={() => setMode("draw")}
            style={{
              padding: "8px 12px",
              background: mode === "draw" ? "#3b82f6" : "white",
              color: mode === "draw" ? "white" : "#314158",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            tambahkan area
          </button>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={20}
          mapTypeId="satellite"
          onLoad={handleMapLoad}
        >
          <DrawingManager
            onLoad={handleDrawingManagerLoad}
            options={{
              drawingControl: false,
              polygonOptions: {
                fillColor: popupState.color,
                fillOpacity: 0.5,
                strokeWeight: 4,
                strokeColor: popupState.color,
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
                setPopupState((prev) => ({ ...prev, visible: false }))
              }
            >
              <div className="w-60 space-y-4 text-sm">
                <div className="space-y-2 rounded border bg-slate-100 p-2 overflow-hidden">
                  <p className="font-sans font-bold text-slate-700 truncate">
                    {popupState.name}
                  </p>
                  <p className="font-mono text-xs text-slate-600">
                    Luas: {popupState.area} m²
                  </p>
                </div>

                <div className="space-y-0.5">
                  <label className="block font-sans text-xs font-semibold text-slate-500">
                    Nama Area
                  </label>
                  <input
                    type="text"
                    ref={nameInputRef}
                    value={popupState.name}
                    onChange={handleNameChange}
                    className="w-full rounded border px-2 py-1"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="block font-sans text-xs font-semibold text-slate-500">
                    Warna Area
                  </label>
                  <div className="flex gap-2 mt-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <label className="block font-sans text-xs font-semibold text-slate-500">
                    Atur lapisan
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={decreaseZIndex}
                      disabled={popupState.zIndex === 0}
                      className={`rounded p-2 ${popupState.zIndex === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-200"}`}
                      title="Send backward"
                    >
                      <IconArrowBarDown />
                    </button>
                    <button
                      onClick={increaseZIndex}
                      disabled={popupState.zIndex === polygons.length - 1}
                      className={`rounded p-2 ${popupState.zIndex === polygons.length - 1 ? "bg-gray-100 text-gray-400" : "bg-gray-200"}`}
                      title="Bring forward"
                    >
                      <IconArrowBarUp />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDelete}
                  className="mt-3 flex w-full items-center gap-1 rounded bg-red-100 p-2 font-sans text-xs font-semibold text-red-600 hover:underline"
                >
                  <IconTrash size={14} />
                  Hapus Area
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
