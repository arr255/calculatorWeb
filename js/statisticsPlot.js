var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, {
  expressions: false
});
var doubleDataNumber=parseInt(localStorage.getItem('doubleDataNumber'));
var x=new Array;
var y=new Array;
for(i=0;i<doubleDataNumber;i++){
    x[i]=localStorage.getItem('x'+i);
    y[i]=localStorage.getItem('y'+i);
}
calculator.setExpression({
    type: 'table',
    columns: [
      {
        latex: 'x',
        values: x,
      },
      {
        latex: 'y',
        values: y,
        dragMode: Desmos.DragModes.XY
      },
    ]
  });
calculator.observe('isAnyExpressionSelected', function () {
  deleteButton.className = calculator.isAnyExpressionSelected ? '' : 'disabled';
});