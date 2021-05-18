import MinesweeperInstance from '../minesweeper/minesweeper.js';
import settings from './settings/settings.js';

// html
window.onload = function() {
    const canvas = document.getElementById('ms-canvas');
    const smiley = document.getElementById('ms-smiley');

    const red = document.getElementById('red');
    const yellow = document.getElementById('yellow');
    const green = document.getElementById('green');

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

        var currSmileySrc = '';

        // minesweeper instance
        var instance = null;
        function setupInstance() {
            if (instance !== null) {
                // remove all references
                instance.mouse.stop();
            }

            instance = new MinesweeperInstance(canvas, settings.width, settings.height, settings.mines);
            instance.onload = function() {
                this.drawWholeGrid();
                this.mouse.start();

                currSmileySrc = 'url(./src/img/smiley_idle.png)';
                smiley.style.backgroundImage = currSmileySrc;
            };

            instance.startLoadingAssets();

            // smiley animations
            instance.ondeath = function() {
                currSmileySrc = 'url(./src/img/smiley_dead.png)';
                smiley.style.backgroundImage = currSmileySrc;
            };
            instance.onvictory = function() {
                currSmileySrc = 'url(./src/img/smiley_win.png)';
                smiley.style.backgroundImage = currSmileySrc;
            };
            instance.onmousedown = function() {
                smiley.style.backgroundImage = 'url(./src/img/smiley_caution.png)';
            };
            instance.onmouseup = function() {
                smiley.style.backgroundImage = currSmileySrc;
            };

            console.log('starting minesweeper instance !\n' + '-'.repeat(16));
            console.log('');
        }

        smiley.onclick = function() {
            setupInstance();
        };

        // settings
        settings.onsubmit = () => smiley.click();

        red.onclick = yellow.onclick = green.onclick = 
            () => settings.popupSettings();

        // andddd done !
        smiley.click();

    }
};
