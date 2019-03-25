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

function integral(expr,downNumber,upNumber,variable){
    var intNumber=1000;//积分次数
    var eachInterval=(upNumber-downNumber)/intNumber;//间隔
    result=0;//结果
    for(k=0;k<intNumber;k++){
        varNumber=downNumber+eachInterval*k;//变量值
        formula=expr.replace(variable,String(varNumber));
        result+=parseFloat(mainCalculateAPI(formula)*eachInterval);
    }
    result=math.round(result,4);
    console.log(result);
    return result;
}
function intFromServer(downNumber,upNumber,expr){
    reg=RegExp(/\{color\{pink\}(.+?)\}/g);
    if(expr.match(reg)){
        variable=RegExp.$1;
        expr=expr.replace(reg,variable);
    }
    else{
        variable="x";
    }
    //幂
    expr=expr.replace(/\^{(.+?)\}/g,"^$1");
    //根号
    expr=expr.replace(/sqrt\[(.+?)\]\{(.+?)\}/g,"$2**$1");
    //分数
    expr=expr.replace(/rac\{(.+?)\}\{(.+?)\}/g,"$1/$2");
    //运算符
    expr=expr.replace(/mathrm\{(.+?)\}/,"$1");
    console.log(expr);
    res=""
    $$.ajax({
        url:"http://www.guomf.top:8002/calPage/cal",
        method:"get",
        data:{"formula":expr,"variable":variable,"downNumber":downNumber,"upNumber":upNumber},
        async:false,
        dataType:"json",
        success:function(data){
            res= data.result2;
        },
        error:function(){
            res= "";
        }
    })
    return res;
}
