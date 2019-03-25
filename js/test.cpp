#include<iostream>
#include<ctime>
using namespace std;
double intgral(){
    double downNumber=1;
    double upNumber=2;
    int intNumber=100000000;
    double eachInterval=(upNumber-downNumber)/intNumber;
    double result=0;
    for(int i=0;i<intNumber;i++){
        double xValue=downNumber+eachInterval*i;
        double yValue=xValue;
        double area=eachInterval*yValue;
        result+=area;
    }
    return result;

}
int main(){
    clock_t begin = clock();
    double r=intgral();
    clock_t end = clock();
    double elapsed_secs = static_cast<double>(end - begin) / CLOCKS_PER_SEC;
    cout<<"result:"<<r<<endl;
    cout<<"time:"<<elapsed_secs<<endl;
    return 0;
}