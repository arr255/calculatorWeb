var type='single';
var currentData=1;
var parameter=window.location.href.match(RegExp('.+?parameter\\=(\\d)'))[2];
var singleData=new Array;
if(parameter=='2') {
    type='double';
}
else {
    type='signal';
}
function Xi(){
    mainCalculate(currentFormula);
    var lastResult=localStorage.getItem('lastResult')
    if(lastResult!=null){
        addItem(lastResult);
    }
}
function addItem(item) {
    if(type=='signal') {
        singleData[currentData-1]=item;
        var newNode='<li class="item-content">\
        <div class="item-inner">\
          <div class="item-title" id="item_'+currentData+'" onclick="changeData('+currentData+')">x'+currentData+'='+item+'</div>';
        $('#staData').append(newNode);
        // Hammer(document.getElementsByClassName('item-data')[currentData-1]).on('press',function(){
        //     var buttons=[{
        //         text:'修改',
        //         onclick:function() {
        //             console.log('修改');
        //         }
        //     },
        //     {
        //         text:'取消',
        //         color:'red'
        //     }];
        //     myApp.actions(buttons);
        // });
        currentData+=1;
    }
}

function changeData(data) {
    myApp.prompt('修改数据', '修改数据', 
    function (value) {
      if(math.isNumeric(parseFloat(value))) {
          singleData[data-1]=value;
          $('#item_'+data).text('x'+data+'='+value);
      }
      else {
          alert('请输入一个数字');
      }
    },
    function (value) {
      myApp.alert('Your name is "' + value + '". You clicked Cancel button');
    }
  );
}

function showStaResult() {

    var SigmaX=math.sum(singleData);
    var SigmaX2=fSigmaX2();
    var n=singleData.length;
    var MeanX=math.mean(singleData);
    var MiddleX=math.median(singleData);
    var ModeX=math.mode(singleData);
    var sigmaX=math.std(singleData);
    var MinX=math.min(singleData);
    var MaxX=math.max(singleData);
    $('#SigmaX').empty().append('&#931;='+SigmaX);
    $('#SigmaX2').empty().append('&Sigma;X<sup>2</sup>='+SigmaX2);
    $('#n').empty().append('n='+n);
    $('#MeanX').empty().append('平均值='+MeanX);
    $('#MiddleX').empty().append('中位数='+MiddleX);
    $('#ModeX').empty().append('众数='+ModeX);
    $('#sigmaX').empty().append('&sigma;X='+sigmaX);
    $('#MinX').empty().append('Mix(X)='+MinX);
    $('#MaxX').empty().append('Max(X)='+MaxX);
    myApp.showTab('#tab5');
}
function fSigmaX2(){
    sum=0;
    for(i=0;i<singleData.length;i++){
        sum+=Math.pow(singleData[i],2);
    }
    return sum;
}

function closeData(){
    myApp.showTab('#tab1');
}
