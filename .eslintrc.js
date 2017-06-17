"use strict";
let i = process.env.NODE_ENV === 'production' ? 2 : 1;
module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "globals": { // 不对这些全局变量进行验证
    "$": false,  // true/false 是否允许变量允许被重写
    "Vue": false,
    "Swiper": false,
    "swiperAnimateCache": false,
    "swiperAnimate": false,
    "Swiper": false,
    "_base" : false
  },
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "no-cond-assign": [2, "always"], //if, while等条件中不允许使用“=”
    "no-constant-condition": 2,
    "no-debugger": i, // 程序中不能出现debugger
    "no-dupe-args": 2, // 函数的参数名称不能重复
    "no-dupe-keys": 2, // 对象的属性名称不能重复
    "no-duplicate-case": 2, // switch的case不能重复
    "no-func-assign": 2,
    "no-obj-calls": 2,
    "no-regex-spaces": 2,
    "no-sparse-arrays": 2,
    "no-unexpected-multiline": 2,
    "no-unreachable": 2,
    "use-isnan": 2,
    "valid-typeof": 2,
    "eqeqeq": [2, "always"],
    "no-caller": 2,
    "no-eval": 2,
    "no-redeclare": 2,
    "no-undef": 2,
    "no-unused-vars": 1,
    "no-use-before-define": 2,
    "comma-dangle": [1, "never"],
    "no-const-assign": 2,
    "no-dupe-class-members": 2
  }
}
