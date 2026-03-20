<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  initialPrice: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);

const pricePerLiter = ref(props.initialPrice);
const liters = ref(50);
const budget = ref(50);
const mode = ref('liters'); // 'liters' or 'budget'

// Watch for initialPrice changes to update the local ref
watch(() => props.initialPrice, (newPrice) => {
  if (newPrice > 0) {
    pricePerLiter.value = newPrice;
  }
}, { immediate: true });

const computedTotal = computed(() => {
  if (!pricePerLiter.value) return '0.00';
  return (pricePerLiter.value * liters.value).toFixed(2);
});

const computedLiters = computed(() => {
  if (!pricePerLiter.value || !budget.value) return '0.00';
  return (budget.value / pricePerLiter.value).toFixed(2);
});

const setPresetLiters = (val) => {
  liters.value = val;
};

const setPresetBudget = (val) => {
  budget.value = val;
};
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="calculator-card">
        <div class="calc-header">
          <div class="header-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><path d="M8 14h2"/><path d="M14 14h2"/><path d="M8 18h2"/><path d="M14 18h2"/></svg>
            <h3>Calculadora de Precio</h3>
          </div>
          <button class="close-btn" @click="emit('close')" aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="calc-body">
          <div class="input-group">
            <label>Precio actual (€/L)</label>
            <div class="input-wrapper">
              <input 
                type="number" 
                v-model.number="pricePerLiter" 
                step="0.001" 
                placeholder="Ej: 1.549"
              />
              <span class="unit">€/L</span>
            </div>
          </div>

          <div class="tabs">
            <button 
              :class="{ active: mode === 'liters' }" 
              @click="mode = 'liters'"
            >Calcular por Litros</button>
            <button 
              :class="{ active: mode === 'budget' }" 
              @click="mode = 'budget'"
            >Calcular por Presupuesto</button>
          </div>

          <div v-if="mode === 'liters'" class="input-group">
            <label>¿Cuántos litros vas a echar?</label>
            <div class="input-wrapper">
              <input 
                type="number" 
                v-model.number="liters" 
                step="1"
              />
              <span class="unit">L</span>
            </div>
            <div class="presets">
              <button @click="setPresetLiters(20)">20L</button>
              <button @click="setPresetLiters(50)">50L</button>
              <button @click="setPresetLiters(65)">65L</button>
            </div>
          </div>

          <div v-else class="input-group">
            <label>¿Cuánto dinero quieres gastar?</label>
            <div class="input-wrapper">
              <input 
                type="number" 
                v-model.number="budget" 
                step="5"
              />
              <span class="unit">€</span>
            </div>
            <div class="presets">
              <button @click="setPresetBudget(20)">20€</button>
              <button @click="setPresetBudget(50)">50€</button>
              <button @click="setPresetBudget(100)">100€</button>
            </div>
          </div>

          <div class="result-area">
            <div class="result-item">
              <span class="result-label">{{ mode === 'liters' ? 'Total aproximado' : 'Litros aproximados' }}</span>
              <span class="result-value">
                {{ mode === 'liters' ? computedTotal : computedLiters }}
                <small class="result-unit">{{ mode === 'liters' ? '€' : 'L' }}</small>
              </span>
            </div>
          </div>
          
          <p class="calc-hint">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Usa esta calculadora para planificar tu repostaje en la gasolinera elegida.
          </p>

          <button @click="emit('close')" class="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Volver a la lista
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.calculator-card {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 380px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
}

@keyframes modal-pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.calc-header {
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.calc-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.calc-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 0.6rem 1rem;
  padding-right: 3.5rem;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-base);
  font-size: 1.1rem;
  font-weight: 700;
  outline: none;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-alpha);
  background: var(--surface-bg);
}

.unit {
  position: absolute;
  right: 1.25rem;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.9rem;
}

.tabs {
  display: flex;
  background: var(--bg-color);
  padding: 0.25rem;
  border-radius: var(--radius-lg);
  gap: 0.25rem;
  border: 1px solid var(--border-color);
}

.tabs button {
  flex: 1;
  padding: 0.5rem 0.25rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.tabs button.active {
  background: var(--surface-bg);
  color: var(--primary-light);
  box-shadow: var(--shadow-sm);
}

.presets {
  display: flex;
  gap: 0.5rem;
}

.presets button {
  flex: 1;
  padding: 0.5rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.presets button:hover {
  border-color: var(--primary-light);
  color: var(--primary-light);
  background: var(--primary-alpha);
}

.result-area {
  margin-top: 0;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-alpha), transparent);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--primary);
  display: flex;
  justify-content: center;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.result-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 700;
  letter-spacing: 0.1em;
}

.result-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-base);
  line-height: 1;
}

.result-unit {
  font-size: 1.25rem;
  color: var(--primary-light);
  margin-left: 0.25rem;
}

.calc-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.4;
  opacity: 0.8;
}

.back-btn {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  margin-top: 0.25rem;
}

.back-btn:hover {
  background: var(--bg-color);
  color: var(--text-base);
  border-color: var(--text-muted);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .calculator-card {
    max-width: 100%;
  }
  .result-value {
    font-size: 2.5rem;
  }
}
</style>
