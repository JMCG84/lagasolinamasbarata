<script setup>
import { ref } from 'vue';
import { getStationLogo } from '../utils/logos';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const failedLogos = ref(new Set());

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
    name: 'Repsol (Waylet)',
    logo: getStationLogo('repsol'),
    color: '#0055a5',
    text: "Descuento directo al pagar con la app Waylet. El ahorro base es de 10 cts/litro, pero puede ascender hasta 40 cts/litro si tienes contratados otros servicios de Repsol (Luz, Gas o Solar). El descuento se aplica sobre el precio del surtidor y aparece desglosado en el ticket de compra. No acumulable a otras tarjetas de descuento."
  },
  {
    name: 'Cepsa / Moeve (GOW)',
    logo: getStationLogo('cepsa'),
    color: '#ed1c24',
    text: "Promoción exclusiva para miembros del programa de fidelización GOW. El ahorro se obtiene en forma de saldo acumulable (normalmente entre 10 y 15 cts/litro) que podrás canjear en próximos repostajes o en establecimientos colaboradores. Imprescindible identificarse con el código QR de la app al pagar."
  },
  {
    name: 'BP (Mi BP)',
    logo: getStationLogo('bp'),
    color: '#00833d',
    text: "Ahorro mediante el sistema de puntos 'Mi BP'. El descuento de 10 cts/litro suele aplicarse como saldo para el siguiente repostaje en estaciones de la red BP. Si utilizas la tarjeta de crédito Visa Mi BP, el descuento se devuelve directamente en tu extracto bancario mensual (3% o 6% según modalidad)."
  },
  {
    name: 'Shell / DISA (Topii / ING)',
    logo: getStationLogo('shell'),
    color: '#fbce07',
    text: "Descuento del 4% directo si pagas a través de la aplicación Topii o si eres cliente de ING y utilizas su tarjeta de débito/crédito. El abono de ING suele aparecer en tu cuenta bancaria unos días después del repostaje, mientras que en Topii el descuento es inmediato sobre el total a pagar."
  },
  {
    name: 'Galp (Mundo Galp)',
    logo: getStationLogo('galp'),
    color: '#ff6600',
    text: "Descuento de 5 cts/litro en combustibles estándar y 10 cts/litro en gama G-Force usando el código QR de la app Mundo Galp. Si además eres cliente de Abanca y pagas con su tarjeta, recibirás una bonificación adicional del 2% al 5% en tu cuenta bancaria."
  },
  {
    name: 'Supermercados (Carrefour / Alcampo / Eroski)',
    logo: getStationLogo('carrefour'),
    multiple: ['carrefour', 'alcampo', 'eroski'],
    color: '#0038a8',
    text: "Estas estaciones ofrecen el ahorro vinculado a sus tarjetas de socio. En Carrefour, el 8% del importe se acumula en tu ChequeAhorro trimestral. En Alcampo y Eroski, el descuento suele ser directo en el precio por litro al pasar la tarjeta de fidelidad antes de repostar."
  },
  {
    name: 'Low Cost (Ballenoil / Petroprix)',
    logo: getStationLogo('ballenoil'),
    multiple: ['ballenoil', 'petroprix'],
    color: '#94a3b8',
    text: "Gasolineras automáticas con el precio base más competitivo de la zona. Sus promociones suelen basarse en cupones de lavado gratuitos o sorteos de combustible acumulado. Consulta en su app ('Easy Fuel' para Ballenoil) posibles promociones de bienvenida por el primer uso."
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
          <!-- IVA Announcement -->
          <div class="iva-banner">
            <div class="iva-icon">📢</div>
            <div class="iva-content">
              <h3>Actualización Gubernamental (20/03/2026)</h3>
              <p>El gobierno ha rebajado oficialmente el <strong>IVA al 10%</strong> en combustibles para paliar los costes energéticos. Los precios mostrados ya están actualizados. Avisaremos cuando esta medida deje de estar vigente.</p>
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
