import type { Weather } from "../domain/Weather";
import type { WeatherRepository } from "../domain/WeatherRepository";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const getWeatherByLonLat = async (lon: number, lat: number): Promise<Weather | null> => {

    try {

        const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
                lat,
                lon,
                appid: apiKey,
                units: "metric",
                lang: "es"
            }
        });

        const data = response.data;

        const weather: Weather = {
            city: data.name,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temperature: data.main.temp,
            tempMin: data.main.temp_min,
            tempMax: data.main.temp_max,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            visibility: data.visibility,
            windSpeed: data.wind.speed,
            windDeg: data.wind.deg
        };

        return weather;

    } catch (error) {
        return null
    }

};


export const axiosWeatherRepository: WeatherRepository = {
    getWeatherByLonLat
}