define( function(require, exports, module) {
  var s = {
    VEHICLE_LENGTHS: ["不限", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/4.2米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/4.5米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/6.2米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/6.8米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/7.2米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/8.2米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/8.6米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/9.6米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/11.7米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/12.5米", "13米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/13.5米", "14米", "17米", "https://s.56qq.com/staticConsignorGarage/dist/20170209/js/plug/17.5米", "18米"],
    VEHICLE_TYPES: ["不限", "半封闭", "半挂", "保温", "单车", "低板", "二拖三", "二拖四", "高栏", "高栏单桥", "高栏双桥", "工程车", "后八轮或前", "后八轮或半", "集装箱", "冷藏"],
    CARGO_TYPES: ["不限", "普货", "重货", "泡货", "整车", "摩托车", "玻璃", "设备", "配件", "电瓷", "显像管", "电器", "烟叶", "服装", "棉纱", "棉被", "平纸板", "药品", "煤炭", "矿产", "钢铁", "铁粉", "建材", "胶版", "食品", "粮食", "饮料", "危险品", "烟花", "化工", "化肥农药", "石油制品", "轻工产品", "牧产品", "牲畜", "渔产品", "农产品", "水果", "蔬菜", "木材", "木方", "竹片", "轿车", "驾驶室", "特种货物", "军用品", "零担", "抛货", "原料", "仪器", "家具", "白酒", "瓷器", "挖机", "冻品", "焦炭", "硅铁", "电石"],
    USEFUL_EXPRESSION: ["急装", "随装", "包来回", "高价急走", "装车付款", "门面装货", "本地装货", "求本地装货", "车型不限", "运价好商量", "马上可以装货", "今天订明天装", "不装水果"],
    UNIT: ["吨", "方", "件", "车", "个", "台", "箱"],
    RE_COUNT: ["不重发", "5次", "10次", "20次", "30次", "60次"],
    RE_INTERVAL: ["5分钟", "10分钟", "20分钟", "30分钟", "60分钟"]
  };
  return s
});
