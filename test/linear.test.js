var test = require('tap').test
  , VAST = require('../index.js')
  , vast = new VAST();

test('Validate ad settings', function(t){
  t.throws(function(){
   vast.attachAd({ 
         structure : 'inline'
       , AdSystem : 'Common name of the ad'
     });
  }, 'It should throw an error if no AdTitle is set');
  t.throws(function(){
   vast.attachAd({ 
         structure : 'inline'
       , AdTitle : 'the title'
       , Error : ''
     });
  }, 'It should throw an error if no AdSystem is set');
  t.end();
});

var ad = vast.attachAd({ 
    id : 1
  , structure : 'inline'
  , sequence : 99
  , AdTitle : 'Common name of the ad'
  , AdSystem : { name: 'Test Ad Server', version : '1.0' }
}).attachImpression({ id : 23, url : 'http://impression.com' });

test('`VAST` object', function(t){
  t.ok(vast, 'It should construct VAST responses');
  t.equal(vast.version, '3.0', 'It should default to VAST 3.0');
  t.ok(vast.attachAd, 'It should define a method to attach ads');
  t.equal(vast.ads.length, 1, 'It should attach Ad objects to the VAST object after calling #attachAd');
  t.ok(ad, 'It should return an ad object when attaching');
  t.end();
});

test('object settings', function(t) {
  t.equal(ad.id, 1, 'It should allow for setting `id` attributes on Ad objects');
  t.equal(ad.sequence, 99, 'It should allow for setting `sequence` attributes on Ad objects');
  t.equal(ad.Wrapper, undefined, 'It should not define a wrapper in a default VAST response');
  t.equal(ad.AdSystem.name, 'Test Ad Server', 'It should set `AdSystem`');
  t.equal(ad.AdTitle, 'Common name of the ad', 'It should set `AdTitle`');
  t.end();
});

test('attach impression', function(t){
  ad.attachImpression({ id: 'sample-server', url : 'http://sample-impression.com' });
  t.equal(ad.impressions[ad.impressions.length - 1].url, 'http://sample-impression.com', 'It should set `Impression`');
  t.end();
});

test('attach survey', function(t){
  t.ok(ad.attachSurvey, 'It defines #attachSurvey');
  ad.attachSurvey({ url : 'http://survey.com' });
  t.equal(ad.surveys[0].url, 'http://survey.com', 'It should set surveys');
  t.end();
});

test('attach creatives and events', function(t){
  t.ok(ad.creatives, 'It should have a `creatives` array');

  var creative = ad.attachLinearCreative({
      AdParameters : '<xml></xml>'
    , Duration : '00:00:30'
  })
  .attachMediaFile({ url : 'http://domain.com/file.ext' })
  .attachTrackingEvent('creativeView', 'http://creativeview.com')
  .attachVideoClick('ClickThrough', 'http://click-through.com');

  t.ok(creative, 'It should return creative when attaching a Linear creative');
  t.equal(creative.Duration, '00:00:30', 'It should set a duration');
  t.throws(function(){ ad.attachLinearCreative() }, 'It should throw an error if no Duration is used');
  t.equal(creative.mediaFiles[0].url, 'http://domain.com/file.ext', 'It should set a media file URL');
  t.equal(creative.trackingEvents[0].url, 'http://creativeview.com', 'It should define tracking event URLs');
  t.equal(creative.trackingEvents[0].event, 'creativeView', 'It should define tracking event types');
  t.throws(function(){ creative.attachTrackingEvent('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect TrackingEvent `type` is used');  
  t.equal(creative.videoClicks[0].url, 'http://click-through.com', 'It should define video click URLs');
  t.equal(creative.videoClicks[0].type, 'ClickThrough', 'It should define video click types');
  t.throws(function(){ creative.attachVideoClick('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect VideoClick `type` is used');  
  creative.attachCompanionAd('StaticResource', {
      width : 300
    , height : 250
    , type : 'image/jpeg'
    , url : 'http://companionad.com/image.jpg'
  }).attachTrackingEvent('creativeView', 'http://companionad.com/creativeView');
  t.end();
});

module.exports = vast;