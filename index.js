var builder = require('xmlbuilder')
  , Ad = require('./lib/ad');

var xml = function(options) {
  var track = (options.track === undefined) ? true : options.track;
  var response = builder.create('VAST', { version : '1.0', encoding : 'UTF-8' });
  response.att('version', this.version);
  this.ads.forEach(function(ad){
    var adOptions = { id : ad.id }
    if (ad.sequence) adOptions.sequence = ad.sequence;
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

      var linearCreatives = ad.creatives.filter(function(c) { return c.type === 'Linear' });
      var nonLinearCreatives = ad.creatives.filter(function(c) { return c.type === 'NonLinear' });
      var companionAdCreatives = ad.creatives.filter(function(c) { return c.type === 'CompanionAd' });

      linearCreatives.forEach(function(c) {
        var creative = creatives.element('Creative')
        var creativeType;
        creativeType = creative.element(c.type);  
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
          mediaFiles.element('MediaFile', mediaFile.url, mediaFile.attributes);
        });
      });

      nonLinearCreatives.forEach(function(c){
        var nonLinearAds = creatives.element('Creative').element('NonLinearAds');
        var creativeType = nonLinearAds.element(c.type, c.attributes);
        c.resources.forEach(function(resource) { 
          var attributes = {}
          if (resource.creativeType) attributes.creativeType = resource.creativeType;
          creativeType.element(resource.type, resource.uri, attributes);
        });
        c.clicks.forEach(function(click){
          creativeType.element(click.type, click.uri);
        });
        if (c.adParameters) creativeType.element('AdParameters', c.adParameters.data, { xmlEncoded : c.adParameters.xmlEncoded });
      });
      if (companionAdCreatives.length > 0) var companionAds = creatives.element('Creative').element('CompanionAds');
      companionAdCreatives.forEach(function(c) {
        companion = companionAds.element('Companion', c.attributes);
        c.resources.forEach(function(r) { 
          companion.element(r.type, r.uri, (r.creativeType) ? { creativeType : r.creativeType } : {});
          if (r.adParameters) companion.element('AdParameters', r.adParameters.data, { xmlEncoded : r.adParameters.xmlEncoded });
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