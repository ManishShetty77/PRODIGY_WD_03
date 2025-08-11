
class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0, draw: 0 };
        
        // Winning combinations for the 3x3 grid
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
        this.loadScores();
    }
    
    /**
     * Initialize DOM elements and store references
     */
    initializeElements() {
        this.gameBoard = document.getElementById('gameBoard');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.gameStatus = document.getElementById('gameStatus');
        this.resetBtn = document.getElementById('resetBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.scoreX = document.getElementById('scoreX');
        this.scoreO = document.getElementById('scoreO');
        this.scoreDraw = document.getElementById('scoreDraw');
        this.cells = document.querySelectorAll('.cell');
    }
    
    /**
     * Attach event listeners to interactive elements
     */
    attachEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.newGameBtn.addEventListener('click', () => this.newGame());
    }
    
    /**
     * Handle cell click events
     * @param {Event} event - The click event
     */
    handleCellClick(event) {
        const index = parseInt(event.target.dataset.index);
        
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(index);
    }
    
    /**
     * Make a move on the board
     * @param {number} index - The cell index (0-8)
     */
    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.updateCellDisplay(index);
        
        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.isBoardFull()) {
            this.handleGameEnd('draw');
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateDisplay();
        }
    }
    
    /**
     * Update the display of a specific cell
     * @param {number} index - The cell index
     */
    updateCellDisplay(index) {
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
        cell.disabled = true;
    }
    
    /**
     * Check if current player has won
     * @returns {Array|undefined} - Winning combination or undefined
     */
    checkWinner() {
        return this.winningCombinations.find(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }
    
    /**
     * Check if the board is full (draw condition)
     * @returns {boolean} - True if board is full
     */
    isBoardFull() {
        return this.board.every(cell => cell !== '');
    }
    
    /**
     * Handle game end scenarios (win or draw)
     * @param {string} result - 'win' or 'draw'
     */
    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result === 'win') {
            const winningCombination = this.checkWinner();
            this.highlightWinningCells(winningCombination);
            this.gameStatus.textContent = `🎉 Player ${this.currentPlayer} Wins!`;
            this.gameStatus.classList.add('winner');
            this.scores[this.currentPlayer]++;
        } else {
            this.gameStatus.textContent = "🤝 It's a Draw!";
            this.gameStatus.classList.add('draw');
            this.scores.draw++;
        }
        
        this.disableAllCells();
        this.updateScoreDisplay();
        this.saveScores();
    }
    
    /**
     * Highlight the winning combination cells
     * @param {Array} combination - Array of winning cell indices
     */
    highlightWinningCells(combination) {
        combination.forEach(index => {
            this.cells[index].classList.add('winning-cell');
        });
    }
    
    /**
     * Disable all cells (game over state)
     */
    disableAllCells() {
        this.cells.forEach(cell => {
            cell.disabled = true;
        });
    }
    
    /**
     * Reset the current game (keep scores)
     */
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.disabled = false;
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        this.gameStatus.textContent = '';
        this.gameStatus.classList.remove('winner', 'draw');
        this.updateDisplay();
    }
    
    /**
     * Start a completely new game (reset scores)
     */
    newGame() {
        this.resetGame();
        this.scores = { X: 0, O: 0, draw: 0 };
        this.updateScoreDisplay();
        this.saveScores();
    }
    
    /**
     * Update the current player display
     */
    updateDisplay() {
        this.currentPlayerDisplay.textContent = `Player ${this.currentPlayer}'s Turn`;
    }
    
    /**
     * Update the score display
     */
    updateScoreDisplay() {
        this.scoreX.textContent = this.scores.X;
        this.scoreO.textContent = this.scores.O;
        this.scoreDraw.textContent = this.scores.draw;
    }
    
    /**
     * Save scores to memory (localStorage not supported in artifacts)
     */
    saveScores() {
        this.storedScores = { ...this.scores };
    }
    
    /**
     * Load scores from memory
     */
    loadScores() {
        if (this.storedScores) {
            this.scores = { ...this.storedScores };
            this.updateScoreDisplay();
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});