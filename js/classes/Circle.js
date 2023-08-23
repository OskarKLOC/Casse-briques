import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Circle extends Shape
{
    constructor (x, y, radius, fillColor, strokeColor)
    {
        super(fillColor, strokeColor);
        this.location       = new Point(x, y);
        this.radius         = radius;
    }

    draw (renderer)
    {
        renderer.context.beginPath();
        renderer.context.arc
        (
            this.location.x,
            this.location.y,
            this.radius,
            0,              // On ne cherche à tracer que des cercles avec notre classe, la valeur sera donc toujours la même
            Math.PI * 2     // On ne cherche à tracer que des cercles avec notre classe, la valeur sera donc toujours la même
        );
        renderer.context.strokeStyle = this.strokeColor;
        renderer.context.lineWidth = 5;
        renderer.context.fillStyle = this.fillColor;
        renderer.context.stroke();
        renderer.context.fill();
    }
}