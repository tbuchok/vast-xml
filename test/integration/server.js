var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , PORT = 3000
;

http.createServer(function(req, res) {
  if (/index\.html$/.test(req.url) || /\/$/.test(req.url))
    return fs.createReadStream(path.join(process.cwd(), 'test', 'integration', 'index.html')).pipe(res);
  if(/vast\.js/.test(req.url) || /vast\.min\.js/.test(req.url))
    return fs.createReadStream(path.join(process.cwd(), 'builds', req.url)).pipe(res);
  res.end('ok!');
}).listen(PORT);
console.log('vast-xml integration server listening:', PORT)