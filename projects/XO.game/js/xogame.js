const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
let currentPlayer = 'X';
let gameActive = false;
let board = ['', '', '', '', '', '', '', '', ''];

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

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function startGame() {
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
    gameActive = false;
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '';
    });
    statusText.textContent = '';
}

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(cell, cellIndex);
    checkWinner();
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? 'red' : 'blue';
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;
    let winningPattern = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningPattern = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer === 'X' ? 'O' : 'X'} wins!`;
        gameActive = false;
        winningPattern.forEach(index => {
            cells[index].style.backgroundColor = 'lightgreen';
        });
    } else if (!board.includes('')) {
        statusText.textContent = 'Draw!';
        gameActive = false;
    }
}

