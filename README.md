# vast-xml

![Travis build status](https://api.travis-ci.org/tbuchok/vast-xml.png)

```
npm install vast-xml
```

## Create a VAST object:

```javascript
var vast = require('vast');

var vast = new VAST();
var ad = vast.attachAd({ 
      id : 1
    , structure : 'inline'
    , sequence : 99
    , AdTitle : 'Common name of the ad'
    , AdSystem : { name: 'Test Ad Server', version : '1.0' }
  });
```

## Attach Impression tracking URLs

```javascript
ad.attachImpression({
      id: 23
    , url: "http://impression.com"
  });
ad.attachImpression({
      id: "sample-server"
    , url: "http://sample-impression.com"
  });
```

## Attach creatives

```javascript
var creative = ad.attachLinearCreative({
    AdParameters : '<xml></xml>'
  , Duration : '00:00:30'
});
creative.attachMediaFile({
    url: 'http://domain.com/file.ext'
  , type: "video/mp4'
  , bitrate: "320"
  , minBitrate: "320"
  , maxBitrate: "320"
  , width: "640"
  , height: "360"
  , scalable: "true"
  , maintainAspectRatio: "true"
  , codec: ""
  , apiFramework: ""
  });
creative.attachTrackingEvent('creativeView', 'http://creativeview.com');
creative.attachVideoClick('ClickThrough', 'http://click-through.com');
```

## Attach companion ads

```javascript
companionAd = creative.attachCompanionAd('StaticResource', {
    width : 300
  , height : 250
  , type : 'image/jpeg'
  , url : 'http://companionad.com/image.jpg'
});
companionAd.attachTrackingEvent('creativeView', 'http://companionad.com/creativeView');
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

## Validating

`npm test` validates the test builds. The validation is done against the VAST .xsd file, [made available by the IAB](http://www.iab.net/vast).

Currently included in the test suite are: 

1. linear ad with a companion ad
1. wrapper ad
1. _More pending..._

The VAST spec is, well vast, and contains a lot of different corner cases. 

**Pull requests, feedback and collaboration in fully rounding-out this module is more than welcome.**

## Misc

`xmllint` is a good tool for validating XML. As a helper, this repo contains the VAST .xsd and to validate a VAST file, follow:

```bash
$ xmllint --noout --schema ./test/files/vast3_draft.xsd /path/to/the/vast.xml
```
