export class Shape
{
    constructor(fillColor, strokeColor)
    {
        this.strokeColor    = strokeColor ?? 'transparent'; // permet de proposer une valeur par défaut (via une valeur, une fonction ou autre)
        this.fillColor      = fillColor ?? 'transparent'; // permet de proposer une valeur par défaut (via une valeur, une fonction ou autre)
    }

    setFillColor (fillColor)
    {
        this.fillColor = fillColor;
    }

    setStrokeColor (strokeColor)
    {
        this.strokeColor = strokeColor;
    }
}