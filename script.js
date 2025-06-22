class ColorOperations2048 {
    constructor() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(null));
        this.score = 0;
        this.best = localStorage.getItem('best-score') || 0;
        this.tileContainer = document.getElementById('tile-container');
        this.scoreElement = document.getElementById('score');
        this.bestElement = document.getElementById('best');
        
        this.operations = {
            'addition': '+',
            'subtraction': '-',
            'multiplication': '*',
            'division': '/',
            'neutral': 'neutral'
        };
        
        this.init();
    }

    init() {
        this.updateDisplay();
        this.addRandomTile();
        this.addRandomTile();
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.handleMove(e.key);
            }
        });
    }

    getRandomOperation() {
        const operations = Object.keys(this.operations);
        const weights = [0.25, 0.2, 0.2, 0.15, 0.2]; // addition, subtraction, multiplication, division, neutral
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < operations.length; i++) {
            cumulative += weights[i];
            if (random < cumulative) {
                return operations[i];
            }
        }
        return 'neutral';
    }

    addRandomTile() {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (!this.grid[row][col]) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            const operation = this.getRandomOperation();
            
            this.grid[randomCell.row][randomCell.col] = {
                value: value,
                operation: operation,
                id: Date.now() + Math.random()
            };
        }
    }

    handleMove(direction) {
        let moved = false;

        switch (direction) {
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.render();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                setTimeout(() => {
                    alert('Game Over! Final Score: ' + this.score);
                }, 100);
            }
        }
    }

    moveLeft() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const newRow = this.processRow(this.grid[row], row);
            if (JSON.stringify(newRow) !== JSON.stringify(this.grid[row])) {
                moved = true;
                this.grid[row] = newRow;
            }
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            const reversed = [...this.grid[row]].reverse();
            const newRow = this.processRow(reversed, row).reverse();
            if (JSON.stringify(newRow) !== JSON.stringify(this.grid[row])) {
                moved = true;
                this.grid[row] = newRow;
            }
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const column = [];
            for (let row = 0; row < 4; row++) {
                column.push(this.grid[row][col]);
            }
            const newColumn = this.processRow(column, null, col);
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
                for (let row = 0; row < 4; row++) {
                    this.grid[row][col] = newColumn[row];
                }
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            const column = [];
            for (let row = 3; row >= 0; row--) {
                column.push(this.grid[row][col]);
            }
            const newColumn = this.processRow(column, null, col);
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
                for (let row = 0; row < 4; row++) {
                    this.grid[3 - row][col] = newColumn[row];
                }
            }
        }
        return moved;
    }

    processRow(row, rowIndex = null, colIndex = null) {
        const filtered = row.filter(cell => cell !== null);
        const result = [];
        
        for (let i = 0; i < filtered.length; i++) {
            if (i < filtered.length - 1 && this.canMerge(filtered[i], filtered[i + 1])) {
                const mergedValue = this.performOperation(filtered[i], filtered[i + 1]);
                const dominantOperation = this.getDominantOperation(filtered[i], filtered[i + 1]);
                
                // Show operation popup - determine position based on movement direction
                let displayRow = rowIndex;
                let displayCol = colIndex !== null ? colIndex : i;
                
                this.showOperationPopup(filtered[i], filtered[i + 1], mergedValue, dominantOperation, displayRow, displayCol);
                
                // Handle special case: if result is 0, don't add it (tile disappears)
                if (mergedValue !== 0) {
                    result.push({
                        value: mergedValue,
                        operation: dominantOperation,
                        id: Date.now() + Math.random(),
                        merged: true
                    });
                }
                
                this.score += Math.max(mergedValue, 1); // Score at least 1 point
                i++; // Skip next tile as it's been merged
            } else {
                result.push(filtered[i]);
            }
        }
        
        while (result.length < 4) {
            result.push(null);
        }
        
        return result;
    }

    performOperation(tile1, tile2) {
        const operation1 = tile1.operation;
        const operation2 = tile2.operation;
        const value1 = tile1.value;
        const value2 = tile2.value;
        
        // Use the operation of the higher value tile, or the first tile if equal
        const dominantOperation = value1 >= value2 ? operation1 : operation2;
        
        let result;
        switch (dominantOperation) {
            case 'addition':
                result = value1 + value2;
                break;
            case 'subtraction':
                result = Math.abs(value1 - value2);
                break;
            case 'multiplication':
                result = value1 * value2;
                break;
            case 'division':
                // Simple division with proper handling
                if (value1 === value2) {
                    result = 1;
                } else {
                    const larger = Math.max(value1, value2);
                    const smaller = Math.min(value1, value2);
                    result = Math.floor(larger / smaller);
                }
                break;
            default: // neutral
                result = value1 + value2; // Default to addition for neutral tiles
                break;
        }
        
        // Allow 0 and 1 as valid results - they have special behaviors
        return result;
    }

    canMerge(tile1, tile2) {
        const value1 = tile1.value;
        const value2 = tile2.value;
        const op1 = tile1.operation;
        const op2 = tile2.operation;
        
        // Special rules for tile 1: can merge with any other tile using multiplication/division
        if (value1 === 1 && value2 !== 1) {
            return op1 === 'multiplication' || op1 === 'division' || op2 === 'multiplication' || op2 === 'division';
        }
        if (value2 === 1 && value1 !== 1) {
            return op1 === 'multiplication' || op1 === 'division' || op2 === 'multiplication' || op2 === 'division';
        }
        
        // Special rules for tile 1 + tile 1: can use multiplication/division/addition
        if (value1 === 1 && value2 === 1) {
            return op1 === 'multiplication' || op1 === 'division' || op1 === 'addition' || 
                   op2 === 'multiplication' || op2 === 'division' || op2 === 'addition';
        }
        
        // Regular rule: tiles with same value can merge
        return value1 === value2;
    }

    getDominantOperation(tile1, tile2) {
        if (tile1.value >= tile2.value) {
            return tile1.operation;
        }
        return tile2.operation;
    }

    showOperationPopup(tile1, tile2, result, operation, row = null, col = null) {
        const operationSymbols = {
            'addition': '+',
            'subtraction': '-',
            'multiplication': '×',
            'division': '÷',
            'neutral': '+'
        };

        const popup = document.createElement('div');
        popup.className = `operation-popup ${operation}`;
        popup.textContent = `${tile1.value} ${operationSymbols[operation]} ${tile2.value} = ${result}`;
        
        // Calculate position based on where the merge happened
        // Position relative to tile container (which has 10px padding)
        let left, top;
        if (row !== null && col !== null) {
            left = col * 100 + 55; // Center of tile (10px padding + 90px/2 tile width)
            top = row * 100 + 55;  // Center of tile (10px padding + 90px/2 tile height)
        } else {
            // Fallback to center of game area
            left = 200;
            top = 200;
        }
        
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
        popup.style.transform = 'translate(-50%, -50%)';
        
        // Add popup to tile container
        this.tileContainer.appendChild(popup);
        
        // Debug: log popup creation
        console.log(`Popup created: ${popup.textContent} at (${left}, ${top})`);
        
        // Remove popup after animation
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }

    render() {
        // Clear only tiles, not popups
        const existingTiles = this.tileContainer.querySelectorAll('.tile');
        existingTiles.forEach(tile => tile.remove());
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const tile = this.grid[row][col];
                if (tile) {
                    const tileElement = document.createElement('div');
                    tileElement.className = `tile ${tile.operation}`;
                    tileElement.textContent = tile.value;
                    tileElement.setAttribute('data-value', tile.value);
                    tileElement.style.left = `${col * 100 + 10}px`;
                    tileElement.style.top = `${row * 100 + 10}px`;
                    
                    if (tile.merged) {
                        tileElement.classList.add('merged');
                        tile.merged = false;
                    }
                    
                    this.tileContainer.appendChild(tileElement);
                }
            }
        }
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.best) {
            this.best = this.score;
            localStorage.setItem('best-score', this.best);
        }
        this.bestElement.textContent = this.best;
    }

    isGameOver() {
        // Check for empty cells
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (!this.grid[row][col]) {
                    return false;
                }
            }
        }

        // Check for possible merges using new canMerge logic
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const current = this.grid[row][col];
                
                // Check right neighbor
                if (col < 3 && this.canMerge(current, this.grid[row][col + 1])) {
                    return false;
                }
                
                // Check bottom neighbor
                if (row < 3 && this.canMerge(current, this.grid[row + 1][col])) {
                    return false;
                }
            }
        }

        return true;
    }

    restart() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(null));
        this.score = 0;
        this.updateDisplay();
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }
}

// Initialize the game
const game = new ColorOperations2048();