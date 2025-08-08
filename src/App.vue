<script setup lang="ts">
import { ref, watch } from 'vue';
import type { City } from './models/city/domain/City';
import CitySearch from './components/city/searcher/CitySearch.vue';
import type { Weather } from './models/weather/domain/Weather';
import { axiosWeatherRepository } from './models/weather/infrastructure/AxiosWeatherRepository';

const ciudadSelected = ref<City | null>(null)
const weather = ref<Weather | null>(null);

const handleCitySelection = (ciudad: City) => {
  ciudadSelected.value = ciudad;
  getWeather();
};

const getWeather = async () => {
  if (ciudadSelected.value != null) {

    try {

      weather.value = await axiosWeatherRepository.getWeatherByLonLat(ciudadSelected.value.lon, ciudadSelected.value.lat)

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }

  }
}

</script>

<template>
  <div class="containerSearcher">
    <CitySearch @seleccion-city="handleCitySelection" />
  </div>

  <div v-if="weather != null && ciudadSelected != null" class="weather-card">
    <h2 class="city-name">🌍 {{ ciudadSelected.name }} {{ ciudadSelected.country }}</h2>

    <div class="weather-main">
      <img :src="`https://openweathermap.org/img/wn/${weather.icon}@2x.png`" :alt="weather.description"
        class="weather-icon" />
      <p class="description">{{ weather.description }}</p>
      <p class="temperature">🌡️ {{ weather.temperature }}°C</p>

    </div>

    <div class="weather-details">
      <p>🔺 Máxima: {{ weather.tempMax }}°C</p>
      <p>🔻 Mínima: {{ weather.tempMin }}°C</p>
      <p>📈 Presión: {{ weather.pressure }} hPa</p>
      <p>💧 Humedad: {{ weather.humidity }}%</p>
      <p>🌫️ Visibilidad: {{ (weather.visibility / 1000).toFixed(1) }} km</p>
      <p>💨 Viento: {{ weather.windSpeed }} m/s ({{ weather.windDeg }}°)</p>

    </div>
  </div>


</template>
<style scoped>
.containerSearcher {
  margin: 20px;
}

.weather-card {
  background: linear-gradient(to top, #2c3e50, #34495e);
  color: #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  max-width: 350px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
}

.city-name {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.description {
  font-size: 1.2rem;
  text-transform: capitalize;
  margin: 5px 0;
}

.temperature {
  font-size: 2rem;
  font-weight: bold;
  color: #ff5722;
}

.weather-details {
  margin-top: 15px;
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
