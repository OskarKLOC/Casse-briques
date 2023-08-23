export class Point
{
    constructor(x, y)
    {
        this.x = x + 0.5;
        this.y = y + 0.5;
    }

    move (x, y) {
        this.x = x + 0.5;
        this.y = y + 0.5;
    }
}