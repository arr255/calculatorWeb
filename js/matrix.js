function addMatrix() {
    var row;
    var column;
    myApp.prompt('设置矩阵', '设置矩阵行数', 
    function (value) {
      if(value.match(/^\d+$/)) {
        row=value;
        myApp.prompt('设置矩阵','设置矩阵列数',
        function (value){
            if(value.match(/^\d$/)) {
                column=value;
                var mat='\\tiny{\\left[\\begin{matrix}';
                for(m=0;m<row;m++) {
                    for(n=0;n<column;n++) {
                        if(n!=column-1) {
                            mat+='[]&';
                        }
                        else {
                            mat+='[] \\\\ '
                        }
                    }
                }
                mat+='\\end{matrix}\\right]}';
                var leftMove=20+row*(3*column-1)+4*row-1; 
                changeFormula(mat,{'leftMove':leftMove});

            }
            else {
                alert('请输入正整数');
                return '';
            }
        })
      }
      else {
        alert('请输入正整数!')
        return '';
      }
    }
    )
}