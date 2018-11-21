var myApp = new Framework7();
//var mainView = myApp.addView('.view');
var height=screen.height;
var $$=Dom7;
var buttonHeight=height*0.7/9;
var currentFormula="$0$";
console.log(currentFormula);
$$("a.button").css("height",buttonHeight+"px");
$$("a").children().css("position","relative");
$$("a").children().css("top",buttonHeight/3+"px");
//增添
function changeFormula(formula){
    currentFormula=currentFormula.replace("$0","");//去除开头0
    currentFormula=currentFormula.replace(/\$/g,"");
    currentFormula=currentFormula+formula;
    currentFormula="$"+currentFormula;
    currentFormula=currentFormula+"$";
    console.log(currentFormula);
    $$("#formula").text(currentFormula);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
//AC按键
function clearContent(){
    $$("#formula").text("$0$");
    currentFormula="$0$";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
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
function handleString(s){
    var str=s.replace(/\$/g,"");
    console.log("handledString:"+str);
    return str;
}

