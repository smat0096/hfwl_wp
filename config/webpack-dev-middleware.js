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
var proxyTable = config.proxyTable || {}

var app = express()

Object.keys(webpackConfig.entry).forEach(function (name) {
  if (!(webpackConfig.entry[name] instanceof Array)) {
      throw new gutil.PluginError('entry[name] 需为 Array');
  }
  //webpackConfig.entry[name].unshift("webpack-hot-middleware/client.js?path=/__webpack_hmr&timeout=20000&noInfo=true&reload=true");
  webpackConfig.entry[name].unshift(path.join(__dirname,'./dev-client.js'));
})

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
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
var staticPath = path.posix.join(webpackConfig.output.publicPath, '/static')
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
