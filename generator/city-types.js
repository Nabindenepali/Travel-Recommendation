const neo4j = require('neo4j-driver');

const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'trippola';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const cities = require('../cities');

const fs = require('fs');

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

const cityTypes = [];

// Retrieve a category of specific name from the list
function getCategory(categories, name) {
    return categories.find(category => category.category === name);
}

// Add the count for a particular category for a city
function addCategoryCount(category, cityIndex) {
    const city = cityTypes[cityIndex];
    const categoryCount = getCategory(city.categories, category);
    if (categoryCount) {
        categoryCount.count += 1;
    } else {
        city.categories.push({
            category: category,
            count: 1
        })
    }
}

// Retrieve all the categories for a particular attraction
const getAllCategories = (attraction, cityIndex) => new Promise(async (resolve, reject) => {
    const query = "MATCH (:Attraction {name: $attraction})-[:INSTANCE_OF]->(category) RETURN category.name";
    const params = {attraction: attraction};

    const request = runQuery(query, params);

    request.then(result => {
        result.records.forEach(function (record) {
            const category = record._fields[0];
            addCategoryCount(category, cityIndex);
        });
        resolve();
    }, () => {
        reject();
    });
});

// Retrieve all the attractions present in a particular city
const getAllAttractions = (city, cityIndex) => new Promise(async (resolve, reject) => {
    console.log('Fetching attractions for: ', city);
    const query = "MATCH (:City {name: $city})-[:HAS_LOCATION]->(attraction) RETURN attraction.name";
    const params = {city: city};

    const request = runQuery(query, params);

    request.then(result => {
        const requests = [];

        result.records.forEach(function (record) {
            const request = getAllCategories(record._fields[0], cityIndex);
            requests.push(request);
        });

        Promise.all(requests).then(() => {
            console.log('Completed fetching attractions for: ', city);
            resolve();
        });
    }, () => {
        reject();
    });
});

function writeToFile() {
    let data = JSON.stringify(cityTypes, null, 2);

    fs.writeFile('./data/city-types.json', data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

function compute() {
    const requests = [];

    cities.forEach((city, i) => {
        cityTypes.push({
            id: i+1,
            city: city,
            categories: []
        });
        const request = getAllAttractions(city, i);
        requests.push(request);
    });

    Promise.all(requests).then(() => {
        writeToFile();
    });
}

compute();





