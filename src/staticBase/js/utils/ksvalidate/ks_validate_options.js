/** 作者 空山, 112093112 **/

define( function(require, exports, module) {
  var options = {
    inputs : {
      name : {
        name : 'name', //表单项 name
        rules : [  //验证规则数组
          {
            reg : /\d+/,                //验证方式, 字符串,正则,函数,可异步
            message : '至少有一个数字',  //错误信息
            type : 1                   //错误类型, 0成功, 1 警告(不影响提交), 2 错误
          },
          {
            reg : 'require', 
            message : '用户名是必填项',
            type : 2 
          },
          {
            reg : function(data,callback){  //这是一个异步函数;
                    console.log(this,this === data.rule.context); //指向 data.rule.context;
                    setTimeout(function(){
                      callback(false);
                    },17)
                  },
            message: '这是一个type2异步验证请求,返回错误 ',
            async : true,    //异步函数需指定async 为 true
            context : ['这是一个测试用的上下文对象'], // 验证的函数上下文
            type :2
          }
        ]
      },
      mobile: {
        name : 'mobile',
        rules : [
          {
            reg : 'idCard',
            message : '请输入正确的身份证号码',
            type : 2
          },
          {
            reg : function(data,callback){
              setTimeout(function(){
                callback(false);
              },2000);
            },
            message: '这是一个type1异步验证请求,耗时2秒,返回错误 ',
            async : true,
            type :1
          }
        ]
      },
      comment :{
        rules : [
          {
            reg : 'true'
          }
        ]
      }
    },
    fn :{
      showErrors: '',//显示错误信息模块
      submitPost : '' //
    }
  };
  return options;
})
