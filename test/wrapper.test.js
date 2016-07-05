var test = require('tap').test
  , VAST = require('../index.js')
  , vast = new VAST()
  , ad
  , creative;

test('Validate ad settings', function(t){
  t.throws(function(){
   vast.attachAd({ 
         structure : 'wrapper'
       , AdSystem : 'Common name of the ad'
       , sequence : 23
     });
  }, 'It should throw an error if no VASTAdTagURI is set');
  t.throws(function(){
   vast.attachAd({ 
         structure : 'wrapper'
       , sequence : 23
       , Error : ''
       , VASTAdTagURI : 'http://example.com'
     });
  }, 'It should throw an error if no AdSystem is set');
  t.end();
});

ad = vast.attachAd({
    structure : 'wrapper'
  , AdSystem : 'Common name of the ad'
  , sequence : 23
  , Error: 'http://error.err'
  , VASTAdTagURI : 'http://example.com'
}).attachImpression({ id: Date.now(), url : 'http://impression.com' });

creative = ad.attachCreative('Linear', { Wrapper : true } )

module.exports = vast;
