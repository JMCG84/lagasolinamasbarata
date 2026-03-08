import { createApp } from "vue";
import App from "./App.vue";
import { inject } from "@vercel/analytics"; // 1. Importas la función

try {
  inject(); // 2. La ejecutas al arrancar la app
} catch (error) {
  console.warn("Vercel Analytics failed to initialize:", error);
}

createApp(App).mount("#app");
