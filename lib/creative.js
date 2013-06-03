var CompanionAd = require('./companion-ad')
  , TrackingEvent = require('./tracking-event')

function Creative(type, settings) {
  settings = settings || {};
  this.type = type;
  this.AdParameters = settings.AdParameters;
  if (settings.Duration) {
    this.Duration = settings.Duration;    
  } else if(type === 'Linear') {
    throw new Error('A Duration is required for all creatives. Consider defaulting to "00:00:00"');
  }
  this.attributes = {};
  if (settings.id) this.attributes.id = settings.id;
  if (settings.width) this.attributes.width = settings.width;
  if (settings.height) this.attributes.height = settings.height;
  if (settings.expandedWidth) this.attributes.expandedWidth = settings.expandedWidth;
  if (settings.expandedHeight) this.attributes.expandedHeight = settings.expandedHeight;
  if (settings.scalable !== undefined) this.attributes.scalable = settings.scalable;
  if (settings.maintainAspectRatio !== undefined) this.attributes.maintainAspectRatio = settings.maintainAspectRatio;
  if (settings.minSuggestedDuration) this.attributes.minSuggestedDuration = settings.minSuggestedDuration;
  if (settings.apiFramework) this.attributes.apiFramework = settings.apiFramework;
  this.mediaFiles = [];
  this.attachMediaFile = function(settings) {
    settings = settings || {};
    var mediaFile = {};
    mediaFile.url = settings.url;
    mediaFile.type = settings.type || 'video/mp4';
    mediaFile.width = settings.width || '640';
    mediaFile.height = settings.height || '360';
    mediaFile.delivery = settings.delivery || 'progressive';
    if (settings.id) mediaFile.id = settings.id
    if (settings.bitrate) mediaFile.bitrate = settings.bitrate
    if (settings.minBitrate) mediaFile.minBitrate = settings.minBitrate
    if (settings.maxBitrate) mediaFile.maxBitrate = settings.maxBitrate
    if (settings.scalable) mediaFile.scalable = settings.scalable
    if (settings.maintainAspectRatio) mediaFile.maintainAspectRatio = settings.maintainAspectRatio
    if (settings.codec) mediaFile.codec = settings.codec
    if (settings.apiFramework) mediaFile.apiFramework = settings.apiFramework
    this.mediaFiles.push(mediaFile);
    return this;
  };
  this.trackingEvents = [];
  this.attachTrackingEvent = function(type, url) {
    this.trackingEvents.push(new TrackingEvent(type, url));
    return this;
  };
  this.videoClicks = [];
  this.attachVideoClick = function(type, url, id) {
    var VALID_VIDEO_CLICKS = ['ClickThrough', 'ClickTracking', 'CustomClick']
    if (VALID_VIDEO_CLICKS.indexOf(type) < 0) { 
      throw new Error('The supplied VideoClick `type` is not a valid VAST VideoClick type.');
    }
    this.videoClicks.push({ type : type, url : url, id : id || '' });
    return this;
  };
  this.clickThroughs = [];
  this.attachClickThrough = function(url) {  
    this.clickThroughs.push(url);
    return this;
  }
  this.clicks = [];
  this.attachClick = function(uri, type) {
    if (typeof uri === 'string') type = 'NonLinearClickThrough'
    this.clicks = [{ type : type, uri : uri }];
    return this;
  }
  this.adParameters = function(data, xmlEncoded) {  
    this.adParameters = { data : data, xmlEncoded : xmlEncoded }
    return this;
  }

  this.resources = [];
  this.attachResource = function(type, uri, creativeType) {
    var resource = { type : type, uri : uri }
    if (type === 'HTMLResource') resource.html = uri;
    if (creativeType) resource.creativeType = creativeType;
    this.resources.push(resource);
  };
  this.companionAds = [];
  this.attachCompanionAd = function(resource, settings) {
    var companionAd = new CompanionAd(resource, settings);
    this.companionAds.push(companionAd);
    return companionAd;
  };
}

module.exports = Creative;