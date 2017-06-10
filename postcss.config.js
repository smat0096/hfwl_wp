'use strict';
module.exports = {
    plugins: {
        'autoprefixer': process.env.NODE_ENV === 'production' ? require('autoprefixer')({ 'broswers': ["last 5 versions"] }) : false,
        'cssnano': process.env.NODE_ENV === 'production'  ? require('cssnano')({ }) : false
    }
}
