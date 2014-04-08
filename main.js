var hyperquest = require('hyperquest')
  , events = require('events')
  , util = require('util')
  , DOM_READY = 'DOMContentLoaded'
  , domReady = false
  , xmlDom = require('./lib/xml-dom')
;

util.inherits(VAST, events.EventEmitter);
function VAST(id, options) {
  if(!(this instanceof VAST))
      return new VAST(id, options);

  this.options = options || {};
  this.id = id;
  this.paused = false;
  if (domReady)
    return this.init();
  document.addEventListener(DOM_READY, this.init.bind(this));
}

VAST.prototype.pause = function() { 
  this.paused = true;
  this.emit('paused')
}
VAST.prototype.resume = function() { 
  this.paused = false;
  this.emit('resumed');
}

VAST.prototype.checkPaused = function(next) {
  this.paused 
    ? this.once('resume', function() { 
        console.log('heard resume!');
        next();
      }.bind(this)) 
    : next.bind(this)()
  ;
}

VAST.prototype.init = function() {
  domReady = true;
  this.videoEl = document.getElementById(this.id);
  if (!this.videoEl)
    return console.error('vast-xml: no video element found with id:', this.id);
  this.tagUri = this.videoEl.getAttribute('data-vast-tag-uri')
  if (!this.tagUri)
    return console.error('vast-xml: no `data-vast-tag-uri` attribute found!');
  this.emit('init', this);
  process.nextTick(function() {
    this.checkPaused(this.fetchTagUri);
  }.bind(this));
}

VAST.prototype.fetchTagUri = function() {
  this.removeListener('resume', this.fetchTagUri);
  console.log(this.tagUri);
  var xmlBuffer = [];
  hyperquest({ uri: this.tagUri, method: 'get' })
    .on('error', function() { 
      console.error('vast-xml: error loading', this.tagUri) 
    }.bind(this))
    .on('data', function(chunk) { xmlBuffer.push(chunk) })
    .on('end', function() {
      this.xml = xmlBuffer.join('');
      this.emit('xmlLoaded', this.xml);
      process.nextTick(function() {
        this.checkPaused(this.parseXml);
      }.bind(this));
    }.bind(this))
  ;
};

VAST.prototype.parseXml = function() {
  var object = xmlDom.parse(this.xml);
  console.log(object);
}

module.exports = global.VAST = VAST;