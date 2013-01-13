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
  this.attachMediaFile = function(url, mediaFileSettings) {
    mediaFileSettings = mediaFileSettings || {};
    this.mediaFiles.push({
        url : url
      , id : mediaFileSettings.id || ''
      , delivery : mediaFileSettings.delivery || 'progressive'
      , type : mediaFileSettings.type || 'video/mp4'
      , bitrate : mediaFileSettings.bitrate || '320'
      , minBitrate : mediaFileSettings.minBitrate || ''
      , maxBitrate : mediaFileSettings.maxBitrate || ''
      , width : mediaFileSettings.width || '640'
      , height : mediaFileSettings.height || '360'
      , scalable : mediaFileSettings.scalable || true
      , maintainAspectRatio : mediaFileSettings.maintainAspectRatio || true
      , codec : mediaFileSettings.codec || ''
      , apiFramework : mediaFileSettings.apiFramework || ''
    });
  };
  this.trackingEvents = [];
  this.attachTrackingEvent = function(type, url) {
    this.trackingEvents.push(new TrackingEvent(type, url));
  };
  this.videoClicks = [];
  this.attachVideoClick = function(type, url, id) {
    var VALID_VIDEO_CLICKS = ['ClickThrough', 'ClickTracking', 'CustomClick']
    if (VALID_VIDEO_CLICKS.indexOf(type) < 0) { 
      throw new Error('The supplied VideoClick `type` is not a valid VAST VideoClick type.');
    }
    this.videoClicks.push({ type : type, url : url, id : id || '' });
  };
  this.companionAds = [];
  this.attachCompanionAd = function(resource, settings) {
    var companionAd = new CompanionAd(resource, settings);
    this.companionAds.push(companionAd);
    return companionAd;
  };
}

module.exports = Creative;