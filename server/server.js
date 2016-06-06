var express = require('express');
var path = require('path');


var port = process.env.PORT || 3000;
var app = express();
// This is the real meat of the example
// ************************************
(function() {

  // Step 1: Create & configure a webpack compiler
  var webpack = require('webpack');
  var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : '../webpack.config');
  var compiler = webpack(webpackConfig);

  // Step 2: Attach the dev middleware to the compiler & the server
  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }));

  // Step 3: Attach the hot middleware to the compiler & the server
  app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }));
})();

// 定义静态文件目录
app.use( "/src", express.static(path.resolve(__dirname, '../src')));
app.use( "/node_modules", express.static(path.resolve(__dirname, '../node_modules')));
app.use( "/config", express.static(path.resolve(__dirname, '../config')));

var renderIndex = (req, res) => {
    res.sendFile(path.resolve(__dirname, '../src/index.html'));
}
app.get('/', renderIndex);

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(__dirname,'adu:','This express app is listening on port:' + port);
});
