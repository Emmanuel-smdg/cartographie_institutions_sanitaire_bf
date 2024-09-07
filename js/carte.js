// Centrer la carte sur le Burkina.
var map = L.map("map").fitBounds([
  [15.083, -5.478], // Nord-Ouest du Burkina Faso
  [9.391, 2.406], // Sud-Est du Burkina Faso
]);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map); //Affiche la carte

// Ce layer est mis pour permettre de mieux voir les contours du pays et de ses régions dans la carte.
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

var chuIcon = L.icon({
  iconUrl: "lib/images/chu.png", // Chemin vers ton icône
  iconSize: [32, 32], // Taille de l'icône
  iconAnchor: [16, 32], // Point d'ancrage de l'icône (centre bas)
  popupAnchor: [0, -32], // Point d'ancrage pour le popup (au-dessus de l'icône)
});

// Fonction pour ajouter des points à partir du GeoJSON
L.geoJSON(chu, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: chuIcon });
  },
  onEachFeature: function (feature, layer) {
    // Contenu du popup avec les informations de l'hôpital
    var popupContent =
      "<b>" +
      feature.properties.nom +
      "</b><br>" +
      "Localité: " +
      feature.properties.localité +
      "<br>" +
      "Rubrique: " +
      feature.properties.rubrique +
      "<br>" +
      "Catégorie: " +
      feature.properties.catégorie +
      "<br>" +
      "Téléphone: " +
      feature.properties.téléphone +
      "<br>" +
      "Email: " +
      feature.properties.email +
      "<br>" +
      "Adresse: " +
      feature.properties.adresse;
    layer.bindPopup(popupContent);
  },
}).addTo(map);
