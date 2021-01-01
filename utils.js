function toTitleCase (word) {
    return word.charAt(0).toUpperCase() + word.substring(1, word.length);
}

function getAvg (array) {
    const sum = array.reduce((a, b) => a + b, 0);
    const avg = (sum / array.length) || 0;
    return avg;
}

function getSum (array) {
    const sum = array.reduce((a, b) => a + b, 0);
    return sum;
}

module.exports = {
    toTitleCase: toTitleCase,
    getAvg: getAvg,
    getSum: getSum
};
