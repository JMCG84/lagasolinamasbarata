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
  }
});

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
      <span v-if="distance !== null && distance !== undefined" class="distance-badge">{{ distance.toFixed(1) }} km</span>
      <span v-else class="province-badge">📍 Por provincia</span>
    </div>
    <div class="location-details">
      <p class="address">{{ station.address }}</p>
      <p class="municipality">{{ station.municipality }}, {{ station.province }}</p>
    </div>
    
    <div class="prices-container">
      <div v-if="(activeFuel === 'price95' || activeFuel === 'distance') && station.price95" class="price-box">
        <span class="fuel-type">Gasolina 95</span>
        <span class="price-value">{{ station.price95.toFixed(3) }} €/L</span>
      </div>
      <div v-if="(activeFuel === 'price98' || activeFuel === 'distance') && station.price98" class="price-box">
        <span class="fuel-type">Gasolina 98</span>
        <span class="price-value">{{ station.price98.toFixed(3) }} €/L</span>
      </div>
      <div v-if="(activeFuel === 'priceDiesel' || activeFuel === 'distance') && station.priceDiesel" class="price-box">
        <span class="fuel-type">Diésel</span>
        <span class="price-value">{{ station.priceDiesel.toFixed(3) }} €/L</span>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="hours">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>{{ station.hours }}</span>
      </div>
      
      <a :href="mapsUrl" target="_blank" rel="noopener noreferrer" class="btn-primary">
        Ir allá
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
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
  height: 100%;
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
  gap: 1rem;
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

.address {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.municipality {
  margin: 0;
}

.prices-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  flex: 1; /* Push footer down */
}

.price-box {
  flex: 1;
  min-width: 100px;
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
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-top: auto;
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
</style>
