'use strict';
module.exports = {
    plugins: {
        'autoprefixer': process.env.NODE_ENV === 'production' ? { browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'] } : false,
        'cssnano': process.env.NODE_ENV === 'production'  ? {
          discardComments: {removeAll: true},
          // 避免 cssnano 重新计算 z-index
          safe: true
        } : false
    }
}
