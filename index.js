var builder = require('xmlbuilder')
  , Ad = require('./lib/ad');

var xml = function(options) {
  options = options || {};
  var track = (options.track === undefined) ? true : options.track;
  var response = builder.create('VAST', { version : '1.0', encoding : 'UTF-8' });
  response.att('version', this.version);
  if (this.ads.length === 0 && this.VASTErrorURI)
    return response.element('Error').cdata(this.VASTErrorURI).end(options);
  this.ads.forEach(function(ad){
    var adOptions = { id : ad.id }
    if (ad.sequence) adOptions.sequence = ad.sequence;
    var Ad = response.element('Ad', adOptions);
    var creatives;
    if (ad.structure.toLowerCase() === 'wrapper') { 
      var wrapper = Ad.element('Wrapper');
      wrapper.element('AdSystem', { version : ad.AdSystem.version }).cdata(ad.AdSystem.name || '');
      wrapper.element('VASTAdTagURI').cdata(ad.VASTAdTagURI);
      if (ad.Error)
        wrapper.element('Error').cdata(ad.Error);
      ad.impressions.forEach(function(impression) {
        if (track) wrapper.element('Impression').cdata(impression.url);
      });
      creatives = wrapper.element('Creatives');
    } else {
      var inline = Ad.element('InLine');
      inline.element('AdSystem', { version : ad.AdSystem.version }).cdata(ad.AdSystem.name || '');
      inline.element('AdTitle').cdata(ad.AdTitle);
      inline.element('Description').cdata(ad.Description || '');
      ad.surveys.forEach(function(survey) {
        var attributes = {}
        if (survey.type) attributes.type = survey.type
        inline.element('Survey', attributes).cdata(survey.url);
      });
      if (ad.Error)
        inline.element('Error').cdata(ad.Error);
      ad.impressions.forEach(function(impression){
        if (track) inline.element('Impression', { id : impression.id }).cdata(impression.url);
      });
      creatives = inline.element('Creatives');
    }
      var linearCreatives = ad.creatives.filter(function(c) { return c.type === 'Linear' });
      var nonLinearCreatives = ad.creatives.filter(function(c) { return c.type === 'NonLinear' });
      var companionAdCreatives = ad.creatives.filter(function(c) { return c.type === 'CompanionAd' });

      linearCreatives.forEach(function(c) {
        var creative = creatives.element('Creative', c.attributes)
        var creativeType;
        var creativeOpts = {};

        if (c.skipoffset) creativeOpts.skipoffset = c.skipoffset;
        creativeType = creative.element(c.type, creativeOpts);
        if (c.icons.length > 0) var icons = creativeType.element('Icons');
        c.icons.forEach(function(i){
          var icon = icons.element('Icon', i.attributes);
          i.resources.forEach(function(r){
            icon.element(r.type, r.uri, (r.creativeType) ? { creativeType : r.creativeType } : {});
          });
        });
        creativeType.element('Duration').cdata(c.Duration);
        var trackingEvents = creativeType.element('TrackingEvents');
        c.trackingEvents.forEach(function(trackingEvent){
          if (track) {
            var attributes = { event : trackingEvent.event };
            if (trackingEvent.offset) attributes.offset = trackingEvent.offset;
            trackingEvents.element('Tracking', attributes).cdata(trackingEvent.url);
          } 
        });
        if (c.AdParameters) creativeType.element('AdParameters').cdata(c.AdParameters);
        var videoClicks = creativeType.element('VideoClicks');
        c.videoClicks.forEach(function(videoClick){
          videoClicks.element(videoClick.type, { id : videoClick.id }).cdata(videoClick.url);
        });
        var mediaFiles = creativeType.element('MediaFiles');
        c.mediaFiles.forEach(function(mediaFile) {
          mediaFiles.element('MediaFile', mediaFile.attributes).cdata(mediaFile.url);
        });
      });

      nonLinearCreatives.forEach(function(c){
        var nonLinearAds = creatives.element('Creative').element('NonLinearAds');
        var creativeType = nonLinearAds.element(c.type, c.attributes);
        c.resources.forEach(function(resource) { 
          var attributes = {}
          if (resource.creativeType) attributes.creativeType = resource.creativeType;
          creativeType.element(resource.type, attributes).cdata(resource.uri);
        });
        c.clicks.forEach(function(click){
          creativeType.element(click.type).cdata(click.uri);
        });
        if (c.adParameters) creativeType.element('AdParameters', { xmlEncoded : c.adParameters.xmlEncoded }).cdata(c.adParameters.data);
      });
      if (companionAdCreatives.length > 0) var companionAds = creatives.element('Creative').element('CompanionAds');
      companionAdCreatives.forEach(function(c) {
        companion = companionAds.element('Companion', c.attributes);
        c.resources.forEach(function(r) { 
          companion.element(r.type, (r.creativeType) ? { creativeType : r.creativeType } : {}).cdata(r.uri);
          if (r.adParameters) companion.element('AdParameters', { xmlEncoded : r.adParameters.xmlEncoded }).cdata(r.adParameters.data);
        });
      });
    if (ad.Extensions) {
      var extensions = inline.element('Extensions');
      [].concat(ad.Extensions).forEach(function(extension) {
        extensions.element('Extension').raw(extension);
      });
    }
  });
  return response.end(options);
};

function VAST(settings) {
  settings = settings || {};
  this.version = settings.version || '3.0';
  this.VASTErrorURI = settings.VASTErrorURI;
  this.ads = [];
  this.attachAd = function(settings) {
    var ad = new Ad(settings);
    this.ads.push(ad);
    return ad; 
  };
  this.xml = xml;
}

module.exports = VAST;
