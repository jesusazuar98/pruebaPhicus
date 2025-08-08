import type { City } from "./City";

export interface CityRepository {
    getCityByName(name: string): Promise<City[]>;  
}