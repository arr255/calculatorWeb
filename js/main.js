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
init();
/*
    init初始化
*/
function init(){
    console.log(currentFormula);
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
    var firstParaStr="";//获取的第一个参数
    var bracketsNumber=0;//括号层数
    var cursorLocation=currentFormula.indexOf(cursor);//光标位置
    for(var i=cursorLocation-1;i>0;i--){
        var reg=/[\+|\-|\*|\/|\(|\$|\}|\,]/;//如果匹配到加减乘除及小括号
        var currentChar=String(currentFormula[i]);
        console.log(currentFormula);
        if(currentChar.match(reg)){//如果匹配到结束符
            if(bracketsNumber==0){//如果不在括号内
                break;
            }
            else{//如果在括号内
                firstParaStr=currentFormula[i]+firstParaStr;
                bracketsNumber-=1;
            }
        }
        else if((currentChar.match(/[\)]/))){//进入括号
            firstParaStr=currentFormula[i]+firstParaStr;
            bracketsNumber+=1;
        }
        else{
            firstParaStr=currentFormula[i]+firstParaStr;
        }
    }
    currentFormula=currentFormula.substr(0,i+1)+currentFormula.substr(cursorLocation);
    cursorLocation=currentFormula.indexOf(cursor);
    // alert(currentFormula);
    if(firstParaStr==""){//如果未找到参数
        currentFormula=currentFormula.replace(cursor,"");//删除光标
        currentFormula=insertStr(currentFormula,cursorLocation,"\\frac{\\underline{"+cursor+"}}{\\underline{}}");
        cursorOnTheLine=true;
    }
    else{
        currentFormula=currentFormula.replace(cursor,"");
        currentFormula=insertStr(currentFormula,cursorLocation,"\\frac{"+firstParaStr+"}{\\underline{"+cursor+"}}");
        cursorOnTheLine=true;
    }
    console.log("firstParaStr:"+firstParaStr);
    reload();
}
function shiftButton(){
    if(page==1){
        page=2;
        myApp.showTab("#tab2");
    }
    else if(page==2){
        page=1;
        myApp.showTab("#tab1");
    }
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
    currentFormula=strPreHandle(currentFormula);
    //获取当前光标位置$xxxcursor
    var cursorLocation=currentFormula.indexOf(cursor);
    if(cursorLocation>0){
        currentFormula=currentFormula.replace(cursor,"");
        //寻找合适的光标位置
        //排除A-Z、a-z、/、[a-z]( 、[A-Z](
            while(del){
                if(cursorLocation<2){
                    break;
                }
                testChar=currentFormula.charAt(cursorLocation-1);
                if(cursorLocation>2){
                    testChar2=currentFormula.charAt(cursorLocation-2);
                }
                currentFormula=currentFormula.substr(0,cursorLocation-1)+currentFormula.substr(cursorLocation,currentFormula.length);
                console.log("test:"+currentFormula);
                if(testChar.match(/\(/)){   
                    if(testChar2.match(/[a-z]/) || testChar2.match(/[A-Z]/)){
                        cursorLocation-=1;
                    }
                }
                else if(testChar.match(/[a-z]/) || testChar.match(/[A-Z]/) || testChar.match(/\\/)){
                    cursorLocation-=1;
                }
                else{
                    cursorLocation-=1;
                    del-=1;
                }
            }
            currentFormula=insertStr(currentFormula,cursorLocation,cursor);
            //去除空格，strPreHandle副产物
            currentFormula=currentFormula.replace(/ /g,"");
            reload();
        }
}
/*
    clearHistory()
    清除历史记录
*/
function clearHistory(){
    localStorage.clear();
    alert("历史记录已清空");
}
/*
    光标左移
    参数：左移位数
    返回：无
*/
function moveLeft(lm){
    var wholeSingnal=["\\\\mathrm\\{\\+\\}","\\\\mathrm\\{\\-\\}","\\\\mathrm\\{\\\\times\\}","\\\\mathrm\\{\\div\\}","[0-9]","\\.","\\\\pi",
                        "\\\\ln\\(","\\\\sin\\(","\\\\cos\\(","\\\\tan\\(","\\^","\\\\sqrt\\[2]\\{\\\\underline\\{","\\\\sqrt\\[2]\\{","\\(","\\)"]
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
    console.log("moveLefted:"+currentFormula);
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
    //currentFormula=strPreHandle(currentFormula);
    //获取当前光标位置$xxxcursor
    var cursorLocation=currentFormula.indexOf(cursor);
    if(cursorLocation+cursor.length+1<currentFormula.length){
        currentFormula=currentFormula.replace(cursor,"");
        while(rm){
            if(cursorLocation+1<currentFormula.length){
                testChar=currentFormula.charAt(cursorLocation);
                testChar2=currentFormula.charAt(cursorLocation-1);
                if(testChar.match(/[\(]/)){   
                    if(testChar2.match(/[a-z]/) || testChar2.match(/[A-Z|]/)){
                        cursorLocation+=1;
                        rm-=1;
                    }
                }
                else if(testChar.match(/[a-z]/) || testChar.match(/[A-Z]/) || testChar.match(/[\\|}]/)){
                    cursorLocation+=1;
                    console.log(testChar+cursorLocation);
                }
                else{
                    cursorLocation+=1;
                    rm-=1;
                }
            }
            else{
                break;
            }
        }
        console.log(currentFormula);
        currentFormula=insertStr(currentFormula,cursorLocation,cursor);
        //假如进入下划线
        reg=new RegExp(regCursor+"\\\\underline\\{");
        currentFormula=currentFormula.replace(reg,"\\underline{"+cursor);
        //加入进入排列组合上部分
        reg=new RegExp("([C|P])_\\{(.+?)\\}\\^"+regCursor+"\\{");
        currentFormula=currentFormula.replace(reg,"$1\_\{$2\}\^\{"+cursor);
        console.log(currentFormula);
        //去除下划线
        // if(cursorOnTheLine){
        //     var reg=new RegExp("\\\\underline\\{(.+)\\}(?="+cursor+")");
        //     console.log(reg);
        //     currentFormula=currentFormula.replace(reg,"$1");
        //     cursorOnTheLine=false;
        // }
        currentFormula=deleteUnderline(currentFormula);
        Already=false;
        reload();
    }
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
    string=handleString(string);
    //string=string.replace(/\(|\)/g,"");//去除括号；
    console.log("Foreeval:"+string);
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
    //第二次处理，添加标号
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
        console.log("result:"+formula);
    }
    var finalResult=calculate(formula);
    //alert(finalResult);
    $$("#result").text(finalResult);
    Already=true;
    logResult=finalResult;
    localStorage.setItem(logFormula,logResult);
    currentLog=localStorage.length;
}
/*
    handleConst(formula):常数处理,将pi、e变为数字，便于后续处理
    参数：待处理式子
    返回值：处理后式子
*/
function handleConst(formula){
    formula=formula.replace("\\pi",Math.PI).replace("\\mathrm{e}",Math.E);
    console.log("handledConst",formula);
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
    console.log("handledBrackets:"+result);
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
    str=str.replace(/(\\sin\()(.+?)\)/g,"math.sin($2)");
    str=str.replace(/(\\cos\()(.+?)\)/g,"math.cos($2)");
    str=str.replace(/(\\tan\()(.+?)\)/g,"math.tan($2)");
    str=str.replace(/(\\arcsin\()(.+?)\)/g,"math.asin($2)");
    str=str.replace(/(\\arccos\()(.+?)\)/g,"math.acos($2)");
    str=str.replace(/(\\arctan\()(.+?)\)/g,"math.atan($2)");
    str=str.replace(/(\\log\()(.+?)\)/g,"lg($2)");//替换以十为底的对数
    //third row
    str=str.replace(/(\\ln\()(.+?)(\))/g,"math.log($2,math.e)");
    //fourth row
    str=str.replace(/\(?([\d|\.]+)\)?\^\{?\(?(\-?[\d|\.]+)\)?\}?/g,"math.pow($1,$2)");
    str=str.replace(/\\sqrt\[(.+?)\]\{(.+?)\}/g,"root($2,$1)");
    //fifth row
    str=str.replace(/\\frac\{(.+?)\}\{(.+?)\}/g,"math.divide($1,$2)");
    console.log("handledString:"+str);
    return str;
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
