
const MinesweeperInstance = function(canvas, width, height, mines, onload) {
    var that = this;

    // game constants
    const TILESIZE = 16;

    const GRIDSPACE = 0;
    const GRIDWALL = 1;
    const GRIDMINE = 2;
    const GRIDHARDSPACE = 3;

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
    this.dead = false;

    this.buffer = [];
    this.flushBuffer = () => this.buffer = [];

    this.clearGrid = function(x, y) {
        var index = getIndex(x, y);
        if (!this.didFirstClick) {
            this.grid[index] = GRIDWALL;
            this.didFirstClick = true;
        }

        if (this.canClickIndex(index)) {
            switch (this.grid[index]) {
                case GRIDWALL:
                    this.grid[index] = GRIDSPACE;
                    if (this.testAdjacent(x, y, GRIDWALL, true) === 8)
                        this.clearAdjacent(x, y);
                    break;
                case GRIDMINE:
                    this.dead = true;
                    // buffer should be empty at this point ..
                    this.drawWholeGrid();
                    break;
            }
        }

        //return index;
    };

    this.flagGrid = function(x, y) {
        var index = getIndex(x, y);
        if (this.canClickIndex(index)) {
            this.buffer[index] = true;
            this.flagged[index] = !this.flagged[index];
        }

        //return index;
    };

    // grid helpers
    this.canClickIndex = index => this.grid[index] !== GRIDSPACE && !this.flagged[index];

    this.clearAdjacent = function(x, y) {
        function checkAdj(xx, yy) {
            if (xx >= width || xx < 0 || yy >= height || yy < 0)
                return;
            
            var index = getIndex(xx, yy);
            if (that.grid[index] === GRIDWALL) {
                that.grid[index] = GRIDSPACE;
                that.clearAdjacent(xx, yy);
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

    this.testAdjacent = function(x, y, tile, countOOB) {
        function checkAdj(xx, yy) {
            if (xx >= width || xx < 0 || yy >= height || yy < 0)
                return countOOB ? 1 : 0;
            
            return (that.grid[getIndex(xx, yy)] === tile) ? 1 : 0;
        }

        const yd = y - 1;
        const yi = y + 1;
        const xd = x - 1;
        const xi = x + 1;

        return (
            // check top
            checkAdj(xd, yi) +
            checkAdj(x, yi) +
            checkAdj(xi, yi) +
            // check middle
            checkAdj(xd, y) +
            checkAdj(xi, y) +
            // check bottom
            checkAdj(xd, yd) +
            checkAdj(x, yd) +
            checkAdj(xi, yd)
        );
    };

    // generate mines
    if (mines > area)
        mines = area;

    for (var i = 0; i < mines; i++) {
        var index = randInt(0, area - 1);

        while (this.grid[index] === GRIDMINE) {
            if (index-- === 0)
                index = area - 1;
        }

        this.grid[index] = GRIDMINE;
    }

    // rendering
    const tilesheet = new Image();

    tilesheet.onload = () => onload();
    tilesheet.src = 'minesweeper/tilesheet.png';

    this.drawBuffer = function(buffer) {
        for (var i = 0; i < buffer.length; i++) {
            this.drawIndex(buffer[i]);
        }
    };

    this.drawWholeGrid = function() {
        for (var i = 0; i < area; i++) {
            this.drawIndex(i);
        }
    }

    this.drawIndex = function(index) {
        const x = (index % width)|0;
        const y = (index / width)|0;

        this.ctx.drawImage(
            tilesheet,
            this.getTileImgOffset(index, x, y) * TILESIZE, 0,
            TILESIZE, TILESIZE,
            x * TILESIZE, y * TILESIZE,
            TILESIZE, TILESIZE
        );
    };

    this.getTileImgOffset = function(index, x, y) {
        switch (this.grid[index]) {
            case GRIDMINE:
                if (this.dead)
                    return 0;
            case GRIDWALL:
                return (this.flagged[index] ? 2 : 1);
                break;
            case GRIDHARDSPACE:
                return 3;
                break;
            default:
                return 3 + this.testAdjacent(x, y, GRIDMINE, false);
        }
    };

    // mouse
    this.mouse = {
        clicking: false,
        x: 0, y: 0,

        updateMouse(e) {
            // were not gonna be clicking a lot so save perf
            if (!this.clicking)
                return;

            var rect = canvas.getBoundingClientRect();
            var scaleX = rect.width / canvas.width;
            var scaleY = rect.height / canvas.height;

            this.x = (e.clientX - rect.left) * scaleX;
            this.y = (e.clientY - rect.top) * scaleY;
        },

        // events
        onMouseDown(e) {
            this.clicking = true;
            this.updateMouse(e); 
            that.handleClickDown(this.x, this.y);

            e.preventDefault();
        },

        onMouseUp(e) {
            this.clicking = false;
            that.handleClickUp(this.x, this.y);

            e.preventDefault();
        },

        // event listeners
        start() {
            document.addEventListener('mousemove', updateMouse);
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
        },

        stop() {
            document.removeEventListener('mousemove', updateMouse);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        }
    };

    // event listener 'this' fixer functions
    const updateMouse = e => that.mouse.updateMouse(e);
    const onMouseDown = e => that.mouse.onMouseDown(e);
    const onMouseUp = e => that.mouse.onMouseUp(e);

    this.handleClickUp = function(x, y, rightClick) {
        if (this.dead)
            return;

        x = (x / TILESIZE)|0;
        y = (y / TILESIZE)|0;
        // dont register out of bound clicks
        if (x >= width || x < 0 || y >= height || y < 0) {
            this.drawWholeGrid();
            return;
        }

        //this.flushBuffer();
        rightClick ? this.flagGrid(x, y) : this.clearGrid(x, y);
        this.drawWholeGrid();
    };

    this.handleClickDown = function(x, y, rightClick) {
        if (this.dead)
            return;

        x = (x / TILESIZE)|0;
        y = (y / TILESIZE)|0;
        // dont register out of bound clicks
        if (x >= width || x < 0 || y >= height || y < 0)
                return;

        this.flushBuffer();
        // hack a lil animation in ;)
        var index = getIndex(x, y);

        if (this.canClickIndex(index)) {
            const tileBefore = this.grid[index];

            this.grid[index] = GRIDHARDSPACE;
            this.drawIndex(index);
            this.grid[index] = tileBefore;
        }
    };
};

export default MinesweeperInstance;