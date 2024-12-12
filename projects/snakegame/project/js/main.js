import { Game } from './game.js';
import { Menu } from './menu.js';

const menu = new Menu();
let game = null;

menu.onGameStart((difficulty) => {
    game = new Game(difficulty);
    game.start();
});