# La Gasolinera Más Barata

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://lagasolinamasbarata.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)

> Encuentra las gasolineras más baratas cerca de ti en tiempo real con datos oficiales del Ministerio para la Transición Ecológica y el Reto Demográfico.
<img width="1302" height="564" alt="Image" src="https://github.com/user-attachments/assets/2e2e7d47-00d1-4ed0-8898-142eebddb8c7" />

## Características

- **Geolocalizacion automatica** - Detecta tu ubicación y busca gasolineras en un radio configurable de 20 o 50 km
- **Precios en tiempo real** - Datos actualizados del Ministerio para la Transición Ecológica y el Reto Demográfico
- **Barra de controles unificada** - Todos los filtros (radio, combustible, calculadora y promociones) accesibles en una sola fila
- **Calculadora de consumo** - Calcula el coste de tu repostaje en tiempo real desde cada tarjeta
- **Promociones y ofertas** - Panel actualizado con las condiciones vigentes de las principales operadoras (Moeve/Cepsa, Repsol, BP, Shell, Galp y supermercados)
- **Aviso legal en promociones** - Descargo de responsabilidad claro antes de mostrar los descuentos estimados
- **Icono de favoritos** - Guarda tus estaciones habituales y filtra por ellas desde la pantalla principal
- **Actualizacion automatica PWA** - El sistema notifica al usuario cuando hay una nueva versión disponible mediante un banner, sin necesidad de cerrar la aplicación
- **Responsive design** - Funciona en móvil, tablet y escritorio
- **Modo claro y oscuro** - Iconos con colores diferenciados en modo claro (surtidor rojo, calculadora gris, estrella amarilla)
- **Sin anuncios ni tracking** - 100% gratuito y respetuoso con la privacidad del usuario

## Stack Tecnológico

- **Frontend**: Vue 3 (Composition API)
- **Lenguaje**: JavaScript ES6+
- **Estilos**: CSS3 con variables custom (Dark Mode y Glassmorphism)
- **Build Tool**: Vite 7 con vite-plugin-pwa
- **Routing**: Vue Router 4
- **Deploy**: Vercel (CI/CD automatico en cada push a main)
- **Analytics**: Vercel Analytics

## Demo

[Ver aplicación en vivo](https://lagasolinamasbarata.vercel.app)

## Instalación Local

### Prerrequisitos

- Node.js >= 18.0.0
- npm o yarn

### Pasos

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/JMCG84/lagasolinamasbarata.git
   cd lagasolinamasbarata
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   ```

4. **Abre tu navegador**

   Visita `http://localhost:5173`

## Build para Producción

```bash
npm run build
npm run preview  # Para previsualizar la build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## Estructura del Proyecto

```
lagasolinamasbarata/
├── public/
│   ├── gas-icon.svg
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── GasCalculator.vue       # Calculadora de consumo y precio
│   │   ├── GasStationCard.vue      # Tarjeta de cada gasolinera
│   │   ├── NotificationToast.vue   # Sistema de notificaciones
│   │   ├── PromotionsModal.vue     # Panel de promociones con aviso legal
│   │   └── PWAPrompt.vue           # Banners de instalacion y actualizacion PWA
│   ├── router/
│   ├── services/
│   │   └── gasAPI.js               # Consumo de la API del Ministerio
│   ├── utils/
│   │   └── logos.js                # Asignacion de logos por operadora
│   ├── views/
│   │   └── HomeView.vue            # Vista principal con barra de controles
│   ├── version.js                  # Version de la app para el sistema de actualizacion
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Sistema de Actualizacion PWA

La aplicación implementa un sistema de doble cobertura para notificar a los usuarios cuando hay una nueva versión disponible:

**Cobertura 1 - Service Worker**: Tras cada despliegue en Vercel, el Service Worker detecta el nuevo bundle y muestra el banner en un máximo de 60 segundos para los usuarios con la app abierta. Los usuarios que abran la app de cero lo verán al instante.

**Cobertura 2 - Control de versión**: El archivo `src/version.js` contiene la versión actual de la app. Si la versión almacenada en el navegador del usuario no coincide con la actual, el banner de actualización se muestra inmediatamente al cargar, independientemente del estado del Service Worker.

Para forzar una notificación universal en el próximo despliegue, basta con incrementar el número de versión en `src/version.js` antes de hacer el commit.

## Casos de Uso

- **Conductores diarios**: Ahorra dinero encontrando las gasolineras más económicas en tu radio habitual
- **Empresas de transporte**: Optimiza los costes de combustible filtrando por tipo de carburante y distancia
- **Viajeros**: Planifica paradas estratégicas en carretera

## Como funciona

1. La aplicación solicita permisos de geolocalización al usuario
2. Consume la API pública del Ministerio para la Transición Ecológica y el Reto Demográfico
3. Calcula distancias usando la fórmula de Haversine
4. Filtra y ordena gasolineras por precio (Gasolina 95, Gasolina 98 y Gasóleo A) o por cercanía
5. Muestra resultados con precio, dirección, distancia y comparativa provincial

## Características Técnicas

### Optimizaciones de Rendimiento

- Cálculo de distancias en cliente (sin llamadas innecesarias a APIs externas)
- Cache de resultados de geolocalización
- Lazy loading de componentes
- Service Worker con control de versión para actualizaciones precisas

### SEO

- Meta tags optimizadas para redes sociales (Open Graph)
- Sitemap.xml generado
- Structured data (JSON-LD)
- Robots.txt configurado

### PWA

- Instalable en Android, iOS, Windows y macOS
- Banner de instalación adaptado a la plataforma del usuario
- Banner de actualización con doble mecanismo de detección (SW + versión)
- Service Worker con registro de tipo `prompt` para control total por parte del usuario

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Autor

**José Manuel Campos**

- Portfolio: [jcampos-dev.vercel.app](https://jcampos-dev.vercel.app)
- LinkedIn: [José Manuel Campos](https://www.linkedin.com/in/tu-perfil)
- GitHub: [@JMCG84](https://github.com/JMCG84)

## Agradecimientos

- Datos proporcionados por el [Ministerio para la Transición Ecológica y el Reto Demográfico](https://www.miteco.gob.es/)
- Iconos de [Lucide Icons](https://lucide.dev/)
- Hosting por [Vercel](https://vercel.com)

---

**Desarrollado en Sevilla, España**

