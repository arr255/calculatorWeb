var myApp = new Framework7();
var mainView = myApp.addView('.view');
mainView.router.load("heel");
var height=document.documentElement.clientHeight;
var $$=Dom7;
var buttonHeight=height*0.7/9;
var cursor="{\\color{yellow}|}";
var regCursor="\\{\\\\color\\{yellow\\}\\|\\}";
var initFormula="$"+cursor+"$"
var currentFormula=initFormula;
var page=1;//切换页面,取值为1,2,3,4
var maxBrackets=0;//最大嵌套的括号层数
var cursorOnTheLine=false;//光标是否在线上内
var Already=true;//上一次计算完成
var recordNumber=0;//记录条数
var logFormula="";//记录的公式
var logResult="";//记录的结果
var currentLog=localStorage.length;//当前记录
var degMode="rad"
var varColor="pink"
var variable=['x'];
init();
/*
    init初始化
*/
function init(){
    //console.log(currentFormula);
    $$("a.button").css("height",buttonHeight+"px");
    $$("a").children().css("position","relative");
    $$("a").children().css("top",buttonHeight/3+"px");
}
/*changeFormula()：按键后公式变动
    参数：formula:前端传入参数;
    leftMove:左移数目;RightMove:右移数目;cursorOnLine:是否在线上，改变全局变量;firstPara:第一个参数位置;
*/
function changeFormula(formula,arg={}){
    if(Already){
        $$("#result").text("");
        $$("formula").text(initFormula);
        currentFormula=initFormula;
        Already=false;
    }
    var RightMove=arg["RightMove"];
    var firstPara=arg["firstPara"];
    var leftMove=arg["leftMove"];
    //删除underline
    //获取添加后的光标位置
    var cursorLocation=currentFormula.indexOf(cursor);
    currentFormula=insertStr(currentFormula,cursorLocation,formula);
    //获取添加后的光标位置
    var cursorLocation=currentFormula.indexOf(cursor);
    if(leftMove>0){
        currentFormula=currentFormula.replace(cursor,"");
        currentFormula=insertStr(currentFormula,cursorLocation-leftMove,cursor);
    }
    currentFormula=deleteUnderline(currentFormula);
    //重新显示
    reload();
}
/*
    addFrac()
    添加分数
*/
function addFrac(){
    var firstPara=searchFirstPara(currentFormula,regCursor);
    if(!firstPara){
        changeFormula("\\frac{\\underline{}}{}",{leftMove:4});
    }
    else{
        currentFormula=currentFormula.replace(firstPara,"");
        changeFormula("\\frac{"+firstPara+"}{\\underline{}}",{leftMove:2});
    }
    reload();
}
/*
    searchFirstPara(formula,endSignal)
    寻找参数，用于分数，阶乘
    返回值：第一个参数字符串
*/
function searchFirstPara(formula,endSignal){
    //如果第一个参数为空为空,包括加减乘除、左括号，$，
    var reg=RegExp("(\\\\mathrm\\{\\+}|\\\\mathrm\\{-\\}|\\\\mathrm\\{\\\\times\\}|\\\\mathrm\\{\\\\div\\}|\\(|\\$)"+endSignal);
    if(formula.match(reg)){
        return "";
    }
    //如果第一个参数为数字
    reg=RegExp("((\\d|\\.)+)"+endSignal)
    if(formula.match(reg)){
        return RegExp.$1;
    }
    //如果第一个参数为常数
    reg=RegExp("((\\\\pi)|(\\\\mathrm\\{e\\}))"+endSignal);
    if(formula.match(reg)){
        return RegExp.$1;
    }
    //如果匹配的为括号
    reg=RegExp("\\)"+endSignal);
    if(formula.match(reg)){
        var handleBracketsStr=handleBrackets(formula);
        reg=RegExp("\\[(\\d+?)\\]\\)"+endSignal);
        handleBracketsStr.match(reg);
        var bracketsNumber=RegExp.$1;
        reg=RegExp("\\["+bracketsNumber+"\\](.+?\\["+bracketsNumber+"\\]\\))"+endSignal);
        handleBracketsStr.match(reg);
        var firstParaWithSignal=RegExp.$1;
        var firstPara=firstParaWithSignal.replace(/\[.+?\]/g,"");
        //console.log("firstPara:"+firstPara);
        //判断是否为函数
        reg=RegExp("(\\\\sin|\\\\cos|\\\\tan|\\\\ln|\\\\arcsin|\\\\arccos|\\\\arctan)"+strToReg(firstPara));
        if(formula.match(reg)){
            return RegExp.$1+firstPara;
        }
        else{
            return firstPara;
        }
    }
}
/*
    strToReg(formula):不转义
    将字符串转为不转义的正则表达式
*/
function strToReg(str){
    var metaChar=["\\\\","\\^","\\$","\\.","\\*","\\+","\\?","\\|","\\/","\\(","\\)","\\[","\\]","\\{","\\}","\\=","\\!","\\:","\\-"];
    for(i=0;i<metaChar.length;i++){
        reg=RegExp("("+metaChar[i]+")","g");
        str=str.replace(reg,"\\"+"$1");
    }
    return str;
}
/*
    changePage(arg):切换页面。当按下shift或换页是触发
    参数：arg，shift或LR
*/
function changePage(arg){
    //若为shift，奇数+1，偶数-1
    //若为LR，若为4的倍数+3或+4，-2；若为4的倍数+1或+2，+2
    if(arg.method=="shift"){
        if(page%2==1){
            page+=1;
        }
        else if(page%2==0){
            page-=1;
        }
    }
    else if(arg.method=="LR"){
        if(page%4==1||page%4==2){
            page+=2;
        }
        else if(page%4==3||page%4==0){
            page-=2;
        }
    }
    //console.log("chagePage:"+page);
    myApp.showTab("#tab"+String(page));
}
/*
    upButtonClick()
    上方向键按下
*/
function upButtonClick(){
    if(Already){
        if(currentLog>0){
            currentFormula=localStorage.key(currentLog);
            result=localStorage.getItem(currentFormula);
            currentLog-=1
            $$("#result").text(result);
            reload();
        }
    }
    else{
        moveLeft(1);
    }
}
/*
    downButtonClick()
    下方向键按下
*/
function downButtonClick(){
    if(Already){
        if(currentLog<localStorage.length){
            currentFormula=localStorage.key(currentLog);
            result=localStorage.getItem(currentFormula);
            currentLog+=1;
            $$("#result").text(result);
            reload();
        }
    }
    else{
        moveRight(1);
    }
}
/*
    AC按键按下，清空内容，返回为0
    返回：无
*/
function clearContent(){
    currentFormula="$"+cursor+"$";
    Already=true;
    currentLog=localStorage.length;
    reload();
}
/* 删除
    参数：
    返回：无
*/
function del(del=1){
    var wholeSingnal=["\\\\mathrm\\{\\+\\}","\\\\mathrm\\{\\-\\}","\\\\mathrm\\{\\\\times\\}","\\\\mathrm\\{\\\\div\\}","[0-9]","\\.","\\\\pi",
        "\\\\ln\\(","\\\\sin\\(","\\\\cos\\(","\\\\tan\\(","\\^\\{","\\\\sqrt\\[2]\\{\\\\underline\\{","\\\\sqrt\\[2]\\{","\\(","\\)","\\}"]
    while(del>0){
        for(i=0;i<wholeSingnal.length;i++){
            var reg=new RegExp("("+wholeSingnal[i]+")("+regCursor+")");
            if(currentFormula.match(reg)){
                currentFormula=currentFormula.replace(reg,"$2");
                del-=1;
                break;
            }
        }
        del-=1;
    }
//console.log("moveLefted:"+currentFormula);
Already=false;
reload();
}
/*
    clearHistory()
    清除历史记录
*/
function clearHistory(){
    localStorage.clear();
    alert("历史记录已清空");
}
/* changeMode:改变模式
    参数：mode.key
    return:none
*/
function changeDegMode(){
    if(degMode=="rad"){
        degMode="deg";
    }
    else if(degMode=="deg"){
        degMode="rad";
    }
    $$("#deg").text(degMode);
}
/*
    moveLeft:光标左移
    参数：左移位数
    返回：无
*/
function moveLeft(lm){
    var wholeSingnal=["\\\\mathrm\\{\\+\\}","\\\\mathrm\\{\\-\\}","\\\\mathrm\\{\\\\times\\}","\\\\mathrm\\{\\div\\}","[0-9]","\\.","\\\\pi",
                        "\\\\ln\\(","\\\\sin\\(","\\\\cos\\(","\\\\tan\\(","\\^\\{","\\\\sqrt\\[2]\\{\\\\underline\\{","\\\\sqrt\\[2]\\{","\\(","\\)","\\}"]
    while(lm>0){
        for(i=0;i<wholeSingnal.length;i++){
            var reg=new RegExp("("+wholeSingnal[i]+")("+regCursor+")");
            if(currentFormula.match(reg)){
                currentFormula=currentFormula.replace(reg,"$2$1");
                lm-=1;
                break;
            }
        }
        lm-=1;
    }
    //console.log("moveLefted:"+currentFormula);
    Already=false;
    reload();
    }
/* 
    absMoveLeft(lm):固定左移
    参数：lm:左移字符数目
*/
function absMoveLeft(lm){

}
function moveRight(rm){
    var wholeSingnal=["\\\\mathrm\\{\\+\\}","\\\\mathrm\\{\\-\\}","\\\\mathrm\\{\\\\times\\}","\\\\mathrm\\{\\div\\}","dx",",","\\]\\{","\\}\\{","\\}\\^\\{","[0-9]","\\.","\\\\pi",
                        "\\\\ln\\(","\\\\sin\\(","\\\\cos\\(","\\\\tan\\(","\\^\\{","\\\\sqrt\\[2]\\{\\\\underline\\{","\\\\sqrt\\[2]\\{","\\(","\\)","\\}"]
    while(rm>0){
        for(i=0;i<wholeSingnal.length;i++){
            var reg=new RegExp("("+regCursor+")("+wholeSingnal[i]+")");
            if(currentFormula.match(reg)){
                currentFormula=currentFormula.replace(reg,"$2$1");
                rm-=1;
                break;
            }
        }
        rm-=1;
        }
    //console.log("moveRighted:"+currentFormula);
    Already=false;
    reload();
}
/*
    deleteUnderline()
*/
function deleteUnderline(str){
    var reg=new RegExp("\\\\underline\\{(.+?)"+regCursor+"\\}");
    str=str.replace(reg,"$1"+cursor);
    return str;
}
/*
    insertStr(str,location,insertContent)
    参数：str：待处理字符串；location：插入的位置;insertContent:插入的内容
    返回值：处理后的字符串
*/
function insertStr(str,location,insertContent){
    str=str.substr(0,location)+insertContent+str.substr(location,str.length);
    return str;
}
/*
    strPreHandle:用于formula左移右移删除等功能时预处理，将空格处理
    参数：formula将要处理的字符串
    返回值：处理后的字符串
*/
function strPreHandle(formula){
    formula=formula.replace(/ /g,"");
    return formula;
}
/*******************************
 * 计算部分
 ******************************/
//主计算函数
function calculate(string){
    console.log("Calculator Received String:"+string);
    string=handleString(string);
    string=handleFactorial(string);
    console.log("Calculaor HandledString:"+string);
    if(string.match(/^\d+\,\d+$/)){
        return string;
    }
    var result=eval(string);
    ApproResult=math.round(parseFloat(result),7);
    if(ApproResult){
        result=ApproResult;
    }
    else{
        var reg = new RegExp('"',"g");
        result=String(result).replace(reg,"")
    }
    return ApproResult;
}
/*
    mainCalculate(formula):主处理函数，进行括号迭代
    参数：待处理式子
    返回值：最终计算结果
*/
function mainCalculate(formula){
    console.log("recievedString:"+formula);
    logFormula=formula.replace(cursor,"");
    localStorage.setItem(logFormula,"");
    //第一次处理，将常数转换
    string=handleConst(formula);
    //第二次处理，函数处理
    //删除光标
    formula=formula.replace(cursor,"");
    //处理积分
    if(formula.match(/\\int_\{(.+?)\}\^\{(.+?)\}(.+?)dx/g)){
        downNumber=RegExp.$1;
        upNumber=RegExp.$2;
        expr=RegExp.$3;
        console.log(formula);
        formula=formula.replace(/\\int_\{(.+?)\}\^\{(.+?)\}(.+?)dx/g,eval("intFromServer("+downNumber+","+upNumber+",'"+expr+"')"));
        console.log(formula);
    }
    //处理导数
    if(formula.match(/\\delta\((.+?)\,(.+?)\)/g)){
        expr=RegExp.$1;
        number=RegExp.$2;
        formula=formula.replace(/\\delta\((.+?)\,(.+?)\)/g,eval("diffFromServer("+expr+","+number+")"));
        console.log(formula)
    }
    console.log(formula);
    //第三次处理，添加标号
    string=handleBrackets(formula);
    formula=handleBrackets(formula);
    maxBrackets=1;
    for(var i=maxBrackets;i>=0;i--){
        //字符串需要加上双重转义字符
        var signal="\\["+String(i)+"\\]";
        var reg=new RegExp("("+signal+"\\("+")"+"(.+?)"+"("+signal+"\\))",'g');
        var signalReg=new RegExp(signal,"g");
        formula.match(reg);
        var handledResult=String(calculate(RegExp.$2));//括号内计算结果
        formula.match(reg);  //重新赋值
        formula=formula.replace(reg,RegExp.$1+handledResult+RegExp.$3).replace(signalReg,"");
        //console.log("result:"+formula);
    }
    formula=handleFactorial(formula);
    var finalResult=calculate(formula);
    //alert(finalResult);
    $$("#result").text(finalResult);
    Already=true;
    logResult=finalResult;
    localStorage.setItem(logFormula,logResult);
    currentLog=localStorage.length;
}
/*
    mainCalculatorAPI(formula):用于积分
    return result;
*/
function mainCalculateAPI(formula){
    //console.log("recievedString:"+formula);
    logFormula=formula.replace(cursor,"");
    localStorage.setItem(logFormula,"");
    //第一次处理，将常数转换
    string=handleConst(formula);
    //第二次处理，添加标号
    string=handleBrackets(formula);
    formula=handleBrackets(formula);
    //处理阶乘
    maxBrackets=1;
    for(var i=maxBrackets;i>=0;i--){
        //字符串需要加上双重转义字符
        var signal="\\["+String(i)+"\\]";
        var reg=new RegExp("("+signal+"\\("+")"+"(.+?)"+"("+signal+"\\))",'g');
        var signalReg=new RegExp(signal,"g");
        formula.match(reg);
        var handledResult=String(calculate(RegExp.$2));//括号内计算结果
        formula.match(reg);  //重新赋值
        formula=formula.replace(reg,RegExp.$1+handledResult+RegExp.$3).replace(signalReg,"");
        //console.log("result:"+formula);
    }
    formula=handleFactorial(formula);
    var finalResult=calculate(formula);
    return finalResult
}
/*
    handleConst(formula):常数处理,将pi、e变为数字，便于后续处理
    参数：待处理式子
    返回值：处理后式子
*/
function handleConst(formula){
    formula=formula.replace("\\pi",Math.PI).replace("\\mathrm{e}",Math.E);
    return formula;
}
/*
    handleBrackets(formula):处理括号嵌套问题,更改maxBrackets值
    参数：待处理式子
    返回值：处理后的式子 例如\sin(\sin(0))处理为\sin[0](\sin[1](0[1])[0])
*/
function handleBrackets(formula){
    var formulaLength=formula.length;
    var result="";
    var controlNumber=-1;
    for(i=0;i<formulaLength;i++){
        if(formula[i]!="(" && formula[i] != ")"){
            result+=formula[i];
        }
        else if(formula[i]=="("){
            controlNumber+=1;
            if(controlNumber>maxBrackets){
                maxBrackets=controlNumber;
            }
            result=result+"["+String(controlNumber)+"](";
        }
        else if(formula[i]==")"){
            result=result+"["+String(controlNumber)+"])";
            controlNumber-=1;
        }
    }
    //console.log("handledBrackets:"+result);
    return result;
}
/*
    handleString:字符串处理
    用于计算式字符串的处理，以便于之后的计算
*/
function handleString(str){
    //删除光标
    str=str.replace(cursor,"");
    str=str.replace(/\$/g,"");
    //删除下划线
    str=str.replace(/\\underline\{(.+?)\}/,"$1");
    //处理加减乘除
    str=str.replace(/\\mathrm{\\times}/g,"*");
    str=str.replace(/\\mathrm{\\div}/g,"/");
    //排列组合处理
    str=str.replace(/C_\{(.+?)\}\^\{(.+?)\}/g,"math.combinations($1,$2)");
    str=str.replace(/P_\{(.+?)\}\^\{(.+?)\}/g,"math.permutations($1,$2)");
    //加减乘除处理
    str=str.replace(/\\mathrm\{\+\}/g,"+");//替换加号;
    str=str.replace(/\\mathrm\{\-\}/g,"-");//替换减号；
    str=str.replace(/\\pi/g,3.14159265359);//替换PI
    str=str.replace(/\\mathrm\{e\}/g,"2.718281828459");//替换自然对数E；
    str=str.replace(/\\times/g,"*");
    str=str.replace(/\\div/,"/");
    //三角函数处理
    if(degMode=="rad"){
        str=str.replace(/(\\sin\()(.+?)\)/g,"math.sin($2)");
        str=str.replace(/(\\cos\()(.+?)\)/g,"math.cos($2)");
        str=str.replace(/(\\tan\()(.+?)\)/g,"math.tan($2)");
        str=str.replace(/(\\arcsin\()(.+?)\)/g,"math.asin($2)");
        str=str.replace(/(\\arccos\()(.+?)\)/g,"math.acos($2)");
        str=str.replace(/(\\arctan\()(.+?)\)/g,"math.atan($2)");
    }
    else if(degMode=="deg"){
        str=str.replace(/(\\sin\()(.+?)\)/g,"dsin($2)");
        str=str.replace(/(\\cos\()(.+?)\)/g,"dcos($2)");
        str=str.replace(/(\\tan\()(.+?)\)/g,"dtan($2)");
        str=str.replace(/(\\arcsin\()(.+?)\)/g,"dasin($2)");
        str=str.replace(/(\\arccos\()(.+?)\)/g,"dacos($2)");
        str=str.replace(/(\\arctan\()(.+?)\)/g,"datan($2)");
    }
    str=str.replace(/(\\sinh\^\{-1\}\()(.+?)\)/g,"math.asinh($2)");
    str=str.replace(/(\\cosh\^\{-1\}\()(.+?)\)/g,"math.acosh($2)");
    str=str.replace(/(\\tanh\^\{-1\}\()(.+?)\)/g,"math.atanh($2)");
    str=str.replace(/(\\sinh\()(.+?)\)/g,"math.sinh($2)");
    str=str.replace(/(\\cosh\()(.+?)\)/g,"math.cosh($2)");
    str=str.replace(/(\\tanh\()(.+?)\)/g,"math.tanh($2)");
    str=str.replace(/(\\log\()(.+?)\)/g,"lg($2)");//替换以十为底的对数
    //third row
    str=str.replace(/(\\ln\()(.+?)(\))/g,"math.log($2,math.e)");
    //fourth row
    str=str.replace(/\(?([\d|\.]+)\)?\^\{?\(?(\-?[\d|\.]+)\)?\}?/g,"math.pow($1,$2)");
    str=str.replace(/\\sqrt\[(.+?)\]\{(.+?)\}/g,"math.nthRoot($2,$1)");
    //fifth row
    str=str.replace(/\\frac\{(.+?)\}\{(.+?)\}/g,"math.divide($1,$2)");
    str=str.replace(/GCD/g,"math.gcd")
    str=str.replace(/LCM/g,"math.lcm")
    return str;
}
/*
处理阶乘
    handleFactorial(formula)
    return:Handled Result
*/
function handleFactorial(formula){
    var para=searchFirstPara(formula,"\\!");
    //带括号
    reg=RegExp("("+para+")"+"\\!","g");
    // formula=formula.replace(/\(/g,"").replace(/\)/g,"");
    if(formula.match(reg)){
        para=RegExp.$1.replace(/\(/g,"").replace(/\)/g,"");
        formula=formula.replace(reg,"math.factorial("+para+")"); 
        return formula;
    } 
    //不带括号
    reg=RegExp("\\(?("+para+")\\)?"+"\\!","g");
    if(formula.match(reg)){
        para=RegExp.$1.replace(/\(/g,"").replace(/\)/g,"");
        formula=formula.replace(reg,"(math.factorial("+para+"))"); 
    } 
    return formula;
}
/*
    reload()：重新载入
    用于页面改变时mathjax 重新渲染
*/
function reload(){
    $$("#formula").text(currentFormula);
    $$("#formula").css("opacity",'0');
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    MathJax.Hub.Queue(function () {
        $$("#formula").css("opacity",1);
      });
    setTimeout(function(){
        $$("#formula").css("color","cyan");
    },100);
}
