"use strict";

///////////////////deklaráció////////////////////////////

var revertTimeout;
var lastUpdate;
var deltaTime
var desiredFPS;
var actualFPS

var scoreDisplay;
var effectDisplay;
var applyButton;

var tableHeight;
var tableWidth;
var canvas = $("canvas");
var cContext = canvas.getContext("2d");



////////////////sárkány/////////////////////////////

var _snake = {
    snakeGirth: 0,
    actualEffect: '-',

    snake: [],
    snakeLength: 0,
    velocity: 0,
    negativeVelocity: 0,
    actualVelocity: 0,
    direction: 'R',
    nextDir: 'R',
    negativeDir: 'L',

    isSnakeCollision: function () {

        var headX = _snake.snake[0].x;
        var headY = _snake.snake[0].y;

        for (var i = 1; i < _snake.snakeLength; ++i) {
            if (headX == _snake.snake[i].x && headY == _snake.snake[i].y) {
                return true;
            }
        }

        return false;
    },

    isBorderCollision: function () {

        if (_snake.snake[0].x > ((tableWidth) - 1) || _snake.snake[0].x < 0 || _snake.snake[0].y < 0 || _snake.snake[0].y > ((tableHeight) - 1)) {
            return true;
        }

        return false;
    },

    controller: function () {

        var headX = _snake.snake[0].x;
        var headY = _snake.snake[0].y;

        if (this.nextDir != this.negativeDir && this.nextDir != this.direction) {
            this.direction = this.nextDir;

            if (this.direction == 'L') {
                this.actualVelocity = this.negativeVelocity;
                this.negativeDir = 'R';
            } else if (this.direction == 'R') {
                this.actualVelocity = this.velocity;
                this.negativeDir = 'L';
            } else if (this.direction == 'D') {
                this.actualVelocity = this.velocity;
                this.negativeDir = 'U';
            } else if (this.direction == 'U') {
                this.actualVelocity = this.negativeVelocity;
                this.negativeDir = 'D';
            }
        }

        var node = _snake.snake.pop();

        if (_snake.direction == 'R' || _snake.direction == 'L') {
            node.x = headX + _snake.actualVelocity;
            node.y = headY
        } else {
            node.y = headY + _snake.actualVelocity;
            node.x = headX;
        }

        _snake.snake.unshift(node);
    },
}


////////////////tereptárgyak/////////////////////////

var _obstacle = {
    numberOfObstacles: 0,
    obstacles: [],

    isCollision: function () {
        for (var i = 0; i < this.numberOfObstacles; ++i) {
            if (_obstacle.obstacles[i].x < _snake.snake[0].x + 1 &&
                _obstacle.obstacles[i].x + 1 > _snake.snake[0].x &&
                _obstacle.obstacles[i].y < _snake.snake[0].y + 1 &&
                1 + _obstacle.obstacles[i].y > _snake.snake[0].y) {
                return true;
            }
        }

        return false;
    },

    generatePosition: function (j) {
        var posX = Math.floor(Math.random() * tableWidth);
        var posY = Math.floor(Math.random() * tableHeight);

        this.obstacles[j].x = posX;
        this.obstacles[j].y = posY;

        while (posX < _snake.snake[0].x + 5 &&
            posX + 1 > _snake.snake[0].x &&
            posY < _snake.snake[0].y + 5 &&
            1 + posY > _snake.snake[0].y) {


            posX = Math.floor(Math.random() * tableWidth);
            posY = Math.floor(Math.random() * tableHeight);

            this.obstacles[j].x = posX;
            this.obstacles[j].y = posY;
        }


        for (var i = 0; i < this.obstacles.length - 1; ++i) {
            while (posX == this.obstacles[i].x && posY == this.obstacles[i].y) {
                posX = Math.floor(Math.random() * tableWidth);
                posY = Math.floor(Math.random() * tableHeight);

                this.obstacles[j].x = posX;
                this.obstacles[j].y = posY;
            }
        }
    },

    generateObstacles: function () {
        this.obstacles = [];

        for (var i = 0; i < this.numberOfObstacles; ++i) {
            this.obstacles[i] = { x: 0, y: 0 };
            _obstacle.generatePosition(i);
        }
    }
}


/////////////////////////////tekercsek//////////////////////////

var _scroll = {

    x: 0,
    y: 0,

    /* */
        wisdomProb: [-1, -1],
        mirrorProb: [31, 99],
        reverserProb: [-1, -1],
        greedProb: [-1, -1],
        slothProb: [-1, -1],
        gluttonProb: [1, 30],
       /* */
        
        /*
    wisdomProb: [0, 79],
    mirrorProb: [80, 83],
    reverserProb: [84, 87],
    greedProb: [88, 91],
    slothProb: [92, 95],
    gluttonProb: [96, 99],
    */


    sprite: document.createElement("img"),
    
    
    //Bölcsesség
    isWisdom: false,
    //Tükrök
    isMirror: false,
    //Fordítás
    isReverser: false,
    //Mohóság
    isGreed: false,
    //Lustaság
    isSloth: false,
    //Falánkság
    isGlutton: false,

    assignRandomEffect: function () {
        var rand = Math.round(Math.random() * 100);

        this.isWisdom = false;
        this.isMirror = false;
        this.isReverser = false;
        this.isGreed = false;
        this.isSloth = false;
        this.isGlutton = false;

        if (rand >= this.wisdomProb[0] && rand <= this.wisdomProb[1]) {
            this.isWisdom = true;
            this.sprite.src = "sprites\\wisdom.png";

        }
        else if (rand >= this.mirrorProb[0] && rand <= this.mirrorProb[1]) {
            this.isMirror = true;
            this.sprite.src = "sprites\\mirror.png";
        }
        else if (rand >= this.reverserProb[0] && rand <= this.reverserProb[1]) {
            this.isReverser = true;
            this.sprite.src = "sprites\\reverser.png";
        }
        else if (rand >= this.greedProb[0] && rand <= this.greedProb[1]) {
            this.isGreed = true;
            this.sprite.src = "sprites\\greed.png";
        }
        else if (rand >= this.slothProb[0] && rand <= this.slothProb[1]) {
            this.isSloth = true;
            this.sprite.src = "sprites\\sloth.png";

        }
        else if (rand >= this.gluttonProb[0] && rand <= this.gluttonProb[1]) {
            this.isGlutton = true;
            this.sprite.src = "sprites\\glutton.png";

        }
    },

    isCollision: function () {
        for (var i = 0; i < _snake.snakeLength; ++i) {
            if (_scroll.x < _snake.snake[i].x + 1 &&
                _scroll.x + 1 > _snake.snake[i].x &&
                _scroll.y < _snake.snake[i].y + 1 &&
                1 + _scroll.y > _snake.snake[i].y) {

                return true;
            }
        }

        return false;
    },

    onCollison: function () {

        var tailNode = _snake.snake[_snake.snakeLength - 1];

        revertState();

        if (this.isWisdom) {
            for (var i = 0; i < 4; ++i) {
                _snake.snake.push({ x: tailNode.x, y: tailNode.y });
                _snake.snakeLength++;
            }
            _snake.actualEffect = "Bölcsesség";
            this.isWisdom = false;
        }
        else if (this.isMirror) {
            _snake.velocity = -1 * _snake.velocity;
            _snake.negativeVelocity = -1 * _snake.velocity;

            _snake.actualEffect = "Tükrök";
            this.isMirror = false;
        }
        else if (this.isReverser) {
            _snake.snake = _snake.snake.reverse();

            var headX = _snake.snake[0].x;
            var headY = _snake.snake[0].y;

            if (_snake.snakeLength > 1) {
                if (headX == _snake.snake[1].x && headY < _snake.snake[1].y) {
                    _snake.nextDir = 'U';
                    _snake.actualVelocity = _snake.negativeVelocity;
                } else if (headX == _snake.snake[1].x && headY > _snake.snake[1].y) {
                    _snake.nextDir = 'D';
                    _snake.actualVelocity = _snake.velocity;
                } else if (headX < _snake.snake[1].x && headY == _snake.snake[1].y) {
                    _snake.nextDir = 'L';
                    _snake.actualVelocity = _snake.negativeVelocity;
                } else if (headX > _snake.snake[1].x && headY == _snake.snake[1].y) {
                    _snake.nextDir = 'R';
                    _snake.actualVelocity = _snake.velocity;
                }
            } else {
                if (_snake.direction == 'L') {
                    _snake.nextDir = 'R';
                    _snake.actualVelocity = _snake.velocity;
                } else if (_snake.direction == 'R') {
                    _snake.nextDir = 'L';
                    _snake.actualVelocity = _snake.negativeVelocity;
                } else if (_snake.direction == 'U') {
                    _snake.nextDir = 'D';
                    _snake.actualVelocity = _snake.velocity;
                } else if (_snake.direction == 'D') {
                    _snake.nextDir = 'U';
                    _snake.actualVelocity = _snake.negativeVelocity;
                }
            }

            _snake.actualEffect = "Fordítás";
            this.isReverser = false;

        }
        else if (this.isGreed) {
            actualFPS = actualFPS / 1.5;

            revertTimeout = setTimeout(revertState, 5000);

            _snake.actualEffect = "Mohóság";
            this.isGreed = false;

        }
        else if (this.isSloth) {
            actualFPS = actualFPS * 1.5;

            revertTimeout = setTimeout(revertState, 5000);

            _snake.actualEffect = "Lustaság";
            this.isSloth = false;
        }
        else if (this.isGlutton) {
            for (var i = 0; i < 10; ++i) {
                _snake.snake.push({ x: tailNode.x, y: tailNode.y });
                _snake.snakeLength++;
            }
            _snake.actualEffect = "Falánkság";
            this.isGlutton = false;
        }

        displayEffect();
        displayScore();

        _scroll.spawn();
    },

    spawn: function () {


        _scroll.generateCoordinates();
        _scroll.assignRandomEffect();
    },

    generateCoordinates: function () {
        this.x = Math.floor(Math.random() * (tableWidth));
        this.y = Math.floor(Math.random() * (tableHeight));

        for (var i = 0; i < _snake.snakeLength; ++i) {
            if (this.x == _snake.snake[i].x && this.y == _snake.snake[i].y) {
                _scroll.generateCoordinates();
            }
        }

        for (var i = 0; i < _obstacle.numberOfObstacles; ++i) {
            if (this.x == _obstacle.obstacles[i].x && this.y == _obstacle.obstacles[i].y) {
                _scroll.generateCoordinates();
            }
        }
    },


};



////////////////főprogram///////////////////////////



init();
update();
//setInterval(update, 1000 / 288);



////////////metódusok///////////////////////////////




function init() {

    tableHeight = $("#tableHeight").value * 2;
    tableWidth = $("#tableWidth").value * 2;

    if ((tableHeight * tableWidth) / 2 < $("#obstacles").value) {
        alert("a pálya területének felénél több akadály nem megengedett");
    } else {
        _obstacle.numberOfObstacles = $("#obstacles").value;
    }


    canvas = $("#canvas");
    cContext = canvas.getContext("2d");
    applyButton = $("#apply");

    _snake.nextDir = 'R';
    _snake.negativeDir = 'L';
    _snake.velocity = 1;
    _snake.negativeVelocity = -1 * _snake.velocity;
    _snake.actualVelocity = _snake.velocity;
    _snake.direction = 'R';
    _snake.snakeLength = 2;
    _snake.snakeGirth = 20;
    desiredFPS = Math.round((1000 / 60) * 4);
    actualFPS = desiredFPS;

    canvas.height = tableHeight * _snake.snakeGirth;
    canvas.width = tableWidth * _snake.snakeGirth;

    scoreDisplay = $("#score");
    effectDisplay = $("#effect");
    _snake.actualEffect = "-";

    _snake.snake = [];

    for (var i = 0; i < _snake.snakeLength; ++i) {
        _snake.snake[i] = {
            x: 0,
            y: tableHeight / 2,
        };
    }

    lastUpdate = Date.now();

    displayEffect();
    displayScore();


    _obstacle.generateObstacles();
    _scroll.spawn();

    render();
}

function update() {
    
    requestAnimationFrame(update);

    var now = Date.now();
    deltaTime = now - lastUpdate;
    
    console.log("velocity: " + _snake.velocity);
    console.log("actualVelocity: " + _snake.actualVelocity);
    console.log(_snake.direction);
    
    if (Math.round(deltaTime) >= Math.floor(actualFPS) - 1) {

        _snake.controller();
        lastUpdate = now;

        if (_snake.isBorderCollision() || _snake.isSnakeCollision() || _obstacle.isCollision()) {
            onCollision();
        }
        if (_scroll.isCollision()) {
            _scroll.onCollison();
        }
    }

    if(!(_snake.isBorderCollision() || _snake.isSnakeCollision() || _obstacle.isCollision())){
        render();
    }

}

function render() {
    cContext.clearRect(0, 0, tableHeight * _snake.snakeGirth, tableHeight * _snake.snakeGirth);

    cContext.fillStyle = "#ece8d5";
    cContext.fillRect(0, 0, tableHeight * _snake.snakeGirth, tableHeight * _snake.snakeGirth)

    cContext.fillStyle = "blue";
    for (var i = 0; i < _obstacle.numberOfObstacles; ++i) {
        cContext.fillRect(_obstacle.obstacles[i].x * _snake.snakeGirth, _obstacle.obstacles[i].y * _snake.snakeGirth, _snake.snakeGirth, _snake.snakeGirth);
    }

    cContext.drawImage(_scroll.sprite, _scroll.x * _snake.snakeGirth, _scroll.y * _snake.snakeGirth, _snake.snakeGirth, _snake.snakeGirth);

    cContext.fillStyle = "red";
    cContext.fillRect(_snake.snake[0].x * _snake.snakeGirth, _snake.snake[0].y * _snake.snakeGirth, _snake.snakeGirth, _snake.snakeGirth);

    cContext.fillStyle = "black";
    for (var i = 1; i < _snake.snakeLength; ++i) {
        cContext.fillRect(_snake.snake[i].x * _snake.snakeGirth, _snake.snake[i].y * _snake.snakeGirth, _snake.snakeGirth, _snake.snakeGirth);
    }

}

function reset() {
    init();
}

function onCollision() {

    _snake.velocity = 0;
    _snake.negativeVelocity = 0;
    _snake.actualVelocity = 0;

    cContext.font = `${tableWidth}px Arial`;
    cContext.fillStyle = "red";
    cContext.textAlign = "center";
    cContext.fillText("Game Over", tableWidth * _snake.snakeGirth / 2, tableHeight * _snake.snakeGirth / 2);
}

function revertState() {
    clearTimeout(revertTimeout);

    actualFPS = desiredFPS;
    _snake.velocity = 1;
    _snake.negativeVelocity = -1 * _snake.velocity;

    if (_snake.direction == 'R' || _snake.direction == 'D') {
        _snake.actualVelocity = _snake.velocity;
    } else {
        _snake.actualVelocity = _snake.negativeVelocity;
    }
}

function $(s) {
    return document.querySelector(s);
}

function displayEffect() {
    effectDisplay.innerHTML = _snake.actualEffect;
}

function displayScore() {
    scoreDisplay.innerHTML = _snake.snakeLength - 1;
}


window.addEventListener('keydown', function (event) {

    switch (event.keyCode) {
        //BAL
        case 37:
            event.preventDefault();
            _snake.nextDir = 'L';
            break;
        //FEL
        case 38:
            event.preventDefault();
            _snake.nextDir = 'U';

            break;
        //JOBB
        case 39:
            event.preventDefault();
            _snake.nextDir = 'R';
            break;
        //LE
        case 40:
            event.preventDefault();
            _snake.nextDir = 'D';

            break;
        case 82:
            event.preventDefault();
            reset();
            break;
    }
});

applyButton.addEventListener('click', function () {
    reset();
});