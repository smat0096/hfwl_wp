define(function(require, exports, module) {
  "use strict";
  var _base = window._base,
      _ks = _base.utils,
      _common = _base.common;
  var _fhIssue = require('fhIssue_new');
  //数据接口在 fhIssue_new.js 中
  var template = `
<transition :name="transitionName" v-on:after-enter="initData">
<div class="wrap sendgoods transition-wrap JS_sendgoodsP">
  <div class="wrap">
      <header-back title = "发布货源" ></header-back>
      <div class="content_box content_box_bottom">
          <form id="fh_goods">
              <div class="fh_box" id="js_fh_box">
                  <div class="info_box city_info clearfix weui-flex bd_c">
                      <div class="fl c_box weui-flex__item">
                          <p class="c_head"><i class="icon_1 icon_1_send_from"></i> 出发地</p>
                          <div class="c_inp js_inp" id="js_from">
                              <b>请选择出发地点</b>
                              <input type="text" name="from" readonly id="js_from_name" /><i class="icon_list_down"></i>
                              <input type="hidden" name="fromId"/>
                          </div>
                      </div>
                      <div class="fl bline"></div>
                      <div class="fl c_box weui-flex__item">
                          <p class="c_head"><i class="icon_1 icon_1_send_to"></i> 到达地</p>
                          <div class="c_inp" id="js_to">
                              <b>请选择到达地点</b>
                              <input type="text" name="to" readonly id="js_to_name" /><i class="icon_list_down"></i>
                              <input type="hidden" name="toId"/>
                          </div>
                      </div>
                  </div>
                  <div class="info_box c_tab bd_c">
                      <table>
                          <tr id="js_car_type">
                              <td width="120"  class="border_after-a">
                                  <i class="icon_1 icon_1_send_cartype"></i>
                                  车长车型
                                  <span class="line"></span>
                              </td>
                              <td  class="border_after-a right10">
                                  <div class="c_inp">
                                      <b>请选择车长车型</b>
                                      <input type="text" readonly/>
                                      <i class="icon_list_down" style="right:0"></i>
                                  </div>
                              </td>
                          </tr>
                          <tr class="b_no"  id="js_goods_type">
                              <td>
                                  <i class="icon_1 icon_1_send_goodstype"></i>
                                  货物类型
                                  <span class="line"></span>
                              </td>
                              <td>
                                  <div class="c_inp">
                                      <b>请选择货物类型</b>
                                      <input type="text" name="cargoType" readonly/>
                                      <i class="icon_list_down"></i>
                                  </div>
                              </td>
                          </tr>
                      </table>
                  </div>
                  <div class="info_box c_tab bd_c">
                      <table>
                          <tr data-type="num" id="js_load">
                              <td width="90" class="border_after-a">
                                  <i class="icon_1 icon_1_load_num"></i>
                                  数 量
                                  <span class="line"></span>
                              </td>
                              <td class="border_after-a">
                                  <div class="c_inp  js_inp" style="border-right: 1px solid #ddd;">
                                      <b>请输入货物数量</b>
                                      <input type="text" maxlength="7" name="load"  class="js_num"/>
                                  </div>
                              </td>
                              <td class="ic js_count border_after-a right10"><span class="js_unit">吨</span><input type="hidden" name="unit" value="1"><i class="icon_list_down"></i></td>
                          </tr>
                          <tr class="b_no" data-type="speed" id="js_price">
                              <td>
                                  <i class="icon_1 icon_1_price"></i>
                                  运 费
                                  <span class="line"></span>
                              </td>
                              <td>
                                  <div class="c_inp  js_inp" style="border-right: 1px solid #ddd;">
                                      <b>请输入货物运费</b>
                                      <input type="text" maxlength="7" name="price"  class="js_num"/>
                                  </div>
                              </td>
                              <td class="ic js_count"><span class="js_unit">元/吨</span><input type="hidden" name="priceUnit" value="吨"><i class="icon_list_down"></i></td>
                          </tr>
                      </table>
                  </div>
                  <div class="info_box bd_c">
                      <p>备&emsp;&emsp;注</p>
                      <textarea name="content" id="js_content" class="fh_txt"></textarea>
                  </div>
                  <div class="set_box clearfix">
                      <div class="fl set_info_wrap">
                          <p class="s_head" id="js_set_btn">更多设置<i class="icon_down bc_o"></i></p>
                          <div class="set_info">
                              <div class="clearfix set_info_btn"  id="js_set_info">
                                  <div class="fl set_btn" id="js_resend_box">重发货源<i></i><input type="hidden" name="resend" value="0"/></div>
                                  <div class="fl set_btn" id="js_hiddenForLocal">同城不可见<i></i><input type="hidden" name="hiddenForLocal" value="0"/></div>
                              </div>
                              <p class="tip  js_tip">该货源每隔20分钟重发一次，共重发30次</p>
                              <p class="tip  js_tip">该货源同城不可见</p>
                          </div>
                      </div>
                      <div class="fr set_btn_wrap">
                          <p class="set_btn" style="margin-top:0" id="js_set_fh">存为常发货源<i></i></p>
                      </div>
                  </div>
                  <div class="sub_btn" id="js_sub">确定发布<span></span></div>
              </div>
          </form>

      </div>
  </div>

  <!--出发地-->
  <div id="dialog_floor_from" class="dialog_floor dialog_floor_fullsize">
      <div class="floor_mask js_floor_mask"></div>
      <div class="floor_content js_floor_content"  style="-height: 600px">
          <div class="js_con"></div>
          <div class="floor_close js_floor_close">取消</div>
      </div>
  </div>
  <!--到达地-->
  <div id="dialog_floor_to" class="dialog_floor">
      <div class="floor_mask js_floor_mask"></div>
      <div class="floor_content js_floor_content"  style="-height: 600px">
          <div class="js_con"></div>
          <div class="floor_close js_floor_close">取消</div>
      </div>
  </div>
  <!--货物类型-->
  <div id="dialog_floor_goodsType" class="dialog_floor">
      <div class="floor_mask js_floor_mask"></div>
      <div class="floor_content js_floor_content"  style="-height: 340px">
          <div class="s_box js_con">
              <div class="s_h">货物类型</div>
              <ul class="s_list clearfix">
              </ul>
          </div>
          <div class="floor_close js_floor_close">取消</div>
      </div>
  </div>
  <!--选择单位-->
  <div id="dialog_floor_goodsUnit" class="dialog_floor">
      <div class="floor_mask js_floor_mask"></div>
      <div class="floor_content js_floor_content"  style="-height: 190px">
          <div class="s_box js_con">
              <div class="s_h">选择单位</div>
              <ul class="s_list clearfix">
              </ul>
          </div>
          <div class="floor_close js_floor_close">取消</div>
      </div>
  </div>
  <!--选择车型车长-->
  <div id="dialog_floor_carType" class="dialog_floor">
      <div class="floor_mask js_floor_mask"></div>
      <div class="floor_content js_floor_content"  style="-height: 550px">
          <div class="s_box js_con">
              <div class="s_h">选择车型</div>
              <div id="js_car_tbox">
                  <ul class="s_list clearfix">
                  </ul>
              </div>
              <div class="s_h">选择车长</div>
              <div id="js_car_lbox">
                  <ul class="s_list clearfix">
                  </ul>
              </div>
          </div>
          <div class="floor_close js_floor_close">确定</div>
      </div>
  </div>
</div>
</transition>
`;

  var _sendGoods = {
    template : template,
    data: function(){
      return {
        'transitionName' : 'in-out-translate',
        'isLoading' : false,
        'isShowLoading' : false
      }
    },
    props : ['user'],
    beforeDestroy : function() {
      $(".JS_sendgoodsP").off().html("");
    },
    methods : {
      initData : function(){
        _fhIssue.init(this.user); //为什么要在index先引入一次才行???
      }
    }
  };
  var sendGoods = Vue.extend(_sendGoods);
  return sendGoods;
});
