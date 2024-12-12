class SoundManager {
    constructor() {
        this.sounds = {
            eat: new Audio('/sounds/eat.mp3'),
            gameOver: new Audio('/sounds/gameover.mp3'),
            hit: new Audio('/sounds/hit.mp3')
        };
        
        // Preload sounds
        Object.values(this.sounds).forEach(sound => {
            sound.load();
        });
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {}); // Ignore autoplay restrictions
        }
    }
}

export const soundManager = new SoundManager();