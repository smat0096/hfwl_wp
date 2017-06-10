'use strict';
module.exports = {
    plugins: {
        'autoprefixer': process.env.NODE_ENV === 'production' ? require('autoprefixer')({ }) : false,
        'cssnano': process.env.NODE_ENV === 'production'  ? require('cssnano')({ }) : false
    }
}
