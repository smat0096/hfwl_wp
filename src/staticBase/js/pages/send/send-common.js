define(function(require,exports,module) {
  "use strict";

  var _send = {
    //执行关闭,删除,重发动作
    doActionData : function(opts){
      var _vm = this;
      if(_vm.isLoading || _vm.isActioning) return;
      var actionType;
      switch(opts.action){
        case 'delete' : actionType = '删除'; break;
        case 'refresh' : actionType = '重发'; break;
        case 'close' : actionType = '关闭'; break;
      };
      $.confirm({
        title: '确认'+actionType+'吗?',
        //text: '内容文案',
        onOK: function () {
          _ks.run.call(_vm, _send.doActionDataAjax,opts);
        },
        onCancel: function () {
          return;
        }
      });
    },
    // 发货记录,常发货源操作;
    doActionDataAjax : function(opts){
      var _vm = this;
      _vm.isActioning = true;
      var _opts = {
        url: _vm.actionUrl,
        type: "GET",
        async: true,
        dataType: "json",
        data: {
          'userId' : _vm.user.id,
          'messageId' : opts.id,
          'listDataType' : _vm.listDataType,
          'action' : opts.action,
          //'operation_type' : opts.operation_type,
          'page' : _vm.page,
          'pageSize' : _vm.pageSize,
          'minId' : _vm.minId,
          't' : (new Date()).getTime()
        },
        success : function(res){
          if(res.status!=="OK"){
            $.alert('服务端错误,操作失败');
            return;
          }
          if(opts.action === 'delete' || opts.action === 'close' ||(opts.action === 'refresh' && _vm.listDataType ==='closing' )){
            for(var i = _vm.listDataF.length-1; i>=0; i--){
              if(_vm.listDataF[i] && _vm.listDataF[i].checked){
                _vm.listDataF.splice(i,1);
              }
            };
          }
          _vm.checkedAll = false;
          _vm.clearChecked();
        },
        error : function(res){
          $.alert('服务端错误,操作失败');
          console.error("返回值错误,操作失败",res);
          _ks.run(opts.error, res);
        },
        complete : function(res){
          _vm.isActioning = false;
          _ks.run(opts.complete, res);
        }
      };
      _opts.data = _ks.extend({},_opts.data,opts);
      return $.ajax(_opts);
    },
    clearChecked : function(){
       this.listDataF.forEach(function(listF){
        listF.checked = false;
      })
    },
    changeSelectMode : function(){
      this.isMultiple = !this.isMultiple;
      this.clearChecked();
      if(this.isMultiple){
        this.isMultipleText = '进入单选'
      }else{
        this.isMultipleText = '进入多选'
      }
    },
    selectAll : function(){
      var jqInputs = $('input[name="sendgoods"]');
      if(this.checkedAll = !this.checkedAll){
        jqInputs.prop('checked', true);
        this.listDataF.forEach(function(listF){
          listF.checked = true;
        })
      }else{
        jqInputs.prop('checked', false);
        this.clearChecked();
      }
    },
    selectOne : function(listF){
      listF.checked = !listF.checked;
      if(!listF.checked){
        this.checkedAll = false;
      }
    },
    actionAll : function(opts){
      //var n = $("#published_goods").serializeArray();
      var _vm = this;
      var n = [];
      this.listDataF.forEach(function(listF){
        if(listF.checked) n.push(listF.id);
      });
      if(n.length>0){
        opts.id = n;
        _vm.doActionData(opts)
      }else{
        $.alert("请选择记录!");
      }
    }
  
  };
  return _send;
})
