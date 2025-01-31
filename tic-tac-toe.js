function createPlayer(name, marker) {
    // Private variables
    let score = 0;

    // Public functions
    const getName = () => name;
    const getMarker = () => marker;
    const win = () => ++score;
    const getScore = () => score;
    const printInfo = () => {
        console.log(`${name} (${marker}) won ${score} games.`);
    }

    return {
        getName,
        getMarker,
        win,
        getScore,
        printInfo,
    };
}

const gameBoard = (function() {
    const tiles = new Array(9).fill(null);

    // Returns the symbol that should be printed to the console
    function getSymbol(index) {
        if (tiles[index] === "X") {
            return "X";
        }
        else if (tiles[index] === "O") {
            return "O";
        }
        // If the tile is not X or O, we want an underscore for
        // the first two rows, but a blank space for the bottom
        // row
        else if (index < 6) {
            return "_";
        }
        else {
            return " "
        }
    }

    // Check if all three symbols are the same
    function allThreeTheSame(a, b, c) {
        return ((a === b) && (a === c));
    }

    return {
        // Print a visual representation of the board to the console
        printBoard: function() {
            for (let row = 0; row < 3; row++) {
                console.log(`${getSymbol((row * 3) + 0)}|${getSymbol((row * 3) + 1)}|${getSymbol((row * 3) + 2)}`);
            }
        },

        placeMarker: function(index, marker) {
            // Ensure the index is in-bounds
            if ((index < 0) || (index > 8)) {
                return false;
            }
            // Verify the tile is not already taken
            else if (tiles[index] !== null) {
                return false;
            }
            // Otherwise, place the marker
            else {
                tiles[index] = marker;
                return true;
            }
        },

        checkForGameOver: function() {
            // First, check for a win.
            // Check the lines that cross the center tile
            if ((tiles[4] !== null) &&
                (allThreeTheSame(tiles[0], tiles[4], tiles[8]) ||
                allThreeTheSame(tiles[1], tiles[4], tiles[7]) ||
                allThreeTheSame(tiles[2], tiles[4], tiles[6]) ||
                allThreeTheSame(tiles[3], tiles[4], tiles[5]))) {
                return tiles[4];
            } 
            // Check the non-diagonal lines from top left
            if ((tiles[0] !== null) &&
                (allThreeTheSame(tiles[0], tiles[1], tiles[2]) ||
                allThreeTheSame(tiles[0], tiles[3], tiles[6]))) {
                return tiles[0];
            } 
            // Check the non-diagonals from bottom right
            if ((tiles[8] !== null) &&
                (allThreeTheSame(tiles[2], tiles[5], tiles[8]) ||
                allThreeTheSame(tiles[6], tiles[7], tiles[8]))) {
                return tiles[8];
            }
            // Next, check for a tie.  If we haven't returned a 
            // winner yet and there are still undefined tiles,
            // the game is in progress.  Otherwise it is a tie.
            let returnValue = "tie";
            tiles.forEach((tile) => {
                if (tile === null) {
                    returnValue = "in progress";
                }
            });
            return returnValue;
        },

        clearBoard: function() {
            tiles.fill(null);
        }
    }
})();

// Test code
const ted = createPlayer("ted", "X");
const jill = createPlayer("jill", "O");
jill.win();
jill.win();
console.log(`${ted.getMarker()} (${ted.getName()}): ${ted.getScore()}`);
console.log(`${jill.getMarker()} (${jill.getName()}): ${jill.getScore()}`);

// Play a random game to check board logic
// Initialize some variables
let gameResult = "in progress";
let marker = "X";

// Place alternating X and O markers at random tiles until the 
// game is over
while ("in progress" === gameResult) {

    // Place the marker at a random place on the board.
    let placedMarker = false;
    while (placedMarker === false) {
        placedMarker = gameBoard.placeMarker(Math.floor(Math.random() * 9), marker);
    }

    // Alternate X and O markers
    if ("X" === marker) {
        marker = "O";
    }
    else {
        marker = "X";
    }

    // Check the game progress
    gameResult = gameBoard.checkForGameOver();
}
gameBoard.printBoard();
console.log(gameResult);

