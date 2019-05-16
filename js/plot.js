
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
var expr1=GetQueryString('F1');
var expr2=GetQueryString('F2');
var expr3=GetQueryString('F3');
calculator.setExpressions([
  {id:'graph1', latex:handleExpr(expr1)},
  // {id:'graph2', latex:handleExpr(expr2)},
  // {id:'graph3', latex:handleExpr(expr3)}
])
calculator.observe('isAnyExpressionSelected', function () {
  deleteButton.className = calculator.isAnyExpressionSelected ? '' : 'disabled';
});


function handleExpr(expr){
  expr=expr.replace(/\\color\{pink}r/,'r').replace(/\\color\{pink}\\theta/,'\\theta')
  if(expr.match(/\\color\{green}=/)){
    return expr.replace(/\\color\{green}=/,'=');
  }
  else{
    return 'y='+expr;
  }
}