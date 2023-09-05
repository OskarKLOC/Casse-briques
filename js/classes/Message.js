import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Message extends Shape
{
    constructor (messages, x, y, important = true, size = 30, font = 'Arial', fillColor = 'black')
    {
      super(fillColor);
      this.location = new Point(x, y);
      this.size     = size;
      this.font     = font;
      this.messages  = messages;
      this.important = important;
    }

    draw (renderer)
    {
      renderer.context.beginPath();     

      // If this is an important message with no game in progress, we display a transparent rectangle above the last state of the game
      if (this.important) {
        renderer.context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        renderer.context.fillRect(0, 0, renderer.context.canvas.width, renderer.context.canvas.height);
      }

      // We display each attempted message
      renderer.context.font = `bold ${this.size}px ${this.font}`;
      renderer.context.fillStyle = this.fillColor;
      for (let i = 0; i < this.messages.length; i++) {
        let message = this.messages[i];
        let messageWidth = renderer.context.measureText(message).width;
        renderer.context.fillText(message, this.location.x - messageWidth / 2, this.location.y + i * (this.size * 1.5));
      }
    }
}