"use client";

import WeatherCard from "@/components/dashboard/WeatherCard";
import { AppAreaChart } from "@/components/dashboard/AppAreaChart";
import PageHeader from "@/components/layout/PageHeader";
import { useEffect, useState } from "react";
import { AppPieChart } from "@/components/dashboard/AppPieChart";
import { AppBarChart } from "@/components/dashboard/AppBarChart";
import { IconCoin, IconMap } from "@tabler/icons-react";
import { GoogleMap, Polygon, Rectangle, Circle, useLoadScript } from '@react-google-maps/api';

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

export default function DashboardPage() {
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const [greeting, setGreeting] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalLand: { area: 0, locations: 0 },
    crops: [],
    landUsage: { cultivated: 0, uncultivated: 0 },
    revenue: 0
  });

  const { isLoaded: isMapLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"],
  });

  useEffect(() => {
    const updateGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting("Selamat Pagi");
      } else if (hours < 18) {
        setGreeting("Selamat Siang");
      } else {
        setGreeting("Selamat Malam");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 3600000); 

    return () => clearInterval(interval); 
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    fetch('/api/media_locations')
      .then(res => res.json())
      .then(data => {
        // Parse geometry jika masih string
        data.forEach(media => {
          if (typeof media.geometry === 'string') {
            try {
              media.geometry = JSON.parse(media.geometry);
            } catch (e) {
              media.geometry = null;
            }
          }
        });
        setMediaList(Array.isArray(data) ? data : []);
      });
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setDashboardStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto">
      <PageHeader title="Dashboard" />

      {/* greeting */}
      <div className="flex-col gap-1 px-4 pt-24 md:pt-20">
        <h2 className="text-base font-bold text-slate-700 sm:text-xl">
          Hello, {greeting} {user?.firstName}👋
        </h2>
        <p className="text-xs text-slate-500 sm:text-sm">
          Inilah perkembangan terkini di kebunmu hari ini!
        </p>
      </div>

      {/* grid layout container*/}
      <div className="md:aspect-2 grid grid-cols-1 gap-2 px-4 pb-4">
        {/* grid layout 1*/}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
          {/* map container */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2" style={{ minHeight: 300 }}>
            {isMapLoaded && (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: 300 }}
                center={getGeometryCenter()}
                zoom={17}
                options={{
                  mapTypeId: 'satellite',
                  streetViewControl: false,
                  fullscreenControl: false,
                  mapTypeControl: true,
                  zoomControl: true,
                }}
              >
                {mediaList.map(media => {
                  if (!media.geometry) return null;
                  const areaTypeOption = AREA_TYPE_OPTIONS.find(opt => (opt.value.toLowerCase() === (media.locationType || '').toLowerCase()));
                  const displayColor = areaTypeOption ? areaTypeOption.color : '#10b981';
                  switch(media.geometry.type) {
                    case 'Polygon':
                      const polygonPath = media.geometry.coordinates[0].map(coord => ({ lat: coord[1], lng: coord[0] }));
                      return <Polygon key={media.id} paths={[polygonPath]} options={{ fillColor: displayColor, strokeColor: displayColor, fillOpacity: 0.5, strokeWeight: 2, editable: false, draggable: false }} />;
                    case 'Rectangle':
                      if (media.geometry.coordinates && media.geometry.coordinates.length === 2) {
                        const bounds = new window.google.maps.LatLngBounds(
                          { lat: media.geometry.coordinates[0][1], lng: media.geometry.coordinates[0][0] },
                          { lat: media.geometry.coordinates[1][1], lng: media.geometry.coordinates[1][0] }
                        );
                        return <Rectangle key={media.id} bounds={bounds} options={{ fillColor: displayColor, strokeColor: displayColor, fillOpacity: 0.5, strokeWeight: 2, editable: false, draggable: false }} />;
                      } else {
                        return null;
                      }
                    case 'Circle':
                      if (media.geometry.coordinates && media.geometry.coordinates.length === 2 && media.geometry.radius !== undefined) {
                        const center = { lat: media.geometry.coordinates[1], lng: media.geometry.coordinates[0] };
                        return <Circle key={media.id} center={center} radius={media.geometry.radius} options={{ fillColor: displayColor, strokeColor: displayColor, fillOpacity: 0.5, strokeWeight: 2, editable: false, draggable: false }} />;
                      } else {
                        return null;
                      }
                    default:
                      return null;
                  }
                })}
              </GoogleMap>
            )}
          </div>
          {/* data wrapper */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              {/* Card design */}
              <div className="flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-slate-500 uppercase">
                    Total luas lahan
                  </p>
                  <div className="h-fit w-fit rounded-full bg-green-600 p-1">
                    <IconMap className="text-white" size={20} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-slate-700 md:text-lg">
                    {Number(dashboardStats.totalLand.area || 0).toFixed(1)} Hektar
                  </p>
                  <p className="text-xs text-slate-500 md:text-sm">
                    <span className="text-green-600">
                      {Number.isFinite(dashboardStats.landUsage?.percentage) ? dashboardStats.landUsage.percentage : 0}%
                    </span> dialokasikan
                    untuk infrastruktur
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              {/* Card design */}
              <div className="flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm text-slate-500 uppercase">
                    pendapatan <span>- APRIL</span>
                  </p>
                  <div className="h-fit w-fit rounded-full bg-yellow-500 p-1">
                    <IconCoin className="text-white" size={20} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-slate-700 md:text-lg">
                    Rp. {dashboardStats.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 md:text-sm">
                    <span className="text-green-600">+15%</span> dibanding bulan
                    lalu
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* weather container */}
          <div className="rounded-lg bg-white">
            <WeatherCard />
          </div>
        </div>

        {/* grid layout 1*/}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* container */}
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {/* Pie chart */}
            <div className="flex h-full flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-2 pb-2">
                <h4 className="text-base font-bold text-slate-700 md:text-lg">
                  🌽Jenis Tanaman
                </h4>
                <hr className="my-2 bg-slate-200"></hr>
                <p className="text-xs text-slate-500 md:text-sm">
                  Representasi stok tanaman berdasarkan jenisnya
                </p>
              </div>
              <AppBarChart data={dashboardStats.crops} />
              {/* Card footer */}
              <div className="flex flex-col items-center gap-1 py-2">
                <h4 className="text-xs font-bold text-slate-700 md:text-sm">
                  Lacak Panen Anda, Maksimalkan Pertumbuhan
                </h4>
                <p className="text-xs text-slate-500">
                  Membuat keputusan berdasarkan data untuk hasil panen yang
                  lebih baik dan keberlanjutan.
                </p>
              </div>
            </div>

            {/* Pie chart */}
            <div className="flex h-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-2 pb-2">
                <h4 className="text-base font-bold text-slate-700 md:text-lg">
                  🌱 Lahan yang ditanam
                </h4>
                <hr className="my-2 bg-slate-200"></hr>
                <p className="text-xs text-slate-500 md:text-sm">
                  Representasi lahan yang sudah ditanam
                </p>
              </div>
              <AppPieChart data={dashboardStats.landUsage} />
            </div>
          </div>

          {/* Area chart */}
          <div className="flex h-full flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
            {/* Card header */}
            <div className="flex flex-col gap-2 pb-2">
              <h4 className="text-base font-bold text-slate-700 md:text-lg">
                📈 Hasil Panen
              </h4>
              <hr className="my-2 bg-slate-200"></hr>
              <p className="text-xs text-slate-500 md:text-sm">
                Lacak pola pertumbuhan waktu nyata dan optimalkan siklus panen
                Anda dengan analisis presisi.
              </p>
            </div>
            <AppAreaChart />
            {/* Card footer */}
            <div className="flex flex-col items-center gap-1 py-2">
              <h4 className="text-xs font-bold text-slate-700 md:text-sm">
                Bulan ini naik 10%
              </h4>
              <p className="text-xs text-slate-500">Januari - April 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
