var builder = require('xmlbuilder')
  , Ad = require('./lib/ad');

var xml = function(options) {
  var response = builder.create('VAST', { version : '1.0', encoding : 'UTF-8' });
  response.att('version', this.version);
  this.ads.forEach(function(ad){
    var Ad = response.element('Ad', { id : ad.id, sequence : ad.sequence });
    if (ad.Wrapper) { 
      Ad.element('Wrapper', ad.Wrapper); 
    } else {
      var inline = Ad.element('InLine');
      inline.element('AdSystem', ad.AdSystem.name, { version : ad.AdSystem.version });
      inline.element('AdTitle', ad.AdTitle);
      inline.element('Description', ad.Description);
      inline.element('Survey', ad.Survey);
      ad.impressions.forEach(function(impression){
        inline.element('Impression', impression.url, { id : impression.id });
      });
      var creatives = inline.element('Creatives');
      ad.creatives.forEach(function(c){
        var creative = creatives.element('Creative');
        var trackingEvents = creative.element('TrackingEvents');
        c.trackingEvents.forEach(function(trackingEvent){
          trackingEvents.element('TrackingEvent', trackingEvent.url, { type : trackingEvent.type });
        });
        var videoClicks = creative.element('VideoClicks');
        c.videoClicks.forEach(function(videoClick){
          videoClicks.element(videoClick.type, videoClick.url, { id : videoClick.id });
        });
        var mediaFiles = creative.element('MediaFiles');
        c.mediaFiles.forEach(function(mediaFile){
          mediaFiles.element('MediaFile', mediaFile.url, {
              id : mediaFile.id
            , delivery : mediaFile.delivery
            , type : mediaFile.type
            , bitrate : mediaFile.bitrate
            , minBitrate : mediaFile.minBitrate
            , maxBitrate : mediaFile.maxBitrate
            , width : mediaFile.width
            , height : mediaFile.height
            , scalable : mediaFile.scalable
            , maintainAspectRatio : mediaFile.maintainAspectRatio
            , codec : mediaFile.codec
            , apiFramework : mediaFile.apiFramework
          });
        });
        var companionAds = creative.element('CompanionAds');
        c.companionAds.forEach(function(companionAd){
          companionAdElement = companionAds.element('CompanionAd', { width : companionAd.width, height : companionAd.height });
          companionAdElement.element(companionAd.resource, companionAd.url, { type: companionAd.type } );
          var trackingEvents = companionAdElement.element('TrackingEvents');
          companionAd.trackingEvents.forEach(function(trackingEvent){
            trackingEvents.element('TrackingEvent', trackingEvent.url, { type : trackingEvent.type });
          });
        });
      });
    }
  });
  return response.end(options);
};

function VAST(settings) {
  settings = settings || {};
  this.version = settings.version || '3.0';
  this.ads = [];
  this.attachAd = function(settings) {
    var ad = new Ad(settings);
    this.ads.push(ad);
    return ad; 
  };
  this.xml = xml;
}

module.exports = VAST;