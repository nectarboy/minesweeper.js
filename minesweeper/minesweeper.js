
const MinesweeperInstance = function(canvas, width, height, mines) {
    var that = this;

    // game constants
    const TILESIZE = 16;

    const GRIDSPACE = 0;
    const GRIDWALL = 1;
    const GRIDMINE = 2;

    const randInt = function randInt (min, max) {
        min = Math.ceil (min);
        max = Math.floor (max);
        return ((Math.random () * (max - min + 1)) + min)|0;
    };

    const getIndex = (x, y) => y * width + x;

    // setup the canvas
    canvas.width = width * TILESIZE;
    canvas.height = height * TILESIZE;

    this.ctx = canvas.getContext('2d');

    // game logic
    const area = width * height;
    this.grid = new Uint8Array(area).fill(GRIDWALL);
    this.flagged = new Uint8Array(area).fill(0);

    this.didFirstClick = false; // protect player on first click

    this.clickGrid = function(x, y) {
        const index = getIndex(x, y);
        if (!this.didFirstClick) {
            this.grid[index] = GRIDWALL;
            this.didFirstClick = true;
        }

        switch (this.grid[index]) {
            case GRIDWALL:
                this.grid[index] = GRIDSPACE;
                this.clearAdjacent(x, y);
                break;
            case GRIDMINE:
                // game over
                break;
        }
    };

    this.flagGrid = function(x, y) {
        const index = getIndex(x, y);
        if (this.grid[index] === GRIDSPACE)
            return;

       this.flagged[index] = !this.flagged[index];
    };

    // grid helpers
    this.clearAdjacent = function(x, y) {
        function checkAdj(xx, yy) {
            if (xx >= width || xx < 0 || yy >= height || yy < 0)
                return;
            
            const index = getIndex(xx, yy);
            if (this.grid[index] === GRIDWALL) {
                this.grid[index] = GRIDSPACE;
                this.clearAdjacent(xx, yy);
            }
        }

        const yd = y - 1;
        const yi = y + 1;
        const xd = x - 1;
        const xi = x + 1;

        // check top
        checkAdj(xd, yi);
        checkAdj(x, yi);
        checkAdj(xi, yi);
        // check middle
        checkAdj(xd, y);
        checkAdj(xi, y);
        // check bottom
        checkAdj(xd, yd);
        checkAdj(x, yd);
        checkAdj(xi, yd);
    };

    // generate mines
    if (mines > area)
        mines = area;

    for (var i = 0; i < mines; i++) {
        const index = randInt(0, area - 1);

        while (this.grid[index] === GRIDMINE) {
            if (--index === 0)
                index = area - 1;
        }

        this.grid[index] = GRIDMINE;
    }

    // rendering
};

export default MinesweeperInstance;
