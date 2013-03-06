var Creative = require('./creative');

var validateInLineSettings = function(settings) {
  var REQUIRED = [ 'AdSystem', 'AdTitle' ];

  var keys = Object.keys(settings);

  REQUIRED.forEach(function(r) {
    if (keys.indexOf(r) < 0) throw new Error('Missing required settings: ' + r)
  });

}

var validateWrapperSettings = function(settings) {
  var REQUIRED = [ 'AdSystem', 'VASTAdTagURI' ];

  var keys = Object.keys(settings);

  REQUIRED.forEach(function(r) {
    if (keys.indexOf(r) < 0) throw new Error('Missing required settings: ' + r)
  });

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
  this.surveys = [];
  this.attachSurvey = function(settings) {
    var survey = { url : settings.url }
    if (settings.type) survey.type = settings.type
    this.surveys.push(survey);
  }
  this.Pricing = settings.Pricing;
  this.Extensions = settings.Extensions;
  this.impressions = [];
  this.attachImpression = function(settings) {
    this.impressions.push(settings);
    return this;
  };
  this.creatives = [];
  this.attachLinearCreative = function(settings) {
    var creative = new Creative('Linear', settings);
    this.creatives.push(creative);
    return creative;
  };
}

module.exports = Ad;