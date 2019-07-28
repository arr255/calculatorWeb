if(!localStorage.getItem('F1')) {
  localStorage.setItem('F1',true);
  localStorage.setItem('F2',true);
  localStorage.setItem('F3',true);
}
var F1Status=localStorage.getItem('F1');
var F2Status=localStorage.getItem('F2');
var F3Status=localStorage.getItem('F3');
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, {
  expressions: false
});
var expr1=localStorage.getItem('F1Expr');
var expr2=localStorage.getItem('F2Expr');
var expr3=localStorage.getItem('F3Expr');
F1Status=expr1?true:false;
F2Status=expr2?true:false;
F3Status=expr3?true:false;
setButtonStatus();
plot();

calculator.observe('isAnyExpressionSelected', function () {
  deleteButton.className = calculator.isAnyExpressionSelected ? '' : 'disabled';
});


function handleExpr(expr){
  if(expr) {
    expr=expr.replace(/\\color\{pink}r/,'r').replace(/\\color\{pink}\\theta/,'\\theta')
    if(expr.match(/\\color\{green}=/)){
      return expr.replace(/\\color\{green}=/,'=');
    }
    else{
      return 'y='+expr;
    }
  }
}
/**
 * 当选择键按下后，改变显示状态
 * 
 */

function changeStatus(f) {
  if(f=='F1') {
    F1Status=!F1Status;
  }
  else if(f=='F2') {
    F2Status=!F2Status;
  }
  else if(f=='F3') {
    F3Status=!F3Status;
  }
  setButtonStatus();
  plot();
}

function setButtonStatus() {
  $('#F1').css('background-color',F1Status?'green':'gray');
  $('#F2').css('background-color',F2Status?'green':'gray');
  $('#F3').css('background-color',F3Status?'green':'gray');
}

function plot(){
  calculator.setBlank();
  if(F1Status) {
    calculator.setBlank();
    calculator.setExpressions([
      {id:'graph1', latex:handleExpr(expr1)},
    ])
  }
  
  if(F2Status) {
    calculator.setExpressions([
      {id:'graph2', latex:handleExpr(expr2)},
    ])
  }
  if(F3Status) {
    calculator.setExpressions([
      {id:'graph3', latex:handleExpr(expr3)},
    ])
  }
}

function backToMainMode(){
  var currentMode=localStorage.getItem('currentMode');
  if(currentMode=='CAL') {
    window.location.href='index.html';
  }
}