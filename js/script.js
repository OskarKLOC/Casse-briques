import { GameField } from "./classes/GameField.js";
import { Block } from "./classes/Block.js";

let gameField;          // DOM object associated to the game field        

// Waiting for the end of content load before lauching our script
window.addEventListener('DOMContentLoaded', initialization);

// Relating keys donw controls to specific actions
function keyDownControl (event) {
    switch (event.key) {
        case 'ArrowLeft':
            gameField.leftKeyPress = true;
            break;
        case 'ArrowRight':
            gameField.rightKeyPress = true;
            break;
        default:
            break;
    }
}

// Relating keys up controls to specific actions
function keyUpControl (event) {
    switch (event.key) {
        case 'Enter':
            if (gameField.gameOver === true) {
                gameField.reset();
                createBlocks();
                window.requestAnimationFrame(() => gameField.refresh());
            }
            break;
        case 'ArrowLeft':
            gameField.leftKeyPress = false;
            break;
        case 'ArrowRight':
            gameField.rightKeyPress = false;
            break;
        default:
            break;
    }
}

// Handling mouse actions
function mouseControl (event) {
    gameField.paddle.move(gameField, 0, event.clientX);
}

function createBlocks () {
    let blocksPerLine = 50;
    let blockWidth = gameField.context.canvas.clientWidth / blocksPerLine;
    let blocksPerColumn = 35;
    let blockHeight = gameField.context.canvas.clientHeight / 1.5 / blocksPerColumn;

    // Initiate game board
    for (let i = 0; i < blocksPerLine; i++) {
        for (let j = 0; j < blocksPerColumn; j++) {
            gameField.addBlock(new Block(i*blockWidth, 20 + j*blockHeight, blockWidth, blockHeight, 'black', 'red', 1, 'ball-add-one', false)); 
        }
    }
}

function initialization () {

    // Initiate the game board
    gameField = new GameField('game-field');
    // renderer.setup();

    createBlocks();
    
    gameField.refresh();

    // Initiate event listeners
    document.addEventListener('keydown', keyDownControl);
    document.addEventListener('keyup', keyUpControl);
    gameField.context.canvas.addEventListener('mousemove', mouseControl);
}
