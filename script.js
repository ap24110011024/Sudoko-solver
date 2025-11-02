let grid = Array.from({length: 9}, () => Array(9).fill(0));
let timerInterval;
let seconds = 0;
const gridElement = document.getElementById('sudoku-grid');
const messageElement = document.getElementById('message');

function createGrid() {
    gridElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.className = 'cell';
            cell.maxLength = 1;
            cell.value = grid[i][j] || '';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.oninput = handleInput;
            gridElement.appendChild(cell);
        }
    }
}

function handleInput(e) {
    const val = parseInt(e.target.value);
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    if (val >= 1 && val <= 9) {
        grid[row][col] = val;
        showMessage('Valid move!', 'success');
    } else {
        grid[row][col] = 0;
        e.target.value = '';
        showMessage('Invalid input! Use 1-9.', 'error');
    }
}

function generatePuzzle() {
    const difficulty = document.getElementById('difficulty').value;
    let fillCount;
    if (difficulty === 'easy') fillCount = 40;
    else if (difficulty === 'medium') fillCount = 30;
    else fillCount = 20;

    grid = Array.from({length: 9}, () => Array(9).fill(0));
    // Generate a valid puzzle (simplified)
    solve(grid); // Fill completely
    // Remove cells randomly
    let removed = 0;
    while (removed < (81 - fillCount)) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (grid[row][col] !== 0) {
            grid[row][col] = 0;
            removed++;
        }
    }
    createGrid();
    resetTimer();
    showMessage(`Generated ${difficulty} puzzle!`, 'success');
}

function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

function solve(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solve(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function solveSudoku() {
    const board = grid.map(row => [...row]);
    if (solve(board)) {
        grid = board;
        createGrid();
        showMessage('Solved!', 'success');
        stopTimer();
    } else {
        showMessage('No solution exists.', 'error');
    }
}

function hint() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        createGrid();
                        showMessage(`Hint: Placed ${num} at (${row+1}, ${col+1})`, 'info');
                        return;
                    }
                }
            }
        }
    }
    showMessage('No hints available.', 'error');
}

function clearGrid() {
    grid = Array.from({length: 9}, () => Array(9).fill(0));
    createGrid();
    resetTimer();
    showMessage('Grid cleared.', 'info');
}

function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    setTimeout(() => messageElement.textContent = '', 3000);
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('time').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById('time').textContent = '00:00';
    startTimer();
}

function formatTime(sec) {
    const min = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

document.getElementById('generate-btn').onclick = generatePuzzle;
document.getElementById('solve-btn').onclick = solveSudoku;
document.getElementById('step-btn').onclick = hint;
document.getElementById('clear-btn').onclick = clearGrid;

createGrid();
resetTimer();