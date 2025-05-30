import { NextResponse } from "next/server";

export async function GET() {
  try {
    const city = "Subang";
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    console.log("Fetching weather for:", city);
    console.log("Using API key:", apiKey ? "API key exists" : "API key missing");

    if (!apiKey) {
      console.error("OpenWeather API key is missing");
      return NextResponse.json(
        { error: "OpenWeather API key is not configured" },
        { status: 500 }
      );
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log("Request URL:", url);

    const res = await fetch(url);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Weather API error:", errorData);
      return NextResponse.json(
        { error: `Failed to fetch weather: ${errorData.message || res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Weather data received:", data);

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
  } catch (error) {
    console.error("Unexpected error in weather API:", error);
    return NextResponse.json(
      { error: `Unexpected error: ${error.message}` },
      { status: 500 }
    );
  }
}
