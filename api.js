require('dotenv').config();

const fetch = require("node-fetch");

const apiKey = process.env.API_KEY;

function apiGet(method, query) {
    return new Promise(function(resolve, reject) {
        var otmAPI =
            "https://api.opentripmap.com/0.1/en/places/" +
            method +
            "?apikey=" +
            apiKey;
        if (query !== undefined) {
            otmAPI += "&" + query;
        }
        fetch(otmAPI)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    });
};

module.exports = apiGet;
