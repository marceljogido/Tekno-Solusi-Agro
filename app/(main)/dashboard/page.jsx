"use client";

import WeatherCard from "@/components/dashboard/WeatherCard";
import { AppAreaChart } from "@/components/dashboard/AppAreaChart";
import PageHeader from "@/components/layout/PageHeader";
import { useEffect, useState } from "react";
import { AppPieChart } from "@/components/dashboard/AppPieChart";
import { AppBarChart } from "@/components/dashboard/AppBarChart";
import { IconCoin, IconMap } from "@tabler/icons-react";


export default function DashboardPage() {
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const [greeting, setGreeting] = useState("");

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
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
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
          <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2">
            Maps
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
                    10.4 Hektar
                  </p>
                  <p className="text-xs text-slate-500 md:text-sm">
                    <span className="text-green-600">78% </span>dialokasikan
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
                    Rp. 30.000.000
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
              <AppBarChart />
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
                  Memvisualisasikan lahan pertanian yang dibudidayakan dan tidak
                  dibudidayakan.
                </p>
              </div>
              <AppPieChart />
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
