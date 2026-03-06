<template>
  <div class="home-view">
    <header class="hero">
      <div class="hero-content">
        <h1>La Gasolinera Más Barata</h1>
        <p>Ahorra cada vez que llenes el tanque. Encuentra las mejores opciones cerca de ti.</p>
        
        <div class="controls">
          <button @click="locateAndFetch" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </span>
            {{ loading ? 'Buscando cerca de ti...' : 'Buscar Gasolineras (20km)' }}
          </button>
          
          <select v-model="fuelType" class="fuel-select" @change="sortStations">
            <option value="price95">Orden: Gasolina 95 más barata</option>
            <option value="priceDiesel">Orden: Diésel más barato</option>
            <option value="distance">Orden: Más cercanas primero</option>
          </select>
        </div>
      </div>
    </header>

    <main class="container">
      <div v-if="error" class="alert-error">
        {{ error }}
      </div>

      <div v-if="!loading && processedStations.length === 0 && !error && hasSearched" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>No se encontraron gasolineras a menos de 20km.</p>
      </div>

      <div class="stations-grid">
        <GasStationCard 
          v-for="station in processedStations" 
          :key="station.id"
          :station="station"
          :distance="station.distance"
        />
      </div>

      <div v-if="loading" class="loading-grid">
        <div v-for="i in 6" :key="i" class="skeleton-card"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GasStationCard from '../components/GasStationCard.vue';
import { fetchGasStations } from '../services/gasAPI';
import { calculateDistance } from '../utils/distance';

const loading = ref(false);
const error = ref(null);
const allStations = ref([]);
const processedStations = ref([]);
const fuelType = ref('price95');
const hasSearched = ref(false);
const userLoc = ref(null);

const MAX_DISTANCE_KM = 20;

onMounted(() => {
  // Try to locate automatically
  locateAndFetch();
});

const locateAndFetch = () => {
  error.value = null;
  loading.value = true;
  hasSearched.value = true;
  processedStations.value = [];

  if (!navigator.geolocation) {
    error.value = "Tu navegador no soporta geolocalización.";
    loading.value = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      userLoc.value = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      await loadGasStations();
    },
    (err) => {
      error.value = "No se pudo obtener tu ubicación. Por favor permite el acceso a la ubicación.";
      loading.value = false;
      console.error(err);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

const loadGasStations = async () => {
  try {
    const data = await fetchGasStations();
    allStations.value = data;
    filterAndSort();
  } catch (err) {
    error.value = "Hubo un error al conectar con los datos del ministerio. Intenta más tarde.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const filterAndSort = () => {
  if (!userLoc.value) return;

  // 1. Calculate distance and filter < 20km
  let filtered = allStations.value.map(station => {
    return {
      ...station,
      distance: calculateDistance(userLoc.value.lat, userLoc.value.lon, station.lat, station.lon)
    };
  }).filter(s => s.distance <= MAX_DISTANCE_KM);

  // 2. Sort depending on user preference
  filtered.sort((a, b) => {
    if (fuelType.value === 'distance') {
      return a.distance - b.distance;
    } else {
      const priceA = a[fuelType.value] || Infinity;
      const priceB = b[fuelType.value] || Infinity;
      return priceA - priceB;
    }
  });

  // Limit to show top results for performance (e.g., top 50)
  processedStations.value = filtered.slice(0, 50);
};

const sortStations = () => {
  filterAndSort();
};

</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero {
  position: relative;
  padding: 6rem 1rem;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  overflow: hidden;
  background-image: url('../assets/hero-bg.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.3) 0%,
    rgba(15, 23, 42, 0.6) 60%,
    var(--bg-color) 100%
  );
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

.hero p {
  font-size: 1.25rem;
  color: #f8fafc;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.fuel-select {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background-color: var(--surface-bg);
  color: var(--text-base);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  outline: none;
}

.fuel-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: var(--primary-light);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
  flex: 1;
  width: 100%;
}

.stations-grid, .loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-muted);
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.25rem;
}

.skeleton-card {
  height: 250px;
  background: var(--surface-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.skeleton-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (max-width: 640px) {
  .controls {
    flex-direction: column;
  }
  .fuel-select, .btn-primary {
    width: 100%;
  }
  .stations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
