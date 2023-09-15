export class Shape {
    constructor(fillColor, strokeColor) {
        this.strokeColor    = strokeColor ?? 'transparent';
        this.fillColor      = fillColor ?? 'transparent';
    }

    setFillColor (fillColor) {
        this.fillColor = fillColor;
    }

    setStrokeColor (strokeColor) {
        this.strokeColor = strokeColor;
    }
}