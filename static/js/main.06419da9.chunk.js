(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,n){},15:function(e,t,n){"use strict";n.r(t);var i=n(0),s=n.n(i),a=n(2),o=n.n(a),r=(n(14),n(3)),c=n(4),h=n(6),p=n(5),u=n(7),d=function(e,t){return Math.abs(Number(e)-Number(t))},f=function(e){e.position=e.position===e.maxPosition?0:++e.position},l={},y=function(e){this.sniperData={x:400,y:300,w:53,h:63,speed:3,position:0,maxPosition:7,isMoving:!1,sniperLastMouseX:0,sniperLastMouseY:0,image:l.sniper};var t=this.sniperData;return t.draw=function(e,n){var i=t.h,s=t.image,a=t.isMoving,o=t.sniperLastMouseX,r=t.sniperLastMouseY,c=t.speed,h=t.w,p=t.x,u=t.y,l=c,y=c,v=d(o,p),x=d(r,u);v>x?y=x/v*c:l=v/x*c,a&&(v>c||x>c)?(o>p?t.x+=l:o<p&&(t.x-=l),r>u?t.y+=y:r<u&&(t.y-=y)):t.isMoving=!1,e.save(),e.translate(t.x,t.y),f(t),n.x&&e.rotate(Math.atan2(n.y-t.y,n.x-t.x)+Math.PI/2),e.drawImage(s,a?t.position*h:0,0,h,i,-15,0,h,i),e.rotate(-Math.PI/2);var w=e.createLinearGradient(0,0,700,0);w.addColorStop(0,"#8B1516"),w.addColorStop(1,"#252729"),e.fillStyle=w,e.fillRect(0,-2,1e3,1),e.restore()},Object.assign(t,e),t},v=function(e){this.stepData={x:0,y:0,r:5,maxR:18,speed:.6,style:"#8B1516",isStarted:!1,width:2};var t=this.stepData;return t.draw=function(e,n){var i=t.isStarted,s=t.maxR,a=t.r,o=t.speed,r=t.style,c=t.width,h=t.x,p=t.y;e.beginPath(),e.strokeStyle=r,e.lineWidth=c,i?(e.arc(h,p,a,0,2*Math.PI),t.r+=o,t.r>s&&"function"==typeof n&&n()):(e.arc(h,p,a,0,2*Math.PI),t.isStarted=!0),e.closePath(),e.stroke()},Object.assign(t,e),t},x=function(e){this.explosionData={x:0,y:0,w:128,h:128,position:0,image:l.explosion};var t=this.explosionData;return t.draw=function(e,n){var i=t.h,s=t.image,a=t.position,o=t.w,r=t.x,c=t.y;if(82!==a){var h=Math.ceil(a/2);e.drawImage(s,h*o,0,o,i,r-64,c-64,o,i),t.position++}else"function"==typeof n&&n()},Object.assign(t,e),t},w=function(e){this.rocketData={mx:0,my:0,w:26,h:49,px:0,py:0,x:0,y:0,speed:16,position:0,maxPosition:3,image:l.rocket};var t=this.rocketData;return t.draw=function(e,n,i){var s=t.h,a=t.image,o=t.speed,r=t.position,c=t.px,h=t.py,p=t.w,u=t.x,l=t.y,y=o,v=o,w=d(c,u),m=d(h,l);if(w>m?v=m/w*o:y=w/m*o,w<o&&m<o)return n.push(new x({x:u,y:l})),void("function"==typeof i&&i());c>u?t.x+=y:c<u&&(t.x-=y),h>l?t.y+=v:h<l&&(t.y-=v),e.save(),e.translate(t.x,t.y),c&&e.rotate(Math.atan2(h-t.y,c-t.x)+Math.PI/2),f(t),e.drawImage(a,r*p,0,p,s,-12,-31,p,s),e.restore()},Object.assign(t,e),t},m=function(e){var t,n=e||{},i=n.drawSceneSpeed,s=n.sceneName;this.sceneName=s||"scene",this.settings={drawSceneSpeed:i||16.66666666},t=[{code:"explosion",src:"images/explosion.png"},{code:"sniper",src:"images/sniper.png"},{code:"rocket",src:"images/rocket.png"}],Array.isArray(t)||(t=[t]),t.forEach(function(e){try{l[e.code]=new Image,l[e.code].src=e.src}catch(t){console.error("Initialization failed!")}})};m.prototype.render=function(){var e=this.ctx,t=this.explosions,n=this.mouseMoveOffset,i=this.rockets,s=this.sniper,a=this.steps;e.clearRect(0,0,e.canvas.width,e.canvas.height),s.draw(e,n),i.forEach(function(n,s){n.draw(e,t,function(){i.splice(s,1)})}),a.forEach(function(t,n){t.draw(e,function(){a.splice(n,1)})}),t.forEach(function(n,i){n.draw(e,function(){t.splice(i,1)})})},m.prototype.destroy=function(){var e=this.ctx,t=this.drawingInterval,n=e.canvas,i=n.height,s=n.width;e.clearRect(0,0,s,i),clearInterval(t)},m.prototype.init=function(){var e=this;this.canvas=document.getElementById(this.sceneName),this.ctx=this.canvas.getContext("2d"),this.rockets=[],this.steps=[],this.explosions=[],this.sniper=new y,this.mouseMoveOffset={x:0,y:0};var t=this.canvas,n=this.mouseMoveOffset,i=this.rockets,s=this.settings,a=this.sniper,o=this.steps;this.render=this.render.bind(this),t.addEventListener("mousemove",function(e){n.x=e.pageX-e.target.offsetLeft,n.y=e.pageY-e.target.offsetTop}),this.drawingInterval=setInterval(function(){e.render()},s.drawSceneSpeed),t.addEventListener("mousedown",function(e){var t=e.originalEvent,s=e.which,r=e.layerX||0,c=e.layerY||0;switch(t&&t.layerX&&(r=t.layerX,c=t.layerY),s){case 1:i.push(new w({mx:n.x,my:n.y,px:r,py:c,x:a.x,y:a.y}));break;case 3:a.sniperLastMouseX=r,a.sniperLastMouseY=c,a.isMoving=!0,o.push(new v({x:r,y:c}))}})};var g=m,M=function(e){function t(){return Object(r.a)(this,t),Object(h.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){(new g).init()}},{key:"onContextMenu",value:function(e){return e.preventDefault(),!1}},{key:"render",value:function(){return s.a.createElement("canvas",{id:"scene",width:"1000",height:"600",tabIndex:"1",onContextMenu:this.onContextMenu})}}]),t}(i.PureComponent);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(s.a.createElement(M,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},8:function(e,t,n){e.exports=n(15)}},[[8,1,2]]]);
//# sourceMappingURL=main.06419da9.chunk.js.map