const neo4j = require('neo4j-driver');

const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'trippola';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const apiGet = require('./api');
const cities = require('./cities');

const radius = 1000; // radius for searching travel attractions

const runQuery = (query, params = {}) => new Promise(async (resolve, reject) => {
    const session = driver.session(); // <<-- session is only visible inside the promise

    session.run(query, params).then((result) => {
        session.close();
        resolve(result);
    }).catch((error) => {
        session.close();
        reject(error);
    });
});

// Print details of a particulat tourist attraction
function saveAttraction(item) {
    const query = 'CREATE (a:Attraction {name: $name, category: $categories}) RETURN a';
    const params = {name: item.name, categories: item.kinds};

    const request = runQuery(query, params);

    request.then(() => {
        console.log('Attraction node created: ', item.name);
    });
}

// Fetch travel attractions for a city with given latitude and longitude within 1000 m
function getListOfAttractions(lon, lat) {
    apiGet(
        "radius",
        `radius=${radius}&lon=${lon}&lat=${lat}&rate=2&format=json`
    ).then(function (data) {
        if (!data.error) {
            data.forEach(item => saveAttraction(item));
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

        console.log('Number of travel attractions: ', count);

        // Get list of travel attractions for specified latitude and longitude
        getListOfAttractions(lon, lat);
    });
}

// Search for a particular city in the api
function searchLocation(city) {
    apiGet("geoname", "name=" + city).then(function (data) {
        if (data.status === "OK") {
            const query = 'CREATE (a:City {name: $name, country: $country}) RETURN a';
            const params = {name: data.name, country: data.country};

            const request = runQuery(query, params);

            request.then(() => {
                console.log('City node created: ', data.name);

                const lon = data.lon;
                const lat = data.lat;
                getAttractions(lon, lat);
            });
        }
    });
}

function createGraph () {
    cities.forEach(city => {
        searchLocation(city)
    })
}

createGraph();

driver.close();

