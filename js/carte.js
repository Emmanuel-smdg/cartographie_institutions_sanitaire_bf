// Centrer la carte sur le Burkina.
let map = L.map("map").fitBounds([
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

// Définitions des icones des différents objets :
//CHU
let chuIcon = L.icon({
  iconUrl: "lib/images/chu.png", // Chemin vers ton icône
  iconSize: [32, 32], // Taille de l'icône
  iconAnchor: [16, 32], // Point d'ancrage de l'icône (centre bas)
  popupAnchor: [0, -32], // Point d'ancrage pour le popup (au-dessus de l'icône)
});
//CHR
let chrIcon = L.icon({
  iconUrl: "lib/images/chr.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Fonction pour ajouter les CHU à partir du GeoJSON

let chuLayer = L.geoJSON(chu, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: chuIcon });
  },
  onEachFeature: function (feature, layer) {
    // Contenu du popup avec les informations de l'hôpital
    let popupContent =
      "<b>" +
      feature.properties.nom +
      "</b><br>" +
      "Localité: " +
      feature.properties.localité +
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
});

// Ajouter les CHR à partir des données GeoJSON
let chrLayer = L.geoJSON(chr, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: chrIcon });
  },
  onEachFeature: function (feature, layer) {
    // Contenu du popup avec les informations de l'hôpital
    let popupContent =
      "<b>" +
      feature.properties.nom +
      "</b><br>" +
      "Localité: " +
      feature.properties.localité +
      "<br>" +
      "Catégorie: " +
      feature.properties.catégorie +
      "<br>" +
      "Téléphone: " +
      feature.properties.téléphone +
      "<br>" +
      "Adresse: " +
      feature.properties.adresse;
    layer.bindPopup(popupContent);
  },
});

// Ajout des couches de filtrage
let overlayMaps = {
  "CHU (Centres Hospitaliers Universitaires)": chuLayer,
  "CHR (Centres Hospitaliers Régionaux)": chrLayer,
};

// Ajout du contrôle de couches
L.control.layers(null, overlayMaps).addTo(map);

// Afficher les deux couches par défaut
chrLayer.addTo(map);
chuLayer.addTo(map);
