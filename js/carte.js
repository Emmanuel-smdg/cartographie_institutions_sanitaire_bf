var map = L.map("map").fitBounds([
  [15.083, -5.478], // Nord-Ouest du Burkina Faso
  [9.391, 2.406], // Sud-Est du Burkina Faso
]);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map); //Affiche la carte

const regionbfLayer = L.geoJSON(regionbf, {
  style(feature) {
    return {
      color: "#00008B", // Couleur des bordures
      weight: 2, // Épaisseur des bordures
      opacity: 1,
      fillOpacity: 0,
    };
  },
}).addTo(map);

/* // Ajout des hôpitaux avec les marqueurs.
var hopitaux = [
  {
    name: "Centre Hospitalier Universitaire Yalgado",
    coords: [12.380529, -1.524788],
  },
  { name: "Hôpital de District de Bogodogo", coords: [12.326179, -1.498797] },
  {
    name: "Hôpital Pédiatrique Charles de Gaulle",
    coords: [12.374176, -1.533103],
  },
  { name: "Centre Médical Saint Camille", coords: [12.35898, -1.523635] },
  { name: "Hôpital National Blaise Compaoré", coords: [12.343456, -1.495722] },
];

// Ajoute des marqueurs pour chaque hôpital
hopitaux.forEach(function (hopital) {
  L.marker(hopital.coords)
    .addTo(map)
    .bindPopup("<b>" + hopital.name + "</b>")
    .openPopup();
});
 */
