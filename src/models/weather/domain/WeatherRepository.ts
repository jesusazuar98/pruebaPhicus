import type { Weather } from "./Weather";

export interface WeatherRepository {
    getWeatherByLonLat(lon: number, lat: number): Promise<Weather | null>;
}