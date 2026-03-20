<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showPrompt = ref(false);
const deferredPrompt = ref(null);
const platformType = ref(''); // 'ios' or 'android'

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  // Classic iOS (iPhone/iPod/Old iPad)
  if (/iphone|ipad|ipod/.test(userAgent)) return true;
  // Modern iPadOS (Identifies as MacIntel with touch support)
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

const isInStandaloneMode = () => 
  ('standalone' in window.navigator) && (window.navigator.standalone);

const handleBeforeInstallPrompt = (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt.value = e;
  
  // Show the prompt for Android/Desktop Chrome
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
  // IOS detection (Static)
  if (isIos() && !isInStandaloneMode()) {
    const lastPrompt = localStorage.getItem('pwa_prompt_ios');
    const now = new Date().getTime();
    if (!lastPrompt || (now - parseInt(lastPrompt) > 3 * 24 * 60 * 60 * 1000)) {
      platformType.value = 'ios';
      showPrompt.value = true;
    }
  }

  // Android/Chrome detection (Event based)
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

const installPwa = async () => {
  if (!deferredPrompt.value) return;
  // Show the install prompt
  deferredPrompt.value.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice;
  if (outcome === 'accepted') {
    console.log('User accepted the PWA install');
  } else {
    console.log('User dismissed the PWA install');
  }
  // We've used the prompt, and can't use it again
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
    <div v-if="showPrompt" class="pwa-prompt-container">
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
