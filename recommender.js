const utils = require('./utils');

const cityTypes = require('./data/city-types');
const categoryNames = require('./data/category-names');
const attractions = require('./data/attractions');
const users = require('./data/user-visits-by-category');
const visits = require('./data/visits-to-attractions');

// Returns the object of counts of types for a city
function getTypesForCity (city) {
    return cityTypes.find(function (cityType) {
        return cityType.id === city.city_id;
    });
}

// Returns the object of counts of types for a city in a category
function getCountForCategory (categories, categoryName) {
    return categories.find(function (category) {
        return category.category === categoryName;
    });
}

// Return tf value
function getTermFrequency (city, category) {
    const typesForCity = getTypesForCity(city);
    const countForType = getCountForCategory(typesForCity.categories, category).count;
    const maxCount = Math.max(...typesForCity.categories.map(category => category.count));
    return countForType / maxCount;
}

// Filter to check whether a city has attractions of given category
function cityHasCategory (city, categoryName) {
    return city.categories.some(function (category) {
        return (category.category === categoryName) && category.count > 0;
    });
}

// Return tf value
function getInverseDocumentFrequency (category) {
    const countOfCities = cityTypes.length;
    const countOfCitiesWithCategory = cityTypes.filter(city => cityHasCategory(city, category)).length;
    return Math.log(countOfCities / (countOfCitiesWithCategory + 1));
}

// Returns type dependent weight score for a category in a city
function getWeightScore (city, category) {
    const tf = getTermFrequency(city, category);
    const idf = getInverseDocumentFrequency(category);
    return tf * idf;
}

// Returns visit count for specific category in a given city
function getVisitCountForCategory (city, category) {
    return city.visits.find(function (visit) {
        return visit.category === category;
    });
}

// Get interest score for a user in a city for a category
function getInterestScoreForCity (city, category) {
    const visitToCategory = getVisitCountForCategory(city, category).count;
    const totalVisits = utils.getSum(city.visits.map(visit => visit.count));
    const weightScore = getWeightScore(city, category);
    return (visitToCategory * weightScore) / totalVisits;
}

// Returns the interest score for an user for given category
function getInterestScoreForCategory (user, category) {
    const cityInterestScores = [];
    user.cities.forEach(function (city) {
        cityInterestScores.push(getInterestScoreForCity(city, category));
    });
    return utils.getAvg(cityInterestScores);
}

// Returns the interest score for an user for given category
function getInterestScore (user, category) {
    var I = 0, Imin = 0, Imax = 0;
    categoryNames.forEach(function (categoryName) {
        const interest = getInterestScoreForCategory(user, categoryName);
        if (categoryName === category) {
            I = interest;
        }
        if ((interest > Imax) || !Imax) {
            Imax = interest;
        }
        if ((interest < Imin) || !Imin) {
            Imin = interest;
        }
    });
    return (I - Imin) / (Imax - Imin);
}

// Returns interest score for an attraction for the given user
function interest (user, attraction) {
    const interestScores = [];
    attraction.categories.forEach(function (category) {
        interestScores.push(getInterestScore(user, category));
    });
    return Math.max(...interestScores);
}

// Returns the max visit count among the group of attractions
function getMaxVisitCount () {
    return Math.max(...visits.map(visit => visit.count));
}

// Returns the visits object for specified attraction
function getVisit (attraction) {
    return visits.find(function (visit) {
        return visit.attraction_id === attraction.id;
    })
}

// Returns popularity score for an attraction
function popularity (attraction) {
    const attractionVisits = getVisit(attraction);
    const maxVisitCount = getMaxVisitCount();
    return attractionVisits.count / maxVisitCount;
}

// Returns an user by its id
function getUser (id) {
    return users.find(function (user) {
        return user.id === id;
    })
}

// A function to sort recommendations in the descending order of their scores
function sortRecommendation (rec1, rec2) {
    if (rec1.score > rec2.score) {
        return -1;
    }
    if (rec1.score < rec2.score) {
        return 1;
    }
    return 0;
}

// Returns sorted recommendations for the given user
function getRecommendationsForUser (user) {
    const recommendations = [];

    attractions.forEach(function (attraction) {
        const score = (popularity(attraction) + interest(user, attraction)).toFixed(3);
        recommendations.push({
            name: attraction.name,
            score: score
        });
    });

    return recommendations.sort(sortRecommendation);
}

// Generate recommendations for an user with specified id
function generateRecommendations (userId) {
    const user = getUser(userId);

    console.log('Recommendations for: ', user.name);

    const recommendations = getRecommendationsForUser(user);

    recommendations.forEach(function (recommendation) {
        console.log('Attraction: ' + recommendation.name + ', Score: ' + recommendation.score);
    });
}

generateRecommendations(1);
