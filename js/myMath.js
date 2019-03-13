//10为底对数
function lg(x){
    return Math.log(x)/Math.log(10);
}
function NPr(x){
    if(math.isInteger(x)){
        while(1){
            if(math.isPrime(x+1)){
                return x+1;
            }
            else{
                x+=1;
            }
        }
    }
    else{
    return "error";
    }
}
function degToRad(deg){
    return math.PI*deg/180
}
function dsin(x){
    return math.sin(degToRad(x));
}
function dcos(x){
    return math.cos(degToRad(x));
}
function dtan(x){
    return math.tan(degToRad(x));
}
function dasin(x){
    return math.asin(degToRad(x));
}
function dacos(x){
    return math.acos(degToRad(x));
}
function datan(x){
    return math.atan(degToRad(x))
}
