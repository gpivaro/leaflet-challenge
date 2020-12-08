/* Date.prototype.toLocaleDateString()
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
options.timeZone = 'UTC';


// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
    // Give each feature a popup describing the place and time of the earthquake
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes, tectonicPlates) {

    // To use OpenStreetMap instead of MapBox
    var attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    var titleUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var OpenStreetTiles = L.tileLayer(titleUrl, { attribution });


    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        maxZoom: 18,
        id: "streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Streets": streetmap,
        "Dark": darkmap,
        "Grayscale": lightmap,
        "Satellite": satellite,
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
        center: [0, 0],
        zoom: 2,
        layers: [satellite, tectonicPlates]

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
        collapsed: false
    }).addTo(myMap);






}


//  United States Geological Survey (USGS) All Earthquakes from the Past 7 Days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// d3.json(url).then((data) => {

//     // Store the imported data to a variable
//     var EarthquakesData = data;
//     // Print the data
//     // console.log(EarthquakesData);

//     // Print the object keys
//     // console.log(Object.keys(EarthquakesData));

//     // Get the date that the data was generated
//     var dataDate = new Date(EarthquakesData.metadata.generated);
//     // console.log(`Data retrieved at: ${dataDate}`);

//     // // Number of data points on the data set
//     // console.log(`Number of records: ${EarthquakesData.metadata.count}`);
//     // // Earthquakes magnitude
//     // console.log(EarthquakesData.features[0].properties.mag);
//     // // Earthquakes time
//     // console.log(new Date(EarthquakesData.features[0].properties.time));
//     // // Earthquakes lat
//     // console.log(EarthquakesData.features[0].geometry.coordinates[0]);
//     // // Earthquakes lon
//     // console.log(EarthquakesData.features[0].geometry.coordinates[1]);
//     // // Earthquakes depth
//     // console.log(EarthquakesData.features[0].geometry.coordinates[2]);


//     // Create a object list with the target data columns
//     var cleanData = [];
//     for (var i = 0; i < EarthquakesData.features.length; i++) {
//         var time = new Date(EarthquakesData.features[i].properties.time);
//         cleanData.push({
//             "time": time.toLocaleTimeString("en-US", options),
//             "title": EarthquakesData.features[i].properties.title,
//             "url": EarthquakesData.features[i].properties.url,
//             "lat": EarthquakesData.features[i].geometry.coordinates[0],
//             "lon": EarthquakesData.features[i].geometry.coordinates[1],
//             "mag": EarthquakesData.features[i].properties.mag,
//             "depth": EarthquakesData.features[i].geometry.coordinates[2]
//         });
//     };
//     // console.log(cleanData);

//     // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
//     // then, send the layer to the createMap() function.
//     var earthquakes = L.geoJSON(data.features, {
//         // onEachFeature: addPopup
//     });

//     // console.log(earthquakes);


//     // Data on tectonic plates
//     var states = [{
//         "type": "Feature",
//         "properties": { "party": "Republican" },
//         "geometry": {
//             "type": "Polygon",
//             "coordinates": [[
//                 [-104.05, 48.99],
//                 [-97.22, 48.98],
//                 [-96.58, 45.94],
//                 [-104.03, 45.94],
//                 [-104.05, 48.99]
//             ]]
//         }
//     }, {
//         "type": "Feature",
//         "properties": { "party": "Democrat" },
//         "geometry": {
//             "type": "Polygon",
//             "coordinates": [[
//                 [-109.05, 41.00],
//                 [-102.06, 40.99],
//                 [-102.03, 36.99],
//                 [-109.04, 36.99],
//                 [-109.05, 41.00]
//             ]]
//         }
//     }];

//     var tectonicPlates = L.geoJSON(states, {
//         style: function (feature) {
//             switch (feature.properties.party) {
//                 case 'Republican': return { color: "#ff0000" };
//                 case 'Democrat': return { color: "#0000ff" };
//             }
//         }
//     });

//     // var tectonicPlatesNew = d3.json('/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json', function (data) {

//     //     return data

//     // });

//     // console.log(tectonicPlatesNew);

//     // Call the function to load the map and the circles
//     createMap(earthquakes, cleanData, tectonicPlates);

// })

// .then(
// d3.json('/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json', function (newdata) {
//     console.log(newdata);
// })

// console.log('----------------------------');
// // Store the imported data to a variable
// var tectonicPlatesNew = data;
// console.log(tectonicPlatesNew);
// console.log('----------------------------');
// );

// 

// d3.json("/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json").then((data) => {
//     console.log(data);
// })
// d3.json(url).then((data) => {

//     console.log(data);
// });


// d3.json("/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json").then((data) => {
//     console.log(data);
// }).then(
//     d3.json(url).then((data) => {

//         console.log(data);

//     }));

d3.json("/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json").then((tectonicPlatesData) => {
    return tectonicPlatesData
}).then(
    function (tectonicPlatesData) {
        d3.json(url).then((EarthquakesData) => {
            console.log(EarthquakesData);
            console.log(tectonicPlatesData);
            createMap(L.geoJSON(EarthquakesData), L.geoJSON(tectonicPlatesData));
        });
    }
);