var hyperquest = require('hyperquest')
  , events = require('events')
  , util = require('util')
  , DOM_READY = 'DOMContentLoaded'
  , ready = false
;

util.inherits(VAST, events.EventEmitter);
function VAST(id) {
  if(!(this instanceof VAST))
      return new VAST(id);

  this.id = id;
  if (ready)
    return this.ready();
  
  document.addEventListener(DOM_READY, function() {
    this.ready();
  }.bind(this));
}

VAST.prototype.ready = function() {
  var videoEl = document.getElementById(this.id);
  this.emit('ready', videoEl);
}

module.exports = global.VAST = VAST;