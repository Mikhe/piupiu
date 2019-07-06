/* global $ */

import * as gameObjects from './gameObjects';

const Scene = function (options) {
    const { drawSceneSpeed, sceneName, } = options || {};

    this.sceneName = sceneName || 'scene';
    this.settings = {
        drawSceneSpeed: drawSceneSpeed || 16.66666666,
    };


    gameObjects.init([
        { code: "explosion", src:  "images/explosion.png"},
        { code: "sniper", src:  "images/sniper.png"},
        { code: "rocket", src:  "images/rocket.png"}
    ]);
};

Scene.prototype.render = function () {
    const { ctx, explosions, mouseMoveOffset, rockets, sniper, steps, } = this;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas

    sniper.draw(ctx, mouseMoveOffset);

    // draw rockets
    rockets.forEach((rock, i) => {
        rock.draw(ctx, explosions, () => {
            rockets.splice(i, 1);
        });
    });

    // draw steps
    steps.forEach((step, i) => {
        step.draw(ctx, () => {
            steps.splice(i, 1);
        });
    });

    // draw explosions
    explosions.forEach((exp, i) => {
        exp.draw(ctx, () => {
            explosions.splice(i, 1);
        });
    });
};

Scene.prototype.destroy = function() {
    const { ctx, drawingInterval } = this;
    const { height, width } = ctx.canvas;

    ctx.clearRect(0, 0, width, height);
    clearInterval(drawingInterval);
};

Scene.prototype.init = function() {
    const self = this;
    this.canvas = document.getElementById(this.sceneName);
    this.ctx = this.canvas.getContext('2d');

    this.rockets = [];
    this.steps = [];
    this.explosions = [];
    this.sniper = new gameObjects.Sniper();

    this.mouseMoveOffset = { x: 0, y: 0};

    const { canvas, mouseMoveOffset, rockets, settings, sniper, steps } = this;

    this.render = this.render.bind(this);

    $('#scene').mousemove(function(e) {
        mouseMoveOffset.x = e.pageX - e.target.offsetLeft;
        mouseMoveOffset.y =	e.pageY - e.target.offsetTop;
    });

    this.drawingInterval = setInterval(function() {

        //draw the scene
        self.render();
    }, settings.drawSceneSpeed);

    $(canvas).mousedown(function(e){
        const { originalEvent, which } = e;

        let mouseX = e.layerX || 0;
        let mouseY = e.layerY || 0;

        if(originalEvent.layerX) {
            mouseX = originalEvent.layerX;
            mouseY = originalEvent.layerY;
        }

        switch (which) {
            case 1: // left button

                //add a rocket
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