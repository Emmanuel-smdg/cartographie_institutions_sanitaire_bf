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

// Fonction pour créer les icones personnalisées
function createCustomIcon(
  iconUrl,
  iconSize = [32, 32],
  iconAnchor = [16, 32],
  popupAnchor = [0, -32]
) {
  return L.icon({
    iconUrl: iconUrl, // Chemin vers l'image de l'icône
    iconSize: iconSize, // Taille de l'icône [width, height]
    iconAnchor: iconAnchor, // Point d'ancrage [x, y]
    popupAnchor: popupAnchor, // Ancrage du popup [x, y]
  });
}
// Création des icônes personnalisées pour les CHR et CHU
let chrIcon = createCustomIcon("lib/images/chr.png");
let chuIcon = createCustomIcon("lib/images/chu.png");
let labIcon = createCustomIcon("lib/images/laboratoire.png");
let depotIcon = createCustomIcon("lib/images/trousse.png");
let hopitalIcon = createCustomIcon("lib/images/hopital.png");
let clininqueIcon = createCustomIcon("lib/images/clinique.png");

// Fonction pour créer un GeoJSON Layer en fonction du type et de l'icône
function createLayer(data, icon) {
  return L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: icon });
    },
    onEachFeature: function (feature, layer) {
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
}

// Couches pour les CHR et CHU
let chrLayer = createLayer(chr, chrIcon);
let chuLayer = createLayer(chu, chuIcon);
let labLayer = createLayer(lab, labIcon);
let depotLayer = createLayer(depot, depotIcon);
let hopitalLayer = createLayer(hopital, hopitalIcon);
let cliniqueLayer = createLayer(clinique, clininqueIcon);

// Ajout des couches de filtrage
let overlayMaps = {
  "CHU (Centres Hospitaliers Universitaires)": chuLayer,
  "CHR (Centres Hospitaliers Régionaux)": chrLayer,
  "Laboratoires d'analyses médicales": labLayer,
  "Dépôts pharmaceutique": depotLayer,
  Hopitaux: hopitalLayer,
  Clinique: cliniqueLayer,
};

// Ajout du contrôle de couches
L.control.layers(null, overlayMaps).addTo(map);

// Afficher les deux couches par défaut
chrLayer.addTo(map);
chuLayer.addTo(map);
labLayer.addTo(map);
depotLayer.addTo(map);
hopitalLayer.addTo(map);
cliniqueLayer.addTo(map);

// Ajout de la recherche sur la carte
let searchControl = new L.Control.Search({
  layer: L.layerGroup([
    chrLayer,
    chuLayer,
    labLayer,
    depotLayer,
    hopitalLayer,
    cliniqueLayer,
  ]),
  propertyName: "nom", // Recherche par le nom des hôpitaux
  marker: false,
  initial: false,
  moveToLocation: function (latlng, title, map) {
    // Centrer la carte sur l'élément recherché
    map.setView(latlng, 15); // Zoom sur l'élément recherché
  },
}).addTo(map);

// Ajout d'une légende personnalisée
let legend = L.control({ position: "bottomleft" });

legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "info legend"),
    labels = ["<strong>Types d'Hôpitaux</strong>"],
    categories = ["CHU", "CHR", "LABO", "DEPOT", "HOPITAL", "CLINIQUE"];

  let icons = {
    CHU: "lib/images/chu.png",
    CHR: "lib/images/chr.png",
    LABO: "lib/images/laboratoire.png",
    DEPOT: "lib/images/trousse.png",
    HOPITAL: "lib/images/hopital.png",
    CLINIQUE: "lib/images/clinique.png",
  };

  categories.forEach(function (category) {
    div.innerHTML += labels.push(
      '<img src="' +
        icons[category] +
        '" style="width:24px;height:24px;"> ' +
        category
    );
  });

  div.innerHTML = labels.join("<br>");
  return div;
};

legend.addTo(map);
