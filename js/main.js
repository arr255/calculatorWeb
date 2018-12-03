var myApp = new Framework7();
var mainView = myApp.addView('.view');
mainView.router.load("heel");
var height=document.documentElement.clientHeight;
var $$=Dom7;
var buttonHeight=height*0.7/9;
var cursor="{\\color{yellow}|}"
var initFormula="$"+cursor+"$"
var currentFormula=initFormula;
var page=1;//切换页面,取值为1,2,3,4
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
function changeFormula(formula,leftMove=0,RightMove=0,boxed=0,curelyBrackets=0){
    //删除末尾花括号(如果有需要)
    if(curelyBrackets){
        currentFormula=currentFormula.Substring(0,currentFormula.Length-1);
    }
    //获取当前光标位置$xxxcursor
    var cursorLocation=currentFormula.indexOf(cursor);
    currentFormula=insertStr(currentFormula,cursorLocation,formula);
    //添加末尾花括号(如果有需要)
    if(curelyBrackets){
        currentFormula=currentFormula+"}";
    }
    //重新显示
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
    AC按键按下，清空内容，返回为0
    返回：无
*/
function clearContent(){
    currentFormula="$"+cursor+"$";
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
    光标左移
    参数：左移位数
    返回：无
*/
function moveLeft(lm){
    currentFormula=strPreHandle(currentFormula);
    //获取当前光标位置$xxxcursor
    var cursorLocation=currentFormula.indexOf(cursor);
    if(cursorLocation>0){
        currentFormula=currentFormula.replace(cursor,"");
        //寻找合适的光标位置
        //排除A-Z、a-z、/、[a-z]( 、[A-Z](
        while(lm){
            if(cursorLocation<2){
                break;
            }
            testChar=currentFormula.charAt(cursorLocation-1);
            if(cursorLocation>2){
                testChar2=currentFormula.charAt(cursorLocation-2);
            }
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
                lm-=1;
            }
        }
        currentFormula=insertStr(currentFormula,cursorLocation,cursor);
        currentFormula=currentFormula.replace(/ /g,"");
        reload();
    }
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
                if(testChar.match(/\(/)){   
                    if(testChar2.match(/[a-z]/) || testChar2.match(/[A-Z]/)){
                        cursorLocation+=1;
                        rm-=1;
                    }
                }
                else if(testChar.match(/[a-z]/) || testChar.match(/[A-Z]/) || testChar.match(/\\/)){
                    cursorLocation+=1;
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
        currentFormula=insertStr(currentFormula,cursorLocation,cursor);
        reload();
    }
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
    formula=formula.replace(/\\pi/g," \\pi");
    return formula;
}
/*******************************
 * 计算部分
 ******************************/
//主计算函数
function calculate(string){
    console.log("recievedString:"+string);
    string=handleString(string);
    var result=eval(string);
    ApproResult=math.round(parseFloat(result),7);
    if(ApproResult){
        result=ApproResult;
    }
    else{
        var reg = new RegExp('"',"g");
        result=String(result).replace(reg,"")
    }
    console.log(string);
   $$("#result").text(ApproResult);
}
/*
    handleString:字符串处理
    用于计算式字符串的处理，以便于之后的计算
*/
function handleString(str){
    //删除光标
    str=str.replace(cursor,"");
    str=str.replace(/\$/g,"");
    str=str.replace(/\\mathrm\{\+\}/g,"+");//替换加号;
    str=str.replace(/\\mathrm\{\-\}/g,"-");//替换减号；
    str=str.replace(/\\pi/g,3.14159265359);//替换PI
    str=str.replace(/\\mathrm\{e\}/g,"2.718281828459");//替换自然对数E；
    str=str.replace(/\\times/g,"*");
    str=str.replace(/\\div/,"/");
    str=str.replace(/\\sin/g,"math.sin");
    str=str.replace(/\\cos/g,"math.cos");
    str=str.replace(/\\tan/g,"math.tan");
    str=str.replace(/\\arcsin/g,"math.asin");
    str=str.replace(/\\arccos/,"math.acos");
    str=str.replace(/\\arctan/,"math.atan");
    str=str.replace(/\\log/g,"lg");//替换以十为底的对数
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
    console.log("currentFormula:"+currentFormula);
    setTimeout(function(){
        $$("#formula").css("color","cyan");
    },100);
}

