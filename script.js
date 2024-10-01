const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let timer; // Timer variable
let timeLeft = 15; // Time allowed for each turn

// Winning conditions
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Check if cell is already clicked or if the game is inactive
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // Update game state
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer); // Add class for color styling

    // Check for a winner
    checkWinner();
    resetTimer(); // Reset timer after each move
}

// Check for a winner
function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        clearInterval(timer);
        return;
    }

    // Check for a draw
    if (!gameState.includes("")) {
        statusDisplay.innerHTML = `It's a Draw!`;
        gameActive = false;
        clearInterval(timer);
        return;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    startTimer(); // Start timer for the next player
}

// Start the timer
function startTimer() {
    timeLeft = 15; // Reset time for new turn
    statusDisplay.innerHTML = `Player ${currentPlayer}'s turn. Time left: ${timeLeft}s`;
    clearInterval(timer); // Clear any existing timer
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            statusDisplay.innerHTML = `Time's up! Player ${currentPlayer} loses their turn.`;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
            checkWinner(); // Check for winner
            startTimer(); // Start timer for the next player
        } else {
            statusDisplay.innerHTML = `Player ${currentPlayer}'s turn. Time left: ${timeLeft}s`;
        }
    }, 1000);
}

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    startTimer();
}

// Restart the game
function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = '';
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('X', 'O'); // Remove player classes
    });
    clearInterval(timer); // Clear timer on restart
    startTimer(); // Start timer for the first player
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});
restartButton.addEventListener('click', restartGame);

// Start the game with a timer
startTimer();
