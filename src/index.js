import MinesweeperInstance from '../minesweeper/minesweeper.js';

// html
window.onload = function() {
    const canvas = document.getElementById('ms-canvas');
    const smiley = document.getElementById('ms-smiley');

    // preload images before continuing
    {
        // loading screeen
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '24px times new roman';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#808080';

        const text = 'loading ...'
        ctx.fillText(text, canvas.width/2, canvas.height/2);
    }

    {
        // image preloader
        var imagesLoaded = 0;
        var imageCount = 4;
        ['idle', 'caution', 'dead', 'press', 'win'].forEach(suffix => {
            const img = new Image();

            img.onload = function() {
                if (++imagesLoaded === imageCount)
                    main();
            };
            img.src = `./src/img/smiley_${suffix}.png`;
        });
    }
        
    function main() {

        var currSuffix = 'idle';
        function setSmileyImgSuffix(suffix) {
            smiley.style.backgroundImage = `url(./src/img/smiley_${suffix}.png)`;
        };

        smiley.onmousedown = function() {
            setSmileyImgSuffix('press');
        };

        // minesweeper instance
        var instance = null;
        function setupInstance() {
            if (instance !== null) {
                // remove all references
                instance.mouse.stop();
            }

            instance = new MinesweeperInstance(canvas, width, height, mines)
            instance.onload = function() {
                instance.drawWholeGrid();
                instance.mouse.start();

                currSuffix = 'idle';
                setSmileyImgSuffix(currSuffix);
            };

            // smiley animations
            instance.ondeath = function() {
                currSuffix = 'dead';
                setSmileyImgSuffix(currSuffix);
            };
            instance.onvictory = function() {
                currSuffix = 'win';
                setSmileyImgSuffix(currSuffix);
            };
            instance.onmousedown = function() {
                setSmileyImgSuffix('caution');
            };
            instance.onmouseup = function() {
                setSmileyImgSuffix(currSuffix);
            };

            console.log('starting minesweeper instance !\n' + '-'.repeat(16));
            console.log('');
        }

        smiley.onclick = function() {
            setupInstance();
        };

        // settings
        // Beginner     –  9*9  Board and 10 Mines
        // Intermediate – 16*16 Board and 40 Mines
        // Advanced     – 24*24 Board and 99 Mines
        const beginner = {
            size: 9,
            mines: 10
        };
        const intermediate = {
            size: 16,
            mines: 40
        };
        const advanced = {
            size: 24,
            mines: 99
        };

        var width = beginner.size;
        var height = beginner.size;
        var mines = beginner.mines;

        // andddd done !
        smiley.click();

    }
};
