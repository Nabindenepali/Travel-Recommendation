const utils = require('./utils');

const recommender = require('./recommender');

const getRecommendationsForUser = recommender.getRecommendationsForUser;
const getUser = recommender.getUser;

const actualVisits = require('./data/actual-visits');

// Get top n recommendations for specified user
function getTopRecommendations(user, n) {
    const recommendations = getRecommendationsForUser(user);
    return recommendations.slice(0, n).map(recommendation => recommendation.id);
}

// Get actual visited places for a particular user
function getVisitedPlaces(user) {
    const userVisits = actualVisits.find(visit => visit.id === user.id);
    if (userVisits) {
        return userVisits.cities[0].visited_attractions;
    }
    return [];
}

// Calculate precision score for an individual user
function calculatePrecision(user, recommendations) {
    const visitedPlaces = getVisitedPlaces(user);

    let matches = 0;

    recommendations.forEach(recommendation => {
        if (visitedPlaces.indexOf(recommendation) > -1) {
            matches++;
        }
    });

    return matches/5;
}

// Calculate recall score for an individual user
function calculateRecall(user, recommendations) {
    const visitedPlaces = getVisitedPlaces(user);

    let matches = 0;

    visitedPlaces.forEach(visitedPlace => {
        if (recommendations.indexOf(visitedPlace) > -1) {
            matches++;
        }
    });

    return matches/visitedPlaces.length;
}

// Calculate F1-score based on given precision and recall values
function calculateF1Score(precision, recall) {
    return 2 * precision * recall / (precision + recall);
}

const userIds = [1, 2, 3, 4, 5];

const precisions = [];

const recalls = [];

userIds.forEach(userId => {
    const user = getUser(userId);
    const topRecommednations = getTopRecommendations(user, 5);

    precisions.push(calculatePrecision(user, topRecommednations));
    recalls.push(calculateRecall(user, topRecommednations));
});

const precision = utils.getAvg(precisions);
console.log('Precision:', precision);

const recall = utils.getAvg(recalls);
console.log('Recall:', recall);

const f1_score = calculateF1Score(precision, recall);
console.log('F1 Score:', f1_score);

