const apiGet = require('./api.js');

const radius = 1000; // radius for searching travel attractions

// Print details of a particulat tourist attraction
function printDetails(item) {
    console.log('Name:', item.name);
    console.log('Categories:', item.kinds);
}

// Fetch travel attractions for a city with given latitude and longitude within 1000 m
function getListOfAttractions(lon, lat) {
    apiGet(
        "radius",
        `radius=${radius}&lon=${lon}&lat=${lat}&rate=2&format=json`
    ).then(function (data) {
        if (!data.error) {
            data.forEach(item => printDetails(item));
        } else {
            console.log('Error:', data.error);
        }
    });
}

// Fetch the count of travel attractions for a city with given latitude and longitude within 1000 m
// and iteratively get the list of attractions in batches
function getAttractions(lon, lat) {
    apiGet(
        "radius",
        `radius=${radius}&lon=${lon}&lat=${lat}&rate=2&format=count`
    ).then(function (data) {
        const count = data.count; // Count of travel attractions in a city

        console.log('Number of travel attractions:', count);

        // Get list of travel attractions for specified latitude and longitude
        getListOfAttractions(lon, lat);
    });
}

// Search for a particular city in the api
function searchLocation(city) {
    apiGet("geoname", "name=" + city).then(function (data) {
        if (data.status === "OK") {
            console.log('Name:', data.name);
            console.log('Country:', data.country);
            const lon = data.lon;
            const lat = data.lat;
            getAttractions(lon, lat);
        }

    });
}

let city = 'London';

searchLocation(city);
