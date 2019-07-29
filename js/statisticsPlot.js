var myApp = new Framework7();
var receiveData;
var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, {
  expressions: false
});
var doubleDataNumber=parseInt(localStorage.getItem('doubleDataNumber'));
var x=new Array;
var y=new Array;
for(i=1;i<doubleDataNumber;i++){
    x[0]='';
    y[0]='';
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

function backToMainMode(){
  var Sparameter=localStorage.getItem('SParameter');
  if(Sparameter=='1') {
    window.location.href='statistics.html?parameter=1'
  }
  else if(Sparameter=='2') {
    window.location.href='statistics.html?parameter=2'
  }
}
/**
 * 
 */
function showCurve() {
  var buttons=[
    {
      text:'直线拟合',
      onClick:function() {
        drawPolyfit(1);
      }
    },
    {
      text:'多项式拟合',
      onClick:function() {
        var buttons=[
          {
            text:'二次',
            onClick:function() {
              drawPolyfit(2);
            }
          },
          {
            text:'三次',
            onClick:function() {
              drawPolyfit(3);
            },
          },
          {
            text:'四次',
            onClick:function() {
             drawPolyfit(4)
            }
          },
          {
            text:'自定义',
            onClick:function() {
                myApp.prompt('设置最高项次数', '设置最高项次数', 
                function (value) {
                  if(value.match(/^\d+$/)) {
                    drawPolyfit(value)
                  }
                  else {
                    alert('请输入正整数!')
                  }
                }
            )}
          },
          {
            text:'取消',
            color:'red'
          }
        ];
        myApp.actions(buttons);
      }
    },
    {
      text:'取消',
      color:'red',
    }
  ]
  myApp.actions(buttons);
}

function polyfitFromServer(x,y,n) {
  var res;
  $.ajax({
    url:"http://guomf.top:8002/calPage/myPolyfit",
    method:"get",
    data:{"x":x+'',"y":y+'','n':n},
    async:false,
    dataType:"json",
    success:function(data){
      res=data;
        console.log(data);
    },
    error:function(){
        res= "";
    }
})
return res;
}

function drawPolyfit(n) {
  receiveData=polyfitFromServer(x,y,n);
  res=receiveData.results.replace('[','').replace(']','').split(',');
  var expr='';
  for(i=0;i<=n;i++) {
    expr=expr+res[i]+'x^'+(n-i)+'+';
  }
  expr=expr.replace(/\+$/g,''); //删除末尾加号
  $('#polyfitExpr').empty();
  for(i=0;i<=n;i++){
    if(i<n-1) {
      $('#polyfitExpr').append(res[i]+'x<sup>'+(n-i)+'</sup>+');
    }
    else if(i==n-1) {
      $('#polyfitExpr').append(res[i]+'x+');
    }
    else {
      $('#polyfitExpr').append(res[i]);
    }
  }
  calculator.setExpressions([
    {id:'graph1', latex:expr},
  ])
}

function showInfo() {
  if(!receiveData) {
    alert('请先拟合曲线');
  }
  else {
    var res=receiveData.results.replace('[','').replace(']','').split(',');
    var determination=receiveData.determination;
    var sigmaX=receiveData.sigmaX;
    var sigmaX2=receiveData.sigmaX2;
    var sigmaY=receiveData.sigmaY;
    var sigmaY2=receiveData.sigmaY2;
    var sigmaXY=receiveData.sigmaXY;
    var meanX=receiveData.meanX;
    var meanY=receiveData.meanY;
    var n=res.length-1;
    $('#polyfitFunction').empty();
    for(i=0;i<=n;i++){
      if(i<n-1) {
        $('#polyfitFunction').append(res[i]+'x<sup>'+(n-i)+'</sup>+');
      }
      else if(i==n-1) {
        $('#polyfitFunction').append(res[i]+'x+');
      }
      else {
        $('#polyfitFunction').append(res[i]);
      }
    }
    $('#determination').empty().append('R<sup>2</sup>='+determination)
    $('#sigmaX').empty().append('&#931;='+sigmaX);
    $('#sigmaX2').empty().append('&Sigma;X<sup>2</sup>='+sigmaX2);
    $('#sigmaY').empty().append('&#931;='+sigmaY);
    $('#sigmaY2').empty().append('&Sigma;Y<sup>2</sup>='+sigmaY2);
    $('#sigmaXY').empty().append('&Sigma;Y<sup>2</sup>='+sigmaXY);
    $('#meanX').empty().append('X平均值='+meanX);
    $('#meanY').empty().append('Y平均值='+meanY);
    myApp.showTab('#tab2');
  }
}

function closeData() {
  myApp.showTab('#tab1');
}