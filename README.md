# `minesweeper.js`
a Minesweeper port for the browser !
it works on phones too and you can try it [here](https://nectarboy.github.io/minesweeper.js) !

---
<!-- this is the ugliest shit ever but it works heheheh -->
<img src='https://github.com/nectarboy/minesweeper.js/blob/main/src/img/smiley_caution.png?raw=true'> <img src='https://github.com/nectarboy/minesweeper.js/blob/main/src/img/smiley_caution.png?raw=true'> <img src='https://github.com/nectarboy/minesweeper.js/blob/main/src/img/smiley_caution.png?raw=true'>

## introduction
this port tries to be as faithful as possible to the original game,
concerning rules, feel, and especially UI :3

some things havent been added, like the score,
and some things are a lil different, like the smiley button

all the rules are the same as the original minesweeper :)

![example](https://github.com/nectarboy/minesweeper.js/blob/main/doc/lessgooo.png?raw=true 'lessgooo')

## importing
>`minesweeper.js` is modular, so be aware of that
```html
<script type='module'>
```

>then you can create minesweeper game instances at will
```javascript
import MinesweeperInstance from './minesweeper/minesweeper.js';

// create a new instance !
var instance = new MinesweeperInstance(canvas, width, height, mines);
instance.onload = function() {
    this.drawWholeGrid();
    this.mouse.start();
};
```

---

nectarboy - 2021
