import MinesweeperInstance from '../minesweeper/minesweeper.js';

// html
const canvas = document.getElementById('ms-canvas');

// minesweeper instance
var instance = new MinesweeperInstance(canvas, 9,9, 10, () => {
    instance.drawWholeGrid();

    instance.mouse.start();
});

window.instance = instance;