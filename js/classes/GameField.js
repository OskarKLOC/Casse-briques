import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";

export class GameField
{
    constructor(canvasId)
    {
        // On récupère l'objet du DOM correspondant au canvas
        let canvas = document.getElementById(canvasId);
        
        // On redimenssionne le canvas pour que ses dimensions correspondent à ce que l'on attend
        // /!\ A ne pas faire dans le CSS directement car cela va générer une sorte de zoom
        canvas.width = window.innerWidth * 80 / 100;       // largeur du navigateur en pixels
        canvas.height = window.innerHeight * 80 / 100;    // hauteur du navigateur en pixels

        // On récupère le contexte pour du dessin 2D
        // Le commentaire qui précède permet d'indiquer le type, et donc d'avoir ensuite l'aide sur les propriétés et méthodes
        /** @type CanvasRenderingContext2D */
        this.context = canvas.getContext('2d');

        this.blocks = [];
        this.gifts = [];
        this.balls = [];

        this.paddle = new Paddle(
            this.context.canvas.width / 2 - 100 / 2,
            this.context.canvas.height - 50,
            100,
            10,
            'black',
            'red'
        );
        this.balls.push(new Ball(
            this.context.canvas.width / 2,
            this.context.canvas.height - 50 - 5,
            5,
            'black',
            'red'
        ));

        // On définit des valeurs par défaut avec des variables tampon qui seront nécessaires pour éviter les chevauchements
        this.strokeStyle = 'white';
        this.fillStyle = 'white';
        this.lineWidth = 2;

        // We initiate a void display of the canvas
        this.clearCanvas(this.fillStyle);

        this.gameOver = true;

        this.leftKeyPress = false;
        this.rightKeyPress = false;

        this.paddleShift = 10;
    }

    reset () {
        this.blocks = [];
        this.gifts = [];

        this.paddle = new Paddle(
            this.context.canvas.width / 2 - 100 / 2,
            this.context.canvas.height - 50,
            100,
            10,
            'black',
            'red'
        );
        this.ball = new Ball(
            this.context.canvas.width / 2,
            this.context.canvas.height - 50 - 5,
            5,
            'black',
            'red'
        );

        this.gameOver = false;
        this.paddleShift = 10;
    }

    // Efface ce qui est dessiné dans le canvas
    clearCanvas (color)
    {
        this.context.fillStyle = color;
        this.context.fillRect
        (
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
    }

    // Enregistre une nouvelle figure géométrique dans la liste de ce qu'il y a à dessiner
    addBlock (shape)
    {
        this.blocks.push(shape);
    }

    // Add a new gift to draw in the game Field
    addGift (shape)
    {
        this.gifts.push(shape);
    }

    // Move and draw all shapes in the canvas
    refresh ()
    {
        // First we clear the canvas of all previous shapes
        this.clearCanvas(this.strokeStyle);

        // We draw all the remaining blocks
        for (let block of this.blocks) {
            block.draw(this);
        }

        // We move and draw all the falling gifts
        for (let [index, gift] of this.gifts.entries()) {
            gift.move(this, index);
            gift.draw(this);
        }

        // We move and draw the paddle
        if (this.leftKeyPress) this.paddle.move(this, -this.paddleShift);
        if (this.rightKeyPress) this.paddle.move(this, this.paddleShift);
        this.paddle.draw(this);

        // We move and draw all the balls
        for (let [index, ball] of this.balls.entries()) {
            ball.move(this, index);
            ball.draw(this);
        }

        // If there is no stop to the game, we recall the current function
        if(!this.gameOver) window.requestAnimationFrame(() => this.refresh());
    }

    /* setup ()
    {
        

        // Quand on déplace la souris, si l'un des boutons de la souris est enfoncé, il faut dessiner dans le canvas
        this.context.canvas.addEventListener('mousemove', (event) => {
            if (this.isDrawing)
            {
                // event.clientX et event.clientY contiennent les coordonnées de la souris dans le canvas
                this.context.lineTo(event.clientX, event.clientY);
                this.context.stroke();
            }
        });

        // On définit un tableau de valeurs possibles pour les couleurs applicables
        let colors = [
            'white',
            'red',
            'blue',
            'green',
            'yellow'
        ];
        
        // On récupère la zone d'affichage des options de couleur
        let colorsBar = document.querySelector('#options-couleur');
        
        // On y injecte les blocs des différentes couleurs possibles
        for (const color of colors) {
            colorsBar.innerHTML += `<div class="option-couleur" data-color="${color}"></div>`;
        }

        // On récupère les blocs des différentes couleurs possibles
        let colorOptions = document.querySelectorAll('.option-couleur');
        
        // Pour chacun des blocs de couleur
        for (const colorOption of colorOptions) {
            // On lui applique la couleur correspondante
            colorOption.style.backgroundColor = colorOption.dataset.color;
            // On lui applique un écouteur d'évènement clic
            colorOption.addEventListener('click', (event) => {
                // En cas de clic, la couleur est appliquée au style de dessin
                this.strokeStyle = event.currentTarget.dataset.color;
            });
        }

        // On définit un tableau de valeurs possibles pour les épaisseurs applicables
        let widths = [
            '2',
            '4',
            '6',
            '8',
            '10'
        ];

        // On récupère la zone d'affichage des options d'épaisseur
        let widthsBar = document.querySelector('#options-epaisseur');
        
        // On y injecte les blocs des différentes épaisseurs possibles
        for (const width of widths) {
            widthsBar.innerHTML += `<div class="option-epaisseur" data-width="${width}"><div></div></div>`;
        }

        // On récupère les blocs des différentes épaisseurs possibles
        let widthOptions = document.querySelectorAll('.option-epaisseur');
        
        // Pour chacun des blocs d'épaisseur
        for (const widthOption of widthOptions) {
            // On lui applique l'épaisseur correspondante
            widthOption.firstChild.style.height = widthOption.dataset.width + 'px';
            widthOption.firstChild.style["margin-top"] = (15 - parseInt(widthOption.dataset.width) / 2) + 'px';
            // On lui applique un écouteur d'évènement clic
            widthOption.addEventListener('click', (event) => {
                // En cas de clic, l'épaisseur est appliquée au style de dessin
                this.lineWidth = event.currentTarget.dataset.width;
            });
        }

        // On récupère le bloc d'option de la gomme
        let eraseOption = document.querySelector('.fa-eraser');
        // On lui applique un écouteur d'évènement clic
        eraseOption.addEventListener('click', () => {
            // En cas de clic, on applique une couleur correspondant à la couleur de fond
            this.strokeStyle = 'black';
        });

        // On récupère le bloc d'option d'effacement complet
        let deleteOption = document.querySelector('.fa-delete-left');
        // On lui applique un écouteur d'évènement clic
        deleteOption.addEventListener('click', () => {
            // En cas de clic, on appelle la fonction qui permet d'applique le même fond sur l'ensemble du canvas
            this.clearCanvas('black');
        });

        // On efface tous les objets éventuellement préexistants et on impose une couleur de fond
        this.clearCanvas('black');
    } */
}