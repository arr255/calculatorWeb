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
function root(a,root){
    if(root==0){
        alert("错误算式");
    }
    return math.pow(a,1/root);
}