window.onload=function(){
    // $("myCanvas").attr("width","800px");
    // $("myCanvas").attr("height","1000px");
    ctx = document.getElementById("myCanvas").getContext("2d");
    clientWidth=document.body.clientWidth;
    clientHeight=document.body.clientHeight;
    centerPoint={x:0,y:0};
    scale={x:2,y:0.5};
    label={x:4,y:3};
    fullScreen={x:clientWidth,y:clientHeight};
    document.getElementById("myCanvas").setAttribute("width",String(fullScreen.x)+"px")
    document.getElementById("myCanvas").setAttribute("height",String(fullScreen.y)+"px")
    ctx.strokeStyle="black";
    ctx.fillStyle="black";
    drawScale(ctx,label,scale,centerPoint,fullScreen);
    drawFunction(ctx,500,"myFun(","red",fullScreen)
}

var moveElem = document.getElementById("myCanvas") //待拖拽元素      
var dragging=false; //是否激活拖拽状态
var coordinate={x:0,y:0};   
//监听鼠标按下事件
document.addEventListener('mousedown', function(e) {
    console.log("down");     
    dragging = true; //激活拖拽状态
    coordinate.x=e.clientX;
    coordinate.y=e.clientY;
});
//监听鼠标放开事件
document.addEventListener('mouseup', function(e) {
    console.log("up")
    dragging = false;
});
//监听鼠标移动事件
document.addEventListener('mousemove', function(e) {
    console.log("Move");
    if (dragging) {
        if(e.clientX-coordinate.x<-30){
            centerPoint.x+=scale.x;
            ctx.clearRect(0,0,fullScreen.x,fullScreen.y)
            drawScale(ctx,label,scale,centerPoint,fullScreen,"black");
            drawFunction(ctx,500,"myFun(","red",fullScreen);
            coordinate.x=e.clientX;
            coordinate.y=e.clientY;
        }
        else if(e.clientX-coordinate.x>30){
            centerPoint.x-=scale.x;
            ctx.clearRect(0,0,fullScreen.x,fullScreen.y)
            drawScale(ctx,label,scale,centerPoint,fullScreen,"black");
            drawFunction(ctx,500,"myFun(","red",fullScreen);
            coordinate.x=e.clientX;
            coordinate.y=e.clientY;
        }
        else if(e.clientY-coordinate.y>30){
            centerPoint.y-=scale.y;
            ctx.clearRect(0,0,fullScreen.x,fullScreen.y)
            drawScale(ctx,label,scale,centerPoint,fullScreen,"black");
            drawFunction(ctx,500,"myFun(","red",fullScreen);
            coordinate.x=e.clientX;
            coordinate.y=e.clientY;
        }
        else if(e.clientY-coordinate.y<=-30){
            centerPoint.y+=scale.y;
            ctx.clearRect(0,0,fullScreen.x,fullScreen.y)
            drawScale(ctx,label,scale,centerPoint,fullScreen,"black");
            drawFunction(ctx,500,"myFun(","red",fullScreen);
            coordinate.x=e.clientX;
            coordinate.y=e.clientY;
        }
    }
});
//鼠标滚轮
$(document).on('mousewheel DOMMouseScroll', function (e) {
    e.preventDefault();
    var value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
    var delta = Math.max(-1, Math.min(1, value));
    if(delta<0){
        scale.x/=2;
        scale.y/=2;
    }
    else{
        scale.x*=2;
        scale.y*=2;
    }
    ctx.clearRect(0,0,fullScreen.x,fullScreen.y)
    drawScale(ctx,label,scale,centerPoint,fullScreen,"black");
    drawFunction(ctx,500,"myFun(","red",fullScreen)
});
/*
    drawScale(ctx,lab  el.x,scale.x,label.y,scale.y,centerPoint):绘制刻度
    arg：画板传参,横轴刻度数量，横轴分刻度，纵轴刻度数量，纵轴分刻度，中心
*/
function drawScale(ctx,label,scale,centerPoint,fullScreen,color){
    ctx.lineWidth=1;
    ctx.strokeStyle=color;
    xPerWidth=Math.round((fullScreen.x/label.x)/2);
    yPerHeight=Math.round((fullScreen.y/label.y)/2);
    //纵轴
    for(i=0;i<label.x;i++){
        ctx.moveTo(Math.round(fullScreen.x/2)+xPerWidth*i,0);
        ctx.lineTo(Math.round(fullScreen.x/2)+xPerWidth*i,fullScreen.y);
        ctx.stroke();
        ctx.moveTo(Math.round(fullScreen.x/2)-xPerWidth*i,0);
        ctx.lineTo(Math.round(fullScreen.x/2)-xPerWidth*i,fullScreen.y);
        ctx.stroke();
        ctx.font="32px serif"
        ctx.fillText(String(centerPoint.x+scale.x*i),fullScreen.x/2+xPerWidth*i,fullScreen.y/2);
        ctx.fillText(String(centerPoint.x-scale.x*i),fullScreen.x/2-xPerWidth*i,fullScreen.y/2);
    }
    //横轴
    for(i=0;i<label.y;i++){
        ctx.moveTo(0,Math.round(fullScreen.y/2)+yPerHeight*i)
        ctx.lineTo(fullScreen.x,Math.round(fullScreen.y/2)+yPerHeight*i)
        ctx.stroke();
        ctx.moveTo(0,Math.round(fullScreen.y/2)-yPerHeight*i)
        ctx.lineTo(fullScreen.x,Math.round(fullScreen.y/2)-yPerHeight*i)
        ctx.stroke();
        ctx.fillText(String(centerPoint.y-scale.y*i),fullScreen.x/2,Math.round(fullScreen.y/2)+yPerHeight*i);
        ctx.fillText(String(centerPoint.y+scale.y*i),fullScreen.x/2,Math.round(fullScreen.y/2)-yPerHeight*i);
    }
}
function mapping(funcPoint,scale,label,fullScreen){
    var screen=new Object;
    screen.x=Math.round(fullScreen.x/2+fullScreen.x*(funcPoint.x-centerPoint.x)/(label.x*scale.x)/2);
    screen.y=Math.round(fullScreen.y/2+fullScreen.y*(funcPoint.y-centerPoint.y)/(label.y*scale.y)/2);
    return screen;
}   
function drawFunction(ctx,signal,func,color){
    ctx.strokeStyle=color
    ctx.lineWidth=5;
    var signalPoint=new Array(signal);
    for(i=0;i<signal;i++){
        xp=centerPoint.x-label.x*scale.x+2*label.x*scale.x/signal*i;
        yp=eval("-"+func+String(xp)+")");
        signalPoint[i]=mapping({x:xp,y:yp},scale,label,fullScreen);
    }
    for(i=0;i<signal-1;i++){
        ctx.beginPath();
        ctx.quadraticCurveTo(signalPoint[i].x,signalPoint[i].y,signalPoint[i+1].x,signalPoint[i+1].y)
        ctx.stroke();
    }
}
function myFun(x){
    return Math.pow(x,2);
}