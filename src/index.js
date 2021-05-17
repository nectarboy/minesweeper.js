import MinesweeperInstance from '../minesweeper/minesweeper.js';

// html
window.onload = function() {
    
    const canvas = document.getElementById('ms-canvas');
    const smiley = document.getElementById('ms-smiley');

    // minesweeper instance
    var instance = null;
    function setupInstance() {
        if (instance !== null) {
            // remove all references
            instance.mouse.stop();
        }

        instance = new MinesweeperInstance(canvas, 9,9, 10, () => {
            instance.drawWholeGrid();
            instance.mouse.start();
        });

        console.log('starting minesweeper instance !\n' + '-'.repeat(16));
        console.log('');

        window.instance = instance;
    }

    setupInstance();

    smiley.onclick = function() {
        setupInstance();
    };

    // settings
    // Beginner     –  9*9  Board and 10 Mines
    // Intermediate – 16*16 Board and 40 Mines
    // Advanced     – 24*24 Board and 99 Mines

};