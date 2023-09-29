export class Point {
    /**
     * Set a new Point object
     * @param {Number} x The location on x axis
     * @param {Number} y The location on y axis
     * @returns {Point} The new Point object correctly initiate
     */
    constructor(x, y) {
        this.x = x + 0.5; // We add 0.5 to prevent the blur of the display
        this.y = y + 0.5; // We add 0.5 to prevent the blur of the display
    }

    /**
     * Set the new location of the point
     * @param {Number} x The location on x axis
     * @param {Number} y The location on y axis
     * @returns {null} No return attempted
     */
    move (x, y) {
        this.x = x + 0.5;
        this.y = y + 0.5;
    }
}