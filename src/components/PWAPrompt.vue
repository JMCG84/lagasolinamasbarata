<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { APP_VERSION } from '../version.js';

const VERSION_KEY = 'app_version_seen';

// VERSION CHECK (Primary banner mechanism) 
// Compares stored version in localStorage with the current APP_VERSION.
// If they differ, shows the update banner immediately on load.
const showUpdateBanner = ref(false);
const updateInProgress = ref(false);
let swPollIntervalId = null;

const isUpdateNeeded = () => {
  return localStorage.getItem(VERSION_KEY) !== APP_VERSION;
};

const checkVersion = () => {
  if (isUpdateNeeded()) showUpdateBanner.value = true;
};

const handleUpdate = async () => {
  if (updateInProgress.value) return;
  updateInProgress.value = true;
  localStorage.setItem(VERSION_KEY, APP_VERSION);
  showUpdateBanner.value = false;

  // If there's a waiting SW, force it to activate.
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Reload when the new SW takes control; fallback reload after a short delay.
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        () => window.location.reload(),
        { once: true },
      );
      setTimeout(() => window.location.reload(), 2500);
    } catch (e) {
      window.location.reload();
    }
  } else {
    window.location.reload();
  }
};

const dismissUpdate = () => {
  localStorage.setItem(VERSION_KEY, APP_VERSION);
  showUpdateBanner.value = false;
  updateInProgress.value = false;
};

// SW DETECTION (Secondary mechanism)
// Uses native Service Worker API to detect when a new build is deployed.
// Shows the banner automatically in under 60 seconds without any module dependency.
const pollServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then((registration) => {
    // Case 1: There is already a SW waiting when the page loads (recent deploy)
    if (registration.waiting) {
      if (isUpdateNeeded()) showUpdateBanner.value = true;
    }

    // Case 2: A new SW is found while the user has the app open
    registration.addEventListener('updatefound', () => {
      const newSW = registration.installing;
      if (!newSW) return;
      newSW.addEventListener('statechange', () => {
        // New SW is installed and waiting to take control
        if (newSW.state === 'installed' && isUpdateNeeded()) {
          showUpdateBanner.value = true;
        }
      });
    });

    // Poll every 60 seconds so the SW checks the server for a new version
    swPollIntervalId = setInterval(() => registration.update(), 60 * 1000);
  });
};

// INSTALL PROMPT
const showPrompt = ref(false);
const deferredPrompt = ref(null);
const platformType = ref('');

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

const isInStandaloneMode = () =>
  ('standalone' in window.navigator) && (window.navigator.standalone);

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault();
  deferredPrompt.value = e;
  if (!isInStandaloneMode()) {
    const lastPrompt = localStorage.getItem('pwa_prompt_android');
    const now = new Date().getTime();
    if (!lastPrompt || (now - parseInt(lastPrompt) > 2 * 24 * 60 * 60 * 1000)) {
      platformType.value = 'android';
      showPrompt.value = true;
    }
  }
};

onMounted(() => {
  checkVersion();
  pollServiceWorker();

  if (isIos() && !isInStandaloneMode()) {
    const lastPrompt = localStorage.getItem('pwa_prompt_ios');
    const now = new Date().getTime();
    if (!lastPrompt || (now - parseInt(lastPrompt) > 3 * 24 * 60 * 60 * 1000)) {
      platformType.value = 'ios';
      showPrompt.value = true;
    }
  }
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  if (swPollIntervalId) clearInterval(swPollIntervalId);
});

const installPwa = async () => {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;
  if (outcome === 'accepted') {
    console.log('User accepted the PWA install');
  }
  deferredPrompt.value = null;
  showPrompt.value = false;
};

const closePrompt = () => {
  showPrompt.value = false;
  const storageKey = platformType.value === 'ios' ? 'pwa_prompt_ios' : 'pwa_prompt_android';
  localStorage.setItem(storageKey, new Date().getTime().toString());
};
</script>

<template>
  
  <Transition name="slide-up">
    <div v-if="showUpdateBanner" class="pwa-prompt-container">
      <div class="pwa-prompt-card update-card">
        <button class="close-btn" @click="dismissUpdate">×</button>
        <div class="prompt-content">
          <div class="update-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </div>
          <div class="text-content">
            <h3>Nueva versión disponible</h3>
            <p>Hay mejoras y correcciones disponibles. Actualiza ahora para obtener la mejor experiencia.</p>
            <button class="update-btn" @click="handleUpdate">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/></svg>
              Actualizar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  
  <Transition name="slide-up">
    <div v-if="showPrompt && !needRefresh" class="pwa-prompt-container">
      <div class="pwa-prompt-card">
        <button class="close-btn" @click="closePrompt">×</button>
        <div class="prompt-content">
          <div class="icon-wrapper">
            <img src="/pwa-192x192.png" alt="App Icon" class="app-icon" />
          </div>
          <div class="text-content">
            <h3>Instala la App</h3>
            <p v-if="platformType === 'ios'">Añádela a tu pantalla de inicio para acceder rápido y sin conexión:</p>
            <p v-else>Disfruta de una mejor experiencia instalando la app en tu dispositivo.</p>
            
            <div v-if="platformType === 'ios'" class="steps">
              <span>Pulsa </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="share-icon">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              <span> y luego <strong>"Añadir a pantalla de inicio"</strong>.</span>
            </div>
            
            <button v-else class="install-btn" @click="installPwa">
              Instalar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-prompt-container {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  z-index: 9999;
}

.pwa-prompt-card {
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(10px);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
}

.prompt-content {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon-wrapper {
  flex-shrink: 0;
}

.app-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  box-shadow: var(--shadow-md);
}

.text-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: var(--text-base);
}

.text-content p {
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.steps {
  font-size: 0.85rem;
  color: var(--text-base);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: var(--radius-md);
}

.share-icon {
  color: var(--primary);
  margin: 0 0.1rem;
}

.install-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
}

.install-btn:hover {
  background: var(--primary-dark);
}

/* Update banner specific styles */
.update-card {
  border-color: var(--primary);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), var(--surface-bg));
}

.update-icon-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-light);
  animation: spin-gentle 4s linear infinite;
}

@keyframes spin-gentle {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(180deg); }
  50%  { transform: rotate(180deg); }
  75%  { transform: rotate(360deg); }
  100% { transform: rotate(360deg); }
}

.update-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.update-btn:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.5);
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateX(-50%) translateY(100px);
  opacity: 0;
}

@media (max-width: 480px) {
  .pwa-prompt-container {
    bottom: 1rem;
    width: 94%;
  }
}
</style>
