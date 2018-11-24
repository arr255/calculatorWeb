var myApp = new Framework7();
//var mainView = myApp.addView('.view');
var height=document.documentElement.clientHeight;
var $$=Dom7;
var buttonHeight=height*0.7/9;
var cursor="{\\color{yellow}|}"
var initFormula="$"+cursor+"$"
var currentFormula=initFormula;
console.log(currentFormula);
$$("a.button").css("height",buttonHeight+"px");
$$("a").children().css("position","relative");
$$("a").children().css("top",buttonHeight/3+"px");
//增添
function changeFormula(formula,leftMove=0,RightMove=0,boxed=0,curelyBrackets=0){
    //删除光标
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
/*
    AC按键按下，清空内容，返回为0
    返回：无
*/
function clearContent(){
    currentFormula="$"+cursor+"$";
    reload();
}
/*
    光标左移
    参数：左移位数
    返回：无
*/
function moveLeft(lm){
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
        reload();
    }
}
function moveRight(rm){
    //获取当前光标位置$xxxcursor
    var cursorLocation=currentFormula.indexOf(cursor);
    if(cursorLocation+cursor.length+1<currentFormula.length){
        currentFormula=currentFormula.replace(cursor,"");
        while(rm){
            if(cursorLocation+1<currentFormula.length){
                testChar=currentFormula.charAt(cursorLocation);
                testChar2=currentFormula.charAt(cursorLocation-1);
                console.log("testChar:"+testChar);
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
function handleString(str){
    //删除光标
    str=str.replace(cursor,"");
    str=str.replace(/\$/g,"");
    str=str.replace(/\\times/g,"*");
    str=str.replace(/\\div/,"/");
    str=str.replace(/\\sin/,"math.sin");
    str=str.replace(/\\cos/,"math.cos");
    str=str.replace(/\\tan/,"math.tan");
    str=str.replace(/\\pi/,math.PI);
    console.log("handledString:"+str);
    return str;
}
function reload(){
    $$("#formula").text(currentFormula);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    console.log("currentFormula:"+currentFormula);
}

