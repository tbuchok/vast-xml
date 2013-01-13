var Creative = require('./creative');

function Ad(settings) {
  var errors = [];
  settings = settings || {};
  this.id = settings.id;
  this.sequence = settings.sequence;
  this.Wrapper = settings.Wrapper;
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
  this.creatives = [];
  this.attachLinearCreative = function(settings) {
    var creative = new Creative('Linear', settings);
    this.creatives.push(creative);
    return creative;
  };
}

module.exports = Ad;