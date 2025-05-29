"use client";

import { useLoadScript } from "@react-google-maps/api";
import FlowerLoadingSpinner from "../ui/FlowerLoadingSpinner";
 // Ganti dengan komponen loading Anda

const libraries = ["drawing", "geometry"]; // Library yang diperlukan

export default function MapWrapper({
  children,
  loadingComponent = <FlowerLoadingSpinner />,
  errorComponent = <div>Gagal memuat peta</div>,
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    language: "id", // Opsional: set bahasa
    region: "ID", // Opsional: set region
  });

  if (loadError) return errorComponent;
  if (!isLoaded) return loadingComponent;

  return <>{children}</>;
}
