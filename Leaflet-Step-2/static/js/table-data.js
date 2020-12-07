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

    var index = 0;
    // Insert a table
    d3.select("table")
        .selectAll("tr")
        .data(cleanData)
        .enter()
        .append("tr")
        .html(function (d) {
            return `<td>${index += 1}</td>
            <td>${d["time"]}</td>
            <td><a href="${d["url"]}" target="_blank">${d["title"]}</a></td>
            <td>${Math.round(d["mag"] * 100) / 100}</td>
            <td>${Math.round(d["lat"] * 100) / 100}</td>
            <td>${Math.round(d["lon"] * 100) / 100}</td>
            <td>${Math.round(d["depth"])}</td>`;
        });


});