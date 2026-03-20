<script setup>
import { computed, ref } from 'vue';
import { getStationLogo } from '../utils/logos';

const props = defineProps({
  station: {
    type: Object,
    required: true
  },
  distance: {
    type: Number,
    required: false,
    default: null
  },
  activeFuel: {
    type: String,
    default: 'distance'
  },
  provinceStats: {
    type: Object,
    default: null
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['calculate', 'toggle-favorite']);

const initialLogo = getStationLogo(props.station.name);
const imageError = ref(false);

const logoUrl = computed(() => {
  return imageError.value ? null : initialLogo;
});

const handleImageError = () => {
  imageError.value = true;
};

const mapsUrl = computed(() => {
  return `https://www.google.com/maps/dir/?api=1&destination=${props.station.lat},${props.station.lon}`;
});
</script>

<template>
  <div class="gas-card">
    <div class="card-header">
      <div class="title-wrapper">
        <img v-if="logoUrl" :src="logoUrl" :alt="station.name" class="station-logo" @error="handleImageError" />
        <div v-else class="generic-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M3 22v-8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v8"></path><path d="M11 22h10"></path><path d="M18 22v-5c0-1.1-.9-2-2-2h-3"></path><circle cx="14" cy="11" r="3"></circle><line x1="14" y1="14" x2="14" y2="22"></line><line x1="3" y1="9" x2="3" y2="4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v5"></line></svg>
        </div>
        <h3 class="station-name">{{ station.name || 'ESTACIÓN DE SERVICIO' }}</h3>
      </div>
      <div class="header-right">
        <button 
          class="btn-favorite" 
          :class="{ 'is-active': isFavorite }" 
          @click.stop="emit('toggle-favorite', station.id)"
          :aria-label="isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
          :data-tooltip="isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <span v-if="distance !== null && distance !== undefined" class="distance-badge">{{ distance.toFixed(1) }} km</span>
        <span v-else class="province-badge">📍 Por provincia</span>
      </div>
    </div>
    <div class="location-details">
      <div v-if="station.isRestricted" class="restricted-warning">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="warn-icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Venta Restringida (Socios/Cooperativas)</span>
      </div>
      <p class="address">{{ station.address }}</p>
      <p class="municipality">{{ station.municipality }}, {{ station.province }}</p>
    </div>
    
    <div class="prices-container">
      <div 
        v-if="(activeFuel === 'price95' || activeFuel === 'distance') && station.price95" 
        class="price-box" 
        :class="{ clickable: activeFuel === 'distance' }"
        @click="activeFuel === 'distance' ? emit('calculate', station.price95) : null"
        :data-tooltip="activeFuel === 'distance' ? 'Calcular con este precio' : ''"
      >
        <span class="fuel-type">Gasolina 95</span>
        <span class="price-value" :class="{ 
          'is-cheapest': provinceStats && station.price95.toFixed(3) === provinceStats.min,
          'is-expensive': provinceStats && station.price95.toFixed(3) === provinceStats.max
        }">{{ station.price95.toFixed(3) }} €/L</span>
      </div>
      <div 
        v-if="(activeFuel === 'price98' || activeFuel === 'distance') && station.price98" 
        class="price-box" 
        :class="{ clickable: activeFuel === 'distance' }"
        @click="activeFuel === 'distance' ? emit('calculate', station.price98) : null"
        :data-tooltip="activeFuel === 'distance' ? 'Calcular con este precio' : ''"
      >
        <span class="fuel-type">Gasolina 98</span>
        <span class="price-value" :class="{ 
          'is-cheapest': provinceStats && station.price98.toFixed(3) === provinceStats.min,
          'is-expensive': provinceStats && station.price98.toFixed(3) === provinceStats.max
        }">{{ station.price98.toFixed(3) }} €/L</span>
      </div>
      <div 
        v-if="(activeFuel === 'priceDiesel' || activeFuel === 'distance') && station.priceDiesel" 
        class="price-box" 
        :class="{ clickable: activeFuel === 'distance' }"
        @click="activeFuel === 'distance' ? emit('calculate', station.priceDiesel) : null"
        :data-tooltip="activeFuel === 'distance' ? 'Calcular con este precio' : ''"
      >
        <span class="fuel-type">Diésel</span>
        <span class="price-value" :class="{ 
          'is-cheapest': provinceStats && station.priceDiesel.toFixed(3) === provinceStats.min,
          'is-expensive': provinceStats && station.priceDiesel.toFixed(3) === provinceStats.max
        }">{{ station.priceDiesel.toFixed(3) }} €/L</span>
      </div>
    </div>

    <!-- Botón calculadora centrado cuando no es modo cercanía -->
    <div v-if="activeFuel !== 'distance'" class="centered-calc">
      <button @click="emit('calculate', station[activeFuel])" class="btn-calc-large">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><path d="M8 14h2"/><path d="M14 14h2"/><path d="M8 18h2"/><path d="M14 18h2"/></svg>
        <span>Calcular Precio</span>
      </button>
    </div>
    
    <div class="card-footer">
      <div class="hours">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>{{ station.hours }}</span>
      </div>
      
      <div class="footer-actions">
        <a :href="mapsUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
          Ir allá
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gas-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0; /* Allow the flex item to shrink below content size */
  animation: fadeIn 0.5s ease-out;
}

.gas-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap; /* Allow wrapping if name is too long on small screens */
  gap: 0.75rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.station-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
  background: white; /* Logos are mostly designed for white background */
  padding: 2px;
  flex-shrink: 0;
}

.generic-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.station-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-base);
  line-height: 1.2;
  word-break: break-word; /* Prevent name from pushing out the card */
  hyphens: auto;
}

.header-right {
  gap: 0.5rem;
  flex-wrap: wrap; /* Allow heart icon and distance badge to wrap if needed */
  justify-content: flex-end;
}

.btn-favorite {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 50%;
}

.btn-favorite:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: scale(1.2);
}

.btn-favorite.is-active {
  color: #ef4444;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4));
}

.btn-favorite.is-active .heart-icon {
  animation: heart-beat 0.4s ease-out;
}

@keyframes heart-beat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.distance-badge {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.province-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.location-details {
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.restricted-warning {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #ef4444; /* Rojo vibrante */
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0.8rem;
  background: rgba(239, 68, 68, 0.08);
  border-radius: var(--radius-md);
  border: 1px solid rgba(239, 68, 68, 0.2);
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0% { border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.1); }
  50% { border-color: rgba(239, 68, 68, 0.5); box-shadow: 0 0 8px 0 rgba(239, 68, 68, 0.2); }
  100% { border-color: rgba(239, 68, 68, 0.2); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.1); }
}

.warn-icon {
  flex-shrink: 0;
}

.address {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
  overflow-wrap: anywhere; /* Crucial for long road names with dots/dashes */
  word-break: break-word;
}

.municipality {
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.prices-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  flex: 1; /* Push footer down */
}

.price-box {
  display: flex;
  flex-direction: column;
  flex: 1 1 80px; /* Allow items to shrink to 80px before wrapping */
  min-width: 0; /* Let flex-basis handle the min size */
  background: var(--surface-bg);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.price-box:hover {
  background: var(--primary-alpha);
  border-color: var(--primary-light);
}

.price-box.clickable {
  cursor: pointer;
}

.price-box.clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  background: var(--primary-alpha);
}

.centered-calc {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn-calc-large {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  color: var(--primary-light);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-calc-large:hover {
  background: var(--primary-alpha);
  border-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.fuel-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.price-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-base);
  transition: color 0.3s ease;
}

.price-value.is-cheapest {
  color: #10b981; /* Verde intenso */
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}

.price-value.is-expensive {
  color: #ef4444; /* Rojo */
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-top: auto;
  gap: 0.75rem;
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.btn-calc {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-calc:hover {
  background: var(--primary-alpha);
  border-color: var(--primary-light);
  color: var(--primary-light);
  transform: scale(1.05);
}

.hours {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  max-width: 50%;
}

.hours span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon {
  flex-shrink: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 360px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-right {
    width: 100%;
    justify-content: flex-start;
    margin-top: 0.25rem;
  }
  .gas-card {
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Reduced shadow spread for mobile */
  }
  .price-value {
    font-size: 1.1rem;
  }
}
</style>
