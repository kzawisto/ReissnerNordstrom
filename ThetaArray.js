
function ThetaArray(alphaStart, alphaEnd, steps, orientation)   {
    this.orientation = orientation;
    this.alphaStart = alphaStart;
    this.alphaEnd = alphaEnd;
    this.steps = Math.floor( steps);
    this.tab = new Array(steps);
    this.step = (alphaEnd - alphaStart) / steps;
    var alpha = alphaStart;
    for(var i = 0;i <steps; ++i)    {
     poly = createPoly(r0, alpha, Q);
     poly.findZeros();
     this.tab [i] = poly.evaluateTheta(r0);
     //if(orientation == "ASCENDING")
    //
      alpha+=this.step;
     }
}
ThetaArray.prototype.fetchRecord = function(theta) {
    if(this.orientation == "ASCENDING") {
        var index = findInArrayRev(this.tab, this.steps, theta);
        if(index <= 1) return -1e10;
        var df = (this.tab[index] - theta) / (this.tab[index] - this.tab[index-1]);
        return new alphaResult(this.alphaStart + this.step * (index - df),  this.step / (this.tab[index] - this.tab[index-1]))  ;
    }
    else {
          var index = findInArray(this.tab, this.steps, theta);
            var df = (-this.tab[index] + theta) / (this.tab[index-1] - this.tab[index]);
            return new alphaResult(this.alphaStart + this.step * (index - df), this.step / (this.tab[index-1] - this.tab[index])) ;
    }
};
ThetaArray.prototype.display = function()   {
    var alpha = this.alphaStart;
    for(var i =0; i < this.steps; ++i)  {
         console.log(alpha * 180.0 / pi  + " " + (this.tab[i] * 180.0 /pi) + " " );
        alpha+=this.step;
    }
};
ThetaArray.prototype.isInArray = function(theta)    {
    var lower = Math.min(this.tab[0], this.tab[this.steps - 1]), upper = Math.max(this.tab[0], this.tab[this.steps - 1]);
    if(theta > lower && theta < upper) return true;
    else return false;
};
function Color(r,g,b)   {
    this.r = r;
    this.g= g;
    this.b = b;
    this.rgba="rgba("+Math.floor(r) +", " + Math.floor(g) + "," + Math.floor(b) +", 1)";
}
function tempToColor(temperature)   {
    temperature /= 100;
    var r,g,b;
    if(temperature <= 66) {
        r =255;
        g = temperature;
        g = 99.4708025861 * Math.log(g) - 161.1195681661;
        if(temperature <= 19) b = 0;
        else {
            b = temperature - 10;
            b = 138.5177312231 * Math.log(b) - 305.0447927307;
        }
    }
    else {
        b = 255;
        r  = temperature - 60;
        r =  329.698727446 * Math.pow(r, -0.1332047592);
        g = temperature - 60;
        g = 288.1221695283 * Math.pow(g, -0.0755148492);  
    }
    r*=1.4;
    b*=1.4;
    g*=1.4;
    if(r > 255) r = 255;
        if(r<0) r =0;
    if(g < 0) g = 0;
    if(g> 255) g = 255;
    if(b < 0) b = 0;
    if(b> 255) b = 255;
    return new Color(r,g,b);
}
function createTabOfThetaArrays(alphaStart, alphaEnd,steps,ordering){
    var tab = new Array(10), tabi = 0;
    tabTmp = new ThetaArray(alphaStart,alphaEnd,steps, ordering);
    for(var i = 0; i<10 && tabi <=steps-2; i++)   {
        var j =0;
        if(ordering == "ASCENDING") {
          for(;tabTmp.tab[tabi] < tabTmp.tab[tabi+1] && tabi < steps -1;  j++,++tabi );
            tab[i] = new ThetaArray(alphaStart + (tabi - j) * tabTmp.step, alphaStart + (tabi) * tabTmp.step, j, "ASCENDING");
        }
         if(ordering == "DESCENDING") {
            for(;tabTmp.tab[tabi] > tabTmp.tab[tabi+1] && tabi < steps -1; j++,++tabi);
            tab[i] = new ThetaArray(alphaStart + (tabi - j) * tabTmp.step, alphaStart + (tabi) * tabTmp.step, j, "DESCENDING");
        }
        ordering = reverseOrdering(ordering);
        
    }
    return tab;
}
function reverseOrdering(ordering){
    if(ordering == "ASCENDING") return "DESCENDING";
    else return "ASCENDING";
}