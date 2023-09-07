import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { Block } from "./Block.js";
import { Message } from "./Message.js";

const GAME_BOARD_WIDTH_PERCENTAGE = 80;
const GAME_BOARD_HEIGHT_PERCENTAGE = 80;
const MIN_RADIUS_BALL = 3.5;
const MAX_RADIUS_BALL = 5;
const MIN_WIDTH_PADDLE = 50;
const MAX_WIDTH_PADDLE = 100;

export class GameField
{
    constructor(canvasId)
    {
        // We get our dom object canvas
        let canvas = document.getElementById(canvasId);
        
        // We resize the canvas to our expectations
        // /!\ Must not be done in CSS to avoid zoom effect
        canvas.width = window.innerWidth * GAME_BOARD_WIDTH_PERCENTAGE / 100;
        canvas.height = window.innerHeight * GAME_BOARD_HEIGHT_PERCENTAGE / 100;

        // We get the context for 2D rendering
        /** @type CanvasRenderingContext2D */
        this.context = canvas.getContext('2d');

        // We define default values if needed to a specific display
        this.strokeStyle = 'white';
        this.fillStyle = 'white';
        this.lineWidth = 2;

        // We initiate a void display of the canvas
        this.clearCanvas(this.fillStyle);

        // We prepare our game tools
        this.blocks = [];
        this.gifts = [];
        this.balls = [];

        // We set the beginning values for our game run
        this.isFirstLaunch = true;
        this.isVictory = false;
        this.gameOver = true;

        // We initiate values linked to our paddle move
        this.leftKeyPress = false;
        this.rightKeyPress = false;
        this.paddleShift = 10;

        // We initiate the needed event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('keydown', (event) => this.keyDownControl(event));
        document.addEventListener('keyup', (event) => this.keyUpControl(event));
        document.addEventListener('mousemove', (event) => this.mouseControl(event));
        this.context.canvas.addEventListener('touchmove', (event) => this.touchControl(event));
    }

    // Reset the common parameters of the game
    reset () {
        this.blocks = [];
        this.gifts = [];
        this.balls = [];
        this.gameOver = false;
        this.isVictory = false;
        this.paddleShift = 10;
    }

    // Adapt the game display to the new size of the window
    resize () {
        // Save old dimensions of the canvas to permit the resizing
        let oldCanvasWidth = this.context.canvas.width;
        let oldCanvasHeight = this.context.canvas.height;

        // Set the new canvas dimensions
        this.context.canvas.width = window.innerWidth * 80 / 100;
        this.context.canvas.height = window.innerHeight * 80 / 100;

        // Calculate blocks new distribution and size
        this.blocks.forEach((block, index) => {
            this.blocks[index].location.x = block.location.x / oldCanvasWidth * this.context.canvas.width;
            this.blocks[index].location.y = block.location.y / oldCanvasHeight * this.context.canvas.height;
            this.blocks[index].width = block.width / oldCanvasWidth * this.context.canvas.width;
            this.blocks[index].height = block.height / oldCanvasHeight * this.context.canvas.height;
        });

        // Calculate gifts new distribution and size
        this.gifts.forEach((gift, index) => {
            this.gifts[index].location.x = gift.location.x / oldCanvasWidth * this.context.canvas.width;
            this.gifts[index].location.y = gift.location.y / oldCanvasHeight * this.context.canvas.height;
            this.gifts[index].width = gift.width / oldCanvasWidth * this.context.canvas.width;
            this.gifts[index].height = gift.height / oldCanvasHeight * this.context.canvas.height;
        });

        // Calculate balls new locations and size
        this.balls.forEach((ball, index) => {
            this.balls[index].location.x = ball.location.x / oldCanvasWidth * this.context.canvas.width;
            this.balls[index].location.y = ball.location.y / oldCanvasHeight * this.context.canvas.height;
            let radius = ball.radius / oldCanvasWidth * this.context.canvas.width;
            if (radius > MAX_RADIUS_BALL) radius = MAX_RADIUS_BALL;
            if (radius < MIN_RADIUS_BALL) radius = MIN_RADIUS_BALL;
            this.balls[index].radius = radius;
        });

        // Calculate paddle new location and size
        this.paddle.location.x = this.paddle.location.x / oldCanvasWidth * this.context.canvas.width;
        this.paddle.location.y = this.paddle.location.y / oldCanvasHeight * this.context.canvas.height;
        let paddleWidth = this.context.canvas.width / 10;
        if (paddleWidth < MIN_WIDTH_PADDLE) paddleWidth = MIN_WIDTH_PADDLE;
        if (paddleWidth > MAX_WIDTH_PADDLE) paddleWidth = MAX_WIDTH_PADDLE;
        this.paddle.width = paddleWidth;
        this.paddle.height = this.paddle.height / oldCanvasHeight * this.context.canvas.height;

        // Launch a refresh of the canvas display only if the game is not running
        if (this.gameOver || this.isVictory || this.isFirstLaunch) this.refresh();
    }

    // Clear all the drawings in our canvas
    clearCanvas (color)
    {
        this.context.fillStyle = color;
        this.context.fillRect
        (
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
    }

    // Add a new block to draw in the game Field
    addBlock (shape)
    {
        this.blocks.push(shape);
    }

    // Add a new gift to draw in the game Field
    addGift (shape)
    {
        this.gifts.push(shape);
    }

    // Move and draw all shapes in the canvas
    refresh () {
        // First we clear the canvas of all previous shapes
        this.clearCanvas(this.strokeStyle);

        // We draw all the remaining blocks
        for (let block of this.blocks) {
            block.draw(this);
        }

        // We move and draw all the falling gifts
        for (let [index, gift] of this.gifts.entries()) {
            if (!this.gameOver) gift.move(this, index);
            gift.draw(this);
        }

        // We move and draw the paddle
        if (this.leftKeyPress && !this.gameOver) this.paddle.move(this, -this.paddleShift);
        if (this.rightKeyPress && !this.gameOver) this.paddle.move(this, this.paddleShift);
        this.paddle.draw(this);

        // We move and draw all the balls
        for (let [index, ball] of this.balls.entries()) {
            if (!this.gameOver) ball.move(this, index);
            ball.draw(this);
        }

        // We check if there is a remaining block during the game
        if (!this.isFirstLaunch && this.blocks.length === 0) {
            this.isVictory = true;
            this.gameOver = true;
        }

        // If there is a game stop, we display a message, if not we recall the current function
        if (this.isFirstLaunch) {
            new Message(['Bienvenue dans Casse-briques !', 'Tapez sur la touche Entrée pour commencer'],  this.context.canvas.width / 2, this.context.canvas.height / 2, true, Math.round(this.context.canvas.width / 30)).draw(this);
        } else if (this.isVictory) {
            new Message(['Félicitations !', 'Vous avez gagné !', 'Tapez sur la touche Entrée pour recommencer'],  this.context.canvas.width / 2, this.context.canvas.height / 2, true, Math.round(this.context.canvas.width / 30)).draw(this);
        } else if (this.gameOver) {
            new Message(['Game Over !', 'Tapez sur la touche Entrée pour recommencer'],  this.context.canvas.width / 2, this.context.canvas.height / 2, true, Math.round(this.context.canvas.width / 30)).draw(this);
        } else {
            window.requestAnimationFrame(() => this.refresh());
        }
    }

    // Create a default grid of blocks
    createBlocks () {
        // We define the parameters of the grid
        let blocksPerLine = 50;
        let blockWidth = this.context.canvas.clientWidth / blocksPerLine;
        let blocksPerColumn = 35;
        let blockHeight = this.context.canvas.clientHeight / 1.5 / blocksPerColumn;

        // We initiate the game board
        for (let i = 0; i < blocksPerLine; i++) {
            for (let j = 0; j < blocksPerColumn; j++) {
                this.addBlock(new Block(i*blockWidth, 20 + j*blockHeight, blockWidth, blockHeight, 'black', 'red', 1, 'ball-add-one', false)); 
            }
        }
    }

    // Create a new ball
    createBall(color) {
        // We define the parameters of the new ball
        let radius = 3 / 5 / 100 * this.context.canvas.width;
        if (radius > MAX_RADIUS_BALL) radius = MAX_RADIUS_BALL;
        if (radius < MIN_RADIUS_BALL) radius = MIN_RADIUS_BALL;
        let xLocation = this.paddle ? this.paddle.location.x + this.paddle.width / 2 : this.context.canvas.width / 2;
        let yLocation = this.paddle ? this.paddle.location.y - radius : this.context.canvas.height - 50 - radius;

        // We set the ball on the game board
        this.balls.push(new Ball(xLocation, yLocation, radius, color, 'red'));
    }

    // Initialize a new game board
    setup () {
        // Creating a new default distribution of blocks
        this.createBlocks();

        // Creating a new default paddle which size and location depend of canvas width and height
        let paddleWidth = this.context.canvas.width / 10;
        if (paddleWidth < MIN_WIDTH_PADDLE) paddleWidth = MIN_WIDTH_PADDLE;
        if (paddleWidth > MAX_WIDTH_PADDLE) paddleWidth = MAX_WIDTH_PADDLE;
        this.paddle = new Paddle(
            this.context.canvas.width / 2 - paddleWidth / 2,
            this.context.canvas.height - paddleWidth / 2,
            paddleWidth,
            paddleWidth / 10,
            'black',
            'red'
        );

        // Creating a new default first ball
        this.createBall('black');
    }

    // Relating keys donw controls to specific actions
    keyDownControl (event) {
        switch (event.key) {
            case 'ArrowLeft':
                this.leftKeyPress = true;
                break;
            case 'ArrowRight':
                this.rightKeyPress = true;
                break;
            default:
                break;
        }
    }

    // Relating keys up controls to specific actions
    keyUpControl (event) {
        switch (event.key) {
            case 'Enter':
                if (this.gameOver) {
                    this.isFirstLaunch = false;
                    this.reset();
                    this.setup();
                    window.requestAnimationFrame(() => this.refresh());
                }
                break;
            case 'ArrowLeft':
                this.leftKeyPress = false;
                break;
            case 'ArrowRight':
                this.rightKeyPress = false;
                break;
            default:
                break;
        }
    }

    // Handling mouse actions
    mouseControl (event) {
        if (!this.gameOver) this.paddle.move(this, 0, event.clientX);
    }

    // Handling touch actions
    touchControl (event) {
        let touch = event.touches[0];
        if (!this.gameOver) this.paddle.move(this, 0, touch.clientX);
    }
}