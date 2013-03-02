var Creative = require('./creative');

var validateInLineSettings = function(settings) {
  var REQUIRED = [ 'AdSystem', 'AdTitle' ],
      EITHER = ['Error', 'Impression'];

  var keys = Object.keys(settings);

  REQUIRED.forEach(function(r) {
    if (keys.indexOf(r) < 0) throw new Error('Missing required settings: ' + r)
  });

  var either = EITHER.filter(function(e) { return keys.indexOf(e) > -1  });
  if (either.length < 1) throw new Error('Missing at least one of settings: ' + EITHER.join(' or '));
}

var validateWrapperSettings = function(settings) {
  var REQUIRED = [ 'AdSystem', 'VASTAdTagURI' ],
      EITHER = ['Error', 'Impression'];

  var keys = Object.keys(settings);

  REQUIRED.forEach(function(r) {
    if (keys.indexOf(r) < 0) throw new Error('Missing required settings: ' + r)
  });

  var either = EITHER.filter(function(e) { return keys.indexOf(e) > -1  });
  if (either.length < 1) throw new Error('Missing at least one of settings: ' + EITHER.join(' or '));

}

function Ad(settings) {
  var errors = [];
  settings = settings || {};
  if (settings.structure.toLowerCase() === 'wrapper') {
    validateWrapperSettings(settings);
    this.VASTAdTagURI = settings.VASTAdTagURI;
  } else {
    validateInLineSettings(settings);
  }
  this.id = settings.id;
  this.sequence = settings.sequence;
  this.structure = settings.structure;
  this.AdSystem = settings.AdSystem;
  this.AdTitle = settings.AdTitle;
  // Optional elements:
  this.Error = settings.Error;
  this.Description = settings.Description;
  this.Advertiser = settings.Advertiser;
  this.Survey = settings.Survey;
  this.Pricing = settings.Pricing;
  this.Extensions = settings.Extensions;
  this.impressions = [];
  this.addImpression = function(id, url) {
    this.impressions.push({ id : id, url : url });
  };
  var impression = (typeof settings.Impression === 'string') ? { id : Date.now(), url : settings.Impression } : settings.Impression;
  this.impressions.push(impression);
  this.creatives = [];
  this.attachLinearCreative = function(settings) {
    var creative = new Creative('Linear', settings);
    this.creatives.push(creative);
    return creative;
  };
}

module.exports = Ad;