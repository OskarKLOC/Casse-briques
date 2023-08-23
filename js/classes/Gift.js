import { Ball } from './Ball.js';
import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Gift extends Shape
{
    constructor (x, y, width, height, fillColor, strokeColor, effect)
    {
        super(fillColor, strokeColor);
        this.location   = new Point(x, y);
        this.width      = width;
        this.height     = height;
        this.shift      = 2;
        this.effect     = effect;
    }

    draw (renderer)
    {
        renderer.context.beginPath();
        renderer.context.strokeStyle = this.strokeColor;
        renderer.context.lineWidth = 2;
        renderer.context.fillStyle = this.fillColor;
        renderer.context.roundRect(
            this.location.x,
            this.location.y,
            this.width,
            this.height,
            this.height / 2
        );
        renderer.context.stroke();
        renderer.context.fill();
    }

    move (gameField, index) {
        // We estimate the new gift location
        let newLocation = this.location.y + this.shift;

        // Is the gift touching the paddle ?
        if (newLocation < gameField.paddle.location.y + gameField.paddle.height && newLocation + this.height > gameField.paddle.location.y
            && this.location.x < gameField.paddle.location.x + gameField.paddle.width && this.location.x + this.width > gameField.paddle.location.x) {
                // If yes, we apply the effect of this gift and we unset it from the game field
                this.applyEffect(gameField);
                gameField.gifts.splice(index, 1);
        // Is the gift touching the bottom of the game field ?
        } else if (newLocation + this.height > gameField.context.canvas.height) {
            // If yes, we unset the gift from the list
            gameField.gifts.splice(index, 1);
        } else {
            // If not, we set the new position to the current gift
            this.location.y = newLocation;
        }
    }

    applyEffect (gameField) {
        switch (this.effect) {
            case 'paddle-bigger':
                if (gameField.paddle.width < gameField.context.canvas.width / 3) {
                    gameField.paddle.width = gameField.paddle.width * 2;
                }
                break;
            case 'paddle-smaller':
                if (gameField.paddle.width > gameField.context.canvas.width / 40) {
                    gameField.paddle.width = gameField.paddle.width / 2;
                }
                break;
            case 'paddle-higher':
                gameField.paddle.location.y = gameField.context.canvas.height - 150;
                break;
            case 'paddle-lower':
                gameField.paddle.location.y = gameField.context.canvas.height - 50;
                break;
            case 'ball-bigger':
                for (let ball of gameField.balls) {
                    if (ball.radius === 12) ball.radius = 15;
                    if (ball.radius === 9) ball.radius = 12;
                    if (ball.radius === 7) ball.radius = 9;
                    if (ball.radius === 5) ball.radius = 7;
                    if (ball.radius === 3) ball.radius = 5;
                    if (ball.radius === 1) ball.radius = 3;
                }
                break;
            case 'ball-smaller':
                for (let ball of gameField.balls) {
                    if (ball.radius === 3) ball.radius = 1;
                    if (ball.radius === 5) ball.radius = 3;
                    if (ball.radius === 7) ball.radius = 5;
                    if (ball.radius === 9) ball.radius = 7;
                    if (ball.radius === 12) ball.radius = 9;
                    if (ball.radius === 15) ball.radius = 12;
                }
                break;
            case 'ball-invincible':
                for (let ball of gameField.balls) {
                    ball.setIsInvincible(true);
                    setTimeout(() => ball.setIsInvincible(false), 5000);
                }
                break;
            case 'ball-add-one':
                gameField.balls.push(new Ball(
                    gameField.paddle.location.x + gameField.paddle.width / 2,
                    gameField.paddle.location.y - 5,
                    5,
                    'blue',
                    'red'
                ));
                break;  
            default:
                break;
        }
    }
}