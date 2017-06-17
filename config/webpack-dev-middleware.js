module.exports = function(config,webpackConfig){
var opn = require('opn')
var path = require('path')
var gutil = require('gulp-util');
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')

// default port where dev server listens for incoming traffic
var port = config.server.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.autoOpenBrowser

//设置代理跨域  https://github.com/chimurai/http-proxy-middleware
config.proxyTable = {
  '/app': {
    target: 'http://cwh.qiruiw.com',
    changeOrigin: true,
    pathRewrite: {
      '^/app': '/app'
    },
    //设置cookie
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader('cookie', 'Hm_lvt_76e0f7fba99c643ac87df5b4822a2932=1493011547,1493011552,1493794769,1494485427; ab46___ewei_shopv2_member_session_2=eyJpZCI6IjcwIiwib3BlbmlkIjoid2FwX3VzZXJfMl8xMzMzMzMzMzMzMiIsIm1vYmlsZSI6IjEzMzMzMzMzMzMyIiwicHdkIjoiZWMxMmFkYWY0M2JhNjgwMmNjMDU0M2MxMGIxYzQ5M2IiLCJzYWx0IjoiUEY0Wk9HWkdaMlZETjNHTyIsImF1ZGl0VHlwZSI6IjEiLCJld2VpX3Nob3B2Ml9tZW1iZXJfaGFzaCI6IjdhMjFkZTE2ZWU1ZmI5ZWZmMGQxZGE2NWQyZjQxMWMyIn0%3D; PHPSESSID=dd0314d1b8a34af27d35a29e9db692cc')
    },
    onProxyRes(proxyRes, req, res){
      Object.keys(proxyRes.headers).forEach(function (key) {
        res.append(key, proxyRes.headers[key]);
      });
    }
  }
};
var proxyTable = config.proxyTable || {}

var app = express()

Object.keys(webpackConfig.entry).forEach(function (name) {
  if (!(webpackConfig.entry[name] instanceof Array)) {
      throw new gutil.PluginError('entry[name] 需为 Array');
  }
  webpackConfig.entry[name].unshift('./config/dev-client');
})

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.server.publicPath, '/static')
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

return {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
}
