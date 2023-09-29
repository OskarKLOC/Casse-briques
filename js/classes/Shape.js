export class Shape {
    /**
     * Set a new Shape object
     * @param {String} fillColor The color used to fill the shape
     * @param {String} strokeColor The color used to stroke the shape
     * @returns {Shape} The new Shape object correctly initiate
     */
    constructor(fillColor, strokeColor) {
        this.strokeColor    = strokeColor ?? 'transparent';
        this.fillColor      = fillColor ?? 'transparent';
    }

    /**
     * Set the new fill color
     * @param {String} fillColor The color used to fill the shape
     * @returns {null} No return attempted
     */
    setFillColor (fillColor) {
        this.fillColor = fillColor;
    }

    /**
     * Set the new stroke color
     * @param {String} strokeColor The color used to stroke the shape
     * @returns {null} No return attempted
     */
    setStrokeColor (strokeColor) {
        this.strokeColor = strokeColor;
    }
}