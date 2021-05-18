const settings = {
    // settings
    // Beginner     –  9*9  Board and 10 Mines
    // Intermediate – 16*16 Board and 40 Mines
    // Advanced     – 24*24 Board and 99 Mines
    width: 9,
    height: 9,
    mines: 10,

    onsubmit: () => {}, // to be set externally

    // a popup with a form
    popupSettings() {
        var win = window.open("./src/settings", "game settings", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=450,height=350,top="+(screen.height/2 - 350/2)+",left="+(screen.width/2 - 450/2));
        win.onload = function() {
            win.latchSettings(settings);
        };
    }
};

export default settings;