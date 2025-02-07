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
    // Array to hold the value of markers played (X or O)
    const board = new Array(9).fill(null);

    // Returns the symbol that should be printed to the console
    function getMarker(index) {
        if (board[index] === "X") {
            return "X";
        }
        else if (board[index] === "O") {
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

    function canPlaceMarker(index) {
        return (board[index] === null);
    }

    function placeMarker(index, markerSymbol) {
        // Ensure the index is in-bounds
        if ((index < 0) || (index > 8)) {
            return false;
        }
        // Verify the tile is not already taken
        else if (!canPlaceMarker(index)) {
            return false;
        }
        // Otherwise, place the marker
        else {
            board[index] = markerSymbol;
            return true;
        }
    }

    // Print a visual representation of the board to the console for debugging
    function printBoard() {
        for (let row = 0; row < 3; row++) {
            console.log(`${getMarker((row * 3) + 0)}|${getMarker((row * 3) + 1)}|${getMarker((row * 3) + 2)}`);
        }
    }

    // Clear out the board
    function clearBoard() {
        board.fill(null);
    }

    function checkForGameOver() {
        // First, check for a win.
        // Check the lines that cross the center tile
        if ((board[4] !== null) &&
            (allThreeTheSame(board[0], board[4], board[8]) ||
                allThreeTheSame(board[1], board[4], board[7]) ||
                allThreeTheSame(board[2], board[4], board[6]) ||
                allThreeTheSame(board[3], board[4], board[5]))) {
            return board[4];
        }
        // Check the non-diagonal lines from top left
        if ((board[0] !== null) &&
            (allThreeTheSame(board[0], board[1], board[2]) ||
                allThreeTheSame(board[0], board[3], board[6]))) {
            return board[0];
        }
        // Check the non-diagonals from bottom right
        if ((board[8] !== null) &&
            (allThreeTheSame(board[2], board[5], board[8]) ||
                allThreeTheSame(board[6], board[7], board[8]))) {
            return board[8];
        }
        // Next, check for a tie.  If we haven't returned a 
        // winner yet and there are still undefined tiles,
        // the game is in progress.  Otherwise it is a tie.
        let returnValue = "tie";
        board.forEach((tile) => {
            if (tile === null) {
                returnValue = "in progress";
            }
        });
        return returnValue;
    }

    return {
        printBoard,
        placeMarker,
        clearBoard,
        checkForGameOver,
        getMarker,
        canPlaceMarker,
    }
})();

const uiController = (function() {
    // Register event listeners for each cell in the UI board
    const displayBoard = document.querySelector(".board");
    const cells = displayBoard.children;
    for (let i = 0; i < 9; i++) {
        // Click event to place a marker
        cells[i].addEventListener("click", function() {
            // Get the marker to place in this cell
            const marker = gameController.getTurn().getMarker();

            // Check if we can place the marker
            if ((gameBoard.checkForGameOver() === "in progress") && 
                (gameBoard.placeMarker(i, marker))) {
                // We successfully placed the marker.
                // This turn is over, tell the game controller.
                gameController.turnOver();
                
                // Set background to indicate this cell is no longer
                // available
                cells[i].style.backgroundColor = "rgba(0, 0, 0, 0.05)";

            }
        })

        // Mouseenter event to change cell background if this is a valid
        // cell to place a marker into
        cells[i].addEventListener("mouseenter", function() {
            if (gameBoard.canPlaceMarker(i)) {
                cells[i].style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }
        })

        // Mouseleave event to revert to original background
        cells[i].addEventListener("mouseleave", function() {
            cells[i].style.backgroundColor = "rgba(0, 0, 0, 0.05)";
        })
    }

    // Register event listeners for game-over dialog buttons
    const gameOverDialog = document.querySelector("#game-over");
    const playAgainBtn = document.querySelector("#play-again");
    playAgainBtn.addEventListener("click", (event) => {
        event.preventDefault();
        uiController.clearBoard();
        gameOverDialog.close("confirm");
    });
    const startOverBtn = document.querySelector("#start-over");
    startOverBtn.addEventListener("click", (event) => {
        event.preventDefault();
        gameController.initialize();
        uiController.clearBoard();
        gameOverDialog.close("confirm");
    });

    function clearBoard() {
        // Clear the underlying game board
        gameBoard.clearBoard();

        // Clear out images on displayed board
        const displayBoard = document.querySelector(".board");
        const cells = displayBoard.children;
        for (let i = 0; i < 9; i++) {
            // Delete contents of cell
            cells[i].innerHTML = "";
        }

    }

    function markerToImageSource(marker) {
        switch (marker) {
            case "X":
                return "images/x.png";
            case "O":
                return "images/o.png";
            default:
                // Return null if invalid marker
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
                const source = markerToImageSource(gameBoard.getMarker(i));

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

        // Get the image source based on the marker
        const source = markerToImageSource(turn.getMarker());

        // If we got a valid image source, create an img element and
        // add the image to the cell.
        if (source !== null) {
            const img = document.createElement("img");
            img.src = source;

            // Remove any current child nodes first
            turnIndicator.innerHTML = "";

            // Then add the child
            turnIndicator.appendChild(img);
        }
    }

    function updateResult(result) {
        const resultIndicator = document.querySelector("#result");
        resultIndicator.innerText = result;
    }

    function updatePlayerInfo(player1, player2) {
        const p1Name = document.querySelector("#player1 .name");
        const p1Score = document.querySelector("#player1 .score");
        const p2Name = document.querySelector("#player2 .name");
        const p2Score = document.querySelector("#player2 .score");

        // Update names
        p1Name.innerText = player1.getName();
        p2Name.innerText = player2.getName();

        // Update scores
        p1Score.innerText = player1.getScore();
        p2Score.innerText = player2.getScore();
    }

    return {
        clearBoard,
        renderBoard,
        updateTurnIndicator,
        updateResult,
        updatePlayerInfo,
    }

})();

const gameController = (function (type) {
    let player1;
    let player2;
    let gameResult = "in progress";
    let turn;

    // Initialize the game by creating two players
    function initialize() {
        if ("test" === type) {
            player1 = createPlayer("ted", "X");
            player2 = createPlayer("jill", "O");
        }
        else {
            // TODO: Pull player names from UI elements
            throw "gameController: only 'test' type is defined";
        }

        // Populate the player info
        uiController.updatePlayerInfo(player1, player2);

        // Initialize whose turn it is
        turn = player1;

        // Update the turn div to display whose turn it is
        uiController.updateTurnIndicator(turn);
    }

    function turnOver() {
        // Update the board
        uiController.renderBoard();

        // Check if the game is over
        let result = gameBoard.checkForGameOver();
        uiController.updateResult(result);

        if ("in progress" === result) {
            // The game is not over yet
            // Alternate player 1 and 2
            if (turn === player1) {
                turn = player2;
            }
            else {
                turn = player1
            }
            uiController.updateTurnIndicator(turn);
        }
        else {
            // The game is over
            if ("X" === result)  {
                // Player 1 won
                player1.win();
            }
            else if ("O" === result) {
                // Player 2 won
                player2.win();
            }

            // Update player info
            uiController.updatePlayerInfo(player1, player2);

            // Show the game over dialog
            const gameOverDialog = document.querySelector("#game-over");
            gameOverDialog.showModal();
        }
    }

    function resetGame() {
        gameResult = "in progress";
        gameBoard.clearBoard();
        turn = player1;
        uiController.updateTurnIndicator(turn);
    }
    
    function getTurn() {
        return turn;
    }

    return {
        initialize,
        turnOver,
        resetGame,
        getTurn,
    }

})("test");

// Main Code Entry Point
gameController.initialize();
