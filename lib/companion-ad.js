var TrackingEvent = require('./tracking-event');

function CompanionAd(resource, settings) {
  settings = settings || {};
  this.resource = resource;
  this.type = settings.type;
  this.url = settings.url;
  this.AdParameters = settings.AdParameters;
  this.AltText = settings.AltText;
  this.CompanionClickThrough = settings.CompanionClickThrough;
  this.CompanionClickTracking = settings.CompanionClickTracking;
  this.width = settings.width;
  this.height = settings.height;

  this.trackingEvents = [];
  this.attachTrackingEvent = function(type, url) {
    this.trackingEvents.push(new TrackingEvent(type, url));
  };
}

module.exports = CompanionAd;