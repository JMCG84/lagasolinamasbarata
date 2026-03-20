# La Gasolinera Mas Barata

## Descripcion del Proyecto
"La Gasolinera Mas Barata" es una Single Page Application (SPA) desarrollada con Vue 3 y Vite. El objetivo principal de la aplicacion es asistir a los usuarios en la busqueda de las estaciones de servicio mas economicas dentro de un radio de 20 kilometros desde su ubicacion actual, promoviendo asi el ahorro de modo intuitivo.

Este proyecto ha sido elaborado por Jose Manuel Campos con la ayuda de Inteligencia Artificial (IA), poniendo en practica los conocimientos y habilidades aprendidos en cursos avanzados de desarrollo de software con IA.

## Flujo de la Aplicacion
El funcionamiento interno de la aplicacion consta de las siguientes etapas principales:

1. Geolocalizacion: Al entrar en la plataforma, el sistema solicita acceso a las coordenadas GPS del navegador del usuario.
2. Sincronizacion de Precios: Se ejecuta una consulta asincrona hacia la API REST oficial en tiempo real del Ministerio para la Transicion Ecologica. Esta peticion esta protegida por un sistema de proxy proxy-fallback para eludir potenciales problemas de CORS.
3. Calculo Vectorial: Mediante algoritmos matematicos en su aplicacion cliente, especificamente a traves de la Formula de Haversine, la aplicacion procesa un gran volumen de datos y descarta aquellas gasolineras ubicadas a mas de 20 kilometros en base a la distancia esferica de la tierra.
4. Identidad Visual: Un utilitario se encarga de procesar las cadenas de texto correspondientes al nombre de cada estacion para asignar y pintar vectores graficos (SVG) que representan el logotipo de la marca correspondiente (ej. Repsol, BP, Cepsa).
5. Interaccion de Usuario: Los usuarios interactuan con una **barra de controles unificada** de alta usabilidad que permite el filtrado instantaneo por radio (20km/50km), tipo de carburante y cercania.
6. Herramientas de Ahorro: Incluye una **calculadora de consumo** en tiempo real y un panel de **promociones y ofertas** vigentes de las principales redes de estaciones (Repsol, Cepsa, etc.).

## Despliegue
Al tratarse de un cliente ligero que externaliza sus llamadas al servidor ministerial, la aplicacion utiliza el patron estatico proporcionado por el compilador 'Vite'.

El flujo de integracion y despliegue continuo (CI/CD) ha sido configurado en la plataforma en la nube Vercel. 
Por medio de esta prestacion, cada nuevo fragmento de codigo subido (push) a la rama 'main' del repositorio de GitHub desencadena una construccion automatica que actualiza inmediatamente la version alojada para produccion.

## Tecnologias Utilizadas
- Vue 3
- Vite
- Routing Inteligente
- Vanilla CSS enfocado a estandar moderno (Dark Mode y Glassmorphism)
- **Personalizacion Tematica**: Iconografía dinamica con colores diferenciados en Modo Claro (Surtidor Rojo, Calculadora Gris, Estrella Amarilla).
- Fetch API y Geolocalizacion HTML5
