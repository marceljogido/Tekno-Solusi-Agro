"use client";

import { useEffect, useState } from "react";
import { IconMapPinFilled } from "@tabler/icons-react";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="h-full animate-pulse rounded-lg bg-blue-100 p-4 font-mono">
        Loading weather...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full rounded-lg bg-red-100 p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="grid h-full grid-cols-2 justify-between gap-4 rounded-lg bg-gradient-to-tl from-blue-700 via-sky-500 to-green-300 p-4 text-white shadow-md">
      {/* column 1 */}
      <div className="flex flex-col justify-between gap-2.5">
        {/* location and date */}
        <div className="flex h-full flex-col gap-2">
          <div className="flex w-fit items-center gap-1 rounded-full bg-white px-3 py-2">
            <IconMapPinFilled className="text-green-500" size={16} />
            <h4 className="text-sm font-bold text-green-500">{weather.city}</h4>
          </div>
          <div className="w-fit font-mono text-xs uppercase">
            {weather.date}
          </div>
        </div>
        {/* temperature */}
        <div className="text-2xl font-extrabold md:text-3xl">
          {weather.temperature}°C
        </div>
      </div>

      {/* column 2 */}
      <div className="w-fill flex flex-col items-end justify-center gap-2 md:items-center md:justify-center">
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="ax-h-16 w-auto object-contain sm:max-h-20 md:max-h-24 lg:max-h-28"
        />
        <div className="w-fill text-center text-sm">
          Sepertinya {weather.description}
        </div>
      </div>
    </div>
  );
}
