 var fs = require('fs')
  , test = require('tap').test
  , libxmljs = require('libxmljs');

var linear = require('./linear.test.js')
  , wrapper = require('./wrapper.test.js')
  , nonLinear = require('./non-linear.test.js')
  , vastError = require('./vast-top-level-error.test.js')
  , xsd = libxmljs.parseXmlString(fs.readFileSync('./test/files/vast3_draft.xsd').toString());

test('validates linear vast XML', function(t) {
  var response = linear.xml({ pretty : true, indent: '  ', newline: '\n' });
  // TB: If desired, uncomment here and write file to disk for review:
  fs.writeFileSync('./test/files/linear.xml', response);
  xml = libxmljs.parseXmlString(response);
  var result = xml.validate(xsd);
  t.ok(result, 'It validates against the VAST .xsd');
  t.end();
});

test('validates non-linear vast xml', function(t){
  var response = nonLinear.xml({ pretty : true, indent: '  ', newline: '\n' });
  // TB: If desired, uncomment here and write file to disk for review:
  // fs.writeFileSync('./test/files/non-linear.xml', response);
  xml = libxmljs.parseXmlString(response);
  var result = xml.validate(xsd);
  t.ok(result, 'It validates against the VAST .xsd');
  t.end();
});

test('validates wrapper vast XML', function(t) {
  var response = wrapper.xml({ pretty : true, indent: '  ', newline: '\n' });
  // TB: If desired, uncomment here and write file to disk for review:
  // fs.writeFileSync('./test/files/wrapper.xml', response);
  xml = libxmljs.parseXmlString(response);
  var result = xml.validate(xsd);
  t.ok(result, 'It validates against the VAST .xsd');
  t.end();
});

test('omit tracking', function(t) {
 var response = linear.xml({ track : false });
 t.notOk(/Impression/.test(response), 'It should not include impressions');
 t.end();
});

test('validates vast with top level error tag and no ads', function(t) {
 var response = vastError.xml({ pretty : true, indent: '  ', newline: '\n' });
 // If desired, uncomment here and write file to disk for review:
 // fs.writeFileSync('./test/files/empty-error.xml', response);
 xml = libxmljs.parseXmlString(response);
 
 var error = xml.get('/VAST/Error'),
     ad = xml.get('/VAST/Ad');

 t.ok(error, 'It has Error element');
 t.notOk(ad, 'It has not Ad element');
 
 // official vast 3.0 XSD does incorrectly does not validate a top-level error
 // implementation can be found at: http://www.iab.net/media/file/VASTv3.0.pdf section 2.4.2.4

 // var result = xml.validate(xsd); // => this is `notOk`
 // t.notOk(result, 'It does not validate against the VAST .xsd (inconsistency between .xsd and documentation)');
 
 t.end();
})
