/* Date.prototype.toLocaleDateString()
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
options.timeZone = 'UTC';

var geojsonMarkerOptions = {
    // fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var myStyle = {
    "color": "#ff7800",
    "weight": 2,
};


//  United States Geological Survey (USGS) All Earthquakes from the Past 7 Days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
    // Give each feature a popup describing the place and time of the earthquake
    return layer.bindPopup(`<h6 style="font-weight: bold;">${feature.properties.title}</h6> <hr> 
             <p>Date: ${new Date(feature.properties.time).toLocaleTimeString("en-US", options)} (UTC)</p> 
             <p>Magnitude: ${feature.properties.mag} ml</p>
             <p>Depth: ${feature.geometry.coordinates[2]} km</p>
             <a href="${feature.properties.url}" target="_blank">More details...</a>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes, tectonicPlates) {

    // To use OpenStreetMap instead of MapBox
    var attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";
    var titleUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var OpenStreetTiles = L.tileLayer(titleUrl, { attribution });
    
    // To use OpenStreetMap Stadia tile layer
    var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });


//     // Define streetmap layer
//     var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "streets-v11",
//         accessToken: API_KEY
//     });

//     // Define darkmap layer
//     var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "dark-v10",
//         accessToken: API_KEY
//     });

//     // Define lightmap layer
//     var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "light-v10",
//         accessToken: API_KEY
//     });

//     // Define satellite layer
//     var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//         maxZoom: 18,
//         id: "satellite-v9",
//         accessToken: API_KEY
//     });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
//         "Streets": streetmap,
        "Dark": Stadia_AlidadeSmoothDark,
        "Grayscale": Stadia_AlidadeSmooth,
//         "Satellite": satellite,
        "OpenStreet": OpenStreetTiles
    };

    earthquakesLayer = L.layerGroup(earthquakes);
    tectonicPlatesLayer = L.layerGroup(tectonicPlates);

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [10, 0],
        zoom: 2,
        fullscreenControl: true,
        layers: [Stadia_AlidadeSmoothDark, earthquakes, tectonicPlates]
    });

    // Create a legend
    var myColors = ["#80ff00", "#bfff00", "#ffff00", "#ffbf00", "#ff8000", "#ff4000"];
    // https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ["<div style='background-color: lightgray'><strong>&nbsp&nbspDepth (km)&nbsp&nbsp</strong></div>"];
        categories = ['-10-10', ' 10-30', ' 30-50', ' 50-70', ' 70-90', '+90'];
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                labels.push(
                    '<li class="circle" style="background-color:' + myColors[i] + '">' + categories[i] + '</li> '
                );
        }
        div.innerHTML = '<ul style="list-style-type:none; text-align: center">' + labels.join('') + '</ul>'
        return div;
    };
    legend.addTo(myMap);

    // Adding a Scale to a map
    L.control.scale()
        .addTo(myMap);

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

}



// Data Loading in D3: https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js
// Promises chaining https://javascript.info/promise-chaining
// Using GeoJSON with Leaflet https://leafletjs.com/examples/geojson/
url_tectonics = 'https://raw.githubusercontent.com/gpivaro/leaflet-challenge/main/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json'
// d3.json("/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json").then((tectonicPlatesData) => {
d3.json(url_tectonics).then((tectonicPlatesData) => {
    return tectonicPlatesData
}).then(
    function (tectonicPlatesData) {
        d3.json(url).then((EarthquakesData) => {
            console.log(EarthquakesData);
            console.log(tectonicPlatesData);
            createMap(
                L.geoJSON(EarthquakesData, {
                    onEachFeature: addPopup,
                    // pointToLayer option to create a CircleMarker:
                    pointToLayer: function (feature, latlng) {
                        // console.log(latlng.alt);
                        geojsonMarkerOptions.radius = feature.properties.mag * 5;
                        var depth = latlng.alt;
                        if (depth < 10) {
                            geojsonMarkerOptions.fillColor = "#80ff00";
                        }
                        else if (depth < 30) {
                            geojsonMarkerOptions.fillColor = "#bfff00";
                        }
                        else if (depth < 50) {
                            geojsonMarkerOptions.fillColor = "#ffff00";
                        }
                        else if (depth < 70) {
                            geojsonMarkerOptions.fillColor = "#ffbf00";
                        }
                        else if (depth < 90) {
                            geojsonMarkerOptions.fillColor = "#ff8000";
                        }
                        else {
                            geojsonMarkerOptions.fillColor = "#ff4000";
                        }
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                }),
                L.geoJSON(tectonicPlatesData, {
                    style: myStyle
                })
            );
        });
    }
);

