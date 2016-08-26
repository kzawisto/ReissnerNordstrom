var pi = 3.14159265359;
var thetanum = 200;
var canvas1,interval;
var r0 =140, Q=0.99, starnum=600, tabStarPosTheta, tabStarPosPhi ,tabb = new Array(thetanum),starArray =new Array(starnum);
var rplus = 1 + Math.sqrt(1-Q*Q), rminus =1 - Math.sqrt(1-Q*Q),
 bcrit = Math.sqrt( 0.5 * Math.pow(3 + Math.sqrt(9 - 8*Q*Q), 3)/ (1 + Math.sqrt(9 - 8*Q*Q))), 
 rd = 0.5 * (3 + Math.sqrt(9 - 8*Q*Q)), rs = rd * (Math.sqrt(2 / (rd - 1)) -1);


function doCalcs(){
    //r0 = 160;
    canvas1 = new MyCanvas("myCanvas");
var poly, Q =0.99;tabStarPosTheta = new Array(starnum); tabStarPosPhi = new Array(starnum);
for(var a =0; a<starnum ;++a)   {
    var x = Math.random() - 0.5 , y = Math.random() - 0.5;
   // var x = Math.random() - 0.5, y = Math.random() - 0.5, sq = Math.sqrt(x*x + y *y);
    var starPosPhi = Math.random() * 2* pi; 
    var starPosTheta=Math.acos(1- 2*Math.random()); //pi - 2*Math.atan(Math.sqrt(x*x + y *y) );
    var temp = 2000 + 4000 * Math.random();
    var size = Math.abs(1 + 2 * Math.random());
     starArray[a] = new Star(starPosTheta, starPosPhi, temp, size);
    
}
starArray[0].size = 6;
starArray[0].temp = 10000;
starArray[0].phi = 0;
starArray[0].theta =  1/9*pi;
 //var tabTheta = createThetaArray(r0, Q), alpha =pi;;
interval = setInterval(function(){myTimer();},50);
    //var att = new AlphaToTheta(r0);
 
};
function displayFrame() {
    r0 = document.getElementById("textbox2").value / 0.998;
   // Q = document.getElementById("textbox1").value;
    if(interval != null) clearInterval(interval);
    myTimer();
}
function MyCanvas(src) {
    
    this.canvas = document.getElementById(src);
    this.context = this.canvas.getContext("2d");
    this.w = this.canvas.scrollWidth;
    this.h = this.canvas.scrollHeight;
};0.64
function create() {
    canvas1 = new MyCanvas("myCanvas");
}
function myTimer()  {
    if(r0 >= rplus) 
    r0 *= 0.998;
    else if(r0 > Q*Q /2+0.01)    r0*=0.999;
   // console.log(r0);
    var att = new AlphaToTheta(r0);
    canvas1.context = canvas1.canvas.getContext("2d");
   
    canvas1.context.fillStyle = "black";
    canvas1.context.fillRect(0,0,canvas1.w, canvas1.h);
   // canvas1.context.globalCompositeOperation = 'multiply';
    for(var a =0; a<starnum ;++a)   {
            var x =  Math.sqrt(2/r0 - Q*Q/(r0*r0));
            if(r0 < rplus && r0 > rminus) x = Math.sqrt(1/Q*Q);
            var ret = att.findAlphas(starArray[a].theta), ret1 = att.findAlphas(starArray[a].theta + pi), ret2 =  att.findAlphas(starArray[a].theta - pi);
            ret = ret.concat(ret1,ret2);
           for(var i =0; i < ret.length;++i)   {
                if(ret[i]!= undefined){
                    canvas1.context.beginPath();
                    var redshift = 1/ (1 + x * Math.cos(ret[i].alpha));
                    var c = tempToColor(starArray[a].temp * redshift);
                  drawEllipse(canvas1.context,  150* Math.tan(ret[i].alpha)  ,
                   starArray[a].size * Math.sqrt(ret[i].brightness),starArray[a].size, starArray[a].phi, c.rgba);
                    //drawEllipse(canvas1.context, 100 * Math.tan(pi/4), 30,20,45,"white");
                }}
       }
    canvas1.context.fillStyle = 'white';
    canvas1.context.fillText("R = " + r0,10,10);
}
function drawEllipse(context, r, rh, rw, angle, fillStyle)   {
    context.save();
    
    context.translate(400, 300);
    context.rotate(angle);
    context.scale(1, rh/rw);
    context.beginPath();
    context.arc(0, -r * rw/rh, rw, 0, Math.PI * 2, false);
    context.restore();
    context.fillStyle = fillStyle;
    context.fill();
}
