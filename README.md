# vast-xml

![Travis build status](https://api.travis-ci.org/tbuchok/vast-xml.png)

```
npm install vast-xml
```

## Create a VAST object:

```javascript
var VAST = require('vast-xml');

var vast = new VAST();
var ad = vast.attachAd({ 
      id : 1
    , structure : 'inline'
    , sequence : 99
    , Error: 'http://error.err'
    , AdTitle : 'Common name of the ad'
    , AdSystem : { name: 'Test Ad Server', version : '1.0' }
  });
```

## Attach Impression tracking URLs

```javascript
ad.attachImpression({
      id: "23"
    , url: "http://impression.com"
  });
ad.attachImpression({
      id: "sample-server"
    , url: "http://sample-impression.com"
  });
```

## Attach Linear creatives

```javascript
var creative = ad.attachCreative('Linear', {
    AdParameters : '<xml></xml>'
  , Duration : '00:00:30'
});
creative.attachMediaFile('http://domain.com/file.ext', {
    type: "video/mp4"
  , bitrate: "320"
  , minBitrate: "320"
  , maxBitrate: "320"
  , width: "640"
  , height: "360"
  , scalable: "true"
  , maintainAspectRatio: "true"
  , codec: ""
  , apiFramework: "VPAID"
});
creative.attachTrackingEvent('creativeView', 'http://creativeview.com');
creative.attachVideoClick('ClickThrough', 'http://click-through.com');
```

### Skippable Linear Creatives

Create _skippable linear creative_ by adding a `skipoffset` attribute when attaching creative. Attach `skip` and/or `progress` tracking events. See below:

```javascript
var creative = ad.attachCreative('Linear', {
    AdParameters : '<xml></xml>'
  , skipoffset: '00:00:05'
  , Duration : '00:00:30'
});
// ...
creative.attachTrackingEvent('skip', 'http://skipevent.com');
creative.attachTrackingEvent('progress', 'http://zing-zang.com', '00:00:15.000');
```

### Attach Icons to Linear creatives

```javascript
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
icon.attachResource('StaticResource', 'http://domain.com/file.gif', 'image/gif');
icon.attachClick('IconClickThrough', 'http://icon-click-through.com');
icon.attachTrackingEvent('IconViewTracking', 'http://icon-view-tracking.com');
```

## Attach Non-Linear creatives

```javascript
var creative = ad.attachCreative('NonLinear', {
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
```

## Attach Companion Ad creatives

```javascript
var creative = ad.attachCreative('CompanionAd', { 
    width : 300
  , height : 250
  , type : 'image/jpeg'
  , url : 'http://companionad.com/image.jpg' 
});
creative.attachTrackingEvent('creativeView', 'http://companionad.com/creativeView');
```

## Generate XML

```javascript
vast.xml({ pretty : true, indent : '  ', newline : '\n' });
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0">
  <Ad id="1" sequence="99">
    <InLine>
      <AdSystem version="1.0">Test Ad Server</AdSystem>
      <AdTitle>Common name of the ad</AdTitle>
      <Description/>
      <Survey/>
      <Error><![CDATA[http://error.err]]></Error>
      <Impression id="23">http://impression.com</Impression>
      <Impression id="sample-server">http://sample-impression.com</Impression>
      <Creatives>
        <Creative>
          <Linear>
            <Duration>00:00:00</Duration>
            <TrackingEvents>
              <Tracking event="creativeView">http://creativeview.com</Tracking>
            </TrackingEvents>
            <VideoClicks>
              <ClickThrough id="">http://click-through.com</ClickThrough>
            </VideoClicks>
            <MediaFiles>
              <MediaFile id="" delivery="progressive" type="video/mp4" bitrate="320" minBitrate="320" maxBitrate="320" width="640" height="360" scalable="true" maintainAspectRatio="true" codec="" apiFramework="">http://domain.com/file.ext</MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
        <Creative>
          <CompanionAds>
            <Companion width="300" height="250">
              <StaticResource creativeType="image/jpeg">http://companionad.com/image.jpg</StaticResource>
              <TrackingEvents>
                <Tracking event="creativeView">http://companionad.com/creativeView</Tracking>
              </TrackingEvents>
            </Companion>
          </CompanionAds>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>
```

## VAST with no ads

```javascript
var VAST = require('vast-xml');

var vast = new VAST({VASTErrorURI: 'http://adserver.com/noad.gif'});
vast.xml({ pretty : true, indent : '  ', newline : '\n' });
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0">
  <Error>
    <![CDATA[http://adserver.com/noad.gif]>
  </Error>
</VAST>
```

## Validating

`npm test` validates the test builds. The validation is done against the VAST .xsd file, [made available by the IAB](http://www.iab.net/vast).

Currently included in the test suite are: 

1. linear ad 
  * with companion
  * with icon
1. non-linear ad
  * with companion
1. wrapper ad

The VAST spec is, well vast, and contains a lot of different corner cases. 

**Pull requests, feedback and collaboration in fully rounding-out this module is more than welcome.**

## Misc

`xmllint` is a good tool for validating XML. As a helper, this repo contains the VAST .xsd and to validate a VAST file, follow:

```bash
$ xmllint --noout --schema ./test/files/vast3_draft.xsd /path/to/the/vast.xml
```
