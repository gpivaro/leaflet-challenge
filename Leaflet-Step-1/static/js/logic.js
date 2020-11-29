
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


});