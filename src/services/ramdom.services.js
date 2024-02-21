const GetRandomElementsFromArray = (array, numberOfElements) => {
    if (numberOfElements >= array.length) {
        return array;
    }

    const shuffledArray = array.slice();

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray.slice(0, numberOfElements);
};

module.exports = { GetRandomElementsFromArray };
