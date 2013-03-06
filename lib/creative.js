var CompanionAd = require('./companion-ad')
  , TrackingEvent = require('./tracking-event')

function Creative(type, settings) {
  settings = settings || {};
  this.type = type;
  this.AdParameters = settings.AdParameters;
  if (settings.Duration) {
    this.Duration = settings.Duration;    
  } else {
    throw new Error('A Duration is required for all creatives. Consider defaulting to "00:00:00"');
  }
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
  this.companionAds = [];
  this.attachCompanionAd = function(resource, settings) {
    var companionAd = new CompanionAd(resource, settings);
    this.companionAds.push(companionAd);
    return companionAd;
  };
}

module.exports = Creative;