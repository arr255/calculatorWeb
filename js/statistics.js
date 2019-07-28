var type='single';
currentData=1;
localStorage.setItem('currentData',1);
var parameter=window.location.href.match(RegExp('.+?parameter\\=(\\d)'))[1];
var singleData=new Array;
var doubleData=new Array;
doubleData[0]=new Array;
doubleData[1]=new Array;
var currentPara='x';
if(parameter=='2') {
    type='double';
    var doubleDataNumber=parseInt(localStorage.getItem('doubleDataNumber'));
    console.log(localStorage.getItem('y1'))
    if(doubleDataNumber) {
        for(i=1;i<doubleDataNumber;i++){
            doubleData[0][i]=localStorage.getItem('x'+i);
            doubleData[1][i]=localStorage.getItem('y'+i);
            addItem(doubleData[0][i]);
            addItem(doubleData[1][i]);
        }
    }
}
else {
    type='single';
}
function Xi(){
    mainCalculate(currentFormula);
    var lastResult=localStorage.getItem('lastResult')
    if(lastResult!=null){
        addItem(lastResult);
    }
}
function addItem(item) {
    currentData=parseInt(localStorage.getItem('currentData'));
    if(type=='single') {
        singleData[currentData-1]=item;
        var newNode='<li class="item-content">\
        <div class="item-inner">\
          <div class="item-title" id="item_'+currentData+'" onclick="changeDataOnclick('+currentData+')">x'+currentData+'='+item+'</div>';
        $('#staData').append(newNode);
        currentData+=1;
        localStorage.setItem('currentData',currentData);
    }
    else if(type=='double') {
        if(currentPara=='x') {
            doubleData[0][currentData]=item;
            var newNode='<li class="item-content">\
            <div class="item-inner">\
              <div class="item-title" id="item_'+currentData+'" onclick="changeDataOnclick('+currentData+')">x'+currentData+'='+item+'</div>';
            $('#staData').append(newNode);
            currentPara='y';
            localStorage.setItem('doubleDataNumber',currentData);
            localStorage.setItem('x'+currentData,item);
        }
        else if(currentPara=='y') {
            doubleData[1][currentData]=item;
            localStorage.setItem('y'+currentData,item);
            // var newNode='<li class="item-content">\
            // <div class="item-inner">\
            //   <div class="item-title" id="item_'+currentData+'" onclick="changeData('+currentData+')">y'+currentData+'='+item+'</div>';
            // $('#staData').append(newNode);
            $('#item_'+currentData).text($('#item_'+currentData).text()+'  y'+currentData+'='+item);
            currentPara='x';
            currentData+=1;
            localStorage.setItem('currentData',currentData);
            localStorage.setItem('doubleDataNumber',currentData);
        }
    }
}

function changeData(data,toBeChanged) {
    myApp.prompt('修改数据', '修改数据', 
    function (value) {
      if(math.isNumeric(parseFloat(value))) {
          if(type=='single') {
            singleData[data-1]=value;
            $('#item_'+data).text('x'+data+'='+value);
          }
          else {
            if(toBeChanged=='x') {
                doubleData[0][data]=value;
                $('#item_'+data).text('x'+data+'='+value+'  y'+data+'='+doubleData[1][data]);
                localStorage.setItem('x'+data,value);
            }
            else if(toBeChanged=='y') {
                doubleData[1][data]=value;
                $('#item_'+data).text('x'+data+'='+doubleData[0][data]+'  y'+data+'='+value);
                localStorage.setItem('y'+data,value);
            }
          }
      }
      else {
          alert('请输入一个数字');
      }
    },
    function (value) {
    }
  );
}

function changeDataOnclick(data) {
    if(type=='double') {
        var buttons=[
            {
                text:'修改x',
                onClick:function(){
                    changeData(data,'x');
                }
            },
            {
                text:'修改y',
                onClick:function(){
                    changeData(data,'y');
                }
            }
        ]
    }
    else {
        changeData(data,'x');
    }
    myApp.actions(buttons);
}
function showStaResult() {
    if(type=='single') {
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
    else {
        //存储数据
        localStorage.setItem('doubleDataNumber',currentData);
        for(i=1;i<currentData;i++) {
            localStorage.setItem('x'+i,doubleData[0][i]);
            localStorage.setItem('y'+i,doubleData[1][i]);
        }
        window.location.href='statisticsPlot.html';
    }
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
