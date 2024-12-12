import { getRainbowColor } from './utils/colors.js';
import { soundManager } from './utils/sounds.js';
import { calculateGameDimensions } from './utils/responsive.js';

export class Game {
    constructor(difficulty) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.difficulty = difficulty;
        this.snake = [];
        this.direction = 'right';
        this.food = null;
        this.score = 0;
        this.gameLoop = null;
        this.colorIndex = 0;
        this.setupCanvas();
        this.setupControls();
        this.setupSpeed();
        this.setupResizeHandler();
    }

    setupCanvas() {
        const dimensions = calculateGameDimensions();
        this.canvas.width = dimensions.width;
        this.canvas.height = dimensions.height;
        this.cellSize = dimensions.cellSize;
        document.getElementById('game-wrapper').style.display = 'block';
        document.getElementById('menu').style.display = 'none';
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const dimensions = calculateGameDimensions();
                this.canvas.width = dimensions.width;
                this.canvas.height = dimensions.height;
                this.cellSize = dimensions.cellSize;
            }, 250);
        });
    }

    setupSpeed() {
        const speeds = {
            easy: 150,
            medium: 100,
            hard: 70
        };
        this.speed = speeds[this.difficulty];
    }

    setupControls() {
        // Keyboard controls
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Touch controls
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.direction = deltaX > 0 ? 'right' : 'left';
            } else {
                this.direction = deltaY > 0 ? 'down' : 'up';
            }
        });
    }

    handleKeyboard(e) {
        const directions = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right'
        };
        
        if (directions[e.key]) {
            const newDirection = directions[e.key];
            const opposites = {
                up: 'down',
                down: 'up',
                left: 'right',
                right: 'left'
            };
            
            if (this.direction !== opposites[newDirection]) {
                this.direction = newDirection;
            }
        }
    }

    start() {
        const centerX = Math.floor(this.canvas.width / this.cellSize / 2);
        const centerY = Math.floor(this.canvas.height / this.cellSize / 2);
        
        this.snake = [
            { x: centerX, y: centerY },
            { x: centerX - 1, y: centerY },
            { x: centerX - 2, y: centerY }
        ];
        
        this.generateFood();
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    update() {
        const head = { ...this.snake[0] };
        
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (this.checkCollision(head)) {
            soundManager.play('hit');
            this.gameOver();
            return;
        }

        this.snake.unshift(head);
        this.colorIndex = (this.colorIndex + 1) % 7; // Rainbow color cycle
        
        if (head.x === this.food.x && head.y === this.food.y) {
            soundManager.play('eat');
            this.score += 10;
            document.getElementById('score').textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        return (
            head.x < 0 ||
            head.x >= this.canvas.width / this.cellSize ||
            head.y < 0 ||
            head.y >= this.canvas.height / this.cellSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    generateFood() {
        const maxX = (this.canvas.width / this.cellSize) - 1;
        const maxY = (this.canvas.height / this.cellSize) - 1;
        
        do {
            this.food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (this.snake.some(segment => 
            segment.x === this.food.x && segment.y === this.food.y));
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake with rainbow effect
        this.snake.forEach((segment, index) => {
            const colorIndex = (this.colorIndex + index) % 7;
            this.ctx.fillStyle = getRainbowColor(colorIndex);
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = getRainbowColor(colorIndex);
            
            this.ctx.fillRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
            );
        });

        // Draw food with pulsing effect
        const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.1;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff4444';
        this.ctx.fillStyle = '#ff4444';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.cellSize + this.cellSize/2,
            this.food.y * this.cellSize + this.cellSize/2,
            (this.cellSize/2 - 1) * pulseScale,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    gameOver() {
        clearInterval(this.gameLoop);
        soundManager.play('gameOver');
        
        const highScore = Math.max(
            parseInt(localStorage.getItem('snakeHighScore') || 0),
            this.score
        );
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        
        setTimeout(() => {
            alert(`Game Over! Score: ${this.score}`);
            document.getElementById('game-wrapper').style.display = 'none';
            document.getElementById('menu').style.display = 'block';
        }, 100);
    }
}