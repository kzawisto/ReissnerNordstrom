
function AlphaToTheta(r0)    {
    this.steps = 100;
    this.eps = 0.01;;
    this.array  = new Array(10);
    
   if(r0 < rd && r0 > rplus)  this.createLowerOuterRegion(r0);
   else if(r0 > rd)  this.createHigherOuterRegion(r0);
   else if(r0 < rplus && r0 > rminus)  this.createSchwarzchildRegion(r0);
   else if(r0 < rminus && r0 > rs)    this.createHigherInnerRegion(r0);
   
   
   else if(r0 < rs) this.array = createTabOfThetaArrays(pi/2, pi ,this.steps*4, "ASCENDING");
     
}

AlphaToTheta.prototype.createLowerOuterRegion = function(r0) {
    this. turnPoint = Math.acos(- Math.sqrt(2/r0 - Q*Q / (r0 * r0)));
    this.alpha1 = findAlphaForB(-bcrit, r0,  0.75 * pi, this.turnPoint, 1);
    this.alpha2 = findAlphaForB(-bcrit, r0, this.turnPoint,pi, 2);
    this.array[1] = new ThetaArray(this.alpha2, pi,this.steps,"DESCENDING");
    this.array[0] = new ThetaArray(pi/2, this.alpha1,this.steps,"ASCENDING");  
   
   // if(this.array[1].tab[0] == NaN)
    this.array[1].tab[0] = this.array[1].tab[1];

};
AlphaToTheta.prototype.createSchwarzchildRegion = function(r0)  {
       this. turnPoint = Math.acos(-1/ Math.sqrt(2/r0 - Q*Q / (r0 * r0)));
    this.alpha1 = findAlphaForB(-bcrit, r0,  0.75 * pi, this.turnPoint, 1);
    this.alpha2 = findAlphaForB(-bcrit, r0, this.turnPoint,pi, 2);
    this.array[0] = new ThetaArray(pi/2, this.alpha1,this.steps, "ASCENDING" );
    
    this.array[1] = new ThetaArray(this.alpha1 + this.eps, pi,this.steps, "ASCENDING");
};

AlphaToTheta.prototype.createHigherOuterRegion = function(r0) {
     this.turnPoint = Math.acos(- Math.sqrt(2/r0 - Q*Q / (r0 * r0)));
       this.alpha1 = findAlphaForB(-bcrit, r0,  this.turnPoint, pi, 2);
       this.alpha2 = findAlphaForB(-bcrit, r0,  pi/2,this.turnPoint, 1);;
       this.array[0] = new ThetaArray(pi/2, this.alpha2,5 * Math.floor(Math.sqrt(this.steps * Math.max(0,this.alpha2 - pi/2))),"ASCENDING");
        this.array[1] = new ThetaArray(this.alpha2+this.eps, this.turnPoint, this.steps/2,"DESCENDING");
        this.array[2] = new ThetaArray(this.turnPoint+ this.eps, this.alpha1,this.steps/2,"ASCENDING");
        this.array[3] = new ThetaArray(this.alpha1+this.eps, pi ,this.steps/2, "DESCENDING");
       // for(var a =0;a<4;++a) {console.log("GGGGGGGG");
        //this.array[a].display();}
};

AlphaToTheta.prototype.createHigherInnerRegion = function(r0) {
  this.turnPoint = Math.acos(- Math.sqrt(2/r0 - Q*Q / (r0 * r0)));
       this.alpha1 = findAlphaForB(-bcrit, r0,  this.turnPoint, pi, 2);
       this.alpha2 = findAlphaForB(-bcrit, r0,  pi/2,this.turnPoint, 1);;
       this.array1 = createTabOfThetaArrays(this.alpha1+this.eps, pi ,this.steps, "ASCENDING");
       this.array2 = createTabOfThetaArrays(pi/2, this.alpha2, this.steps, "ASCENDING");
       var a =0, b =0;
       for(;this.array1[a] != null;++a)this.array[a] = this.array1[a];
       for(;this.array2[b] != null;++a, ++b)this.array[a] = this.array2[b];
};

AlphaToTheta.prototype.findAlphas = function(theta)  {
    var ret = new Array();
    for(var a = 0; this.array[a] != null; ++a)    {
        if(this.array[a].isInArray(theta) == true) {
            ret.push(this.array[a].fetchRecord(theta));
        };
    }
    return ret;
};


function alphaResult(alpha, brightness){
    this.alpha = alpha;
    this.brightness = brightness;
}
function Star(theta, phi, temp,size)   {
    this.theta = theta;
    this.phi = phi;
    this.size = size;
    this.temp = temp;
    this.color = tempToColor(temp);
}
function createThetaArray(r0, Q)    {
     var tabAlpha = new Array(thetanum), dalpha = 1.0 / thetanum, alpha = pi;
        for(var i =0; i< thetanum; ++i){
       poly = createPoly(r0, alpha, Q);
       poly.findZeros();
       tabAlpha[i] = poly.evaluateTheta(r0);
    //console.log(alpha   + " " + (tabAlpha[i] ) + " " + poly.b);
    //  
        tabb[i] = poly.b;
        alpha -= dalpha;
    }
    return tabAlpha;
}
function bfunction(b, r0, alpha) {
    return b + r0 * Math.sin(alpha) / (1 + Math.cos(alpha)*Math.sqrt(2/r0 - Q * Q / (r0 * r0)));
}
function findAlphaForB(b, r0, left, right, type)    {
    var axis = 0.5 * (left + right), num =0;
    while(Math.abs(bfunction(b,r0,axis)) > 1e-8)   {
        if(bfunction(b,r0,axis) > 0)   
            if(type == 1) right = axis; else left = axis;
        else  if(type == 1) left = axis; else right = axis;
        axis = (left+ right) /2;
        num++;
       
        if(num == 50) break;
    }
    return axis;
}
function findInArray(sortedArray, len, value)    {
    var left = 0, right = len-1;
    while(left <= right )  {
        
        axis = Math.floor((left + right) / 2);
        if(value < sortedArray[axis]) left = axis+1;
        else right = axis-1;
     
    }
    return left;
    
}
function findInArrayRev(sortedArray, len, value)    {
    var left = 0, right = len-1;
    while(left <= right )  {
        
        axis = Math.floor((left + right) / 2);
        if(value > sortedArray[axis]) left = axis+1;
        else right = axis-1;
     
    }
    return left;
    
}
function retrieveFromArray(tabTheta, value)    {
    var index = findInArray(tabTheta,thetanum, value);
   // console.log(index + " x " + value);
    return  pi- 1 / thetanum * index - 1/ thetanum * (tabTheta[index] - value)/(tabTheta[index] - tabTheta[index + 1]);
}