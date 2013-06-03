var test = require('tap').test
  , VAST = require('../index.js')
  , vast = new VAST();

var ad = vast.attachAd({ id : 0, structure : 'inline', sequence : 1, AdTitle : 'Common name of the ad', AdSystem : { name : 'Foo', version : '1.0'} })
  .attachImpression({ id : 1, url : 'http://impression.com' });

var nonLinear = ad.attachCreative('NonLinear', {
    id : 99
  , width : 90
  , height: 10
  , expandedWidth : 90
  , expandedHeight : 45
  , scalable : false
  , maintainAspectRatio : false
  , minSuggestedDuration : '00:00:00'
  , apiFramework : 'VPAID'
});

test('Create non-linear creative', function(t) {
  t.equal(nonLinear.attributes.id, 99, 'It should set id of consistent with the creation of the object');
  t.equal(nonLinear.attributes.width, 90, 'It should set width of consistent with the creation of the object');
  t.equal(nonLinear.attributes.height,10, 'It should set height of consistent with the creation of the object');
  t.equal(nonLinear.attributes.expandedWidth, 90, 'It should set expandedWidth of consistent with the creation of the object');
  t.equal(nonLinear.attributes.expandedHeight, 45, 'It should set expandedHeight of consistent with the creation of the object');
  t.equal(nonLinear.attributes.scalable, false, 'It should set scalable with the creation of the object');
  t.equal(nonLinear.attributes.maintainAspectRatio, false, 'It should set maintainAspectRatio with the creation of the object');
  t.equal(nonLinear.attributes.minSuggestedDuration, '00:00:00', 'It should set minSuggestedDuration with the creation of the object');
  t.equal(nonLinear.attributes.apiFramework, 'VPAID', 'It should set apiFramework of consistent with the creation of the object');

  t.end();
});

test('Attach resource to Non-Linear creative', function(t){
  nonLinear.attachResource('StaticResource', 'http://example.com/file.png', 'image/png');
  t.equal(nonLinear.resources.length, 1, 'It should add resources');
  t.equal(nonLinear.resources[0].type, 'StaticResource', 'It should store the type');
  t.equal(nonLinear.resources[0].uri, 'http://example.com/file.png', 'It should store the uri');
  t.equal(nonLinear.resources[0].creativeType, 'image/png', 'It should store the creativeType');
  t.end();
});

test('Attach non linear click throughs, click trackin and ad parameters', function(t) {
  nonLinear.attachClick('http://click-through.com');
  t.equal(nonLinear.clicks[0].uri, 'http://click-through.com', 'It should set a click-through');
  nonLinear.attachClick({ uri : 'http://click-tracking.com', type : 'NonLinearClickTracking' });
  t.equal(nonLinear.clicks.length, 1, 'It should create add all tracking click throughs and override the original');
  nonLinear.attachClick('http://click-through-override.com');
  t.equal(nonLinear.clicks[0].uri, 'http://click-through-override.com', 'It should override set a click-through with only one');
  nonLinear.adParameters('<xml>data</xml>', true);
  t.equal(nonLinear.adParameters.data, '<xml>data</xml>', 'It should set Ad Parameters');
  t.equal(nonLinear.adParameters.xmlEncoded, true, 'It should set Ad Parameters@xmlEncoded');
  t.end();
});

module.exports = vast;
