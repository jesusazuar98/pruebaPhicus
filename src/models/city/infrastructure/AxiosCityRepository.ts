import type { City } from "../domain/City";
import type { CityRepository } from "../domain/CityRepository";
import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;

const getCityByName = async (name: string): Promise<City[]> => {
  try {
    console.log('apikey', apiKey);
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: name,
        limit: 5,
        appid: apiKey
      }
    })

    const data = response.data

    return data

  } catch (error) {
    console.error('Error al buscar ciudades:', error)
    return []
  }
}



export const axiosCityRepository: CityRepository = {
  getCityByName
}