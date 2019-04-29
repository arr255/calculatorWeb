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
var degMode="rad"
var varColor="pink"
var variable=['x'];
var dbName="MainDB";
var db;
var logNumber;
var changed=false;
var isFormulaBuffer=true;
var formulaBuffer;
var formulaPreview;
var ifpending=false;
var btnTimer;
init();
LogDBInit();
/*
    init初始化
*/
function init(){
    //console.log(currentFormula);
    $$("a.button").css("height",buttonHeight+"px");
    $$("a").children().css("position","relative");
    $$("a").children().css("top",buttonHeight/3+"px");
    initFormula="$"+cursor+"$"
    currentFormula=initFormula;
    page=1;//切换页面,取值为1,2,3,4
    maxBrackets=0;//最大嵌套的括号层数
    cursorOnTheLine=false;//光标是否在线上内
    Already=true;//上一次计算完成
    recordNumber=0;//记录条数
    degMode="rad"
    varColor="pink"
    variable=['x'];
    changed=false;
    myApp.showTab("#tab"+String(page));
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
    //如果第一个参数为常数或变量
    reg=RegExp("((\\\\pi)|(\\\\mathrm\\{e\\})|(\\{\\\\color\\{pink\\}x\\}))"+endSignal);
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
        //禁止动画
        $$('#animated').attr('class','');
        if(page%2==1){
            page+=1;
        }
        else if(page%2==0){
            page-=1;
        }
    }
    else if(arg.method=="LR"){
        //允许动画
        $$('#animated').attr('class','tabs-animated-wrap');
        if(page%4==1||page%4==2){
            page+=2;
        }
        else if(page%4==3||page%4==0){
            page-=2;
        }
    }
    else if(arg.method=='R'){
        //允许动画
        $$('#animated').attr('class','tabs-animated-wrap');
        if(page%4==3||page%4==0){
            page-=2;
        }
    }
    else if(arg.method=='L') {
        //允许动画
        $$('#animated').attr('class','tabs-animated-wrap');
        if (page%4==1||page%4==2){
            page+=2;
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
            currentLog-=1;
            formula=getData(currentLog).then((value)=>{currentFormula=value.formula;reload();});
            result=getData(currentLog).then((value)=>{$$("#result").text(value.result);reload();});
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
        queryLogNumber().then((value)=>{
            if(currentLog<value-1){
                currentLog+=1;
                getData(currentLog).then((value)=>{currentFormula=value.formula;reload();});
                getData(currentLog).then((value)=>{$$("#result").text(value.result);reload();});
            }
            else{
                moveRight(1);
            }  
        })
    }
}
/*
    AC按键按下，清空内容，返回为0
    返回：无
*/
function clearContent(){
    currentFormula="$"+cursor+"$";
    Already=true;
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

/**
 * 
 * 递归，显示历史记录
 * @param {* int} i 初始0
 * @param {* str} str 初始''
 * 
 * Examples:
 * showHistory(0,'')
 * 
 */
function showHistory(i,str) {
    $('#log_item').empty();
    formula=getData(i).then((value)=>{
        if(value) {
            str+='<li><a href="#" class="item-link item-content" onclick="historyClick('+i+','+value.formula+')">\
            <div class="item-title">'+value.formula+'</div></a></li>'
            if(i<logNumber-1) {
                showHistory(i+1,str);
            }
            else {
                console.log(str);
                $$('#log_item').append(str);
            }
        }
    })
}

function historyClick(i,formula) {
    alert("test");
    Already=true;
    currentLog=i;
    currentFormula=formula;
    reload();
}
/*
    clearHistory()
    清除历史记录
*/
function clearHistory(){
     deleteData();
     alert("数据已清空！")
}
/* changeRegMode:改变模式
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
    if(Already){
        changed=true;
    }
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

function moveRight(rm){
    if(Already){
        changed=true;
    }
    var wholeSingnal=["\\\\mathrm\\{\\+\\}","\\\\mathrm\\{\\-\\}","\\\\mathrm\\{\\\\times\\}","\\\\mathrm\\{\\div\\}","dx",",","\\]\\{","\\}\\\\mid","\\}\\(","\\}\\{","\\}\\^\\{","[0-9]","\\.","\\\\pi",
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
    //第一次处理，将常数转换
    string=handleConst(formula);
    //第二次处理，函数处理
    //删除光标
    formula=formula.replace(cursor,"");
    //处理积分
    while(formula.match(/\\int_\{(.+?)\}\^\{(.+?)\}(.+?)dx/)){
        downNumber=RegExp.$1;
        upNumber=RegExp.$2;
        expr=RegExp.$3;
        console.log(formula);
        formula=formula.replace(/\\int_\{(.+?)\}\^\{(.+?)\}(.+?)dx/,eval("intFromServer("+downNumber+","+upNumber+",'"+expr+"')"));
        console.log(formula);
    }
    //处理导数
    while(formula.match(/\\delta\((.+?)\,(.+?)\)/)){
        expr=RegExp.$1;
        number=RegExp.$2;
        formula=formula.replace(/\\delta\((.+?)\,(.+?)\)/,eval("diffFromServer('"+expr+"'"+","+"'1')"));
        console.log(formula)
    }
    //处理级数和
    while(formula.match(/\\sum_\{\\color\{pink\}x=(.+?)\}\^\{(.+?)\}\((.+?)\)/)){
        brackets=0;
        reg=new RegExp(/\\sum_\{\\color\{pink\}x=(.+?)\}\^\{(.+?)\}\((.+?)\)/)
        console.log(reg);
        expr=RegExp.$3;
        downNumber=RegExp.$1;
        upNumber=RegExp.$2;
        while(RegExp.$3.match(/\(/)){
            brackets+=1;
            s=".+?";
            for(i=0;i<brackets;i++){
                s+="\\).*?";
            }
            reg=RegExp("\\\\sum_\\{\\\\color\\{pink\\}x=(.+?)\\}\\^\\{(.+?)\\}\\(("+s+")\\)");
            formula.match(reg);
            if(RegExp.$3){
                expr=RegExp.$3;
                downNumber=RegExp.$1;
                upNumber=RegExp.$2;
            }
            else{
                s=s.substr(0,s.length-5);
                reg=RegExp("\\\\sum_\\{\\\\color\\{pink\\}x=(.+?)\\}\\^\\{(.+?)\\}\\(("+s+")\\)");
                break;
            }
        }
        console.log(expr);
        formula=formula.replace(reg,eval("sumFromServer('"+expr+"','"+downNumber+"','"+upNumber+"')"));       
    }
    //处理product
    while(formula.match(/\\prod_\{\\color\{pink\}x=(.+?)\}\^\{(.+?)\}\((.+?)\)/)){
        brackets=0;
        reg=new RegExp(/\\prod_\{\\color\{pink\}x=(.+?)\}\^\{(.+?)\}\((.+?)\)/)
        console.log(reg);
        expr=RegExp.$3;
        downNumber=RegExp.$1;
        upNumber=RegExp.$2;
        while(RegExp.$3.match(/\(/)){
            brackets+=1;
            s=".+?";
            for(i=0;i<brackets;i++){
                s+="\\).*?";
            }
            reg=RegExp("\\\\prod_\\{\\\\color\\{pink\\}x=(.+?)\\}\\^\\{(.+?)\\}\\(("+s+")\\)");
            formula.match(reg);
            if(RegExp.$3){
                expr=RegExp.$3;
                downNumber=RegExp.$1;
                upNumber=RegExp.$2;
            }
            else{
                s=s.substr(0,s.length-5);
                reg=RegExp("\\\\prod_\\{\\\\color\\{pink\\}x=(.+?)\\}\\^\\{(.+?)\\}\\(("+s+")\\)");
                break;
            }
        }
        console.log(expr);
        formula=formula.replace(reg,eval("prodFromServer('"+expr+"','"+downNumber+"','"+upNumber+"')"));       
    }
    console.log(formula);
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
    string=handleDegree(string);
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
/** 
 * 主处理函数，进行括号迭代
 * 
 * Syntax:mainCalculate(formula)
 * 
 * @param{string} formula
 * @returns{string} result
 * 
 * 
*/
function mainCalculate(formula){
    console.log("recievedString:"+formula);
    var logFormula="";//记录的公式
    logFormula=formula;
    formula=strPreHandle(formula);
    //第三次处理，添加标号
    string=handleBrackets(formula);
    formula=handleBrackets(formula);
    //maxBrackets=0;
    for(var i=maxBrackets;i>=0;i--){
        //字符串需要加上双重转义字符
        var signal="\\["+String(i)+"\\]";
        var reg=new RegExp("("+signal+"\\("+")"+"(.+?)"+"("+signal+"\\))",'g');
        var signalReg=new RegExp(signal,"g");
        var k=formula.match(reg);
        var number=k?k.length:k=0;
        for(m=0;m<number;m++){
            var res=k[m].replace(RegExp(signal,'g'),'');
            console.log(res);
            var handledResult=String(res);//括号内计算结果
            formula.match(reg);  //重新赋值
            formula=formula.replace(k[m],handledResult).replace(signalReg,"");
            console.log("result:"+formula);
        }
    }
    formula=handleFactorial(formula);
    var finalResult=calculate(formula);
    console.log(typeof(finalResult));

    $$("#result").text(finalResult);
    Already=true;
    if(changed){
        updateData(currentLog,{formula:logFormula,result:finalResult});
    }
    else{
        currentLog+=1;
        addData(logFormula,finalResult);
    }
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
    //seventh row
    str=str.replace(/\\log_\{(.+?)\}\((.+?)\)/g,"math.log($2,$1)");
    //eighth row
    str=str.replace(/([\d|\.]+)\^\{\\circ\}([\d|\.]+)\^\{\\circ\}([\d|\.]+)\^\{\\circ\}/g,"degreeToNumber({'deg':$1,'min':$2,'sec':$3})");
    str=str.replace(/([\d|\.]+)\^\{\\circ\}([\d|\.]+)\^\{\\circ\}/g,"degreeToNumber({'deg':$1,'min':$2})");
    str=str.replace(/([\d|\.]+)\^\{\\circ\}/g,"degreeToNumber({'deg':$1})");
    str=str.replace(/Npr/g,"Npr");
    str=str.replace(/\\mid\{(.+?)\}\\mid/,"math.abs($1)")
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
    处理mathrm{d}
    handleDegree(formula)
    result:handled result
*/
function handleDegree(formula){
    var para=searchFirstPara(formula,"\\\\mathrm\\{d\\}");
    //带括号
    reg=RegExp("("+para+")"+"\\\\mathrm\\{d\\}","g");
    // formula=formula.replace(/\(/g,"").replace(/\)/g,"");
    if(formula.match(reg)){
        para=RegExp.$1.replace(/\(/g,"").replace(/\)/g,"");
        formula=formula.replace(reg,"degreeToRadium("+para+")"); 
        return formula;
    } 
    //不带括号
    reg=RegExp("\\(?("+para+")\\)?"+"\\\\mathrm\\{d\\}","g");
    if(formula.match(reg)){
        para=RegExp.$1.replace(/\(/g,"").replace(/\)/g,"");
        formula=formula.replace(reg,"(degreeToRadium("+para+"))"); 
    } 
    return formula;
}

function changeMode() {
    var buttons = [
        {
            text: '标准',
            onClick:function(){
                deleteData();
                init();
                myApp.showTab("#tab"+String(page));
            }
        },
        {
            text: '统计',
            onClick:function() {
                window.location.href='statistics.html'
            }
        },
        {
            text: '取消',
            color: 'red'
        },
    ];
    myApp.actions(buttons);
}
/** 
 *    数据库indexedDB初始化 ,初始化logNumber,currentLog
*/
function LogDBInit(){
    var request=indexedDB.open(dbName);
    request.onerror=function(event){
        alert("The App is not allowed to use IndexedDB!")
    }

    request.onsuccess=function(event){
        db=event.target.result;
        var objStore=db.transaction('log','readwrite').objectStore('log')
        var countReq=objStore.count();
        countReq.onsuccess = function(event){
            logNumber = countReq.result;
            currentLog = logNumber;

        }
    }

    request.onupgradeneeded=function(event){
        db=event.target.result;
        //create objectStore named log
        var objStore=db.createObjectStore("log",{keyPath:'id',autoIncrement:true});
        //添加索引
        objStore.createIndex("formula","formula");
        objStore.createIndex("result","result");
        objStore.transaction.oncomplete=function(event){
            console.log("DB created successfully");
        }
        logNumber = 0;
        currentLog = logNumber += 1;
    }
}
/**
 * 查询日志数目
 * 
 * Syntax:
 *   queryNumber()
 * 
 * Examples:
 *   queryLogNumber().then((value)=>{console.log(value)})
 * 
 */
function queryLogNumber(){
    return new Promise((resolve,rejected)=>{
        var objStore=db.transaction('log','readwrite').objectStore('log')
        var countReq=objStore.count();
        countReq.onsuccess=function(event) {
            var number=countReq.result;
            resolve(number);
        }
    })
}
/** 
 * 增添数据
 *
 * Syntax:
 * 
 * addData(formula,result)
 * 
 * Examples:
 * 
 * addData("1+1",2)
 * 
 * @param{string} formula
 * @param{string} result
 * @return
    
*/
function addData(formula,result){
    var objStore=db.transaction('log','readwrite').objectStore('log')
    var countReq=objStore.count();
    countReq.onsuccess=function(event) {
        id=countReq.result;
        console.log(id);
        request=objStore.add({id:id,formula:formula,result:result});
        request.onsuccess=function(event){
            console.log("Data Added successfully!");
        }
        request.onerror=function(event){
            console.log("Data added failed!");
        }
    }
}

/**
 * 查询数据
 * Syntax : getData(id)
 * 
 * @param {number} id 
 * 
 * @return {object}
 * 
 */
function getData(id){
    return new Promise((resolve,rejected)=>{
        var request=db.transaction(['log']).objectStore('log').get(id);
        request.onerror=function(event){
            console.log(request.result);
        }
        request.onsuccess=function(event){
            console.log(request.result);
            resolve(request.result);
        }  
    })
}

/**
 * update data
 * 
 * Syntax:
 * 
 * updateData(id,arg)
 * 
 * Examples:
 * updateData(1,{formula:'1+1',result:2})
 * 
 * @param {integer} id 
 * @param {object} arg 
 */
function updateData(id,arg){
    var objectStore=db.transaction(['log'],'readwrite').objectStore('log');
    var request=objectStore.get(id);
    request.onsuccess = function(event) {
        var data=event.target.result;
        data.formula=arg.formula;
        data.result=arg.result;
        var requestUpdate = objectStore.put(data);
        requestUpdate.onsuccess = function(event) {
            console.log("Update successfully");
            changed=false;
        }
    }
}
/**
 * 
 * 删除数据并重新建立数据库
 * 
 */
function deleteData(){
    var delReq=indexedDB.deleteDatabase(dbName);
    delReq.onsuccess=function(event) {
        console.log('Delete successfully!');
        LogDBInit();
    }
    delReq.onerror=function(event) {
        console.log("Delete failed!");
    }
}


/*
    reload()：重新载入
    用于页面改变时mathjax 重新渲染
*/
function reload(){
    ifpending=true;
    clearTimeout(btnTimer);
    btnTimer=setTimeout(function(){
        ifpending=false;
        formulaBuffer.style.display='block';
        formulaPreview.style.display='none';
        isFormulaBuffer=!isFormulaBuffer;
    },500);
    if(isFormulaBuffer){
        formulaBuffer=document.getElementById('formula-buffer');
        formulaPreview=document.getElementById('formula');
    }
    else {
        formulaBuffer=document.getElementById('formula');
        formulaPreview=document.getElementById('formula-buffer');
    }
    // $$("#formula").text(currentFormula);
    // $$("#formula").css("opacity",'0');
    formulaBuffer.innerHTML=currentFormula;
    // $$('#formula-buffer').text(currentFormula);
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub,formulaBuffer],function () {
        // $$("#formula").css("opacity",1);
        
      });
}
