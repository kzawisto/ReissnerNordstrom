function el(x,kc, p, a, b)  {
    var mc = kc * kc, xp1sqrt = Math.sqrt(1+x*x);
    var xOld = 1, yOld = 1, IOld = Math.log(x + xp1sqrt), INew;
    var xPower = x;
    var result= 0;
    for(var i = 1; i < 100; ++i)    {
        INew = xPower / (2*i) * xp1sqrt - (2*i - 1)/(2*i) * IOld;
        result += a* yOld * IOld +b* yOld * INew;
        xNew = - (2*i- 1)/(2*i)*mc * xOld;
        yNew = xNew - p*yOld;
        xOld = xNew;
        yOld= yNew;
        xPower*=(x*x);
    }
    return result;
}
function F(phi, ksq)  {
    var cos = Math.cos(phi), sin = Math.sin(phi);
    return sin*CarlsonForm(cos*cos, 1 - ksq *sin*sin,1);
}
function CarlsonForm(x,y,z) {
    var lambda, xn = x, yn = y, zn =z;
    for(var a =0; a < 20; ++a) {
        lambda = Math.sqrt(xn*yn) + Math.sqrt(yn*zn) + Math.sqrt(zn*xn);
        xn= (xn + lambda)/4;
        yn = (yn+lambda) /4;
        zn = (zn + lambda) /4;
    }
    return 1/Math.sqrt(xn);
}

