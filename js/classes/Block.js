import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Block extends Shape {
    /**
     * Set a new Block object
     * @param {Number} x The top left corner location on x axis
     * @param {Number} y The top left corner location on y axis
     * @param {Number} width The block's width
     * @param {Number} height The block's height
     * @param {String} fillColor The color used to fill the block
     * @param {String} strokeColor The color used to stroke the block
     * @param {Number} durability The durability of the block
     * @param {String} gift The optionnal gift associated to the block
     * @param {Boolean} isInvincible The optionnal invincibility indicator of the block
     * @returns {Block} The new Block object correctly initiate
     */
    constructor (x, y, width, height, fillColor, strokeColor, durability = 1, gift, isInvincible = false) {
        super(fillColor, strokeColor);
        this.location       = new Point(x, y);
        this.width          = width;
        this.height         = height;
        this.durability     = durability;
        this.isInvincible   = isInvincible;
        if (gift && gift !== 'none') this.gift = gift;
    }

    /**
     * Display the current block
     * @param {GameField} renderer The current GameField object using the canvas renderer
     * @returns {null} No return attempted
     */
    draw (renderer) {
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

    /**
     * Decrease the durability of the current block
     * @returns {null} No return attempted
     */
    decreaseDurability () {
        this.durability -= 1;
    }

    /**
     * Add a gift to the current block
     * @param {String} gift The optionnal gift associated to the block
     * @returns {null} No return attempted
     */
    addGift (gift) {
        this.gift = gift;
    }
}