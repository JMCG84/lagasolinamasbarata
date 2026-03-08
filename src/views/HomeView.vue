<template>
  <div class="home-view">
    <button @click="toggleTheme" class="theme-toggle" aria-label="Cambiar tema">
      <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
    </button>
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
            {{ loading ? 'Buscando cerca de ti...' : `Buscar (${searchDistance}km)` }}
          </button>
          
          <select v-model="searchDistance" class="fuel-select" @change="sortStations">
            <option :value="20">Radio: 20 km</option>
            <option :value="50">Radio: 50 km</option>
          </select>

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

      <div v-if="!loading && processedStations.length > 0 && provinceStats" class="province-stats">
        <div class="stat-item">
          <span class="stat-label">📍 Provincia</span>
          <span class="stat-value">{{ provinceStats.name }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">📉 Mínimo (7 días)</span>
          <span class="stat-value text-green">{{ provinceStats.min }} €/L</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">📈 Máximo (7 días)</span>
          <span class="stat-value text-red">{{ provinceStats.max }} €/L</span>
        </div>
      </div>

      <div v-if="!loading && processedStations.length === 0 && !error && hasSearched" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <p>No se encontraron gasolineras a menos de {{ searchDistance }}km.</p>
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
const searchDistance = ref(20);
const hasSearched = ref(false);
const userLoc = ref(null);
const isDarkMode = ref(true);
const provinceStats = ref(null);

onMounted(() => {
  if (localStorage.getItem('theme') === 'light') {
    isDarkMode.value = false;
    document.documentElement.classList.add('light-mode');
  } else {
    document.documentElement.classList.remove('light-mode');
  }
  // Try to locate automatically
  locateAndFetch();
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
};

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

  // 1. Calculate distance and filter based on selection
  let filters = allStations.value.map(station => {
    return {
      ...station,
      distance: calculateDistance(userLoc.value.lat, userLoc.value.lon, station.lat, station.lon)
    };
  });
  
  let filtered = filters.filter(s => s.distance <= searchDistance.value);

  if (filtered.length > 0) {
    const currentProvince = filtered[0].province;
    
    // Calculate min/max across all stations in that province for standard 7-day approximation
    const provinceStations = allStations.value.filter(s => s.province === currentProvince);
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    provinceStations.forEach(s => {
      let price = s[fuelType.value];
      if (price && price > 0) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    });

    if (minPrice !== Infinity && maxPrice !== -Infinity) {
      provinceStats.value = {
        name: currentProvince,
        min: minPrice.toFixed(3),
        max: maxPrice.toFixed(3)
      };
    } else {
      provinceStats.value = null;
    }
  } else {
    provinceStats.value = null;
  }

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

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  z-index: 50;
  background: var(--surface-bg);
  color: var(--text-base);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(5deg);
  border-color: var(--primary);
  color: var(--primary-light);
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

.province-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  padding: 1.25rem 2.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}

.province-stats:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
  margin: 0 1rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-base);
}

.text-green { color: #10b981; }
.text-red { color: #ef4444; }

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
  .province-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
  .stat-divider {
    height: 1px;
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style>
