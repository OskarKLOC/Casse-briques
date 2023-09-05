import { GameField } from "./classes/GameField.js";

let gameField; // DOM object associated to the game board        

// Waiting for the end of content load before lauching our script
window.addEventListener('DOMContentLoaded', initialization);


function initialization () {
    // We create the game board
    gameField = new GameField('game-field');

    // We set a new game
    gameField.setup();
    
    // We display the initial set of the game
    // All the game is managed by the gameField object
    gameField.refresh();
}
