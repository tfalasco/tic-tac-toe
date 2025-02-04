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
    // Array to hold the value of tiles played (X or O)
    const tiles = new Array(9).fill(null);

    // Returns the symbol that should be printed to the console
    function getSymbol(index) {
        if (tiles[index] === "X") {
            return "X";
        }
        else if (tiles[index] === "O") {
            return "O";
        }
        else {
            return " "
        }
    }

    // Check if all three symbols are the same
    function allThreeTheSame(a, b, c) {
        return ((a === b) && (a === c));
    }

    function placeMarker(index, markerSymbol) {
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
            tiles[index] = markerSymbol;
            return true;
        }
    }

    return {
        // Print a visual representation of the board to the console
        printBoard: function() {
            for (let row = 0; row < 3; row++) {
                console.log(`${getSymbol((row * 3) + 0)}|${getSymbol((row * 3) + 1)}|${getSymbol((row * 3) + 2)}`);
            }
        },

        placeMarker,

        clearBoard: function () {
            tiles.fill(null);
        },

        checkForGameOver: function () {
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

        getSymbol,
    }
})();

const uiController = (function() {
    // Register click event listeners for each cell in the UI board
    const displayBoard = document.querySelector(".board");
    const cells = displayBoard.children;
    for (let i = 0; i < 9; i++) {
        cells[i].addEventListener("click", function() {
            // Get the marker to place in this cell
            const marker = gameController.getTurn().getMarker();

            // Check if we can place the marker
            if ((gameBoard.checkForGameOver() === "in progress") && 
                (gameBoard.placeMarker(i, marker))) {
                // We successfully placed the marker.
                // This turn is over, tell the game controller.
                gameController.turnOver();
            }
        })
    }

    function symbolToImageSource(symbol) {
        switch (symbol) {
            case "X":
                return "images/x.png";
            case "O":
                return "images/o.png";
            default:
                // Return null if invalid symbol
                return null;
        }
    }

    function renderBoard() {
        const displayBoard = document.querySelector(".board");
        const cells = displayBoard.children;
        for (let i = 0; i < 9; i++) {
            // If this cell already has an image in it, skip it.
            if (!cells[i].hasChildNodes()) {
                // Get the image source based on the symbol
                const source = symbolToImageSource(gameBoard.getSymbol(i));

                // If we got a valid image source, create an img element and
                // add the image to the cell.
                if (source !== null) {
                    const img = document.createElement("img");
                    img.src = source;
                    cells[i].appendChild(img);
                }
            }
        }
    }

    function updateTurnIndicator(turn) {
        const turnIndicator = document.querySelector("#turn");

        // Remove any current child nodes
        turnIndicator.innerHTML = "";

        // Get the image source based on the marker
        const source = symbolToImageSource(turn.getMarker());

        // If we got a valid image source, create an img element and
        // add the image to the cell.
        if (source !== null) {
            const img = document.createElement("img");
            img.src = source;
            turnIndicator.appendChild(img);
        }
    }

    function updateResult(result) {
        const resultIndicator = document.querySelector("#result");
        resultIndicator.innerText = result;
    }

    return {
        renderBoard,
        updateTurnIndicator,
        updateResult,
    }

})();

const gameController = (function (type) {
    let player1;
    let player2;
    let gameResult = "in progress";
    let turn;

    return {
        // Initialize the game by creating two players
        initialize: function () {
            if ("test" === type) {
                player1 = createPlayer("ted", "X");
                player2 = createPlayer("jill", "O");
            }
            else {
                // TODO: Pull player names from UI elements
                throw "gameController: only 'test' type is defined";
            }

            // Initialize whose turn it is
            turn = player1;

            // Update the turn div to display whose turn it is
            uiController.updateTurnIndicator(turn);
        },

        turnOver: function() {
            // Check if the game is over
            let result = gameBoard.checkForGameOver();
            uiController.updateResult(result);

            // Alternate player 1 and 2
            if (turn === player1) {
                turn = player2;
            }
            else {
                turn = player1
            }
            uiController.updateTurnIndicator(turn);
            uiController.renderBoard();
        },

        playRandomGame: function() {
            // Place alternating player1 and 2 markers at random tiles until the 
            // game is over
            while ("in progress" === gameResult) {

                // Place the marker at a random place on the board.
                let placedMarker = false;
                while (placedMarker === false) {
                    placedMarker = gameBoard.placeMarker(Math.floor(Math.random() * 9), turn.getMarker());
                }

                // Alternate player 1 and 2
                if (turn === player1) {
                    turn = player2;
                }
                else {
                    turn = player1
                }

                // Check the game progress
                gameResult = gameBoard.checkForGameOver();

                // Update the UI
                uiController.renderBoard();
                uiController.updateTurnIndicator(turn);
            }

            // Print the board
            gameBoard.printBoard();

            // Update the scores and print out the result
            if (gameResult === player1.getMarker()) {
                player1.win();
                if ("test" === type) {
                    console.log(`${player1.getName()} wins!`);
                }
            }
            else if (gameResult === player2.getMarker()) {
                player2.win();
                if ("test" === type) {
                    console.log(`${player1.getName()} wins!`);
                }
            }
            else {
                if ("test" === type) {
                    console.log("It's a tie!");
                }
            }
            if ("test" === type) {
                player1.printInfo();
                player2.printInfo();
            }
        },

        resetGame: function () {
            gameResult = "in progress";
            gameBoard.clearBoard();
        },

        getTurn: function() {
            return turn;
        }
    }

})("test");

gameController.initialize();

// Test Code
// gameController.playRandomGame();
