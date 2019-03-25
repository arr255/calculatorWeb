import math
import time
def integral():
    downNumber=1
    upNumber=2
    intNumber=100000000
    eachInterval=(upNumber-downNumber)/intNumber
    result=0
    for i in range(intNumber):
        xValue=downNumber+eachInterval*i
        yValue=xValue
        area=eachInterval*yValue
        result+=area
    print(round(result,7))
start=time.clock()
integral()
elapsed = (time.clock() - start)
print("time:"+str(elapsed))