// Setup canvas
var canvas = document.createElement("canvas");
canvas.width = 640;
canvas.height = 320;
document.body.appendChild(canvas);
var context = canvas.getContext("2d");

// Setup keyboard
var keyboard = {
    left: 37,
    right: 39,
    space: 32,

    keys: {},

    logKeyDown: function(event) {
        console.log(event.keyCode);
    },

    keyDown: function(event) {
        this.keys[event.keyCode] = true;
    },

    keyUp: function(event) {
        this.keys[event.keyCode] = false;
    }
};

window.addEventListener('keydown', function(event) {
    keyboard.keyDown(event);
});
window.addEventListener('keyup', function(event) {
    keyboard.keyUp(event);
});

// Setup objects
var creatures = [];
var bullets = [];

var box = {
    x: 0,
    y: 300,
    size: 20,
    bulletTimer: 0,

    update: function() {
        context.fillStyle = "rgb(0,255,0)";
        context.fillRect(this.x, this.y, this.size, this.size);

        if(keyboard.keys[keyboard.left] && this.x >= 0) {
            this.x -= 5;
        } else if(keyboard.keys[keyboard.right] && this.x <= canvas.width-this.size) {
            this.x += 5;
        }

        if(this.bulletTimer <= 0 && keyboard.keys[keyboard.space]) {
            this.bulletTimer = 30;

            var bullet = {
                x: this.x,
                y: this.y,
                size: 5,
                dead: false,

                update: function() {
                    if(this.dead) {
                        return;
                    }

                    context.fillStyle = "rgb(0,0,255)";
                    context.fillRect(this.x, this.y, this.size, this.size);
                    this.y -= 5;

                    for(var i=0; i < creatures.length; i++) {
                        var creature = creatures[i];

                        if(creature.dead) {
                            continue;
                        }

                        if(this.x >= creature.x && this.x <= creature.x + creature.size
                          && this.y >= creature.y && this.y <= creature.y + creature.size) {
                            this.dead = true;
                            creature.dead = true;
                        }
                    }
                }
            };

            bullets.push(bullet);
        }

        this.bulletTimer -= 1;
    }
};

for(var i=0; i < 10; i++) {
    var creature = {
        x: i * 30,
        y: 10,
        size: 20,
        direction: "right",
        dead: false,

        update: function() {
            if(this.dead) {
                return;
            }

            context.fillStyle = "rgb(255,0,0)";
            context.fillRect(this.x, this.y, this.size, this.size);

            if(this.direction == "left") {
                this.x -= 5;

                if(this.x < 0) {
                    this.direction = "right";
                    this.y += 30;                    
                }
            } else if(this.direction == "right") {
                this.x += 5;

                if(this.x > canvas.width-this.size) {
                    this.direction = "left";
                    this.y += 30;
                }
            }
        }
    };

    creatures.push(creature);
}

// Main loop
setInterval(function() {
    context.clearRect(0,0,canvas.width,canvas.height);

    box.update();

    for(var i=0; i < creatures.length; i++) {
        creatures[i].update();
    }

    for(var i=0; i < bullets.length; i++) {
        bullets[i].update();
    }
}, 1/60 * 1000);
