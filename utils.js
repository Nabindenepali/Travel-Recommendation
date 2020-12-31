function toTitleCase (word) {
    return word.charAt(0).toUpperCase() + word.substring(1, word.length);
}

module.exports = {
    toTitleCase: toTitleCase
};
