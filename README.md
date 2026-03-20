# La Gasolinera Más Barata

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://lagasolinamasbarata.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> Encuentra las gasolineras más baratas cerca de ti en tiempo real con datos oficiales del Ministerio de Industria de España.

![Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Screenshot+del+proyecto)

## Características

- **Geolocalización automática** - Detecta tu ubicación y busca gasolineras en un radio de 20 km
- **Precios en tiempo real** - Datos actualizados del Ministerio de Industria
- **Rendimiento optimizado** - Cálculo eficiente de distancias usando fórmula de Haversine
- **Responsive design** - Funciona perfectamente en móvil, tablet y desktop
- **Sin anuncios ni tracking** - 100% gratis y respetuoso con tu privacidad

## Stack Tecnológico

- **Frontend**: Vue 3 (Composition API)
- **Lenguaje**: TypeScript / JavaScript ES6+
- **Estilos**: CSS3 con variables custom
- **Build Tool**: Vite 7
- **Routing**: Vue Router 4
- **Deploy**: Vercel
- **Analytics**: Vercel Analytics

## Demo

[Ver aplicación en vivo](https://lagasolinamasbarata.vercel.app)\*\*

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
│   ├── router/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Casos de Uso

- **Conductores diarios**: Ahorra dinero encontrando las gasolineras más económicas
- **Empresas de transporte**: Optimiza rutas para reducir costes de combustible
- **Viajeros**: Planifica paradas estratégicas en carretera

## ¿Cómo funciona?

1. La aplicación solicita permisos de geolocalización al usuario
2. Consume la API pública del [Ministerio de Industria](https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/)
3. Calcula distancias usando la fórmula de Haversine
4. Filtra y ordena gasolineras por precio (Gasolina 95 y Gasóleo A)
5. Muestra resultados con precio, dirección y distancia

## Características Técnicas

### Optimizaciones de Rendimiento

- Cálculo de distancias en cliente (sin llamadas innecesarias a APIs)
- Caché de resultados de geolocalización
- Lazy loading de componentes

### SEO

- Meta tags optimizadas para redes sociales (Open Graph)
- Sitemap.xml generado
- Structured data (JSON-LD)
- Robots.txt configurado

## Contribuciones

Las contribuciones son bienvenidas! Si tienes ideas para mejorar el proyecto:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Autor

**José Manuel Campos**

- Portfolio: [jcampos-dev.vercel.app](https://jcampos-dev.vercel.app)
- LinkedIn: [José Manuel Campos](https://www.linkedin.com/in/tu-perfil)
- GitHub: [@JMCG84](https://github.com/JMCG84)

## Agradecimientos

- Datos proporcionados por el [Ministerio de Industria, Comercio y Turismo](https://www.mincotur.gob.es/)
- Iconos de [Lucide Icons](https://lucide.dev/)
- Hosting por [Vercel](https://vercel.com)

---

**Si este proyecto te resultó útil, considera darle una estrella en GitHub!**

---

**Desarrollado en Sevilla, España**
