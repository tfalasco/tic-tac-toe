function createPlayer(name, marker) {
    // Private variables
    let score = 0;

    // Public functions
    const getName = () => name;
    const getMarker = () => marker;
    const win = () => ++score;
    const getScore = () => score;

    return {
        getName,
        getMarker,
        win,
        getScore
    };
}

// Test code
const ted = createPlayer("ted", "X");
const jill = createPlayer("jill", "O");
jill.win();
jill.win();
console.log(`${ted.getMarker()} (${ted.getName()}): ${ted.getScore()}`);
console.log(`${jill.getMarker()} (${jill.getName()}): ${jill.getScore()}`);