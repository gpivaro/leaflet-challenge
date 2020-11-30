// // Create a map object
// var myMap = L.map("map", {
//     center: [37.09, -102.71],
//     zoom: 4.5
// });

// // Adding tile layer
// L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     maxZoom: 18,
//     id: "streets-v11",
//     accessToken: API_KEY
// }).addTo(myMap);



// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
    // Give each feature a popup describing the place and time of the earthquake
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes, data) {

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

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [38.09, -98.991],
        zoom: 4.5,
        layers: [darkmap]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create the circles for each data point
    data.forEach(function (element) {

        var color = "";

        if (element.depth < 10) {
            color = "#80ff00";
        }
        else if (element.depth < 30) {
            color = "#bfff00";
        }
        else if (element.depth < 50) {
            color = "#ffff00";
        }
        else if (element.depth < 70) {
            color = "#ffbf00";
        }
        else if (element.depth < 90) {
            color = "#ff8000";
        }
        else {
            color = "#ff4000";
        }


        // add circles to map
        L.circle([element.lon, element.lat], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: color,
            // Adjust radius
            radius: element.mag * 20000
        }).bindPopup(`<h3>Name: ${element.title}</h3> <hr> 
            <p>Date: ${element.time} (UTC)</p> 
            <p>Magnitude: ${element.mag} ml</p>
            <p>Depth: ${element.depth} km</p>
            <a href="${element.url}" target="_blank">More details...</a>`)
            .addTo(myMap);
    });


}

/* Date.prototype.toLocaleDateString()
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
options.timeZone = 'UTC';


//  United States Geological Survey (USGS) All Earthquakes from the Past 7 Days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then((data) => {

    // Store the imported data to a variable
    var EarthquakesData = data;
    // Print the data
    console.log(EarthquakesData);

    // Print the object keys
    console.log(Object.keys(EarthquakesData));

    // Get the date that the data was generated
    var dataDate = new Date(EarthquakesData.metadata.generated);
    console.log(`Data retrieved at: ${dataDate}`);

    // Number of data points on the data set
    console.log(`Number of records: ${EarthquakesData.metadata.count}`);

    // Earthquakes magnitude
    console.log(EarthquakesData.features[0].properties.mag);

    // Earthquakes time
    console.log(new Date(EarthquakesData.features[0].properties.time));

    // Earthquakes lat
    console.log(EarthquakesData.features[0].geometry.coordinates[0]);

    // Earthquakes lon
    console.log(EarthquakesData.features[0].geometry.coordinates[1]);

    // Earthquakes depth
    console.log(EarthquakesData.features[0].geometry.coordinates[2]);


    // Create a object list with the target data columns
    var cleanData = [];
    for (var i = 0; i < EarthquakesData.features.length; i++) {
        var time = new Date(EarthquakesData.features[i].properties.time);
        cleanData.push({
            "time": time.toLocaleTimeString("en-US", options),
            "title": EarthquakesData.features[i].properties.title,
            "url": EarthquakesData.features[i].properties.url,
            "lat": EarthquakesData.features[i].geometry.coordinates[0],
            "lon": EarthquakesData.features[i].geometry.coordinates[1],
            "mag": EarthquakesData.features[i].properties.mag,
            "depth": EarthquakesData.features[i].geometry.coordinates[2]
        });
    };

    console.log(cleanData);



    // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
    // then, send the layer to the createMap() function.
    var earthquakes = L.geoJSON(data.features, {
        onEachFeature: addPopup
    });

    createMap(earthquakes, cleanData);



});