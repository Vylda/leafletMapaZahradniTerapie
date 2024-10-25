const { latLng, map: leafletMap, marker, tileLayer } = L;
const map = leafletMap('map')
  .setView([49, 16], 13)

tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
)
  .addTo(map);

const loadData = async (map) => {
  const response = await fetch('./data.json');

  if (!response.ok) {
    throw new Error('Failed to load data');
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }

  const hasValidData = data.every(({ lat, lon, name }) => !!lat && !!lon && !!name);
  if (!hasValidData) {
    throw new Error('Data is invalid');
  }

  const bounds = data.map(({ lat, lon, name }) => {
    const center = latLng(lat, lon);
    marker(center)
      .addTo(map)
      .bindPopup(name);
    return center;
  });

  map.fitBounds(bounds);
};

loadData(map);
