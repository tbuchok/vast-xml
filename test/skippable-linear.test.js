var test = require('tap').test
  , VAST = require('../index.js')
  , vast = new VAST();

test('skippable linear ad with skipoffset and progress event with offset', function(t) {
  var ad = vast.attachAd({ 
      id : 1
    , structure : 'inline'
    , sequence : 99
    , AdTitle : 'Common name of the ad'
    , Error: 'http://error.err'
    , AdSystem : { name: 'Test Ad Server', version : '1.0' }
  }).attachImpression({ id : 23, url : 'http://impression.com' });

  var skippableLinearCreative = ad.attachCreative('Linear', {
      id: 99
    , skipoffset: '00:00:05'
    , AdParameters : '<xml></xml>'
    , Duration : '00:00:30'
  })
  .attachTrackingEvent('skip', 'http://skipevent.com')
  .attachTrackingEvent('progress', 'http://zing-zang.com', '00:00:30.000')
  .attachMediaFile('http://domain.com/file.ext', { id: Date.now() })

  t.ok(ad.creatives, 'It should have a `creatives` array');
  t.ok(skippableLinearCreative, 'It should return creative when attaching a Linear creative');
  
  t.throws(function(){ skippableLinearCreative.attachTrackingEvent('progress', 'http://zing-zang.com') }, 'It should throw an error if offset for TrackingEvent of type `progress` is not provided.');  
  
  t.end();
});

module.exports = vast;
