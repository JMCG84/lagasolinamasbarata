import { createApp } from "vue";
import App from "./App.vue";
import { inject } from "@vercel/analytics"; // 1. Importas la función

inject(); // 2. La ejecutas al arrancar la app

createApp(App).mount("#app");
