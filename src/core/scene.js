import * as gameObjects from './gameObjects';

const Scene = function (options) {
    const { drawSceneSpeed, monsterGenerateInterval, sceneName, } = options || {};

    this.sceneName = sceneName || 'scene';
    this.settings = {
        drawSceneSpeed: drawSceneSpeed || 16.66666666,
        monsterGenerateInterval: monsterGenerateInterval || 2000,
    };


    gameObjects.init([
        { code: "explosion", src:  "images/explosion.png"},
        { code: "monster", src:  "images/monster.png"},
        { code: "rocket", src:  "images/rocket.png"},
        { code: "sniper", src:  "images/sniper.png"},
    ]);
};

Scene.prototype.render = function () {
    const self = this;
    const { ctx, explosions, monsters, mouseMoveOffset, rockets, sniper, steps, } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas

    sniper.draw(self, mouseMoveOffset);

    // draw rockets
    rockets.forEach((rock, i) => {
        rock.draw(self, () => {
            rockets.splice(i, 1);
        });
    });

    // draw steps
    steps.forEach((step, i) => {
        step.draw(self, () => {
            steps.splice(i, 1);
        });
    });

    // draw explosions
    explosions.forEach((exp, i) => {
        exp.draw(self, () => {
            explosions.splice(i, 1);
        });
    });

    // draw monsters
    monsters.forEach((mon, i) => {
        mon.draw(self, () => {
            monsters.splice(i, 1);
        });
    });
};

Scene.prototype.destroy = function() {
    const { ctx, drawingInterval, monsterInterval } = this;
    const { height, width } = ctx.canvas;

    ctx.clearRect(0, 0, width, height);
    clearInterval(monsterInterval);
    clearInterval(drawingInterval);
};

Scene.prototype.init = function(width, height) {
    const self = this;
    this.canvas = document.getElementById(this.sceneName);
    this.ctx = this.canvas.getContext('2d');

    this.explosions = [];
    this.monsters = [];
    this.rockets = [];
    this.steps = [];
    this.sniper = new gameObjects.Sniper();

    this.mouseMoveOffset = { x: 0, y: 0};

    const { canvas, mouseMoveOffset, rockets, settings, sniper, steps } = this;

    this.render = this.render.bind(this);

    canvas.addEventListener('mousemove', (e) => {
        mouseMoveOffset.x = e.pageX - e.target.offsetLeft;
        mouseMoveOffset.y =	e.pageY - e.target.offsetTop;
    });

    this.drawingInterval = setInterval(() => {

        //draw the scene
        self.render();
    }, settings.drawSceneSpeed);

    this.monsterInterval = setInterval(() => {
        self.monsters.push(new gameObjects.Monster({
            px:     sniper.x,
            py:     sniper.y,
            mx:     mouseMoveOffset.x,
            my:     mouseMoveOffset.y,
            maxX:   width,
            maxY:   height,
        }));
    }, settings.monsterGenerateInterval);

    canvas.addEventListener('mousedown', (e) => {
        const { originalEvent, which } = e;

        let mouseX = e.layerX || 0;
        let mouseY = e.layerY || 0;

        if (originalEvent && originalEvent.layerX) {
            mouseX = originalEvent.layerX;
            mouseY = originalEvent.layerY;
        }

        switch (which) {
            case 1: // left button

                rockets.push(new gameObjects.Rocket({
                    mx 		: mouseMoveOffset.x,
                    my  	: mouseMoveOffset.y,
                    px 		: mouseX,
                    py		: mouseY,
                    x		: sniper.x,
                    y		: sniper.y
                }));

                break;

            case 3: // right button

                // saving last coordinates and move the sniper
                sniper.sniperLastMouseX = mouseX;
                sniper.sniperLastMouseY = mouseY;
                sniper.isMoving = true;

                //add a step
                steps.push(new gameObjects.Step({
                    x: mouseX,
                    y: mouseY
                }));

                break;
        }
    });
};

export default Scene;