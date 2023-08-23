import { Gift } from './Gift.js';
import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Ball extends Shape
{
    constructor (x, y, radius, fillColor, strokeColor, shiftX = 2, shiftY = -2)
    {
        super(fillColor, strokeColor);
        this.location   = new Point(x, y);
        this.radius     = radius;
        this.shiftX     = shiftX;
        this.shiftY     = shiftY;
        this.isInvincible = false;
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
        renderer.context.lineWidth = 1;
        renderer.context.fillStyle = this.fillColor;
        renderer.context.stroke();
        renderer.context.fill();
    }

    move (gameField, index) {
        // We estimate the new location of the ball
        let newXLocation = this.location.x + this.shiftX;
        let newYLocation = this.location.y + this.shiftY;
    
        // Is the ball touching the left side of the canvas ?
        if (newXLocation - this.radius < 0) {
            // If yes, we adjust its position and its Y shift to prevent an exit from the field
            newXLocation = this.radius;
            this.shiftX = -this.shiftX;
        }
    
        // Is the ball touching the right side of the canvas ?
        if ((newXLocation + this.radius) > gameField.context.canvas.width) {
            // If yes, we adjust its position and its Y shift to prevent an exit from the field
            newXLocation = gameField.context.canvas.width - this.radius;
            this.shiftX = -this.shiftX;
        }
    
        // Is the ball touching the ceil of the canvas ?
        if (newYLocation - this.radius < 0) {
            // If yes, we adjust its position and its Y shift to prevent an exit from the field
            newYLocation = this.radius;
            this.shiftY = -this.shiftY;
        }
    
        // Is the ball touching the paddle ?
        if (newYLocation + this.radius > gameField.paddle.location.y && newYLocation - this.radius < gameField.paddle.location.y + gameField.paddle.height) {
            if ((newXLocation + this.radius > gameField.paddle.location.x) && (newXLocation - this.radius < gameField.paddle.location.x + gameField.paddle.width)) {
                // If yes, we adjust its position and its Y shift
                newYLocation = gameField.paddle.location.y - this.radius;
                this.shiftY = -this.shiftY;
                // Depending of the location and direction of the collision, we accelerate or deccelerate the X shift of the ball
                if (newXLocation < gameField.paddle.location.x + gameField.paddle.width / 4) {
                    this.shiftX = this.shiftX - 0.5;
                } else if (newXLocation < gameField.paddle.location.x + gameField.paddle.width / 2) {
                    this.shiftX = this.shiftX - 0.2;
                } else if (newXLocation < gameField.paddle.location.x + gameField.paddle.width * 3 / 4) {
                    this.shiftX = this.shiftX + 0.2;
                } else {
                    this.shiftX = this.shiftX + 0.5;
                }
            } 
        }
    
        // Si la balle touche le cadre en bas, on ajuste sa position pour l'empêcher de sortir et on lance les fonctions d'arrêt de jeu
        if ((newYLocation + this.radius) > gameField.context.canvas.height) {
            newYLocation = gameField.context.canvas.height - this.radius;
            if (gameField.balls.length > 1) {
                gameField.balls.splice(index, 1);
            } else {
                gameField.gameOver = true;
            }
        }

        // We search the indexes of all blocks with potential collision with the ball
        let touchedBlocksIndexes = gameField.blocks.reduce((indexes, block, index) => {
            if (newXLocation + this.radius > block.location.x
                && newXLocation - this.radius < block.location.x + block.width
                && newYLocation + this.radius > block.location.y
                && newYLocation - this.radius < block.location.y + block.height) {
                    indexes.push(index);
                }
                return indexes;
        }, []);

        // We select the closer block from the ball
        let touchedBlockIndex = -1;
        if (touchedBlocksIndexes.length > 1) {
            let distance = Number.MAX_SAFE_INTEGER;
            touchedBlocksIndexes.forEach(index => {
                let centreX = gameField.blocks[index].location.x + gameField.blocks[index].width / 2;
                let centreY = gameField.blocks[index].location.y + gameField.blocks[index].height / 2;
                let line = Math.sqrt((centreX - newXLocation) ** 2 + (centreY - newYLocation) ** 2);
                if (line < distance) {
                    distance = line;
                    touchedBlockIndex = index;
                }
            });
        } else if (touchedBlocksIndexes.length === 1) {
            touchedBlockIndex = touchedBlocksIndexes[0];
        }

        // We set the new shift and the new location of the ball depending of wich side of the block is touched
        if (touchedBlockIndex !== -1) {
            if (!this.isInvincible || gameField.blocks[touchedBlockIndex].isInvincible) {
                if (this.location.x + this.radius > gameField.blocks[touchedBlockIndex].location.x && this.location.x - this.radius < gameField.blocks[touchedBlockIndex].location.x + gameField.blocks[touchedBlockIndex].width) {
                    this.shiftY = -this.shiftY;
                    if (this.location.y - this.radius < gameField.blocks[touchedBlockIndex].location.y) {
                        newYLocation = gameField.blocks[touchedBlockIndex].location.y - this.radius;
                    } else {
                        newYLocation = gameField.blocks[touchedBlockIndex].location.y + gameField.blocks[touchedBlockIndex].height + this.radius;
                    }
                    newXLocation = this.location.x + this.shiftX * ((newYLocation - this.location.y) / this.shiftY);  
                } else {
                    this.shiftX = -this.shiftX;
                    if (this.location.x - this.radius < gameField.blocks[touchedBlockIndex].location.x) {
                        newXLocation = gameField.blocks[touchedBlockIndex].location.x - this.radius;
                    } else {
                        newXLocation = gameField.blocks[touchedBlockIndex].location.x + gameField.blocks[touchedBlockIndex].width + this.radius;
                    }
                    newYLocation = this.location.y + this.shiftY * ((newXLocation - this.location.x) / this.shiftX);
                }
            }
            if (!gameField.blocks[touchedBlockIndex].isInvincible) {
                if (gameField.blocks[touchedBlockIndex].durability > 1) {
                    gameField.blocks[touchedBlockIndex].decreaseDurability();
                } else {
                    if (gameField.blocks[touchedBlockIndex].gift) {
                        gameField.addGift(new Gift(
                            gameField.blocks[touchedBlockIndex].location.x,
                            gameField.blocks[touchedBlockIndex].location.y,
                            gameField.blocks[touchedBlockIndex].width,
                            gameField.blocks[touchedBlockIndex].height,
                            'green',
                            'black',
                            gameField.blocks[touchedBlockIndex].gift
                        ));
                    }
                    gameField.blocks.splice(touchedBlockIndex, 1);
                }
            }
        }
        
        // We set the new location of the ball
        this.location.x = newXLocation;
        this.location.y = newYLocation;   
    }

    setIsInvincible (isInvincible) {
        this.isInvincible = isInvincible;
    }
}