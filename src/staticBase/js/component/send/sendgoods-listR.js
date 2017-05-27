define(function(require,exports,module){
"use strict";
var _template = `
<div class="fh_re_info content_box_list bd_c sendgoods-list" >
  <div class="weui-cells weui-cells_checkbox">
    
    <!-- 单选头部 已注释,改为模板slot -->
    <header>
      <!--
      <div class="f_head" v-show="!isMultiple"> 
        <div class="clearfix">
          <div class="fl"> 
            <span v-text="listF.createTimeDiff"></span>&nbsp;&nbsp;
            <i class="icon_1 icon_1_price"></i>
            <span v-text="listF.browseCount">50</span><span>人已浏览</span>
          </div> 
          <div class="fr">
            <a href="javascript:;" class="detail_price c_o">收信息费</a>
          </div>
        </div>
      </div>
      -->
      <slot name="header"  v-show="!isMultiple"></slot>
    </header>

    <!-- 多选主体 -->
    <div class="weui-cell weui-check__label hide_before sendgoods-list_m" 
      @click="selectOne(listF)"
      v-show="!!isMultiple" >
      <div class="weui-cell__hd">
        <input 
          type="checkbox" 
          class="weui-check" 
          name="sendgoods" 
          :value="listF.id"
          :checked = "listF.checked"
        />
        <i class="weui-icon-checked orange_checked"></i>
      </div>
      <div class="weui-cell__bd ">
        <div class="f_address clearfix">
          <div class="detail_address weui-flex">
            <span class="weui-flex__item text-left c_o" v-text="listF.from">湖南郴州</span>
            <span class="icon_1 icon_1_send_arrow ml--28"></span>
            <span class="weui-flex__item text-center c_o" v-text="listF.to">浙江台州</span>
          </div> 
          <div class="weui-media-box__info detail_text">
            <span v-if="listF.cargoTypeName" v-text="listF.cargoTypeName">普货</span>
            <span  v-if="listF.carType" v-text="listF.carType">高栏</span>
            <span  v-if="listF.carLen" v-text="listF.carLen">31吨</span>
          </div> 
        </div>
      </div>
    </div>

    <!-- 单选主体 -->
    <a v-show="!isMultiple" class="weui-cell cell_access hide_before sendgoods-list_s"
      href="javascript:;" >
      <div class="weui-cell__bd ">
        <div class="f_address clearfix">
          <div class="detail_address weui-flex">
            <span class="weui-flex__item text-center c_o" v-text="listF.from">湖南郴州</span>
            <span class="icon_1 icon_1_send_arrow"></span>
            <span class="weui-flex__item text-center c_o" v-text="listF.to">浙江台州</span>
          </div>  
        </div>
      </div>
    </a>
    
    <!-- 单选底部按钮  右侧按钮已注释,改为模板slot -->
    <div class="weui-cell sendgoods-list_s pt-0 pb-6" v-show="!isMultiple">
      <div class="weui-cell__bd">
         <div class="f_address clearfix">
            <div class="fl detail_address">
              <div class="detail_text weui-media-box__info">
                <span v-if="listF.cargoTypeName" v-text="listF.cargoTypeName" class="">普货</span>
                <span  v-if="listF.carType" v-text="listF.carType" class="">高栏</span>
                <span  v-if="listF.carLen" v-text="listF.carLen" class="">31吨</span>
              </div>
            </div> 
            <!--
            <div class="fr c_o">
              <a 
                href="javascript:;" 
                class="weui-btn weui-btn_mini blue_btn_plain detail_btn" 
                v-if="listDataType == 'sending'"
                @click="closeOne(listF)"
              >关闭</a>
              <a href="javascript:;" 
                class="weui-btn weui-btn_mini blue_btn_plain detail_btn"
                @click="deleteOne(listF)"
              >删除</a>
              <a href="javascript:;" 
                class="weui-btn weui-btn_mini blue_btn_plain detail_btn"
                @click="refreshOne(listF)"
              >重发</a>
            </div> 
            -->
            <slot name="footer-right"></slot>
          </div>
      </div>
    </div>

  </div>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
              transitionName : 'in-out-translate-fade'
            }
        },
        props: ['listF','listDataType','isMultiple'],
        methods: {
          selectOne : function(listF) {
            this.$emit('select-one',listF)
          },
          closeOne : function(listF){
            this.$emit('action-data',{
              id : listF.id,
              action : 'close'
            })
          },
          deleteOne : function(listF){
            this.$emit('action-data',{
              id : listF.id,
              action : 'delete'
            })
          },
          refreshOne : function(listF){
            this.$emit('action-data',{
              id : listF.id,
              action : 'refresh'
            })
          },
        }
    });
})
