# vast-xml
A Node module for creating real-time VAST XML responses.

Installation
---
_Pending._
```
npm install vast-xml
```

Create a VAST object:
---
```javascript
var vast = require('vast');

var vast = new VAST();
var ad = vast.attachAd({ 
    id : 1
  , sequence : 99
  , AdTitle : 'Common name of the ad'
  , AdSystem : { name: 'Test Ad Server', version : '1.0' }
});
```

Attach Creatives
---
```javascript
var creative = ad.attachLinearCreative({
    AdParameters : '<xml></xml>'
  , Duration : '00:00:30'
});
creative.attachMediaFile('http://domain.com/file.ext');
creative.attachTrackingEvent('creativeView', 'http://creativeview.com');
creative.attachVideoClick('ClickThrough', 'http://click-through.com');
```

Attach Companion Ads
---
```javascript
companionAd = creative.attachCompanionAd('StaticResource', {
    width : 300
  , height : 250
  , type : 'image/jpeg'
  , url : 'http://companionad.com/image.jpg'
});
companionAd.attachTrackingEvent('creativeView', 'http://companionad.com/creativeView');
```

Generate the XML response
---
```javascript
vast.xml({ pretty : true, indent : '  ', newline : '\n' });
/*
<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0">
  <Ad id="1" sequence="99">
    <InLine>
      <AdSystem version="1.0">Test Ad Server</AdSystem>
      <AdTitle>Common name of the ad</AdTitle>
      <Description/>
      <Survey/>
      <Impression id="sample-server">http://impression.com</Impression>
      <Creatives>
        <Creative>
          <TrackingEvents>
            <TrackingEvent type="creativeView">http://creativeview.com</TrackingEvent>
          </TrackingEvents>
          <VideoClicks>
            <ClickThrough id="">http://click-through.com</ClickThrough>
          </VideoClicks>
          <MediaFiles>
            <MediaFile id="" delivery="progressive" type="video/mp4" bitrate="320" minBitrate="" maxBitrate="" width="640" height="360" scalable="true" maintainAspectRatio="true" codec="" apiFramework="">http://domain.com/file.ext</MediaFile>
          </MediaFiles>
          <CompanionAds>
            <CompanionAd width="300" height="250">
              <StaticResource type="image/jpeg">http://companionad.com/image.jpg</StaticResource>
              <TrackingEvents>
                <TrackingEvent type="creativeView">http://companionad.com/creativeView</TrackingEvent>
              </TrackingEvents>
            </CompanionAd>
          </CompanionAds>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>
*/
```