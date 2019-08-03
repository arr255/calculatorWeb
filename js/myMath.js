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
function degreeToRadium(x){
    return x/180*math.PI;
}
function degreeToNumber(arg){
    deg=arg.deg;
    min=arg.min;
    sec=arg.sec;
    console.log(deg);
    if(deg && min && sec){
        return deg+min/60+sec/3600;
    }
    else if(deg && min){
        return deg+min/60;
    }
    else if(deg){
        return deg;
    }
}
function Npr(x){
    startX=Math.floor(x)+1;
    while(1){
        if(math.isPrime(startX)){
           return startX; 
        }
        else{
            startX+=1;
        }
    }
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
    expr=handleToPy(expr);
    res=""
    $$.ajax({
        url:"http://www.guomf.top:8002/calPage/myInt",
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
function diffFromServer(expr,number){
    expr=String(expr);
    number=parseFloat(number);
    reg=RegExp(/\{color\{pink\}(.+?)\}/g);
    if(expr.match(reg)){
        variable=RegExp.$1;
        expr=expr.replace(reg,variable);
    }
    else{
        variable="x";
    }
    expr=handleToPy(expr);
    console.log(expr)
    res="";
    $$.ajax({
        url:"http://www.guomf.top:8002/calPage/myDiff",
        method:"get",
        data:{"expr":expr,"variable":variable,"number":number},
        async:false,
        dataType:"json",
        success:function(data){
            res= data.result;
        },
        error:function(){
            res= "";
        }
    })
    console.log(res);
    return res;
}
function sumFromServer(expr,downNumber,upNumber){
    console.log(expr);
    expr=String(expr);
    downNumber=parseFloat(downNumber);
    upNumber=parseFloat(upNumber);
    reg=RegExp(/\{color\{pink\}(.+?)\}/g);
    if(expr.match(reg)){
        variable=RegExp.$1;
        expr=expr.replace(reg,variable);
    }
    else{
        variable="x";
    }
    expr=handleToPy(expr);
    console.log(expr)
    res="";
    $$.ajax({
        url:"http://www.guomf.top:8002/calPage/mySum",
        method:"get",
        data:{"formula":expr,"downNumber":downNumber,"upNumber":upNumber},
        async:false,
        dataType:"json",
        success:function(data){
            res= data.result;
        },
        error:function(){
            res= "";
        }
    })
    console.log(res);
    return res;
}
function prodFromServer(expr,downNumber,upNumber){
    console.log(expr);
    expr=String(expr);
    downNumber=parseFloat(downNumber);
    upNumber=parseFloat(upNumber);
    reg=RegExp(/\{color\{pink\}(.+?)\}/g);
    if(expr.match(reg)){
        variable=RegExp.$1;
        expr=expr.replace(reg,variable);
    }
    else{
        variable="x";
    }
    expr=handleToPy(expr);
    console.log(expr)
    res="";
    $$.ajax({
        url:"http://www.guomf.top:8002/calPage/myProd",
        method:"get",
        data:{"formula":expr,"downNumber":downNumber,"upNumber":upNumber},
        async:false,
        dataType:"json",
        success:function(data){
            res= data.result;
        },
        error:function(){
            res= "";
        }
    })
    console.log(res);
    return res;
}
function handleToPy(expr){
    //幂
    expr=expr.replace(/\^{(.+?)\}/g,"^$1");
    //根号
    expr=expr.replace(/sqrt\[(.+?)\]\{(.+?)\}/g,"$2**$1");
    //分数
    expr=expr.replace(/rac\{(.+?)\}\{(.+?)\}/g,"$1/$2");
    //运算符
    expr=expr.replace(/mathrm\{+\}/g,"+");
    expr=expr.replace(/mathrm\{div\}/g,"/");
    expr=expr.replace(/mathrm\{\times\}/g,"*");
    expr=expr.replace(/mathrm\{-\}/g,"-");
    console.log(expr);
    return expr;
}

function arrayToStr(arr) {
    str='[['
    for(row=0;row<arr.length;row++) {
        for(column=0;column<arr[0].length;column++) {
            str+=String(arr[row][column]);
            if(column!=arr[0].length-1) {
                str+=','
            }
        }
        if(row!=arr.length-1) {
            str+='],['
        }
    }
    str+=']]'
    return str;
}

function eigen(arr) {
    $$.ajax({
        url:"http://www.guomf.top:8002/calPage/eigen",
        method:"get",
        data:{"arr":arrayToStr(arr)},
        async:false,
        dataType:"json",
        success:function(data){
            res='['+data.result+']';
            console.log(res);
        },
        error:function(){
            res="";
        }
    })
    console.log(res);
    return res;
}

function cramer(arr) {
    var arr1='[[';
    var arr2='[';
    var row=arr.length;
    var column=arr[0].length;
    for(m=0;m<row;m++) {
        for(n=0;n<column;n++) {
            if(n<column-2) {
                arr1+=arr[m][n]+',';
            }
            else if(n==column-2) {
                arr1+=arr[m][n]+']';
            }
            else {
                arr2+='['+arr[m][n]+']';
            }
        }
        if(m!=row-1) {
            arr1+=',['; 
            arr2+=',';
        }
    }
    arr1+=']';
    arr2+=']';
    console.log(arr1);
    $$.ajax({
        url:"http://www.guomf.top:8002/calPage/cramer",
        method:"get",
        data:{"arr1":arr1,"arr2":arr2},
        async:false,
        dataType:"json",
        success:function(data){
            res='['+data.result+']';
            console.log(res);
        },
        error:function(){
            res="";
        }
    })
    console.log(res);
    return res;
}

function myInv(arr) {
    return arrayToStr(math.inv(arr));
}
function myTranspose(arr) {
    return arrayToStr(math.transpose(arr));
}