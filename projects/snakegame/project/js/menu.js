export class Menu {
    constructor() {
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.selectedDifficulty = 'medium';
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDifficulty = btn.dataset.difficulty;
            });
        });

        // Set default difficulty
        document.querySelector('[data-difficulty="medium"]').classList.add('active');

        this.restartBtn.addEventListener('click', () => {
            document.getElementById('game-wrapper').style.display = 'none';
            document.getElementById('menu').style.display = 'block';
        });
    }

    onGameStart(callback) {
        this.startBtn.addEventListener('click', () => {
            callback(this.selectedDifficulty);
        });
    }
}