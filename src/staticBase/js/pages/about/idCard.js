define(function(require,exports,module){
require('utils/ksidcard/id.js');
require('utils/ksidcard/idcard.js');

var _template = `
<div class="home">
    <div class="wrapper">
      <div class="container">
       <form onsubmit="return false;">
      
        <input type="text" class="inp_a" placeholder="请输入身份证号（15位或18位）" name="userid" id="userid" maxlength="100">
        <button class="btn_a" onclick="this.value = '查询中..';searchCard();">查 询</button>
        </form>
 
    <div id="error" style="display: none; color:Red; font-size:14px;">身份证信息有误</div>
        
        <div class="result" id="info" style="display:none;">
          <p><span class="label">号 码：</span><span class="cRed" id="code"></span></p>
          <p><span class="label">地 区：</span><span id="diqu"></span></p>
          <p><span class="label">生 日：</span><span id="shengri"></span></p>
          <p><span class="label">性 别：</span><span id="xingbie"></span></p>
        </div>
        <div class="result" id="e_info" style="display:none;">
          <p><span class="label">查询号码：</span><span id="e_e_code"></span><span class="cRed">（最后一位校验码错误）</span></p>
          <p><span class="label">正确号码：</span><span id="e_code"></span></p>
          <p><span class="label">地区：</span><span id="e_diqu"></span></p>
          <p><span class="label">生日：</span><span id="e_shengri"></span></p>
          <p><span class="label">性别：</span><span id="e_xingbie"></span></p>
        </div>
        
        <br> 
                 <div class="statement" style="display:none;">
          <div class="tit">身份证号码前6位查询：</div><br>
                   <div class="tit">
                    <select id="province" name="province" style="float:none;">            
              
              
            <option value="">--请选择--</option><option value="110000">北京市</option><option value="120000">天津市</option><option value="130000">河北省</option><option value="140000">山西省</option><option value="150000">内蒙古自治区</option><option value="210000">辽宁省</option><option value="220000">吉林省</option><option value="230000">黑龙江省</option><option value="310000">上海市</option><option value="320000">江苏省</option><option value="330000">浙江省</option><option value="340000">安徽省</option><option value="350000">福建省</option><option value="360000">江西省</option><option value="370000">山东省</option><option value="410000">河南省</option><option value="420000">湖北省</option><option value="430000">湖南省</option><option value="440000">广东省</option><option value="450000">广西壮族自治区</option><option value="460000">海南省</option><option value="500000">重庆市</option><option value="510000">四川省</option><option value="520000">贵州省</option><option value="530000">云南省</option><option value="540000">西藏自治区</option><option value="610000">陕西省</option><option value="620000">甘肃省</option><option value="630000">青海省</option><option value="640000">宁夏回族自治区</option><option value="650000">新疆维吾尔自治区</option><option value="710000">台湾省(886)</option><option value="810000">香港特别行政区(852)</option><option value="820000">澳门特别行政区(853)</option></select>
            <span>省</span>
            <select id="city" name="city" style="float:none;">&gt;
              
            <option value="">--请选择--</option></select>
            <span>市</span>
            <select id="region" name="region" style="float:none;">&gt;
              
            <option value="">--请选择--</option></select>
            <span>区</span>
                  </div><br>
                  <p class="num_area_six">对应的身份证前6位是：<strong class="cYellow" id="identity"></strong></p>
                  <br>
                </div>
                
                
        <div class="result" id="message" style="display:none;">
          <p class="cRed">请输入15或18位正确的身份证号码</p>
        </div>
      </div>
    </div>

  <div id="cli_dialog_div"></div>
</div>
  `;

  return Vue.extend({
        template: _template,
        replace:true,
        data:function(){
            return{
            }
        },
        props: ['user'],
        mounted : function(){
          this.fromName = this.user.pos.cityName
        },
        methods: {
          
        }
    });
  
})
