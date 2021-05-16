
// controller
const mouse = {
    clicking: false,
    preX: 0, preY: 0,
    x: 0, y: 0,

    updateMouse(e) {
        // were not gonna be clicking a lot so save perf
        if (!this.clicking)
            return;

        var rect = html.canvas.getBoundingClientRect();
        var scaleX = rect.width / html.canvas.width;
        var scaleY = rect.height / html.canvas.height;

        this.preX = this.x;
        this.preY = this.y;

        this.x = (e.clientX - rect.left) * scaleX;
        this.y = (e.clientY - rect.top) * scaleY;
    },

    // events
    onMouseDown(e) {
        this.updateMouse(e); 
        this.clicking = true;
    },

    onMouseUp(e) {
        this.clicking = false;
    },

    // event listeners
    Start() {
        canvas.addEventListener('mousemove', updateMouse);
        canvas.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
    },

    Stop() {
        canvas.removeEventListener('mousemove', updateMouse);
        canvas.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
    }
};

// event listener 'this' fixer functions
const updateMouse = e => that.mouse.updateMouse(e);
const onMouseDown = e => that.mouse.onMouseDown(e);
const onMouseUp = e => that.mouse.onMouseUp(e);