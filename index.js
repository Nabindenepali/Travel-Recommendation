const neo4j = require('neo4j-driver');

const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'trippola';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const apiGet = require('./api');
const cities = require('./cities');

const radius = 1000; // radius for searching travel attractions

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

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

// Save a tourist attraction and create relationship between city and attraction node
function saveAttraction(city, item) {
    const query = 'CREATE (a:Attraction {name: $name}) RETURN a';
    const params = {name: item.name};

    const request = runQuery(query, params);

    request.then(() => {
        console.log('Attraction node created: ', item.name);

        const query = "MATCH (a:City),(b:Attraction) WHERE a.name = \"" + city + "\" AND b.name = \"" + item.name + "\"\n" +
            "CREATE (a)-[r:HAS_LOCATION]->(b)" + "\n" +
            "RETURN type(r)";

        const request = runQuery(query);

        request.then(() => {
            console.log('Relationship created between city and attraction');
        });


        item.kinds.split(',').forEach(function (kind) {
            const query = 'MERGE (a:Category {name: $name}) RETURN a';
            const params = {name: kind};

            const request = runQuery(query, params);

            request.then(() => {
                console.log('Category node created: ', kind);

                const query = "MATCH (a:Attraction),(b:Category) WHERE a.name = \"" + item.name + "\" AND b.name = \"" + kind + "\"\n" +
                    "CREATE (a)-[r:INSTANCE_OF]->(b)" + "\n" +
                    "RETURN type(r)";

                const request = runQuery(query);

                request.then(() => {
                    console.log('Relationship created between attraction and category');
                });
            });
        });
    });
}

// Fetch travel attractions for a city with given latitude and longitude within 1000 m
async function getListOfAttractions(city, lon, lat) {
    await sleep(2000);

    apiGet(
        "radius",
        `radius=${radius}&lon=${lon}&lat=${lat}&rate=1&format=json`
    ).then(function (data) {
        if (!data.error) {
            data.forEach(item => saveAttraction(city, item));
        } else {
            console.log('Error:', data.error);
        }
    });
}

// Fetch the count of travel attractions for a city with given latitude and longitude within 1000 m
// and iteratively get the list of attractions in batches
async function getAttractions(city, lon, lat) {
    await sleep(2000);

    apiGet(
        "radius",
        `radius=${radius}&lon=${lon}&lat=${lat}&rate=1&format=count`
    ).then(function (data) {
        const count = data.count; // Count of travel attractions in a city

        console.log('Number of travel attractions: ', count);

        // Get list of travel attractions for specified latitude and longitude
        getListOfAttractions(city, lon, lat);
    });
}

// Search for a particular city in the api
async function searchLocation(city) {
    await sleep(2000);

    apiGet("geoname", "name=" + city).then(function (data) {
        if (data.status === "OK") {
            const query = 'CREATE (a:City {name: $name, country: $country}) RETURN a';
            const params = {name: city, country: data.country};

            const request = runQuery(query, params);

            request.then(() => {
                console.log('City node created: ', city);

                const lon = data.lon;
                const lat = data.lat;
                getAttractions(city, lon, lat);
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

