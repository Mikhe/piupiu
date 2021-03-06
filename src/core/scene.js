import * as gameObjects from './gameObjects';

const Scene = function (options) {
    const { drawSceneSpeed, monsterGenerateInterval, sceneName, } = options || {};

    this.sceneName = sceneName || 'scene';
    this.settings = {
        drawSceneSpeed: drawSceneSpeed || 16.66666666,
        levelUp: 30,
        monsterSpeed: 1,
        monsterGenerateInterval: monsterGenerateInterval || 2000,
    };


    gameObjects.init([
        { code: "explosion", src:  "images/explosion.png"},
        { code: "monster", src:  "images/monster.png"},
        { code: "rocket", src:  "images/rocket.png"},
        { code: "sniper", src:  "images/sniper.png"},
    ]);
};

Scene.prototype.getMonsterSpeed = function() {
    return this.settings.monsterSpeed;
};

Scene.prototype.render = function () {
    const self = this;
    const { ctx, explosions, level, life, monsters, mouseMoveOffset, rockets, score, sniper, steps, } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas

    level.draw(self);
    score.draw(self);
    sniper.draw(self, mouseMoveOffset);

    life.draw(self, () => {
        self.destroy();
    });

    rockets.forEach((rock, i) => {
        rock.draw(self, () => {
            rockets.splice(i, 1);
        });
    });

    steps.forEach((step, i) => {
        step.draw(self, () => {
            steps.splice(i, 1);
        });
    });

    explosions.forEach((exp, i) => {
        exp.draw(self, () => {
            explosions.splice(i, 1);
        });
    });

    monsters.forEach((mon, i) => {
        mon.draw(self, () => {
            monsters.splice(i, 1);
        });
    });
};

Scene.prototype.destroy = function() {
    const { ctx, drawingInterval, gameover, level, monsterInterval, settings, score } = this;
    const { height, width } = ctx.canvas;

    clearInterval(monsterInterval);
    clearInterval(drawingInterval);

    setTimeout(() => {
        ctx.clearRect(0, 0, width, height);
        gameover.draw(this);
        level.draw(this);
        score.draw(this);
    }, settings.drawSceneSpeed);
};

Scene.prototype.init = function(width, height) {
    const self = this;
    this.canvas = document.getElementById(this.sceneName);
    this.ctx = this.canvas.getContext('2d');

    this.explosions = [];
    this.monsters = [];
    this.rockets = [];
    this.steps = [];
    this.gameover = new gameObjects.GameOver();
    this.level = new gameObjects.Level();
    this.life = new gameObjects.Life();
    this.score = new gameObjects.Score();
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
            maxX:   width,
            maxY:   height,
            speed:  self.getMonsterSpeed(),
        }));
    }, settings.monsterGenerateInterval);

    canvas.addEventListener('mousedown', (e) => {
        const { which } = e;

        let mouseX = e.offsetX || 0;
        let mouseY = e.offsetY || 0;

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