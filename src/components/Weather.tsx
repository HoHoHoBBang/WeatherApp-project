import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface weatherDataType {
  icon: string;
  name: string;
  temp: number;
  sunrise: number;
  sunset: number;
  wind: number;
  humidity: number;
}

interface iconType {
  [key: string]: string;
}

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<weatherDataType | null>(null);
  const [empty, setEmpty] = useState(false);

  const icons: iconType = {
    "01d": assets.clear_sky,
    "01n": assets.clear_night,
    "02d": assets.few_cloud,
    "02n": assets.few_cloud_night,
    "03d": assets.scattered_clouds,
    "03n": assets.scattered_clouds,
    "04d": assets.broken_clouds,
    "04n": assets.broken_clouds,
    "09d": assets.shower_rain,
    "09n": assets.shower_rain,
    "10d": assets.rain,
    "10n": assets.rain,
    "11d": assets.thunderstorm,
    "11n": assets.thunderstorm,
    "13d": assets.snow,
    "13n": assets.snow,
    "50d": assets.mist,
    "50n": assets.mist,
  };

  const search = async () => {
    if (empty) {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();
        const icon = icons[data.weather[0].icon] || assets.clear_sky;

        setWeatherData({
          icon: icon,
          name: data.name,
          temp: Math.floor(data.main.temp),
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          wind: data.wind.speed,
          humidity: data.main.humidity,
        });
      } catch (error) {
        console.log(error);
      }
      setCity("");
    }
  };

  const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      search();
    }
  };

  useEffect(() => {
    if (city.trim() !== "") {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [city]);

  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 rounded-xl bg-gradient-to-br from-blue-500 via-blue-700 to-blue-900 p-5 sm:h-3/4 sm:w-[400px]">
        <p className="text-2xl text-white">WEATHER</p>

        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1">
          <input
            type="text"
            className="bg-transparent px-2 outline-none"
            onChange={(e) => setCity(e.target.value)}
            value={city}
            placeholder="Enter the city"
            onKeyDown={keyHandler}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="cursor-pointer text-xl text-gray-400"
            onClick={() => search()}
          />
        </div>

        {weatherData ? (
          <>
            <div className="flex flex-col items-center justify-center">
              <img src={weatherData.icon} alt="" className="w-40" />
              <p className="text-3xl text-white">{weatherData.name}</p>

              <div className="flex items-center">
                <p className="text-7xl text-white">{weatherData.temp}℃</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5">
              <div className="flex items-center gap-2">
                <img src={assets.humidity} alt="" className="w-10" />
                <div>
                  <p className="text-sm text-white">{weatherData.humidity}%</p>
                  <p className="text-xs text-white">Humidity</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <img src={assets.wind} alt="" className="w-10" />
                <div>
                  <p className="text-sm text-white">{weatherData.wind} km/h</p>
                  <p className="text-xs text-white">Wind speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Weather;
