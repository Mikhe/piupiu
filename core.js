var tools = function() {
	//get difference between 2 numbers
	var getDiff = function (x,y){
		try {
			return Math.abs(Number(x) - Number(y));
		} catch(e){
			return 0;
		}
	}
	
	//extending an object 
	var extend = function(obj, obj2) {
		try {
			$.extend(obj, obj2);
		} catch(e) {
			return obj;
		}	
		return obj;
	}
	
	// update sprite positions
	var updatePosition = function (obj) {
		obj.position = obj.position == obj.maxPosition ? 0 : ++obj.position;
	}

	return {
		getDiff 		: getDiff,
		extend  		: extend,
		updatePosition	: updatePosition
	}
}

var gameObjects = function() {
	var images = {};
	
	//images initialization
	/* params
		@elements = [ { code, src } ]
	*/
	var init = function(elements) {		
		if (!(elements instanceof Array)) {
			elements = [elements];
		}
		
		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			try {
				images[el.code] = new Image();
				images[el.code].src = el.src;
			} catch(e){
				console.error("Initialization failed!");
			}
		}
	}
	
	var Sniper = function (options) {
		var obj = {
			x					: 400,
			y					: 300,
			w					: 53,
			h					: 63,
			speed				: 3,
			position			: 0,
			maxPosition			: 7,
			moving				: false,
			sniperLastMouseX	: 0,
			sniperLastMouseY	: 0,
			image				: images.sniper
		}

		/* params
			@ctx - context;
			@mouseMoveOffset - offset coordinates if the mouse
		*/	
		obj.draw = function(ctx, mouseMoveOffset) {
			var sniperspeed = obj.speed;
			var stepX = sniperspeed;
			var stepY = sniperspeed;
			var sniperLastMouseX = obj.sniperLastMouseX;
			var sniperLastMouseY = obj.sniperLastMouseY;
			var diffX = tools.getDiff(sniperLastMouseX, obj.x);
			var diffY = tools.getDiff(sniperLastMouseY, obj.y);
			if (diffX > diffY) {
				stepY = diffY/diffX*sniperspeed;
			} else {
				stepX = diffX/diffY*sniperspeed;
			}
					
			if (obj.moving && (diffX > sniperspeed || diffY > sniperspeed)) {
				if (sniperLastMouseX > obj.x) {
					obj.x += stepX;
				}
				if (sniperLastMouseY > obj.y) {
					obj.y += stepY;
				}
				if (sniperLastMouseX < obj.x) {
					obj.x -= stepX;
				}
				if (sniperLastMouseY < obj.y) {
					obj.y -= stepY;
				}	
			} else {
				obj.moving = false;		
			}
				
			ctx.save();
			ctx.translate(obj.x, obj.y);
			tools.updatePosition(obj);
			mouseMoveOffset.x && ctx.rotate(Math.atan2(mouseMoveOffset.y - obj.y, mouseMoveOffset.x - obj.x) + Math.PI/2);
			ctx.drawImage(obj.image, obj.moving ? obj.position * obj.w : 0,  0, obj.w, obj.h, -15, 0, obj.w, obj.h);
			
			ctx.rotate(-Math.PI/2);
			var lineGrd = ctx.createLinearGradient(0,0,700,0);
			lineGrd.addColorStop(0,"#8B1516");
			lineGrd.addColorStop(1,"#252729");
			ctx.fillStyle = lineGrd;
			ctx.fillRect(0,-2,1000,1);
			ctx.restore();
		}		
	
		//checking custom options
		tools.extend(obj, options);
		
		return obj;
	}	
	
	var Step = function (options) {
		var obj = {
			x		: 0,
			y		: 0,
			r		: 5,
			maxR	: 18,
			speed	: 0.6,
			style	: "#8B1516",
			started	: false,
			width	: 2 			
		}
		
		/* params
			@ctx - context;
			@cb -  callback for removing
		*/	
		obj.draw = function(ctx, cb) {
			ctx.beginPath();
			ctx.strokeStyle = obj.style;
			ctx.lineWidth = obj.width;
			if (!obj.started) {
				ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
				obj.started = true;
			} else {				
				ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
				obj.r += obj.speed;
				if (obj.r > obj.maxR) {
					if (typeof cb == "function") cb();
				}
			}
			ctx.closePath();
			ctx.stroke();
		}
		
		//checking custom options
		tools.extend(obj, options);
		
		return obj;
	}
	
	var Explosion = function (options) {
		var obj = {
			x			: 0,
			y			: 0,
			w			: 128,
			h			: 128,
			position	: 0,
			image		: images.explosion
		}
		
		/* params
			@ctx - context;
			@cb -  callback for removing
		*/
		obj.draw = function(ctx, cb) {
			if (obj.position != 82) { 
				var p = Math.ceil(obj.position/2);

				ctx.drawImage(obj.image, p * obj.w,  0, obj.w, obj.h, obj.x - 64, obj.y -64, obj.w, obj.h);
				obj.position++;
			} else {
				if (typeof cb == "function") cb();
			}	
		}
		
		//checking custom options
		tools.extend(obj, options);
		
		return obj;	
	}	
	
	var Rocket = function (options) {
		var obj = {
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
			image		: images.rocket
		}
		
		/* params
			@ctx - context;
			@explosions - array of explosions
			@cb -  callback for removing
		*/
		obj.draw = function(ctx, explosions, cb) {
			var rtspeed = obj.speed;
			var rth = obj.h;
			var rtw = obj.w;
			var rtimage = obj.image;;
			var rtpx = obj.px;
			var rtpy = obj.py;
			var stepX = rtspeed;
			var stepY = rtspeed;
			var diffX = tools.getDiff(rtpx, obj.x);
			var diffY = tools.getDiff(rtpy, obj.y);
			if (diffX > diffY) {
				stepY = diffY/diffX*rtspeed;
			} else {
				stepX = diffX/diffY*rtspeed;
			}
			if (diffX < rtspeed && diffY < rtspeed) {
				explosions.push(new gameObjects.Explosion({
					x		: obj.x,
					y		: obj.y
				}));
				if (typeof cb == "function") cb();
				return;
			}
			if (rtpx > obj.x) {
				obj.x += stepX;
			}
			if (rtpy > obj.y) {
				obj.y += stepY;
			}
			if (rtpx < obj.x) {
				obj.x -= stepX;
			}
			if (rtpy < obj.y) {
				obj.y -= stepY;
			}							
			
			ctx.save();
			ctx.translate(obj.x, obj.y);
			rtpx && ctx.rotate(Math.atan2(rtpy - obj.y, rtpx - obj.x) + Math.PI/2);
			tools.updatePosition(obj);
			ctx.drawImage(rtimage, obj.position*rtw,  0, rtw, rth, -12, -31, rtw, rth);
			ctx.restore();		
		}
		
		//checking custom options
		tools.extend(obj, options);
		
		return obj;
	}	
	
	return {
		init		: init,
		Step		: Step,
		Explosion	: Explosion,
		Rocket		: Rocket,
		Sniper		: Sniper
	}
}

//the main scene
var Scene = function (options) {
	
	gameObjects.init([
		{ code: "explosion", src:  "images/explosion.png"},
		{ code: "sniper", src:  "images/sniper.png"},
		{ code: "rocket", src:  "images/rocket.png"}
	]);

	//defaults
	var settings = {
		drawSceneSpeed: 16.66666666
	}	
	
	//checking custom options
	tools.extend(settings, options);
	
	//some default variables
	var mouseMoveOffset;		
	var drawingInterval;
	var canvas;
	var ctx;
	
	var init = function() {
		canvas = document.getElementById('scene');
		ctx = canvas.getContext('2d');

		var rockets = [];
		var steps = [];
		var explosions = [];	
		var sniper = new gameObjects.Sniper();
		
		mouseMoveOffset = { x: 0, y: 0};
		
		$('#scene').mousemove(function(e) {					
			mouseMoveOffset.x = e.pageX - e.target.offsetLeft;
			mouseMoveOffset.y =	e.pageY - e.target.offsetTop;
		})
		drawingInterval = setInterval(function() {
			//draw the scene
			render(ctx, sniper, rockets, steps, explosions)
		}, settings.drawSceneSpeed); 	
		
		$(canvas).mousedown(function(e){ 
			var mouseX = e.layerX || 0;
			var mouseY = e.layerY || 0;
			if(e.originalEvent.layerX) {
				mouseX = e.originalEvent.layerX;
				mouseY = e.originalEvent.layerY;
			}
			
			switch (e.which) {
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
					sniper.moving = true;
					
					//add a step
					steps.push(new gameObjects.Step({
						x: mouseX,
						y: mouseY
					}));
					break;
			}
		});
	};
	
	// render function
	var render = function (ctx, sniper, rockets, steps, explosions) { // main drawScene function
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas	

		sniper.draw(ctx, mouseMoveOffset);

		// draw rockets
		if (rockets.length > 0) {			
			for (var key in rockets) {
				rockets[key].draw(ctx, explosions, function() {	
					rockets.splice(key,1);
				});
			}
		}
		
		// draw steps
		if (steps.length > 0) {
			for (var key in steps) {
				steps[key].draw(ctx, function() {
					steps.splice(key,1);
				});	
			}		
		}
		
		// draw explosions
		if (explosions.length > 0) {		
			for (var key in explosions) {
				explosions[key].draw(ctx, function() {
					explosions.splice(key,1);
				});
			}		
		}	
	}	
	
	var destroy = function() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		clearInterval(drawingInterval);
	}
	
	return {
		init			: init,
		destroy			: destroy
	}
}

tools = new tools();
gameObjects = new gameObjects();