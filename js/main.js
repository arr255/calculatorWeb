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
function clearContent(){
    $$("#formula").text("$0$");
    currentFormula="$0$";
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
function equal(){
    
}
