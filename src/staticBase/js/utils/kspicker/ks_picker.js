/** 
 * 1. 初始化
 * 2. 筛选逻辑
 * 3. 显示视图
 * 4. 监听事件
 * 作者 空山, 112093112 
 */

define( function(require, exports, module) {
  "use strict";
  var _ks = require('../ks_utils.js');
  var KsPicker = function(opts){
      return new KsPicker.fn.init(opts);
  };

  KsPicker.prototype = KsPicker.fn = {
  /** 1. 初始化 S **/
    constructor : KsPicker,
    init :  function(opts){
      var defaults = {
        /* 基本属性 S */
          type : 'deep', //模式 deep 深度递归, para 平行遍历
          multiple : 0, //多选的数量
          auto : true, //单选情况下自动关闭
          length : 'auto', //deep模式的层级;
          nameId : '',
          codeId : '',
          pageId : '',
          title : '',
          topName : '', 
          callback : undefined, //回调函数

          pathStart : 0, //计算pathText时,开始计算路径的层级, 建议 0或1
          topSign : ' ', //多选时,不同主路径间的分隔符
          pathSign : '', //路径间的连接符
          currSign : '', //路径和最终值的分隔符
          valueSign : ',', //同一路径的最终值的分隔符

          /* 显示设置, 数据层无用, 传递数据给视图层 S */
          isShowBack : false,
          isShowValue : false,
          isShowCurrPath : false,
          isShowReset : false,
          /* 显示设置, 数据层无用, 传递数据给视图层 E */

          //citypicker 数据格式;
          data :{
           name : '',
           sub :[
              {
                name : '全国',  //名字
                code : '-1',   //code 应为字符串格式
                include : 'all' // 与其它 value 项是否能同时取值 current 包含同级所有, all 包含所有 , code待完善
               },
              {
                name : '北京',
                code : '1101',
                sub : [
                  {
                    name : '全北京', 
                    code : '1101', 
                    active : false, //改value否已激活, 写入value中了
                    parent : this.curr,  //当前父级
                    include : 'current'
                  },
                 //...
                 ]
               }
            //...
            ]
          },
          template : '', //模板,待完善
        /* 基本属性 E */

        /* 钩子方法,null表示取消 S */
          extend :{
            //钩子
            afterSetCurr :undefined,
            afterSetValue :undefined,
            afterPicker :undefined,
            //显示
            showMessage : undefined, 
            //监听
            initEvent : undefined
            //提交
          },
        /* 经常被替换的方法 E */
      };
      var _this = this;
      opts = _ks.extend({},defaults,opts);
      _this.opts = opts;
      //函数替换
      _ks.extend(this,opts.extend);
      
      //初始化数据
      if(_this.opts.type === 'deep'){
        _this.data = _this.initData(_this.opts.data);
      }else if(_this.opts.type === 'para'){
        _this.data = _this.initDataPara(_this.opts.data);
      };
      //重置数据
      // this.value = this.opts.value || []; 
      // this.valueText = this.opts.valueText ||''; 
      // this.valueCode = this.opts.valueCode || []; 
      this.reset();

      /* 注册事件 */
      'function' === typeof _this.initEvent && _this.initEvent();

      return _this;
    },
    initData : function(data,resType){
      var arr=[];
      if(data instanceof Array){
        switch (typeof data[0]){ 
          case 'string' :
            for(var i=0,iLen=data.length; i<iLen; i++){
              arr.push({name : data[i]});
            }
            break;
          case 'object':
            arr = data;
            break;
          default:
            console.error("数据错误",data);
            break;
        };
        switch (resType){ 
          case 'array' :
            data = arr;
            break;
          default:
            data = {
              sub : arr,
              name : this.opts.topName || ''
            };
            break;
        };
      }else if('object' === typeof data){
        data = data;
      }else{
        console.error("数据错误",data);
      }
      return data;
    },
    //重置相关
    reset : function(){
      if(this.value && this.value.length){
        for(var i=0,iL = this.value.length; i< iL; i++){
          this.value[i].active = false;
        }
      };
      this.value = []; 
      this.valueText = ''; 
      this.valueCode = []; 
      this.goTop();
    },
    goTop : function(){
      this.pref = [];
      this.curr = this.data;
      this.currPath = '';
      this.isTop = true;
      this.isEnd = false;
      if(this.opts.type === 'deep'){
        this.curr = this.data;
      }else if (this.opts.type === 'para'){
        this.curr = this.data.sub[0];
      }
    },
    goEnd: function(){
      _ks.run(this.afterPicker, this);
      _ks.run(this.opts.callback, this);
      this.hide();
    },
  /** 1. 初始化 E **/
  /** 2. 筛选逻辑 deep 深度递归模式 S **/

    /*  2.1 核心方法 类型不同可扩展 S */
    goSub : function(data){ //所点击的子级
      if('undefined' === typeof data.name || data.name === ''){
        console.warn("数据错误,无name",data);
        return;
      };
      var curr = this.getCurr(data);
      if(curr){
        this.isTop = false;
        this.setCurr(data, curr);
      }else{
        this.setValue(data)
      };
    },
    getCurr : function(data){
      var _this = this ,curr;
      data.parent = this.curr; //设置父级; 并联模式无效,对象引用;
      switch(_this.opts.type){
        case 'deep':
          curr = _this.getCurr_deep(data);
          break;
        case 'para':
          curr = _this.getCurr_para(data);
          break;
        default:
          console.error('getSub错误',data)
          break;
      }
      return curr;
    },
    getCurr_deep : function(data){
      return data.sub ? data : null;
    },
    getCurr_para : function(data){
      var l = this.curr.length,
          n = this.getCurrSize(),
          next = this.data.sub[this.curr.index+1], 
          curr;
      if(n < l){
        curr = this.curr;
      }else if(n == l){ //临界长度
        if(next){
          curr = next;
        }else if(this.data.length -1 === this.pref.length ){ //最终长度,进入value模式
          curr = null;
        }else{
          console.error("长度错误1",n,l);
        };
      }else{
        console.error("长度错误2",n,l);
      }
      return curr;
    },
    goPref : function(){
      if(this.pref.length > 0){
        this.isEnd = false;
        this.curr = this.pref.pop();
        !this.pref.length && (this.isTop = true);
        this.currPath = this.getCurrPath(this.pref, this.curr);
        _ks.run(this.afterSetCurr,this);
      }else{
        this.isTop = true;
        this.showMessage({
          message : '已经是最顶级了',
          type : 'error'
        });
      };
    },
    checkInclude(data){ //检测包含选项, 只适用于多选
      var _curr = this.curr,
          _currSub = this.curr.sub,
          _value = this.value,
          temp, message;
      switch (data.include){
        case 'all' : 
          //选中all, 覆盖所有
          this.value = [];
          break;
        case 'current' : 
          //选中current, 覆盖同级
          for(var i= _value.length; i >=0 ; i--){
            temp = _value[i];
            if(temp && temp.parent === data.parent){
              temp.active = false;
              _value.splice(i,1);
            };
          };
          //break; 不跳出, 接着判断 value中的 包含情况;
        default:
          for(var i = 0,iL= _value.length; i<iL; i++){
            temp = _value[i];
            if(temp.include === 'all' || ( temp.include ==='current' && temp.parent === data.parent )){
              message = '已经选择'+temp.name+"了";
              this.showMessage({
                message : message,
                type : 'error'
              });
              return false;
            };
          };
          break;
      };
      return true;
    },

    setCurr: function(data ,curr){
      var _this = this;
      this.pref.push(this.curr);
      curr.parent = this.curr;
      this.curr = curr;
      this.currPath = this.getCurrPath(this.pref, this.curr);
      //并联模式特殊处理
      if(this.opts.type ==="para"){
        this.value.push(data);
        this.currPath = this.getParaText();
        this.valueText = this.currPath;
      };
      _ks.run(this.afterSetCurr,this);
    },
    setValue: function(data){
      data.currPath = this.currPath || '';
      if(this.opts.type ==="para"){
        this.setValuePara(data);
      }else if(!!this.opts.multiple){
        this.setValueM(data);
      }else{
        this.setValueS(data);
      };
      _ks.run(this.afterSetValue,this);
    },
    /* 多选 S */
    setValueM : function(data){
      var index,message;
      if(!data.active){
        if(this.value.length < this.opts.multiple){
          if(!this.checkInclude(data)) return; //检测多选包含情况;
          this.value.push(data);
          data.active = true;
        } else {
          message = "最大选择数量为"+this.opts.multiple;
          this.showMessage({
            message : message,
            type : 'error'
          })
        };
      }else{
        index = this.value.indexOf(data);
        data.active = false;
        if('-1' !== index) this.value.splice(index,1);
      };
      this.valueText = this.getValueText(this.value); //获取结果文本
      this.valueCode = this.getValueCode(this.value); //获取结果代码
    },
    /* 多选 E */
    /* 单选 S */
    setValueS : function(data){
      data.active = !data.active;
      if(this.value[0] === data){
        this.value = [];
      }else{
        if(this.value[0])this.value[0].active = false;
        this.value[0] = data; 
      };
      this.valueText = this.getValueText(this.value); //获取结果文本
      this.valueCode = this.getValueCode(this.value); //获取结果代码
      if(this.opts.auto){
        this.goEnd();
      }
    },
    /* 单选 E */
    /* 并联 S */
    setValuePara : function(data){
      this.value.push(data);
      this.valueText = this.getParaText(this.value);
      _ks.run(this.afterSetValue,this);
      if(this.opts.auto){
          this.goEnd();
      };
    },
    /* 并联 E */
    getValueText : function(value){
      var valueText = '',
          s = '',
          t = {}, 
          value = value.slice();
      for(var i = value.length-1; i>= 0; i--){
        if(!value[i]) continue;
        t = value.splice(i,1)[0];
        s = t.name;
        for(var j= value.length-1;j>=0;j--){
          if(!value[j]) continue;
          if(value[j].currPath === t.currPath){
            t = value.splice(j,1)[0];
            s = t.name + this.opts.valueSign + s;
          }
        }
        s = t.currPath + this.opts.currSign + s;
        valueText = valueText ? s+this.opts.topSign+valueText : s;
        valueText = _ks.trim(valueText);
      }
      return valueText;
    },
    getValueCode : function(value){
      var valueCode = [],
          value = value.slice();
      for(var i = value.length-1; i>= 0; i--){
        if(!value[i] || 'undefined' === typeof value[i].code) continue;
        valueCode.push(value[i].code);
      }
      return valueCode;
    },

    getCurrPath : function(pref,curr){
      var currPath = '',
          pathSign = this.opts.pathSign;
      for(var i= this.opts.pathStart,iL = pref.length; i< iL; i++){ //pathText从第一个子项开始;注意, 如果初始数据为array, initData后是没有name,也就不会被加入路径中;
        currPath += pref[i].name ? pref[i].name + pathSign : '';
      }
      currPath += curr.name || '';
      currPath = _ks.trim(currPath);
      if(pathSign){
        currPath = currPath.replace(new RegExp('^\\'+ pathSign +'|'+'\\'+ pathSign +'$','g'), '');
      }
      return currPath;
    },
  /** 2. 筛选逻辑 deep 深度递归模式 E **/

  /** 2. 筛选逻辑 para 并联模式 S **/
    initDataPara : function(data){
      var length = 0;
      if(this.opts.type === 'para'){
        data = this.initData(data);
        for(var i=0, iL = data.sub.length; i<iL;i++){
          data.sub[i].length = data.sub[i].length || 1;
          length += data.sub[i].length || 1;
          data.sub[i].sub = this.initData(data.sub[i].sub,'array');
          data.sub[i].index = i;
        }
      };
      data.length = length;
      return data;
    },
    getCurrSize : function(){
      var curr = this.curr, pref = this.pref,j=1;
      for(var i=0,iL=pref.length;i<iL;i++){
        if(pref[i] === curr){
          j++;
        }
      };
      return j;
    },
    getParaText : function(){
      var value = this.value, s = '';
      for(var i =0, iL = value.length; i< iL; i++){
        s += value[i].name + this.opts.valueSign;
      }
      return s;
    },
  /** 2. 筛选逻辑 para 并联模式 E **/

  /** 3. 显示视图 S **/
    show : function(){
      //待完善, 需JS模板渲染组件, 目前结合Vue使用,无此需求
    },
    render : function(){
    },
    hide : function(){
    },
    showMessage : function(res){
      console.log(res.message,res.type);
      var type = res.type,
          message = res.message;
      if(type === 'error'){
        this.showError(message);
      }else if(type === 'warn'){
        this.showWarn(message);
      };
    },
    showError : function(message){
      $.toast && $.toast(message, "cancel");
      console.log(message);
    },
    showWarn : function(message){
      $.toast && $.toast(message, "forbidden");
      console.log(message);
    },
  /** 3. 显示视图 E **/
  /** 4. 事件监听 钩子 S **/
    afterSetCurr : function(){},
    afterSetValue : function(){},
    afterPicker : function(){},
    initEvent : function(){  /*待完善*/ }
  /** 4. 事件监听 钩子 E **/
  }

  KsPicker.fn.init.prototype = KsPicker.prototype;
  window.KsPicker = window.KsPicker || KsPicker;
  return window.KsPicker;

  function getParent (data,datas){
    var _sub = datas.sub;
    if(_sub){
      for(var i=0,iL=_sub.length; i<iL ; i++){
        if(data === _sub[i]){
          return datas;
        }else if(datas[i].sub){

        }
      }
    }
  }
})
