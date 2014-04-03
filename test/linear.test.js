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
  , Error: 'http://error.err'
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

test('vast 2.0 specific settings', function(t){
  var vast20 = new VAST({ version : '2.0' });
  var ad = vast20.attachAd({ 
      id : 1
    , structure : 'inline'
    , AdTitle : 'Common name of the ad'
    , AdSystem : { name: 'Test Ad Server', version : '1.0' }
  }).attachImpression({ id : 23, url : 'http://impression.com' });
  t.equal(vast20.version, '2.0', 'It should use version 2.0 if set');
  t.notOk(ad.sequence, 'It does not have a sequence');
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

var creative = ad.attachCreative('Linear', {
    id: 99
  , AdParameters : '<xml></xml>'
  , Duration : '00:00:30'
})
.attachMediaFile('http://domain.com/file.ext', { id: Date.now() })
.attachTrackingEvent('creativeView', 'http://creativeview.com')
.attachVideoClick('ClickThrough', 'http://click-through.com');

test('attach creatives and events', function(t){
  t.ok(ad.creatives, 'It should have a `creatives` array');

  t.ok(creative, 'It should return creative when attaching a Linear creative');
  t.ok(creative.attributes.id === 99, 'it should set creative@id attrs');
  t.ok(/id=\"99\"/.test(vast.xml()), 'it renders creative id');
  t.equal(creative.Duration, '00:00:30', 'It should set a duration');
  t.throws(function(){ ad.attachLinearCreative() }, 'It should throw an error if no Duration is used');
  t.equal(creative.mediaFiles[0].url, 'http://domain.com/file.ext', 'It should set a media file URL');
  t.equal(creative.trackingEvents[0].url, 'http://creativeview.com', 'It should define tracking event URLs');
  t.equal(creative.trackingEvents[0].event, 'creativeView', 'It should define tracking event types');
  t.throws(function(){ creative.attachTrackingEvent('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect TrackingEvent `type` is used');  
  t.equal(creative.videoClicks[0].url, 'http://click-through.com', 'It should define video click URLs');
  t.equal(creative.videoClicks[0].type, 'ClickThrough', 'It should define video click types');
  t.throws(function(){ creative.attachVideoClick('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect VideoClick `type` is used');  
  ad.attachCreative('CompanionAd', { width : 300, height : 250 })
    .attachResource('StaticResource', 'http://companionad.com/image.jpg', 'image/jpeg')
    .attachTrackingEvent('creativeView', 'http://companionad.com/creativeView');
  t.end();
});

test('validate mediafile settings', function(t) {
  var vastMediaFileTest = new VAST({ version : '2.0' });
  var ad = vastMediaFileTest.attachAd({
      id : 1
    , structure : 'inline'
    , AdTitle : 'Common name of the ad'
    , AdSystem : { name: 'Test Ad Server', version : '1.0' }
    }).attachImpression({ id : 23, url : 'http://impression.com' });
  t.throws(function() {
    ad.attachCreative('Linear', {
         AdParameters : '<xml></xml>'
       , Duration : '00:00:30'
     }).attachMediaFile('http://domain.com/file.ext', {})
  }, 'it should throw an error if no id is set');
  ad.attachCreative('Linear', {
       AdParameters : '<xml></xml>'
     , Duration : '00:00:30'
   }).attachMediaFile('http://domain.com/file.ext', { id: Date.now(), scalable: false })
  t.ok(ad.creatives[1].mediaFiles[0].attributes.scalable === false, 'it should set false on scalabe');
  t.ok(/scalable=\"false\"/.test(vastMediaFileTest.xml()), 'it properly casts `false` to string');
  t.end();
});

test('attach icons and icon stuff', function(t){
  t.ok(creative.attachIcon, 'it should have an attach icon method');
  t.ok(creative.icons, 'it should have an icons array');
  var icon = creative.attachIcon({ 
      program : 'foo'
    , height : 250
    , width : 300
    , xPosition : 'left'
    , yPosition : 'top'
    , apiFramework : 'VPAID'
    , offset : '01:05:09'
    , duration : '00:00:00'
  });
  t.equals(creative.icons[0].attributes.program, 'foo', 'It should set the appropriate program attributes');
  t.equals(creative.icons[0].attributes.height, 250, 'It should set the appropriate height attributes');
  t.equals(creative.icons[0].attributes.width, 300, 'It should set the appropriate width attributes');
  t.equals(creative.icons[0].attributes.xPosition, 'left', 'It should set the appropriate xPosition attributes');
  t.equals(creative.icons[0].attributes.yPosition, 'top', 'It should set the appropriate yPosition attributes');
  t.equals(creative.icons[0].attributes.apiFramework, 'VPAID', 'It should set the appropriate apiFramework attributes');
  t.equals(creative.icons[0].attributes.offset, '01:05:09', 'It should set the appropriate offset attributes');
  t.equals(creative.icons[0].attributes.duration, '00:00:00', 'It should set the appropriate duration attributes');

  icon.attachResource('StaticResource', 'http://domain.com/file.gif', 'image/gif');
  // add another resource and watch validation fail!
  t.equal(icon.resources[0].type, 'StaticResource', 'It should set a resource');
  icon.attachClick('IconClickThrough', 'http://icon-click-through.com');
  t.equal(icon.clicks[0].uri, 'http://icon-click-through.com', 'It should set icon clicks');
  icon.attachTrackingEvent('IconViewTracking', 'http://icon-view-tracking.com');
  t.equal(icon.trackingEvents[0].uri, 'http://icon-view-tracking.com', 'It should set icon clicks');

  t.end();
});

module.exports = vast;