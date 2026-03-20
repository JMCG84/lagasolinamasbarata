<script setup>
import { ref, computed, onMounted } from "vue";
import GasStationCard from "../components/GasStationCard.vue";
import GasCalculator from "../components/GasCalculator.vue";
import PromotionsModal from "../components/PromotionsModal.vue";
import NotificationToast from "../components/NotificationToast.vue";
import { fetchGasStations } from "../services/gasAPI";
import { calculateDistance } from "../utils/distance";

// ── Constants ──
const CA_PROVINCES = [
  {
    ca: "Andalucía",
    provinces: [
      "Almería",
      "Cádiz",
      "Córdoba",
      "Granada",
      "Huelva",
      "Jaén",
      "Málaga",
      "Sevilla",
    ],
  },
  { ca: "Aragón", provinces: ["Huesca", "Teruel", "Zaragoza"] },
  { ca: "Asturias", provinces: ["Asturias"] },
  { ca: "Illes Balears", provinces: ["Illes Balears"] },
  { ca: "Canarias", provinces: ["Las Palmas", "Santa Cruz de Tenerife"] },
  { ca: "Cantabria", provinces: ["Cantabria"] },
  {
    ca: "Castilla-La Mancha",
    provinces: ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
  },
  {
    ca: "Castilla y León",
    provinces: [
      "Ávila",
      "Burgos",
      "León",
      "Palencia",
      "Salamanca",
      "Segovia",
      "Soria",
      "Valladolid",
      "Zamora",
    ],
  },
  { ca: "Cataluña", provinces: ["Barcelona", "Girona", "Lleida", "Tarragona"] },
  { ca: "Extremadura", provinces: ["Badajoz", "Cáceres"] },
  { ca: "Galicia", provinces: ["A Coruña", "Lugo", "Ourense", "Pontevedra"] },
  { ca: "La Rioja", provinces: ["La Rioja"] },
  { ca: "Madrid", provinces: ["Madrid"] },
  { ca: "Murcia", provinces: ["Murcia"] },
  { ca: "Navarra", provinces: ["Navarra"] },
  { ca: "País Vasco", provinces: ["Álava", "Guipúzcoa", "Vizcaya"] },
  {
    ca: "Comunitat Valenciana",
    provinces: ["Alicante", "Castellón", "Valencia"],
  },
  { ca: "Ceuta", provinces: ["Ceuta"] },
  { ca: "Melilla", provinces: ["Melilla"] },
];

// ── State ──
const loading = ref(false);
const error = ref(null);
const allStations = ref([]);
const processedStations = ref([]);
const fuelType = ref("price95");
const searchDistance = ref(20);
const hasSearched = ref(false);
const userLoc = ref(null);
const isDarkMode = ref(true);
const provinceStats = ref(null);
const lastUpdated = ref(null);
const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"));
const showOnlyFavorites = ref(false);

// Modal state
const showLocationModal = ref(false);
const modalCA = ref("");
const modalProvince = ref("");
const modalFuelType = ref("price95");

// Calculator state
const showCalculator = ref(false);
const showPromotions = ref(false);
const calcInitialPrice = ref(0);

// Notification Toast state
const toastState = ref({
  show: false,
  message: '',
  type: 'info'
});

const showNotification = (message, type = 'info') => {
  toastState.value.show = false; // Reset if already showing
  setTimeout(() => {
    toastState.value.message = message;
    toastState.value.type = type;
    toastState.value.show = true;
  }, 50);
};

const openCalculator = (price = 0) => {
  calcInitialPrice.value = typeof price === "number" ? price : 0;
  showCalculator.value = true;
};

// ── Computed ──
const lastUpdatedFormatted = computed(() => {
  if (!lastUpdated.value) return null;
  const now = new Date();
  const diff = Math.floor((now - lastUpdated.value) / 60000); // Minutes
  if (diff < 1) return "hace menos de un minuto";
  if (diff === 1) return "hace 1 minuto";
  return `hace ${diff} minutos`;
});

const modalProvinces = computed(() => {
  const found = CA_PROVINCES.find((item) => item.ca === modalCA.value);
  return found ? found.provinces : [];
});

// ── Lifecycle ──
onMounted(() => {
  if (localStorage.getItem("theme") === "light") {
    isDarkMode.value = false;
    document.documentElement.classList.add("light-mode");
  } else {
    document.documentElement.classList.remove("light-mode");
  }
  // Try to locate automatically
  locateAndFetch();
});

// ── Methods ──
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  }
};

const toggleFavorite = (id) => {
  const index = favorites.value.indexOf(id);
  if (index === -1) {
    favorites.value.push(id);
    showNotification("Gasolinera añadida a favoritos", "success");
  } else {
    favorites.value.splice(index, 1);
    showNotification("Gasolinera eliminada de favoritos", "info");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value));
};

const toggleOnlyFavorites = () => {
  showOnlyFavorites.value = !showOnlyFavorites.value;
  if (showOnlyFavorites.value) {
    showNotification("Filtrando por favoritas", "info");
  } else {
    showNotification("Mostrando todas las estaciones", "info");
  }
  filterAndSort();
};

const locateAndFetch = () => {
  error.value = null;
  loading.value = true;
  hasSearched.value = true;
  processedStations.value = [];

  if (!navigator.geolocation) {
    loading.value = false;
    showLocationModal.value = true;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      userLoc.value = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      await loadGasStations();
    },
    (err) => {
      loading.value = false;
      console.error(err);
      showLocationModal.value = true;
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
};

const loadGasStations = async () => {
  try {
    const data = await fetchGasStations();
    allStations.value = data;
    lastUpdated.value = new Date();
    filterAndSort();
  } catch (err) {
    error.value =
      "Hubo un error al conectar con los datos del ministerio. Intenta más tarde.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const filterAndSort = () => {
  if (!userLoc.value) return;

  // 1. Calculate distance and filter based on selection
  let filters = allStations.value.map((station) => {
    return {
      ...station,
      distance: calculateDistance(
        userLoc.value.lat,
        userLoc.value.lon,
        station.lat,
        station.lon,
      ),
    };
  });

  let filtered = filters.filter((s) => s.distance <= searchDistance.value);

  // Filter by favorites if active
  if (showOnlyFavorites.value) {
    filtered = filtered.filter((s) => favorites.value.includes(s.id));
  }

  if (filtered.length > 0) {
    const currentProvince = filtered[0].province;

    // Calculate min/max across all stations in that province for standard 7-day approximation
    const provinceStations = allStations.value.filter(
      (s) => s.province === currentProvince,
    );
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    const statFuel = fuelType.value === "distance" ? "price95" : fuelType.value;

    provinceStations.forEach((s) => {
      let price = s[statFuel];
      if (price && price > 0) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    });

    if (minPrice !== Infinity && maxPrice !== -Infinity) {
      provinceStats.value = {
        name: currentProvince,
        min: minPrice.toFixed(3),
        max: maxPrice.toFixed(3),
      };
    } else {
      provinceStats.value = null;
    }
  } else {
    provinceStats.value = null;
  }

  // 2. Sort depending on user preference
  filtered.sort((a, b) => {
    if (fuelType.value === "distance") {
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

const searchByProvince = async () => {
  if (!modalProvince.value) return;
  showLocationModal.value = false;
  loading.value = true;
  hasSearched.value = true;
  fuelType.value = modalFuelType.value;
  processedStations.value = [];
  error.value = null;

  try {
    if (allStations.value.length === 0) {
      const data = await fetchGasStations();
      allStations.value = data;
    }

    const fuelKey = modalFuelType.value;

    const filtered = allStations.value
      .filter(
        (s) => s.province.toLowerCase() === modalProvince.value.toLowerCase(),
      )
      .sort((a, b) => {
        const priceA = a[fuelKey] || Infinity;
        const priceB = b[fuelKey] || Infinity;
        return priceA - priceB;
      });

    processedStations.value = filtered;

    // Filter by favorites if active
    if (showOnlyFavorites.value) {
      processedStations.value = processedStations.value.filter((s) => 
        favorites.value.includes(s.id)
      );
    }

    processedStations.value = processedStations.value.slice(0, 50);

    // Stats de provincia
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    filtered.forEach((s) => {
      const price = s[fuelKey];
      if (price && price > 0) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    });

    if (minPrice !== Infinity && maxPrice !== -Infinity) {
      provinceStats.value = {
        name: modalProvince.value,
        min: minPrice.toFixed(3),
        max: maxPrice.toFixed(3),
      };
    } else {
      provinceStats.value = null;
    }
  } catch (err) {
    error.value =
      "Hubo un error al conectar con los datos del ministerio. Intenta más tarde.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="home-view">
    <button
      @click="toggleOnlyFavorites"
      class="favorites-toggle"
      :class="{ 'is-active': showOnlyFavorites }"
      :data-tooltip="showOnlyFavorites ? 'Ver todas las estaciones' : 'Filtrar por favoritas'"
      aria-label="Ver favoritos">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        :fill="showOnlyFavorites ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon">
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span v-if="favorites.length > 0" class="fav-count">{{
        favorites.length
      }}</span>
    </button>
    <button 
      @click="toggleTheme" 
      class="theme-toggle" 
      :data-tooltip="isDarkMode ? 'Modo claro' : 'Modo oscuro'"
      aria-label="Cambiar tema">
      <svg
        v-if="isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon">
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
    <header class="hero">
      <div class="hero-content">
        <h1>La Gasolinera Más Barata</h1>
        <p>
          Ahorra cada vez que llenes el tanque. Encuentra las mejores opciones
          cerca de ti.
        </p>

        <div class="controls-wrapper">
          <div class="controls-toolbar">
            <button
              @click="locateAndFetch"
              class="control-btn btn-lookup"
              :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon">
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Buscar</span>
              </template>
            </button>

            <div class="control-select-wrapper" data-tooltip="Filtrar por distancia">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="select-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <select
                v-model="searchDistance"
                class="control-select"
                @change="sortStations">
                <option :value="20">Radio: 20 km</option>
                <option :value="50">Radio: 50 km</option>
              </select>
            </div>

            <div
              class="control-select-wrapper"
              data-tooltip="Ordenar por combustible o cercanía">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="select-icon icon-fuel">
                <path d="M6 2L3 6v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <select
                v-model="fuelType"
                class="control-select"
                @change="sortStations">
                <option value="price95">Gasolina 95</option>
                <option value="price98">Gasolina 98</option>
                <option value="priceDiesel">Diésel</option>
                <option value="distance">Más cercanas</option>
              </select>
            </div>

            <button
              @click="openCalculator()"
              class="control-btn btn-util"
              data-tooltip="Calcular consumo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-calc">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <path d="M8 14h2" />
                <path d="M14 14h2" />
                <path d="M8 18h2" />
                <path d="M14 18h2" />
              </svg>
              <span>Calcular Repostaje</span>
            </button>

            <button
              @click="showPromotions = true"
              class="control-btn btn-util"
              data-tooltip="Promociones y ofertas">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-star">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Promociones y Ofertas</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container">
      <div v-if="error" class="alert-error">
        {{ error }}
      </div>

      <div
        v-if="!loading && processedStations.length > 0 && provinceStats"
        class="province-stats">
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

      <div
        v-if="
          !loading && processedStations.length === 0 && !error && hasSearched
        "
        class="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>No se encontraron gasolineras a menos de {{ searchDistance }}km.</p>
      </div>

      <div
        v-if="!loading && processedStations.length === 0 && showOnlyFavorites"
        class="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <p>Aún no tienes gasolineras favoritas guardadas.</p>
        <button @click="showOnlyFavorites = false; filterAndSort()" class="btn-text">
          Ver todas las gasolineras
        </button>
      </div>

      <div class="stations-grid">
        <GasStationCard
          v-for="station in processedStations"
          :key="station.id"
          :station="station"
          :distance="station.distance"
          :activeFuel="fuelType"
          :provinceStats="provinceStats"
          :isFavorite="favorites.includes(station.id)"
          @calculate="openCalculator"
          @toggle-favorite="toggleFavorite" />
      </div>

      <GasCalculator
        :show="showCalculator"
        :initial-price="calcInitialPrice"
        @close="showCalculator = false" />

      <PromotionsModal :show="showPromotions" @close="showPromotions = false" />

      <NotificationToast 
        :show="toastState.show" 
        :message="toastState.message" 
        :type="toastState.type" 
        @close="toastState.show = false" 
      />

      <div v-if="lastUpdatedFormatted" class="update-note">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon">
          <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Datos actualizados según el Ministerio {{ lastUpdatedFormatted }}.
      </div>

      <div v-if="loading" class="loading-grid">
        <div v-for="i in 6" :key="i" class="skeleton-card"></div>
      </div>
    </main>

    <!-- Modal: sin ubicación → buscar por provincia -->
    <div
      v-if="showLocationModal"
      class="modal-overlay"
      @click.self="showLocationModal = false">
      <div class="modal-box">
        <div class="modal-icon">📍</div>
        <h2 class="modal-title">Ubicación no disponible</h2>
        <p class="modal-desc">
          No pudimos obtener tu ubicación. Selecciona tu zona y tipo de
          carburante para ver las gasolineras más baratas.
        </p>

        <div class="modal-fields">
          <select
            v-model="modalCA"
            class="modal-select"
            @change="modalProvince = ''">
            <option value="" disabled>Comunidad Autónoma</option>
            <option
              v-for="item in CA_PROVINCES"
              :key="item.ca"
              :value="item.ca">
              {{ item.ca }}
            </option>
          </select>

          <select
            v-model="modalProvince"
            class="modal-select"
            :disabled="!modalCA">
            <option value="" disabled>Provincia</option>
            <option v-for="prov in modalProvinces" :key="prov" :value="prov">
              {{ prov }}
            </option>
          </select>

          <select v-model="modalFuelType" class="modal-select">
            <option value="price95">Gasolina 95</option>
            <option value="price98">Gasolina 98</option>
            <option value="priceDiesel">Diésel</option>
          </select>
        </div>

        <button
          @click="searchByProvince"
          class="modal-btn"
          :disabled="!modalProvince">
          🔍 Ver gasolineras más baratas
        </button>
        <button @click="showLocationModal = false" class="modal-cancel">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos globales para modo claro (fuera de scoped para detectar .light-mode en html) */
html.light-mode .icon-fuel {
  color: #dc2626 !important;
  stroke: #dc2626 !important;
}
html.light-mode .icon-calc {
  color: #475569 !important;
  stroke: #475569 !important;
}
html.light-mode .icon-star {
  color: #ca8a04 !important;
  stroke: #ca8a04 !important;
  fill: rgba(234, 179, 8, 0.1);
}
</style>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100vw;
  overflow-x: hidden;
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

.favorites-toggle {
  position: absolute;
  top: 1rem;
  left: 1.5rem;
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

.favorites-toggle:hover {
  transform: scale(1.1) rotate(-5deg);
  border-color: #ef4444;
  color: #ef4444;
}

.favorites-toggle.is-active {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
}

.fav-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc2626;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--surface-bg);
}

.btn-text {
  background: none;
  border: none;
  color: var(--primary-light);
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  text-decoration: underline;
  font-size: 0.9rem;
}

.hero {
  position: relative;
  padding: 6rem 1rem;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  overflow: hidden;
  width: 100% !important;
  background-image: url("../assets/hero-bg.png");
  background-size: cover;
  background-position: center;
  background-attachment: scroll; /* Changed from fixed to scroll for mobile/tablet */
}

.hero::before {
  content: "";
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
  max-width: 1100px;
  margin: 0 auto;
}

h1 {
  font-size: clamp(2rem, 5vw, 4rem); /* Reduced min-size from 2.5rem to 2rem */
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
  word-break: break-word; /* Ensure wrapping on very narrow devices */
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

.controls-wrapper {
  margin-top: 2rem;
  width: 100%;
}

.controls-toolbar {
  display: flex;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  padding: 0.4rem;
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4);
  gap: 0.5rem;
  width: 100%;
  max-width: 100%; /* Ensure it does not overflow its parent */
  margin: 0 auto;
}

.control-btn,
.control-select-wrapper {
  flex: 1 1 auto;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem 0.6rem;
  border-radius: var(--radius-lg);
  border: none;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: normal; /* Allow text wrapping on very narrow screens */
  text-align: center;
}

.btn-lookup {
  background: var(--primary);
  color: white;
  min-width: 110px;
  flex: 1;
}

.btn-util {
  background: transparent;
  color: var(--text-base);
  border: 1px solid var(--border-color);
  flex: 1.4;
  min-width: 160px;
}

.btn-util .icon {
  flex-shrink: 0;
  color: var(--primary-light);
}

.control-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 130px;
  flex: 1.2;
}

.select-icon {
  position: absolute;
  left: 0.6rem;
  color: var(--primary-light);
  pointer-events: none;
  z-index: 10;
  flex-shrink: 0;
}

.control-select {
  width: 100%;
  appearance: none;
  padding: 0.75rem 1.6rem 0.75rem 2.2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-base);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.4rem center;
  background-size: 0.7rem;
}

.control-select:focus {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem;
  flex: 1;
  width: 100%;
}

.stations-grid,
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
  transition:
    transform 0.2s,
    box-shadow 0.2s;
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

.text-green {
  color: #10b981;
}
.text-red {
  color: #ef4444;
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

.update-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-style: italic;
  opacity: 0.8;
}

.update-note .icon {
  flex-shrink: 0;
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
  content: "";
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
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 900px) {
  .controls-toolbar {
    flex-wrap: wrap;
    justify-content: center;
  }
  .control-btn,
  .control-select-wrapper {
    flex: 1 1 200px;
  }
}

@media (max-width: 640px) {
  .controls-toolbar {
    flex-direction: column;
    padding: 0.75rem; /* Reduced from 1rem to gain horizontal space */
    gap: 0.75rem;
  }
  .control-btn,
  .control-select-wrapper {
    width: 100%;
    flex: none;
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

@media (max-width: 400px) {
  .hero {
    padding: 4rem 1rem;
  }
  .favorites-toggle,
  .theme-toggle {
    width: 38px;
    height: 38px;
    top: 0.75rem;
  }
  .favorites-toggle { left: 1rem; }
  .theme-toggle { right: 1rem; }
  
  .container {
    padding: 2rem 0.75rem;
  }
}

/* ── Modal ubicación ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem 1.75rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
  animation: modal-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-in {
  from {
    transform: scale(0.82);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-icon {
  font-size: 2.8rem;
  margin-bottom: 0.6rem;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-base);
  margin-bottom: 0.5rem;
}

.modal-desc {
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.55;
  margin-bottom: 1.5rem;
}

.modal-fields {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.modal-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background-color: var(--surface-bg);
  color: var(--text-base);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  -webkit-appearance: auto;
  appearance: auto;
}

.modal-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-alpha);
}

.modal-select:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.modal-btn {
  width: 100%;
  padding: 0.85rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
  margin-bottom: 0.75rem;
}

.modal-btn:hover:not(:disabled) {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.45);
}

.modal-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.modal-cancel {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.88rem;
  font-family: inherit;
  cursor: pointer;
  text-decoration: underline;
  padding: 0.25rem;
  transition: color 0.2s;
}

.modal-cancel:hover {
  color: var(--text-base);
}
</style>
