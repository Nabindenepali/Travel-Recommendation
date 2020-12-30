const apiGet = require('./api');

const cities = require('./cities');

const radius = 1000; // radius for searching travel attractions

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Print details of a particulat tourist attraction
function printDetails(item) {
    console.log('Name:', item.name);
    console.log('Categories:', item.kinds);
}

// Fetch travel attractions for a city with given latitude and longitude within 1000 m
async function getListOfAttractions(lon, lat) {
    await sleep(2000);

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
async function getAttractions(lon, lat) {
    await sleep(2000);

    apiGet(
        "radius",
        `radius=${radius}&lon=${lon}&lat=${lat}&rate=2&format=count`
    ).then(function (data) {
        console.log(data);
        const count = data.count; // Count of travel attractions in a city

        console.log('Number of travel attractions:', count);

        // Get list of travel attractions for specified latitude and longitude
        getListOfAttractions(lon, lat);
    });
}

// Search for a particular city in the api
async function searchLocation(city) {
    await sleep(2000);

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

cities.forEach(city => {
    searchLocation(city);
});

