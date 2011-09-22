window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var dots = [];
var ctx;
var WIDTH = 60;
var HEIGHT = 60;

var hWidth = WIDTH / 2;
var hHeight = HEIGHT / 2;
var dotLag = 25;

function Dot(options) {
    options = options || {};
    this.distance = options.distance || 15;
    this.radius = options.radius || 2.5;
    this.angle = options.angle || 90;
    this.totalAngle = this.angle;
    this.color = options.color || "#19A5E1";
    this.velocity = 6;
    this.minVelocity = options.minVelocity || 1.5;
    this.maxVelocity = options.maxVelocity || 6;
    this.visible = false;
}
Dot.prototype.draw = function (context, xCenter, yCenter) {
    var d = this.distance,
        radians = Math.PI * this.angle / 180,
        x = d * Math.cos(radians),
        y = d * Math.sin(radians);
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(x + xCenter, y + yCenter, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
}
Dot.prototype.update = function (lastDot) {
    var angle = this.angle,
        velocity = this.velocity,
        minV = this.minVelocity,
        maxV = this.maxVelocity,
        angleDiff = lastDot.angle - angle;


    if ((angle >= 180 && angle < 360)) {
        velocity = velocity > minV ? velocity * 0.85 : minV;
    }
    else if ((angle >= 0 && angle < 180)) {
        velocity = velocity < maxV ? velocity * 1.1 : maxV;
    }

    this.angle = (angle + velocity) % 360;
    this.totalAngle += velocity;
    this.velocity = velocity;
}
function run(canvas) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext("2d");
    for (var i = 0; i < 6; i++) {
        dots.push(new Dot({
            angle: 90
        }));
    }
    dots[0].visible = true;
    draw();
};

function resetDots() {
    for (var i = 0, il = dots.length; i < il; i++) {
        dots[i].constructor({
            angle: 90
        });
    }
    dots[0].visible = true;
    draw();
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    var cont = true;
    for (var i = 0, il = dots.length; i < il; i++) {
        var dot = dots[i],
            lastDot = dots[i - 1] || dots[il - 1];

        if (lastDot.totalAngle > (dot.maxVelocity * 18) + 90) {
            dot.visible = true;
        }
        if (dot.totalAngle > 800) {
            dot.visible = false;
            if (i == il - 1) {
                setTimeout(resetDots, 200);
                cont = false;
                break
            }
        }
        if(dot.visible == true) {
            dot.draw(ctx, hWidth, hHeight);
            dot.update(lastDot);
        }
    }
    cont && requestAnimFrame(draw);
}