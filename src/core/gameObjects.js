import * as tools from './tools';

const images = {};

const init = function(elements) {
    if (!(Array.isArray(elements))) {
        elements = [elements];
    }

    elements.forEach(el => {
        try {
            images[el.code] = new Image();
            images[el.code].src = el.src;
        } catch(e){
            console.error("Initialization failed!");
        }
    });
};

const Score = function (options) {
    this.scoreData = {
        color: '#fff',
        font: '30px Arial',
        label: 'Score:',
        score: 0,
        x: 20,
        y: 20,
    };

    const { scoreData } = this;

    scoreData.draw = function(scene) {
        const { color, font, label, score, x, y } = scoreData;
        const { ctx } = scene;
        const text = `${label} ${score}`;

        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, x, y);
    };

    //checking custom options
    Object.assign(scoreData, options);

    return scoreData;
};

const Sniper = function (options) {
    this.sniperData = {
        x					: 400,
        y					: 300,
        w					: 53,
        h					: 63,
        speed				: 3,
        position			: 0,
        maxPosition			: 7,
        isMoving			: false,
        sniperLastMouseX	: 0,
        sniperLastMouseY	: 0,
        image				: images.sniper,
    };

    const { sniperData } = this;

    sniperData.draw = function(scene, mouseMoveOffset) {
        const { ctx } = scene;
        const { h, image, isMoving, sniperLastMouseX, sniperLastMouseY, speed, w, x, y } = sniperData;

        let stepX = speed;
        let stepY = speed;

        const diffX = tools.getDiff(sniperLastMouseX, x);
        const diffY = tools.getDiff(sniperLastMouseY, y);

        if (diffX > diffY) {
            stepY = diffY / diffX * speed;
        } else {
            stepX = diffX / diffY * speed;
        }

        if (isMoving && (diffX > speed || diffY > speed)) {
            if (sniperLastMouseX > x) {
                sniperData.x += stepX;
            } else if (sniperLastMouseX < x) {
                sniperData.x -= stepX;
            }

            if (sniperLastMouseY > y) {
                sniperData.y += stepY;
            } else if (sniperLastMouseY < y) {
                sniperData.y -= stepY;
            }
        } else {
            sniperData.isMoving = false;
        }

        ctx.save();
        ctx.translate(sniperData.x, sniperData.y);
        tools.updatePosition(sniperData);

        mouseMoveOffset.x && ctx.rotate(
            Math.atan2(mouseMoveOffset.y - sniperData.y, mouseMoveOffset.x - sniperData.x) + Math.PI/2
        );
        ctx.drawImage(image, isMoving ? sniperData.position * w : 0,  0, w, h, -15, 0, w, h);
        ctx.rotate(-Math.PI/2);

        const lineGrd = ctx.createLinearGradient(0,0,700,0);
        lineGrd.addColorStop(0,"#8B1516");
        lineGrd.addColorStop(1,"#252729");
        ctx.fillStyle = lineGrd;
        ctx.fillRect(0,-2,1000,1);
        ctx.restore();
    };

    //checking custom options
    Object.assign(sniperData, options);

    return sniperData;
};

const Step = function (options) {
    this.stepData = {
        x		    : 0,
        y		    : 0,
        r		    : 5,
        maxR	    : 18,
        speed	    : 0.6,
        style	    : '#8B1516',
        isStarted	: false,
        width	    : 2,
    };

    const { stepData } = this;

    stepData.draw = function(scene, cb) {
        const { ctx } = scene;
        const { isStarted, maxR, r, speed, style, width, x, y } = stepData;

        ctx.beginPath();
        ctx.strokeStyle = style;
        ctx.lineWidth = width;

        if (!isStarted) {
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            stepData.isStarted = true;
        } else {
            ctx.arc(x, y, r, 0, 2 * Math.PI);
            stepData.r += speed;
            if (stepData.r > maxR) {
                if (typeof cb == "function") cb();
            }
        }

        ctx.closePath();
        ctx.stroke();
    };

    //checking custom options
    Object.assign(stepData, options);

    return stepData;
};

const Explosion = function (options) {
    this.explosionData = {
        x			: 0,
        y			: 0,
        w			: 128,
        h			: 128,
        position	: 0,
        image		: images.explosion,
    };

    const { explosionData } = this;

    explosionData.draw = function(scene, cb) {
        const { ctx } = scene;
        const { h, image, position, w, x, y } = explosionData;

        if (position !== 82) {
            const p = Math.ceil(position / 2);

            ctx.drawImage(image, p * w,  0, w, h, x - 64, y - 64, w, h);
            explosionData.position++;
        } else {
            if (typeof cb == "function") cb();
        }
    };

    //checking custom options
    Object.assign(explosionData, options);

    return explosionData;
};

const Rocket = function (options) {
    this.rocketData = {
        mx			: 0,
        my			: 0,
        w			: 26,
        h			: 49,
        px			: 0,
        py			: 0,
        x			: 0,
        y			: 0,
        speed		: 16,
        position	: 0,
        maxPosition	: 3,
        image		: images.rocket,
    };

    const { rocketData } = this;

    rocketData.checkTargets = function(scene) {
        const { x, y } = rocketData;
        const { monsters } = scene;
        const initialLength = monsters.length;

        scene.monsters = monsters.filter(mon => {
            const diffX = tools.getDiff(mon.x, x);
            const diffY = tools.getDiff(mon.y, y);

            return !(diffX < 20 && diffY < 20);


        });

        return initialLength !== scene.monsters.length;
    };

    rocketData.draw = function(scene, cb) {
        const { explosions, ctx } = scene;
        const { checkTargets, h, image, speed, position, px, py, w, x, y } = rocketData;
        const hasTarget = checkTargets(scene);

        let stepX = speed;
        let stepY = speed;

        const diffX = tools.getDiff(px, x);
        const diffY = tools.getDiff(py, y);

        if (diffX > diffY) {
            stepY = diffY / diffX * speed;
        } else {
            stepX = diffX / diffY * speed;
        }

        if (hasTarget || (diffX < speed && diffY < speed)) {
            explosions.push(new Explosion({
                x: x,
                y: y
            }));

            if (typeof cb == "function") cb();

            return;
        }

        if (px > x) {
            rocketData.x += stepX;
        } else if (px < x) {
            rocketData.x -= stepX;
        }

        if (py > y) {
            rocketData.y += stepY;
        } else if (py < y) {
            rocketData.y -= stepY;
        }

        ctx.save();
        ctx.translate(rocketData.x, rocketData.y);
        px && ctx.rotate(Math.atan2(py - rocketData.y, px - rocketData.x) + Math.PI/2);
        tools.updatePosition(rocketData);
        ctx.drawImage(image, position * w,  0, w, h, -12, -31, w, h);
        ctx.restore();
    };

    //checking custom options
    Object.assign(rocketData, options);

    return rocketData;
};

const Monster = function (options) {
    this.monsterData = {
        mx:                     0,
        my:                     0,
        w:                      42,
        h:                      31,
        px:                     0,
        py:                     0,
        speed:                  1,
        position:               0,
        maxPosition:            0,
        maxX:                   options.maxX,
        maxY:                   options.maxY,
        image:                  images.monster,
        monsterAppearOptions: [
            { x: 'random',  y: 0 },
            { x: 'max',     y: 'random' },
            { x: 'random',  y: 'max' },
            { x: 0,         y: 'random' }
        ],
    };

    const { monsterData } = this;
    const sides = monsterData.monsterAppearOptions;
    const randomSide = tools.getRandom(4);
    const chosenOption = sides[randomSide];

    Object.keys(chosenOption).forEach(key => {
        const maxKeyValue = monsterData[`max${key.toUpperCase()}`];

        switch (chosenOption[key]) {
            case 'random':
                monsterData[key] = tools.getRandom(maxKeyValue);
                break;

            case 'max':
                monsterData[key] = maxKeyValue;
                break;

            default:
                monsterData[key] = chosenOption[key];
        }
    });

    monsterData.draw = function(scene, cb) {
        const { ctx } = scene;
        const { h, image, speed, position, px, py, w, x, y } = monsterData;

        let stepX = speed;
        let stepY = speed;

        const diffX = tools.getDiff(px, x);
        const diffY = tools.getDiff(py, y);

        if (diffX > diffY) {
            stepY = diffY / diffX * speed;
        } else {
            stepX = diffX / diffY * speed;
        }

        if (diffX < speed && diffY < speed) {
            if (typeof cb == "function") cb();

            return;
        }

        if (px > x) {
            monsterData.x += stepX;
        } else if (px < x) {
            monsterData.x -= stepX;
        }

        if (py > y) {
            monsterData.y += stepY;
        } else if (py < y) {
            monsterData.y -= stepY;
        }

        ctx.save();
        ctx.translate(monsterData.x, monsterData.y);
        px && ctx.rotate(Math.atan2(py - monsterData.y, px - monsterData.x) + Math.PI/2);
        tools.updatePosition(monsterData);
        ctx.drawImage(image, position * w,  0, w, h, -12, -31, w, h);
        ctx.restore();
    };

    //checking custom options
    Object.assign(monsterData, options);

    return monsterData;
};

export {
    Explosion,
    init,
    Monster,
    Rocket,
    Score,
    Sniper,
    Step,
}