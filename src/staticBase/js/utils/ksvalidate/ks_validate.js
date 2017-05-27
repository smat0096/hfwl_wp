/** 
 * 1. 初始化
 * 2. 提交 submit
 * 3. check 验证逻辑
 * 4. 具体类型检测
 * 5. 显示视图
 * 6. dom事件监听
 * 
 * 10. 表单dom操作
 * 作者 空山, 112093112 
 */

define( function(require, exports, module) {
  "use strict";

  var __OPTIONS__ = {
    name : 'KsValidate',
    version : '0.01'
  };

  var regs = require('./ks_validate_regs.js'),
      _ks = require('../ks_utils.js');

  //require('../../lib/jquery-weui/lib/jquery-2.1.4');
  var KsValidate = function(opts){
      return new KsValidate.fn.init(opts);
    };

  KsValidate.prototype = KsValidate.fn = {
  /** 1. 初始化 S **/
    constructor : KsValidate,
    init :  function(opts){
      var defaults = {
        
        /* 基本属性 S */
          form : '', // 表单dom节点
          submitBtn : '', // 提交按钮dom节点
          checkAll : false, // true 验证所有目标数据, false 遇到第一个致命错误就停止验证;
          checkType : 'submit',// 验证事件钩子 input, blur, submit;
          submitType : 'ajax',// 提交方式, form, ajax;
          inputs : {}, //验证规则
          warnType : 1, //致命错误的等级, 对应 验证规则 inputs 配置中的 type 值; 
          errorType : 2, //致命错误的等级, 对应 验证规则 inputs 配置中的 type 值; 
          delay : 100, //验证间隔
          target : null, // 需验证的目标数据, json格式;
          callback : null, //提交数据后的回调函数, 
        /* 基本属性 E */

        /* submit提交ajax S */
          ajax :{
            url : 'http://localhost:3000',
            type : 'post',
            data : {},   //附加data,注意, 是附加的固定值数据
            dataType : 'json',
            success : '',
            error : '',
            complete : ''
          },
        /* submit提交ajax E */

        /* 经常被替换的方法,null表示取消 S */
          extend :{
            //显示
            showMessage : undefined,
            showSuccess : undefined,
            showWarn : undefined,
            showError : undefined,
            //监听
            /* initEvent, 默认监听提交按钮执行提交事件, 默认验证与提交的数据为插件获取的表单值 */
            /* 如需更改表单 *验证*或*提交*数据, 应禁止initEvent,然后从外部调用 submit 或 check 方法提供不同数据; */
            initEvent : undefined,
            //提交
            /* 可通过更改 submitPost 更改提交数据 */
            submitPost : undefined,
            /* 钩子 */
            beforeCheck : undefined, //参数 picker, 用于改变 picker.checkData[验证数据] 和 picker.checkTarget[验证目标]
            afterCheck : undefined,  //参数 picker  用于回调, 根据picker.results[验证结果]  处理后续;
            beforeSubmit : undefined, //参数 picker   用于改变 picker.submitData[提交数据]
            afterSubmit : undefined   //参数 res      用于回调,根据 res [ajax返回的数据] 处理后续; 表单提交模式不使用;
          },
        /* 经常被替换的方法 E */
      };
      opts.ajax = _ks.extend({}, defaults.ajax, opts.ajax);
      opts = _ks.extend({},defaults,opts);
      this.opts = opts;

      //延迟配置
      if(opts.delay){
        this.check = _ks.lazy(this.check, this.opts.delay);
      };

      //函数替换 null表示取消
      _ks.extend(this, opts.extend);

      //表单配置
      this.form = opts.form;
      this.submitBtn = opts.submitBtn;

      //初始化状态 TOFIXED
      this.isChecking = false;
      this.isSubmiting = false;
      this.checkData = null; //校验数据集合
      this.checkTarget = null; //校验目标集合[在数据集合中需要校验的对象]
      this.submitData = null; //提交数据集合 
      this.results = null; //验证结果

      /* 注册事件 */
      'function' === typeof this.initEvent && this.initEvent(opts.callback, opts.target);

      return this;
    },
  /** 1. 初始化 E **/
  /** 2. 提交 submit S**/
    /**
     * [submit 提交方法, 可在提交按钮点击的钩子函数中直接调用,调用验证方法,验证并显示结果, 并在验证成功后执行提交]
     * @param  {[object]}   data     [验证并提交的数据源]
     * @param  {Function} callback [回调执行函数]
     * @param  {[object]}   target   [验证目标]
     * @return {[type]}            [description]
     */
    submit : function(data,callback,target){
      var _this = this;
      target = target || _this.opts.target || data;
      _this.check(data, function(result){
        if(!result.isFail){

          if(_this.isSubmiting) return;
          _this.isSubmiting = true;
          /* 数据转存, 为钩子函数提供操作空间 S */
          _this.submitData = data; 
          _ks.run(_this.beforeSubmit,_this);
          data = _this.submitData;
          /* 数据转存, 为钩子函数提供操作空间 E */

          if(_this.opts.submitType === 'form'){
            _this.submitForm(data,callback);
          }else{
            _this.submitPost(data,callback);
          }
        }
      },target);
    },
    //提交
    submitPost : function(data,callback){
      var _this = this;
      var opts = _ks.extend({},_this.opts.ajax);
      opts.data = _ks.extend({},opts.data, data);

      _ks.ajax(opts,function(res){
        _this.isSubmiting = false;
        _ks.run(_this.afterSubmit,res);
        _ks.run(callback);
      });
    },
    submitForm : function(data,callback){
      //form表单提交, 页面跳转没有回调了,除非使用 webWorker serveWorker 等关闭页面依然能够运行的API
      _ks.run(callback, data);
      this.form.submit();
    },
  /** 2. 提交 submit E**/

  /** 3. 验证逻辑 S **/
    /**
     * [check 验证方法, 可以直接调用, 验证数据后显示结果, 并执行回调函数]
     * @param  {[object]}   data     [验证的数据源]
     * @param  {Function} callback [description]
     * @param  {[object]}   target   [验证目标]
     * @return {[type]}            [description]
     */
    check : function(data, callback,target){
      if(this.isChecking || this.isSubmiting) return;
      this.isChecking = true;

      /* 数据转存, 为钩子函数提供操作空间 S */
      this.checkData = data; 
      this.checkTarget = target || _this.opts.target || data; 
      _ks.run(this.beforeCheck,this);
      data = this.checkData;
      target = this.checkTarget;
      /* 数据转存, 为钩子函数提供操作空间 E */
      
      var results = {
        isFail : false,
        asyncSum : 0,
        asyncNum : 0,
        data : {}
      },
      _this = this,
      inputs = _this.opts.inputs;
      target = target || _this.opts.target || data;
      for(var name in target){
        var input = inputs[name];
        if(!input){
          //console.warn("验证目标不在验证规则中", name,target);
          continue;
        };
        var rules = input.rules,
        value = data[name],
        result = _this.valiRules(name, value, rules,results,callback);
        var isOver = _this.setResults( name, value, result, results);
        if(isOver) break;
      };
      _this.checkOver(results,callback)
    },
    checkOver : function(results,callback){
      if(results.asyncNum >= results.asyncSum){
        this.isChecking = false;
        this.results = results;
        _ks.run(this.afterCheck,this);
        this.showMessage(this.results);
        _ks.run(callback,this.results);
      }
    },
    setResults : function(name, value, result, results){
      var data = results.data,
          type = result && result.rule.type || 0,
          message = result && result.rule.message || '',
          rule = result && result.rule || null;

      if( !data[name] || data[name].type < type){
        data[name] = {
          name : name,
          value : value,
          type :  type,
          message : message,
          rule : rule
        };
        if(type >= this.opts.errorType){
          results.isFail = true;
          if(!this.opts.checkAll) return true;
        };
      }else{
        //console.log(name, value, result, results);
      };
      return false;
    },
    valiRules: function(name, value,rules,results,callback){
      var result = null, _data ;
      for(var i=0,iLen=rules.length; i<iLen; i++){
        _data = {
          name : name,
          value : value,
          rule : rules[i],
          rules : rules
        };
        result = this.valiRule(_data,results,callback);
        if(result && result.rule.type >= this.opts.errorType){
          return result;
        }
      }
      return result;
    },
    valiRule : function(_data,results,callback){
      var result = null, 
        reg = _data.rule.reg,
        regType =  typeof reg, 
        _this = this;
        switch(regType){
          case 'string' :
            result = _this.checkstring(_data, results, callback)
            break;
          case 'object' :
            if(reg.constructor === RegExp){
              result = _this.checkregexp(_data, results,callback);
            }else{
              console.error("正则数据类型错误");
            };
            break;
          case 'function' :
            if(_data.rule.async){
              _this.checkAsyncFn(_data, results, callback);
            }else {
              result = _this.checkSyncFn(_data ,results, callback);
            };
            break;
          default :
            console.error('验证数据错误',_data);
            break;
        };
        return result;
    },
  /** 3. 验证逻辑 E **/

  /** 4. 具体类型检测 S */
    checkstring: function(_data,results,callback){
      var result = null,
          regName = _data.rule.reg,
          name = _data.name,
          value = _data.value,
          rule = _data.rule;
      if(!regs.reg(regName,value,_data)){
        result = _data;
      }
      return result;
    },
    checkregexp: function(_data,results,callback){
      var result=null,
          reg = _data.rule.reg,
          value = _data.value ? (_data.value+'') : '';
      if(!reg.test(value)){
        result = _data;
      };
      return result;
    },
    checkSyncFn : function(_data,results,callback){
      var result=null,
          reg = _data.rule.reg,
          context = _data.rule.context || window; //rule.context 为传入上下文
      if(!reg.call(context,_data)){
        result = _data
      }
      return result;
    },
    checkAsyncFn : function(_data, results, callback){
      var result=null,
          name = _data.name,
          value = _data.value,
          reg = _data.rule.reg,
          context = _data.rule.context || window,
          _this = this;
      results.asyncSum++;
      //异步回调执行
      reg.call(context,_data,function(res){
        results.asyncNum++;
        res || (result = _data);
        _this.setResults(name, value, result, results);
        _this.checkOver(results,callback)
      });
      return result;
    },
  /** 4. 具体类型检测 E */

  /** 5. 显示视图  S **/
    showMessage : function(results){
      var data = results.data,
          warnType = this.opts.warnType,
          errorType = this.opts.errorType,
          type, _data;
      for(var key in data){
        _data = data[key];
        type = _data.type;
        if( type < warnType){
          _ks.run.call(this, this.showSuccess,_data);
        }else if( type >= warnType && type <  errorType){
          _ks.run.call(this, this.showWarn ,_data);
        }else if( type >= errorType){
          _ks.run.call(this, this.showError, _data );
        }
      };
    },
    clearMessage : function(data){
      //$(this.form[data.name]).next('.valimsg').remove();
    },
    showError : function(data){
      this.clearMessage(data);
      var template = '<div class="valimsg valimsg-error" style="color: #f44336"></div>',
          name = data.name,
          message = data.message,
          errorMsg = $(template).text(message);
          $(this.form[name]).css({'border':'1px solid #f44336'}).parent().append(errorMsg);
    },
    showWarn : function(data){
      this.clearMessage(data);
      var template = '<div class="valimsg valimsg-error" style="color: #ffc107"></div>',
          name = data.name,
          message = data.message,
          warnMsg = $(template).text(message);
          $(this.form[name]).css({'border':'1px solid #ffc107'}).parent().append(warnMsg);
    },
    showSuccess : function(data){
      this.clearMessage(data);
      var name = data.name;
      $(this.form[name]).css({'border':'1px solid #4caf50'});
    },
  /** 5. 显示视图  E **/

  /** 6. 事件监听S **/
    //初始化监听事件;
    initEvent : function(callback,target){
      this.initCheck(callback,target);
      this.initSubmit(callback,target);
    },
    //监听(单独)验证事件
    initCheck : function(callback,target){
      if(this.opts.checkType ==='submit') return;
      var _this =this,
          checkType = _this.opts.checkType ,
          inputs = _this.opts.inputs;
      target = target || _this.opts.target || _this.opts.inputs;
      for(var name in target){
        (function(name){
          _this.form[name] && _this.form[name].addEventListener(checkType, function(){
          var data = {};
          data[name] = _this.form[name].value; 
          _this.check(data,callback,data);
        })
        })(name);
      }
    },
    //监听提交事件
    initSubmit: function(callback,target){
      var _this = this,
          form = _this.form,
          target = target || _this.opts.target || _this.opts.inputs;
      _this.submitBtn.onclick = function(){
        var data = _this.getFormValue();
        _this.submit(data,callback,data)
      };
    },
    //获取表单值;
    getFormValue : function(form){
      form = form || this.opts.form; 
      return getFormValue(form);
    }
  /** 6. 事件监听E **/
  }

  KsValidate.fn.init.prototype = KsValidate.prototype;
  window.KsValidate = window.KsValidate || KsValidate;
  return window.KsValidate;

  /*10. 表单dom操作 S */
    //获取表单值
    function getFormValue (form,type){
      var values,
          element,
          data,
          name,
          elements = getFormElements(form);
      if(type === 'array'){
        values = [];
      }else{
        values = {};
      };
      for(var i =0,iLen = elements.length; i<iLen; i++){
        element = elements[i],
        name = elements.name;
        data = getInputValue(element);
        if(type === 'array'){
          values.push(data);
        }else{
          values[data[0]] = data[1];
        }
      };
      return values;
    };
    //获取指定form中的所有的<input><textarea>对象  
    function getFormElements (form) {  
      var elements = [];  
      var inputElements = _ks.toArray(form.getElementsByTagName('input'));
      var textAreaElements = _ks.toArray(form.getElementsByTagName('textarea'));
      elements = elements.concat(inputElements,textAreaElements);
      return elements;  
    };
    //获取单个input中的【name,value】数组 
    function inputSelector (element) {  
     if (element.checked)  
       return [element.name, element.value];  
    };
    function getInputValue (element) {  
      switch (element.type.toLowerCase()) {  
       case 'submit':  
       case 'hidden':  
       case 'password':  
       case 'text':
       //case 'file': // file类型无法设置value值(除了空字符串以外), 在需要判断服务器是否已有数据的需求下,无法直接验证
       case 'textarea':
        return [element.name, element.value];  
       case 'checkbox':  
       case 'radio':  
        return inputSelector(element);  
      }  
      return false;  
    };
  /*10. 表单dom操作 E */
})
