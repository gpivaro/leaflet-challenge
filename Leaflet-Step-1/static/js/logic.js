
//  United States Geological Survey (USGS) All Earthquakes from the Past 7 Days
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then((data) => {

    // Store the imported data to a variable
    var EarthquakesData = data;

    // Print the data
    console.log(EarthquakesData);
    // Print the object keys
    console.log(Object.keys(EarthquakesData));

});