const data = require('./data');

const utils = require('./utils');

const categoryNames = data.categories;
const attractions = data.attractions;
const users = data.userVisitsByCategory;
const visits = data.visitsToAttractions;

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
    return visitToCategory/totalVisits;
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
        // console.log('in', interest)
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

// Generate recommendations for an user with specified id
function generateRecommendations (userId) {
    const user = getUser(userId);

    console.log('Recommendations for: ', user.name);

    attractions.forEach(function (attraction) {
        const score = (popularity(attraction) + interest(user, attraction)).toFixed(3);
        console.log('Attraction: ' + attraction.name + ', Score: ' + score);
    });
}

generateRecommendations(1);
