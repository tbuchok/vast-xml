var builder = require('xmlbuilder')
  , Ad = require('./lib/ad');

var xml = function(options) {
  var track = (options.track === undefined) ? true : options.track;
  var response = builder.create('VAST', { version : '1.0', encoding : 'UTF-8' });
  response.att('version', this.version);
  this.ads.forEach(function(ad){
    var Ad = response.element('Ad', { id : ad.id, sequence : ad.sequence });
    if (ad.structure.toLowerCase() === 'wrapper') { 
      var wrapper = Ad.element('Wrapper');
      wrapper.element('AdSystem', ad.AdSystem);
      wrapper.element('VASTAdTagURI', ad.VASTAdTagURI);
      ad.impressions.forEach(function(impression) {
        if (track) wrapper.element('Impression').cdata(impression.url);
      });
      wrapper.element('Creatives');
    } else {
      var inline = Ad.element('InLine');
      inline.element('AdSystem', ad.AdSystem.name, { version : ad.AdSystem.version });
      inline.element('AdTitle', ad.AdTitle);
      inline.element('Description', ad.Description);
      ad.surveys.forEach(function(survey) {
        var attributes = {}
        if (survey.type) attributes.type = survey.type
        inline.element('Survey', survey.url, attributes);
      });
      ad.impressions.forEach(function(impression){
        if (track) inline.element('Impression', { id : impression.id }).cdata(impression.url);
      });
      var creatives = inline.element('Creatives');
      ad.creatives.forEach(function(c){
        var creative = creatives.element('Creative')
        var creativeType = creative.element(c.type);
        creativeType.element('Duration', c.Duration);
        var trackingEvents = creativeType.element('TrackingEvents');
        c.trackingEvents.forEach(function(trackingEvent){
          if (track) trackingEvents.element('Tracking', trackingEvent.url, { event : trackingEvent.event });
        });
        if (c.AdParameters) creativeType.element('AdParameters').cdata(c.AdParameters);
        var videoClicks = creativeType.element('VideoClicks');
        c.videoClicks.forEach(function(videoClick){
          videoClicks.element(videoClick.type, videoClick.url, { id : videoClick.id });
        });
        var mediaFiles = creativeType.element('MediaFiles');
        c.mediaFiles.forEach(function(mediaFile) {
          attributes = {};
          attributes.delivery = mediaFile.delivery
          attributes.type = mediaFile.type
          attributes.width = mediaFile.width
          attributes.height = mediaFile.height
          if (mediaFile.id) attributes.id = mediaFile.id
          if (mediaFile.bitrate) attributes.bitrate = mediaFile.bitrate
          if (mediaFile.minBitrate) attributes.minBitrate = mediaFile.minBitrate
          if (mediaFile.maxBitrate) attributes.maxBitrate = mediaFile.maxBitrate
          if (mediaFile.scalable) attributes.scalable = mediaFile.scalable
          if (mediaFile.maintainAspectRatio) attributes.maintainAspectRatio = mediaFile.maintainAspectRatio
          if (mediaFile.codec) attributes.codec = mediaFile.codec
          if (mediaFile.apiFramework) attributes.apiFramework = mediaFile.apiFramework
          mediaFiles.element('MediaFile', mediaFile.url, attributes);
        });
        if (c.companionAds.length > 0) {
          var companionAds = creatives.element('Creative').element('CompanionAds');
          c.companionAds.forEach(function(companionAd){
            companionAdElement = companionAds.element('Companion', { width : companionAd.width, height : companionAd.height });
            companionAdElement.element(companionAd.resource, companionAd.url, { creativeType: companionAd.type } );
            var trackingEvents = companionAdElement.element('TrackingEvents');
            companionAd.trackingEvents.forEach(function(trackingEvent){
              if (track) trackingEvents.element('Tracking', trackingEvent.url, { event : trackingEvent.event });
            });
          });
        }
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