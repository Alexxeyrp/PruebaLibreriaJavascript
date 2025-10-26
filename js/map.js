var map = L.map("map").setView([40.3491648, -3.5290726], -10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([40.3491648, -3.5290726])
  .addTo(map)
  .bindPopup(
    "CODE TECH<br> Calle Ana Maria Matute 18, rivas-vaciamadrid 28522<br>Tel: 632102853"
  )
  .openPopup();

L.Routing.control({
  waypoints: [L.latLng(40.3491648, -3.5290726), L.latLng(40.42063, -3.55344)],
  routeWhileDragging: true,
  geocoder: L.Control.Geocoder.nominatim(),
}).addTo(map);

map.whenReady(() => {
  map.panBy([0, 0]);
});
