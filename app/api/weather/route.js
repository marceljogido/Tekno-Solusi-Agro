import { NextResponse } from "next/server";

export async function GET() {
  const city = "Subang";
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 },
    );
  }

  const data = await res.json();

  const translateWeather = (description) => {
    const translations = {
      Clear: "Cerah",
      Clouds: "Berawan",
      Rain: "Hujan",
      Thunderstorm: "Badai Petir",
      Drizzle: "Gerimis",
      Snow: "Salju",
      Mist: "Kabut",
      Fog: "Kabut Tebal",
      Smoke: "Asap",
      Haze: "Udara Kabur",
      Dust: "Debu",
      Sand: "Pasir",
      Ash: "Abu Vulkanik",
      Squall: "Angin Kencang",
      Tornado: "Tornado",
    };

    return translations[description] || description; 
  };

  const weather = {
    city: data.name,
    date: new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    temperature: Math.round(data.main.temp),
    description: translateWeather(data.weather[0].main),
    icon: data.weather[0].icon,
  };

  return NextResponse.json(weather);
}
