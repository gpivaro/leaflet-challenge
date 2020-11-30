/* Date.prototype.toLocaleDateString()
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
options.timeZone = 'UTC';


//  United States Geological Survey (USGS) All Earthquakes from the Past 7 Days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then((data) => {

    // Store the imported data to a variable
    var EarthquakesData = data;


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

    // Return data on JSON format to mimic and API endpoint
    // console.log(JSON.stringify(cleanData, null, 2));
    var myJSON = JSON.stringify(cleanData, null, 2);
    document.getElementById("jsonData").textContent = myJSON;

});