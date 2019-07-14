var type='single';
var currentData=1;
var parameter=window.location.href.match(RegExp('.+?parameter\\=(\\d)'))[2];
var signalData=new Array(10000);
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
        signalData[currentData-1]=item;
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
    var buttons=[{
        text:'修改',
        onClick:function() {
        
        }
    },
        {
            text:'取消',
            color:'red'
        }];
        myApp.actions(buttons);
}