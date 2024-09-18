let map = L.map("map").setView([12.0, -1.0], 12); 

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map); 

function createCustomIcon(iconUrl, iconSize = [24, 24], iconAnchor = [12, 24], popupAnchor = [0, -24]) {
  return L.icon({
    iconUrl: iconUrl,
    iconSize: iconSize,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
  });
}

let icons = {
  "CHU": createCustomIcon("lib/images/chu.png"),
  "CHR": createCustomIcon("lib/images/chr.png"),
  "Laboratoire": createCustomIcon("lib/images/laboratoire.png"),
  "Dépôt": createCustomIcon("lib/images/trousse.png"),
  "Hôpital": createCustomIcon("lib/images/hopital.png"),
  "Clinique": createCustomIcon("lib/images/clinique.png"),
  "CMA": createCustomIcon("lib/images/cma.png"),
  "CSPS": createCustomIcon("lib/images/csps.png"),
};

function createLayer(data, icon) {
  return L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: icon });
    },
    onEachFeature: function (feature, layer) {
      let popupContent = `<div class='popup-content mb-2'>
                            <h5>${feature.properties.nom}</h5>
                            Localité: ${feature.properties.localité}<br>
                            Catégorie: ${feature.properties.catégorie}<br>
                            Téléphone: ${feature.properties.téléphone}<br>
                            Email: ${feature.properties.email}<br>
                            Site Web: ${feature.properties.site_web}<br>
                            Adresse: ${feature.properties.adresse}
                          </div>`;
      layer.bindPopup(popupContent);
    },
  });
}

let layers = {
  "CHU": createLayer(chu, icons["CHU"]),
  "CHR": createLayer(chr, icons["CHR"]),
  "Laboratoire": createLayer(lab, icons["Laboratoire"]),
  "Dépôt": createLayer(depot, icons["Dépôt"]),
  "Hôpital": createLayer(hopital, icons["Hôpital"]),
  "Clinique": createLayer(clinique, icons["Clinique"]),
  "CMA": createLayer(cma, icons["CMA"]),
  "CSPS": createLayer(csps, icons["CSPS"]),
};

function setDefaultLayers() {
  layers["CHR"].addTo(map);
  layers["CMA"].addTo(map);
}

let overlayMaps = {};
Object.keys(layers).forEach(function (key) {
  overlayMaps[key] = layers[key];
});

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

setDefaultLayers(); 

let searchControl = new L.Control.Search({
  layer: L.layerGroup(Object.values(layers)),
  propertyName: "nom", 
  marker: false,
  initial: false,
  moveToLocation: function (latlng, title, map) {
    map.setView(latlng, 15); 
  },
}).addTo(map);

let routingControl;

function calculateRoute(start, end) {
  if
  (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
    router: L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
    }),
    lineOptions: {
      styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
    },
    createMarker: function () {
      return null;
    },
  }).addTo(map);

  routingControl.on("routesfound", function (e) {
    let routes = e.routes;
    let summary = routes[0].summary;
    let popupContent = `Distance: ${(summary.totalDistance / 1000).toFixed(2)} km<br>
                        Durée: ${Math.round(summary.totalTime / 60)} minutes`;
    L.popup().setLatLng(end).setContent(popupContent).openOn(map);
  });
}

map.on("popupopen", function (e) {
  let marker = e.popup._source;
  if (marker) {
    let popupContent = e.popup.getContent();
    let container = L.DomUtil.create("div", "");
    container.innerHTML = popupContent;

    let startBtn = L.DomUtil.create("button", "btn btn-info", container);
    startBtn.innerHTML = "Calculer l'itinéraire depuis ma position";
    startBtn.style.cursor = "pointer";

    L.DomEvent.on(startBtn, "click", function () {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          let start = { lat: position.coords.latitude, lng: position.coords.longitude };
          let end = marker.getLatLng();
          calculateRoute(start, end);
        });
      } else {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
      }
    });

    e.popup.setContent(container);
  }
});

L.Control.ClearRoute = L.Control.extend({
  onAdd: function (map) {
    let btn = L.DomUtil.create("button", "btn btn-secondary text-center mt-2");
    btn.innerHTML = "Effacer l'itinéraire";
    btn.onclick = function () {
      if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
      }
    };
    return btn;
  },
});

new L.Control.ClearRoute({ position: "topright" }).addTo(map);

let legend = L.control({ position: "bottomleft" });

legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "bg-light rounded p-1"),
    labels = ["<strong>Légende :</strong>"],
    categories = Object.keys(icons);

  categories.forEach(function (category) {
    div.innerHTML += `<img src="${icons[category].options.iconUrl}" style="width:24px;height:24px; margin-bottom:0.25rem"> ${category}<br>`;
  });

  return div;
};

legend.addTo(map);
