import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Block extends Shape
{
    constructor (x, y, width, height, fillColor, strokeColor, durability = 1, gift, isInvincible = false)
    {
        super(fillColor, strokeColor);
        this.location       = new Point(x, y);
        this.width          = width;
        this.height         = height;
        this.durability     = durability;
        this.isInvincible   = isInvincible;
        if (gift) this.gift = gift;
    }

    // Display the current block
    draw (renderer)
    {
        renderer.context.strokeStyle = this.strokeColor;
        renderer.context.lineWidth = 2;
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

    // Decrease the durability of the current block
    decreaseDurability () {
        this.durability -= 1;
    }

    // Add a gift to the current block
    addGift (gift) {
        this.gift = gift;
    }
}