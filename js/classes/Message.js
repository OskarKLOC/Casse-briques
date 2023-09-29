import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Message extends Shape {
  /**
     * Set a new Message object
     * @param {Array} messages An array of string contents to display
     * @param {Number} x The top left corner location on x axis
     * @param {Number} y The top left corner location on y axis
     * @param {Boolean} important An indicator of importance of our message
     * @param {Number} size The size of the font of our message
     * @param {String} font The font of our message
     * @param {String} fillColor The color used to fill the message
     * @returns {Message} The new Message object correctly initiate
     */
    constructor (messages, x, y, important = true, size = 30, font = 'Arial', fillColor = 'black') {
      super(fillColor);
      this.location = new Point(x, y);
      this.size     = size;
      this.font     = font;
      this.messages  = messages;
      this.important = important;
    }

    /**
     * Display the current message on the game field
     * @param {GameField} renderer The current GameField object using the canvas renderer
     * @returns {null} No return attempted
     */
    draw (renderer) {
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