const WIDTH = 101;
const HEIGHT = 83;

var Enemy = function() {
    this.posX = Math.round(Math.random() * 4);
    this.posY = Math.round(Math.random() * 2) + 1;
    this.speed = Math.random() * 200 + 100;
    this.sprite = 'images/enemy-bug.png';
    this.updatePosition();
};

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    // Check to see if enemy is on screen, if not reposition it
    if(this.x > (5 * WIDTH)) {
        this.x = -WIDTH;
        this.posY = Math.round(Math.random() * 2) + 1;
        this.y = this.posY * HEIGHT - HEIGHT/2;
        this.speed = Math.random() * 200 + 100;
    }
    this.posX = Math.round(this.x / WIDTH);
};

Enemy.prototype.updatePosition = function() {
    this.x = this.posX * WIDTH;
    this.y = this.posY * HEIGHT - HEIGHT/2;
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.posX = 2;
    this.posY = 5;
    this.updatePosition();
    this.sprite = 'images/char-horn-girl.png';
};

Player.prototype.update = function(dt) {
    // Check collision with enemies
    allEnemies.forEach((enemy) => {
        if (this.posX === enemy.posX && this.posY === enemy.posY) {
            this.posX = 2;
            this.posY = 5;
            this.updatePosition();
            scorePanel.score = 0;
        }
    });
    this.updatePosition();
};

// Handle user key input
Player.prototype.handleInput = function(keyCode) {
    if(!winPanel.visible){
        if(keyCode === 'down' && this.posY < 5) {
            this.posY++;
        } else if(keyCode === 'up' && this.posY > 0) {
            this.posY--;
            scorePanel.score += 1;
        } else if(keyCode === 'left' && this.posX > 0) {
            this.posX--;
        } else if(keyCode === 'right' && this.posX < 4) {
            this.posX++;
        }
    }

};

Player.prototype.updatePosition = function() {
    this.x = this.posX * WIDTH;
    this.y = this.posY * HEIGHT - HEIGHT/2;
};

// Draw player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Gem = function() {
    this.posX = Math.round(Math.random() * 4);
    this.posY = Math.round(Math.random() * 2) + 1;
    // Generate gems based on random numbers
    let random = Math.random();
    if(random < 0.3) {
        this.sprite = 'images/gem-blue.png';
    } else if (random < 0.6) {
        this.sprite = 'images/gem-green.png';
    } else {
        this.sprite = 'images/gem-orange.png';
    }
    this.updatePosition();
};

Gem.prototype.update = function(dt) {
    // Check if gem collides with player
    if(this.posX === player.posX && this.posY === player.posY) {
        this.posX = -1;
        this.posY = -1;
        this.updatePosition();
        scorePanel.score += 5;
    }
};

Gem.prototype.updatePosition = function() {
    this.x = this.posX * WIDTH;
    this.y = this.posY * HEIGHT - HEIGHT/2;
};


// Draw the gems on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Rock = function(x) {
    this.posX = x;
    this.posY = 0;
    this.sprite = 'images/rock.png';
    this.updatePosition();
};

Rock.prototype.update = function(dt) {
    // If player lands on rock show win game
    if(this.posX === player.posX && this.posY === player.posY) {
        winPanel.won = true;
        winPanel.visible = true;
    } else if(player.posY === 0 && winPanel.visible === false){
        winPanel.won = false;
        winPanel.visible = true;
    }
};

Rock.prototype.updatePosition = function() {
    this.x = this.posX * WIDTH;
    this.y = this.posY * HEIGHT - HEIGHT/2;
};

// Draw the gems on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Score panel class
var ScorePanel = function() {
    this.score = 0;
};

ScorePanel.prototype.update = function(dt) {

};

// Draw the score panel on canvas
ScorePanel.prototype.render = function() {
    ctx.font = '30px sans';
    ctx.fillStyle = 'white';
    ctx.fillText( `Score: ${this.score}`, 10, 575);
};

// Draw the win panel
var WinPanel = function() {
    this.score = 0;
    this.visible = false;
    this.won = false;
};

WinPanel.prototype.update = function(dt) {

};

WinPanel.prototype.render = function() {
    if(this.visible) {
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.9;
        ctx.fillRect( 50, 150, 400, 200);
        ctx.globalAlpha = 1.0;
        ctx.font = '30px sans';
        ctx.fillStyle = 'black';
        ctx.fillText( 'GAME OVER!', 150, 200);
        if(this.won) {
            ctx.fillText( 'YOU WON!', 160, 250);
        } else {
            ctx.fillText( 'YOU LOST!', 160, 250);
        }

        ctx.fillText( `Your score was: ${scorePanel.score}`, 130, 300);
    }
};

// Player, enemies, gems, score panel, win panel objects
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];
let player = new Player();
let allGems = [new Gem(), new Gem(), new Gem()];
let allRocks = [new Rock(0), new Rock(2), new Rock(4)];
let scorePanel = new ScorePanel();
let winPanel = new WinPanel();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
