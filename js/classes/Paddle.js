import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Paddle extends Shape
{
    constructor (x, y, width, height, fillColor, strokeColor)
    {
        super(fillColor, strokeColor);
        this.location       = new Point(x, y);
        this.width          = width;
        this.height         = height;
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

    move (gameField, shift, position = null) {
        // The new paddle location is the mouse position if we move this one, or the old location with an added shift if we make a key press
        let newXLocation = position === null ? this.location.x + shift : position - gameField.context.canvas.offsetLeft - this.width / 2;
    
        // The new position can't be lesser than 0
        if (newXLocation < 0) newXLocation = 0;
    
        // The new position can't be greater than the canvas width
        if ((newXLocation + this.width) > gameField.context.canvas.width) newXLocation = gameField.context.canvas.width - this.width;
    
        // We set the new position to the current paddle
        this.location.x = newXLocation;
    }
}