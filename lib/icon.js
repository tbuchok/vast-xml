function Icon(settings) {
  this.attributes = {};
  if (settings.program) this.attributes.program = settings.program;
  if (settings.width) this.attributes.width = settings.width;
  if (settings.height) this.attributes.height = settings.height;
  if (settings.xPosition) this.attributes.xPosition = settings.xPosition;
  if (settings.yPosition) this.attributes.yPosition = settings.yPosition;
  if (settings.duration) this.attributes.duration = settings.duration;
  if (settings.offset) this.attributes.offset = settings.offset;
  if (settings.apiFramework) this.attributes.apiFramework = settings.apiFramework;
  this.resources = [];
  this.attachResource = function(type, uri, creativeType) {
    var resource = { type : type, uri : uri }
    if (type === 'HTMLResource') resource.html = uri;
    if (creativeType) resource.creativeType = creativeType;
    this.resources.push(resource);
    return this;
  };
  this.clicks = [];
  this.attachClick = function(type, uri) {
    this.clicks.push({ type : type, uri : uri });
  };
  this.trackingEvents = [];
  this.attachTrackingEvent = function(type, uri) {
    this.trackingEvents.push({ type : type, uri : uri });
  };
}

module.exports = Icon;