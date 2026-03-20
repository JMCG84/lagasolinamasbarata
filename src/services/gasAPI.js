const API_URL = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

// Fallback proxy in case of CORS
const PROXY_URL = "https://api.allorigins.win/raw?url=";

export async function fetchGasStations() {
  try {
    let response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    let data = await response.json();
    return formatData(data.ListaEESSPrecio);
  } catch (error) {
    console.warn("Direct fetch failed, attempting proxy...", error);
    try {
      let proxyResponse = await fetch(PROXY_URL + encodeURIComponent(API_URL));
      if (!proxyResponse.ok) throw new Error("Proxy response failed");
      let proxyData = await proxyResponse.json();
      return formatData(proxyData.ListaEESSPrecio);
    } catch (proxyError) {
      console.error("Failed to fetch gas stations from API and Proxy:", proxyError);
      throw proxyError;
    }
  }
}

function formatData(stations) {
  return stations.map(station => {
    // Parse lat and lon that come with commas instead of dots
    const lat = parseFloat(station['Latitud'].replace(',', '.'));
    const lon = parseFloat(station['Longitud (WGS84)'].replace(',', '.'));
    
    // Parse prices
    const price95 = parsePrice(station['Precio Gasolina 95 E5']);
    const price98 = parsePrice(station['Precio Gasolina 98 E5']);
    const priceDiesel = parsePrice(station['Precio Gasoleo A']);

    return {
      id: station['IDEESS'],
      name: station['Rótulo'],
      address: station['Dirección'],
      municipality: station['Municipio'],
      province: station['Provincia'],
      hours: station['Horario'],
      lat,
      lon,
      price95,
      price98,
      priceDiesel,
      margin: station['Margen'],
      isRestricted: (station['Tipo Venta'] === 'R')
    };
  }).filter(station => !isNaN(station.lat) && !isNaN(station.lon));
}

function parsePrice(priceStr) {
  if (!priceStr) return null;
  const parsed = parseFloat(priceStr.replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}
