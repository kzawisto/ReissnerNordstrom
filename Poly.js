;
function Poly(b,Q)
{
    this.b = b;
    this.Q = Q; 
    this.root = new Array(5);
    this.b_crit = 0.5*Math.pow(3 + Math.sqrt(9 - 8*Q*Q),3)/ (1 + Math.sqrt(9- 8 * Q *Q));
    
}
Poly.prototype.findZeros= function(){
    var endpoint =  1 -Math.sqrt(1-this.Q*this.Q);
    this.root[1] = this.findRoot(-endpoint*0.5);
    this.findTrinom(this.root[1]);
   //this.root[2] = this.findRoot(-endpoint*0.5);
    this.solveTrinom();
};
Poly.prototype.Delta = function(r)  {
    return 1 - 2 / r + this.Q * this.Q / (r*r);
    
};
Poly.prototype.solveTrinom = function() {
    var b = this.c1, c = this.c2, d=this.c3;
    var Qdet = (3* c - b*b) / 9, Rdet = (9*b*c -27*d - 2*b*b*b) / 54;
    var Ddet = Math.pow(Qdet, 3) +Rdet * Rdet;
    if(Ddet > 0)    {
        this.hasComplexRoots = true;
        var S,T;
        if(Rdet + Math.sqrt(Ddet) > 0)  S = Math.pow(Rdet+ Math.sqrt(Ddet), 0.33333333333333333333);
        else S = -Math.pow(-Rdet- Math.sqrt(Ddet), 0.3333333333333333333);
        if(Rdet - Math.sqrt(Ddet) >0)   T = Math.pow(Rdet - Math.sqrt(Ddet), 0.3333333333333333333);
        else T = -Math.pow(-Rdet + Math.sqrt(Ddet), 0.33333333333333333333);
        this.root[2] = S + T -b/3;
        this.rootReal = -(S+T)/2 - b/3;
        this.rootImaginary = Math.sqrt(3.0) / 2 * (S-T);
        this.d1 = -2* this.rootReal;
        this.d2 = this.rootReal*  this.rootReal + this.rootImaginary * this.rootImaginary;
    }
    else    {
        this.hasComplexRoots = false;
        var theta = Math.acos(Rdet/Math.sqrt(-Qdet*Qdet*Qdet));
        this.root[4] = 2* Math.sqrt(-Qdet) * Math.cos(theta /3) - b/3;
        this.root[2] = 2* Math.sqrt(-Qdet) * Math.cos(theta /3 + 2.0* 3.14159265359 /3) - b/3;
        this.root[3] = 2* Math.sqrt(-Qdet) * Math.cos(theta /3 + 4.0*3.14159265359 / 3) - b/3;
    }
    
};
Poly.prototype.p = function(r)    {
    return r*r*r*r -this.b*this.b*r*r + 2*this.b*this.b*r -this.b*this.b*this.Q*this.Q;
};
Poly.prototype.pDerivative = function(r) {
    return 4*r*r*r -2*this.b*this.b*r + 2*this.b*this.b;
};
Poly.prototype.f = function(r)  {
    return r*r*r*r/ (r*r-2*r+this.Q*this.Q) - this.b*this.b;
};
Poly.prototype.df = function(r) {
    return 2*r*r*r*(2*this.Q*this.Q+r*r-3*r)/ Math.pow(r * r - 2 * r + this.Q * this.Q,2);
};
Poly.prototype.findTrinom = function(root) {
    this.c1 = root;
    this.c2= -this.b*this.b+root*root;
    this.c3 = (2-root)*this.b*this.b+root*root*root;
};
Poly.prototype.trinom = function(r){
    return r*r*r + this.c1*r*r + this.c2 * r + this.c3;
};/*
Poly.prototype.binom = function(r)  {
    return r*r + this.d1 * r +this.d2;
};
Poly.prototype.trinomDerivative = function(r)   {
    return 1/(r - this.root[1])* this.df(r) - 1 / (r - this.root[1])/ (r - this.root[1]) * this.f(r);
    //3*r*r + this.c1*2*r + this.c2;
};
Poly.prototype.findBinom = function(root){
    this.d1 = this.c1 + root;
    this.d2 = this.c2 + root* this.c1 + root*root;
};*/
Poly.prototype.findRoot = function(initialGuess)
{   var x= initialGuess, num;
    for(var i = 0;i<10; i++){
     num =0;
        while(Math.abs(this.f(x)) > 1e-11 && num != 50)  {
        x = x - this.f(x)/this.df(x);
        num++;
        }
        if(num == 50)   { x = initialGuess -0.2+0.4*Math.random();  ;}
        else   return x;
        
    }
    return x;

};
Poly.prototype.findTrinomRoot = function(initialGuess)
{
       var x= initialGuess, num;
    for(var i = 0;i<10; i++){
     num =0;
        while(Math.abs(this.f(x)) > 1e-11 && num != 50)  {
        x = x - this.f(x)/this.trinomDerivative(x) / (x - this.root[1]);
        num++;
        }
        if(num == 50)   { x = initialGuess -0.2+0.4*Math.random(); console.log("error " + i) ;}
        else   return x;
        
    }
    console.log("BIG error");
    return x;

};
Poly.prototype.solve = function()
{
    this.root[1] = this.findRoot(5*this.b*this.b);
    this.findTrinom(this.root[1]);
    this.root[2] = this.findTrinomRoot(-5*this.b*this.b);
    this.findBinom(this.root[2]);
    this.solveBinom();
    
};
Poly.prototype.calculateIntegral = function( y)   {
    if(this.hasComplexRoots)    {
       turnPoint = this.root[2];
       var B = Math.sqrt((this.root[1] - this.rootReal) * (this.root[1] - this.rootReal) + this.rootImaginary * this.rootImaginary),
      A = Math.sqrt((this.root[2] - this.rootReal) * (this.root[2] - this.rootReal) + this.rootImaginary * this.rootImaginary);
      var h = 1 / Math.sqrt(A*B), ksq = ((A+B) * (A+B) - (this.root[1] - this.root[2])*(this.root[1] - this.root[2]))/(4*A*B);
      var phi = Math.acos(((A-B)* y + this.root[2] * B - this.root[1] * A) / ((A + B)*y - this.root[2] * B - this.root[1] * A  ));
        
     return this.b*h * F(phi, ksq); 
    }
    else {
        var a =this.root[4], b = this.root[3], c = this.root[2], d = this.root[1];
        var h = 2/ Math.sqrt((a - c) * (b - d)), ksq = (b - c) / (a- c) * (a - d) / (b - d),
        phi = Math.asin(Math.sqrt((y - a) / (y - b) * (b - d) / (a - d)));
        return this.b*h * F(phi, ksq);
    }
};
Poly.prototype.evaluateTheta = function(r0)   {
    return - this.calculateIntegral(10e12) - this.calculateIntegral(r0);
};
Poly.prototype.redshift = function(r0, alpha)   {
    1 / (1 + Math.cos(alpha) * Math.sqrt(2 / r0 - Q*Q /(r0 * r0)));
};
function createPoly(r0, alpha, Q)   {
    var b = - r0 * Math.sin(alpha) / (1 + Math.cos(alpha) * Math.sqrt(2 / r0 - Q*Q /(r0 * r0)));
    return new Poly(b,Q);
}
