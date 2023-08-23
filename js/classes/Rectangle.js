import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Rectangle extends Shape
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
        renderer.context.strokeStyle = this.strokeColor;
        renderer.context.lineWidth = 5;
        renderer.context.strokeRect
        (
            this.location.x,
            this.location.y,
            this.width,
            this.height
        );
        renderer.context.fillStyle = this.fillColor;
        renderer.context.fillRect
        (
            this.location.x,
            this.location.y,
            this.width,
            this.height
        );
    }
}