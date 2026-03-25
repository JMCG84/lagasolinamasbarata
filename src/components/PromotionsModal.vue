<script setup>
import { ref } from 'vue';
import { getStationLogo } from '../utils/logos';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const showDisclaimer = ref(true);
const failedLogos = ref(new Set());

// Reset disclaimer when modal opens
import { watch } from 'vue';
watch(() => props.show, (newVal) => {
  if (newVal) showDisclaimer.value = true;
});

const handleImageError = (name, idx = null) => {
  const key = idx !== null ? `${name}-${idx}` : name;
  failedLogos.value.add(key);
};

const isLogoFailed = (name, idx = null) => {
  const key = idx !== null ? `${name}-${idx}` : name;
  return failedLogos.value.has(key);
};

const promotions = [
  {
    name: '🔴 OFERTA SEMANA SANTA · Moeve (antes Cepsa) & Naturgy: ¡Máximo Histórico!',
    logo: getStationLogo('cepsa'),
    color: '#ed1c24',
    text: "Campaña especial de Semana Santa (del 24 de marzo al 6 de abril). El ahorro base es de 12 cts/litro pagando con la app Moeve gow. El descuento escala según tu vinculación con Naturgy: 20 cts/litro si tienes Luz o Gas. 30-40 cts/litro si añades servicios de mantenimiento. 60 cts/litro si tienes placas solares con Naturgy. Hasta 67 cts/litro: máximo ahorro usando la app gow + la tarjeta bancaria del programa. Extra Profesionales: +5 cts/litro para autónomos con tarjeta Moeve Pro."
  },
  {
    name: '🔴 OFERTA SEMANA SANTA · 🔵 Repsol (Waylet): Respuesta a la Crisis',
    logo: getStationLogo('repsol'),
    color: '#0055a5',
    text: "Promoción vigente hasta el 6 de abril. Repsol ha duplicado sus descuentos: el ahorro mínimo por usar Waylet es de 10 cts/litro. Puedes alcanzar hasta 40 cts/litro si tienes contratados con Repsol los servicios de Luz, Gas y Energía Solar (Plan Energías Conectadas). El descuento es directo en el pago y se acumula en tu saldo Waylet para próximos repostajes."
  },
  {
    name: '🟢 BP (Mi BP): Ahorro Acumulable',
    logo: getStationLogo('bp'),
    color: '#00833d',
    text: "BP ofrece hasta 15 cts/litro de ahorro acumulable para usuarios de la tarjeta o app Mi BP. Además, si utilizas la tarjeta Visa Mi BP, recibes una devolución adicional de hasta el 6% en tu extracto mensual. Este ahorro es independiente de la rebaja fiscal del IVA ya aplicada en el surtidor."
  },
  {
    name: '🟡 Shell / DISA (Topii / ING)',
    logo: getStationLogo('shell'),
    color: '#fbce07',
    text: "Mantienen el 4% de descuento directo a través de la app Topii. Para clientes de ING, el 4% se devuelve automáticamente en la cuenta bancaria tras el repostaje. Es la opción más sencilla ya que no requiere vinculación de contratos de luz o gas."
  },
  {
    name: 'Galp (Mundo Galp)',
    logo: getStationLogo('galp'),
    color: '#ff6600',
    text: "Ahorro de 5 cts/litro en combustibles estándar y 10 cts/litro en gama G-Force usando la app Mundo Galp. Si pagas con tarjetas de Abanca, sumas una bonificación adicional de entre el 2% y el 5% según el tipo de cuenta, que recibirás directamente en tu extracto mensual."
  },
  {
    name: '🛒 Carrefour: El ChequeAhorro sube',
    logo: getStationLogo('carrefour'),
    multiple: ['carrefour', 'alcampo', 'eroski'],
    color: '#0038a8',
    text: "Debido a la situación energética, Carrefour devuelve ahora el 10% del importe (antes 8%) en tu ChequeAhorro trimestral al presentar la tarjeta de El Club Carrefour en sus estaciones de servicio. El precio del surtidor ya refleja además la bajada del IVA al 10%."
  },
  {
    name: 'Low Cost (Ballenoil / Petroprix)',
    logo: getStationLogo('ballenoil'),
    multiple: ['ballenoil', 'petroprix'],
    color: '#94a3b8',
    text: "Mantienen los precios base más bajos de la API oficial. Sus promociones actuales se centran en la app Easy Fuel (Ballenoil) con sorteos de combustible y cupones de lavado. No requieren contratos de luz o gas para acceder a su precio reducido."
  }
];

const getMultipleLogos = (names) => {
  return names.map(name => ({
    url: getStationLogo(name),
    name: name
  }));
};

</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="promotions-card">
        <div class="modal-header">
          <div class="header-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M6 9l6 6 6-6"/></svg>
            <h2>Promociones y Ahorro</h2>
          </div>
          <button class="close-btn" @click="emit('close')" aria-label="Cerrar">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- DISCLAIMER VIEW -->
          <Transition name="fade-slide" mode="out-in">
            <div v-if="showDisclaimer" class="disclaimer-view">
              <div class="disclaimer-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shield-pulse"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 class="disclaimer-title">Aviso Legal y de Responsabilidad</h3>
              <p class="disclaimer-text">
                Los precios mostrados en el mapa ya incluyen la rebaja del <strong>IVA al 10%</strong> aprobada por el Gobierno (Real Decreto-ley 7/2026).
              </p>
              <p class="disclaimer-text">
                Los descuentos adicionales de hasta 67 cts (Moeve) o 40 cts (Repsol) son promociones comerciales de duración limitada hasta el 6 de abril y dependen de la <strong>vinculación energética (Luz/Gas)</strong> del usuario.
              </p>
              <p class="disclaimer-text">
                Esta app utiliza los datos oficiales de la API del Ministerio para la Transición Ecológica.
              </p>
              
              <button @click="showDisclaimer = false" class="accept-btn">
                Aceptar y Ver Ofertas
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>
              </button>
            </div>

            <!-- PROMOTIONS CONTENT -->
            <div v-else class="promotions-content">
              <!-- IVA Announcement -->
              <div class="iva-banner">
                <div class="iva-icon">📢</div>
                <div class="iva-content">
                  <h3>Actualización Gubernamental (25/03/2026)</h3>
                  <p>La rebaja del <strong>IVA al 10%</strong> en combustibles, aprobada por el Gobierno (Real Decreto-ley 7/2026), está vigente. Los precios mostrados ya reflejan esta actualización.</p>
                </div>
              </div>

              <div class="promo-list">
                <div v-for="promo in promotions" :key="promo.name" class="promo-item">
                  <div class="promo-header">
                    <div class="promo-logos">
                      <template v-if="promo.multiple">
                        <div v-for="(brand, idx) in getMultipleLogos(promo.multiple)" :key="idx" class="logo-container">
                          <img 
                            v-if="brand.url && !isLogoFailed(promo.name, idx)" 
                            :src="brand.url" 
                            :alt="brand.name" 
                            class="brand-logo" 
                            @error="handleImageError(promo.name, idx)"
                          />
                          <div v-else class="fallback-logo" :title="brand.name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v14"/><path d="M15 6h2c1.1 0 2 .9 2 2v3s0 2 2 2"/><circle cx="10" cy="11" r="2"/><path d="M7 15h6"/></svg>
                          </div>
                        </div>
                      </template>
                      <div v-else class="logo-container">
                        <img 
                          v-if="promo.logo && !isLogoFailed(promo.name)" 
                          :src="promo.logo" 
                          :alt="promo.name" 
                          class="brand-logo" 
                          @error="handleImageError(promo.name)"
                        />
                        <div v-else class="fallback-logo">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v14"/><path d="M15 6h2c1.1 0 2 .9 2 2v3s0 2 2 2"/><circle cx="10" cy="11" r="2"/><path d="M7 15h6"/></svg>
                        </div>
                      </div>
                    </div>
                    <h3 class="brand-name">{{ promo.name }}</h3>
                  </div>
                  <p class="promo-text">{{ promo.text }}</p>
                </div>
              </div>

              <button @click="emit('close')" class="footer-btn">
                Entendido, volver a la lista
              </button>
            </div>
          </Transition>
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
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.promotions-card {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-pop {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, var(--primary), #1d4ed8);
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

.modal-header h2 {
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

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* IVA Banner */
.iva-banner {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
  border: 2px solid var(--primary);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.iva-icon {
  font-size: 2rem;
}

.iva-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--primary-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.iva-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-base);
  line-height: 1.5;
}

.promo-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.promo-item {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  transition: transform 0.2s, border-color 0.2s;
}

.promo-item:hover {
  border-color: var(--primary-light);
  transform: translateX(4px);
}

.promo-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.promo-logos {
  display: flex;
  gap: 0.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  background: white;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.fallback-logo {
  width: 36px;
  height: 36px;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-light);
}

.brand-name {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-base);
}

.promo-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.footer-btn {
  width: 100%;
  padding: 1rem;
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.footer-btn:hover {
  background: var(--bg-color);
  border-color: var(--primary-light);
  color: var(--primary-light);
}

/* Disclaimer Styles */
.disclaimer-view {
  padding: 1.5rem 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  animation: modal-pop 0.3s ease-out;
}

.disclaimer-icon {
  width: 80px;
  height: 80px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-light);
  margin-bottom: 0.5rem;
}

.shield-pulse {
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

.disclaimer-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-base);
  margin: 0;
}

.disclaimer-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0;
  text-align: left;
}

.disclaimer-text strong {
  color: var(--text-base);
}

.accept-btn {
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px var(--primary-alpha);
  transition: all 0.2s;
  margin-top: 1rem;
}

.accept-btn:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--primary-alpha);
}

.promotions-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .promotions-card {
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>
