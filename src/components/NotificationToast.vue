<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'info' // info, success, warning
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const emit = defineEmits(['close']);
let timer = null;

const startTimer = () => {
  stopTimer();
  timer = setTimeout(() => {
    emit('close');
  }, props.duration);
};

const stopTimer = () => {
  if (timer) clearTimeout(timer);
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    startTimer();
  } else {
    stopTimer();
  }
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <Transition name="toast">
    <div v-if="show" class="notification-toast" :class="type" @mouseenter="stopTimer" @mouseleave="startTimer">
      <div class="toast-content">
        <div class="toast-icon">
          <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg v-else-if="type === 'info'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <span class="toast-message">{{ message }}</span>
      </div>
      <button class="toast-close" @click="emit('close')">&times;</button>
    </div>
  </Transition>
</template>

<style scoped>
.notification-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface-bg);
  border: 1px solid var(--border-color);
  color: var(--text-base);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10000;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  min-width: 280px;
  max-width: 90vw;
  justify-content: space-between;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.success .toast-icon { color: #10b981; }
.info .toast-icon { color: var(--primary-light); }
.warning .toast-icon { color: #f59e0b; }

.toast-message {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toast-close:hover {
  color: var(--text-base);
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.9);
}

@media (max-width: 640px) {
  .notification-toast {
    bottom: 1.5rem;
    width: calc(100% - 2rem);
    padding: 1rem;
  }
}
</style>
