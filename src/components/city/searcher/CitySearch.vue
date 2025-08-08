<script setup lang="ts">
import { ref, watch } from 'vue';
import { axiosCityRepository } from '@/models/city/infrastructure/AxiosCityRepository';
import type { City } from '@/models/city/domain/City';

const emit = defineEmits<{
    (e: 'seleccionCity', ciudad: City): void
}>()


const nombreCiudad = ref<string>('');
const cities = ref<City[]>([]);
const historialCities = ref<City[]>([]);
const selectedCity = ref<City | null>(null);
const mostrarHistorial = ref<boolean>(false);

const buscarCiudad = async (newCiudad: string) => {
    try {
        cities.value = await axiosCityRepository.getCityByName(newCiudad);
    } catch (error) {
        console.error('Error fetching cities:', error);
        cities.value = [];
    }
};

const guardarEnHistorial = (city: City) => {

    const historial = JSON.parse(localStorage.getItem('historialCiudades') || '[]');
    const exist = historial.some((c: City) => c.name === city.name && c.country === city.country);

    if (!exist) {
        historial.push(city);
        localStorage.setItem('historialCiudades', JSON.stringify(historial));
    }

}

const seleccionarCiudad = (city: City) => {
    selectedCity.value = city;
    guardarEnHistorial(city);
    cities.value = [];
    historialCities.value = [];
    emit('seleccionCity', city);
}

const toggleHistorial = () => {
    mostrarHistorial.value = !mostrarHistorial.value;
    historialCities.value = [];
    cities.value = [];
    nombreCiudad.value = '';

    if(mostrarHistorial.value === true){
        const historial = JSON.parse(localStorage.getItem('historialCiudades') || '[]');
        historialCities.value = historial.slice(0,10);
    }

}


watch(nombreCiudad, async (newValue) => {

    if (mostrarHistorial.value === true && newValue.length > 0) {
        const historial = JSON.parse(localStorage.getItem('historialCiudades') || '[]');
        historialCities.value = historial.filter((c: City) => c.name.toLowerCase().includes(newValue.toLowerCase()));
        return;
    }

    if (newValue.length > 0) {

        await buscarCiudad(newValue);
        historialCities.value = [];
    } else {
        historialCities.value = [];
        cities.value = [];
    }
});

</script>

<template>

    <div class="buscador">

        <div class="inputContainer">
            <input class="inputBuscador" v-model="nombreCiudad" placeholder="Buscar ciudad" />
            <button @click="toggleHistorial" :class="{ 'btn-historial': true, activo: mostrarHistorial }"
                aria-label="Historial">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v3l4-4-4-4v3zM12 8v5l4.3 2.6.7-1.2-3.5-2.1V8z" />
                </svg>
            </button>

        </div>

        <ul v-if="historialCities.length > 0" class="sugerencias">
            <li v-for="(city, index) in historialCities" :key="index" @click="seleccionarCiudad(city)"
                class="sugerencia">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path d="M13 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v3l4-4-4-4v3zM12 8v5l4.3 2.6.7-1.2-3.5-2.1V8z" />
                </svg>  {{ city.name }}, {{ city.country }}
            </li>
        </ul>

        <ul v-if="cities.length > 0" class="sugerencias">
            <li v-for="(city, index) in cities" :key="index" @click="seleccionarCiudad(city)" class="sugerencia">
                {{ city.name }}, {{ city.country }}
            </li>
        </ul>
    </div>
</template>



<style scoped>
.buscador {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    font-family: 'Segoe UI', sans-serif;
}

.inputContainer {
    display: flex;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid;
}

.btn-historial {
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.btn-historial svg {
    fill: #888;
    transition: fill 0.3s ease;
}

.btn-historial:hover svg {
    fill: #555;
    transform: scale(1.1);
}

.btn-historial.activo svg {
    fill: #007BFF;
    /* color azul cuando está activo */
}


.inputBuscador {
    flex: 1;
    box-sizing: border-box;
    padding: 10px 14px;
    font-size: 16px;
    border: 0px solid #ccc;
    transition: border-color 0.2s;
}

.inputBuscador:focus {
    outline: none;
    border-color: #0077ff;
}

.sugerencias {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 8px 8px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    margin: 0;
    padding: 0;
    list-style: none;
}

.sugerencia {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    cursor: pointer;
    transition: background-color 0.2s ea;
    border-bottom: 1px solid #eee;
}

.sugerencia:hover {
    background-color: #f5f5f5;
}
</style>
