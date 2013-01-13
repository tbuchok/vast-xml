var assert = require('assert')
  , VAST = require('../index.js');

var vast = new VAST();
var ad = vast.attachAd({ 
    id : 1
  , sequence : 99
  , AdTitle : 'Common name of the ad'
  , AdSystem : { name: 'Test Ad Server', version : '1.0' }
});

(function() {
  assert.ok(vast, 'It should construct VAST responses');
  assert.equal(vast.version, '3.0', 'It should default to VAST 3.0');
  assert.ok(vast.attachAd, 'It should define a method to attach ads');
  assert.equal(vast.ads.length, 1, 'It should attach Ad objects to the VAST object after calling #attachAd');
  assert.ok(ad, 'It should return an ad object when attaching');
}());

(function() {
  assert.equal(ad.id, 1, 'It should allow for setting `id` attributes on Ad objects');
  assert.equal(ad.sequence, 99, 'It should allow for setting `sequence` attributes on Ad objects');
  assert.equal(ad.Wrapper, undefined, 'It should not define a wrapper in a default VAST response');
  assert.equal(ad.AdSystem.name, 'Test Ad Server', 'It should set `AdSystem`');
  assert.equal(ad.AdTitle, 'Common name of the ad', 'It should set `AdTitle`');
  ad.addImpression('sample-server', 'http://impression.com');
  assert.equal(ad.impressions[0].url, 'http://impression.com', 'It should set `Impression`');
  assert.ok(ad.creatives, 'It should have a `creatives` array');
}());

(function(){
  var creative = ad.attachLinearCreative({
      AdParameters : '<xml></xml>'
    , Duration : '00:00:30'
  });
  assert.ok(creative, 'It should return creative when attaching a Linear creative');
  assert.equal(creative.Duration, '00:00:30', 'It should set a duration');
  assert.throws(function(){ ad.attachLinearCreative() }, 'It should throw an error if no Duration is used');
  creative.attachMediaFile('http://domain.com/file.ext');
  assert.equal(creative.mediaFiles[0].url, 'http://domain.com/file.ext', 'It should set a media file URL');
  creative.attachTrackingEvent('creativeView', 'http://creativeview.com');
  assert.equal(creative.trackingEvents[0].url, 'http://creativeview.com', 'It should define tracking event URLs');
  assert.equal(creative.trackingEvents[0].type, 'creativeView', 'It should define tracking event types');
  assert.throws(function(){ creative.attachTrackingEvent('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect TrackingEvent `type` is used');  
  creative.attachVideoClick('ClickThrough', 'http://click-through.com');
  assert.equal(creative.videoClicks[0].url, 'http://click-through.com', 'It should define video click URLs');
  assert.equal(creative.videoClicks[0].type, 'ClickThrough', 'It should define video click types');
  assert.throws(function(){ creative.attachVideoClick('zingZang', 'http://zing-zang.com') }, 'It should throw an error if an incorrect VideoClick `type` is used');  
  companionAd = creative.attachCompanionAd('StaticResource', {
      width : 300
    , height : 250
    , type : 'image/jpeg'
    , url : 'http://companionad.com/image.jpg'
  });
  companionAd.attachTrackingEvent('creativeView', 'http://companionad.com/creativeView');
}());

(function(){
  response = vast.xml({ pretty : true, indent : '  ', newline : '\n' });
  assert.ok(/VAST/.test(response), 'It should have VAST in the response');
  assert.ok(/\<Ad id="/.test(response), 'It should have <Ad ...  in the response');
  assert.ok(/\<AdSystem/.test(response), 'It should have <AdSystem ... in the response');
  assert.ok(/\<AdTitle/.test(response), 'It should have <AdTitle ... in the response');
  assert.ok(/\<Impression/.test(response), 'It should have <Impression ... in the response');
  assert.ok(/\<Creative/.test(response), 'It should have <Creative ... in the response');
  assert.ok(/\<MediaFile/.test(response), 'It should have <MediaFile ... in the response');
  console.log(response);
})

(function(){
  // Build wrapper responses!
  // var wrapperAd = vast.attachAd({ Wrapper : 'http://www.example.com/' });
  // assert.equal(wrapperAd.Wrapper, 'http://www.example.com/', 'It should define a wrapper URL if set');
}());