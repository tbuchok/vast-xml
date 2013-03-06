VALID_TRACKING_EVENT_TYPES = [
    'creativeView'
  , 'start'
  , 'firstQuartile'
  , 'midpoint'
  , 'thirdQuartile'
  , 'complete'
  , 'mute'
  , 'unmute'
  , 'pause'
  , 'rewind'
  , 'resume'
  , 'fullscreen'
  , 'exitFullscreen'
  , 'expand'
  , 'collapse'
  , 'acceptInvitationLinear'
  , 'closeLinear'
  , 'skip'
  , 'progress'
];

function TrackingEvent(event, url) {
  if (VALID_TRACKING_EVENT_TYPES.indexOf(event) < 0) { 
    throw new Error('The supplied Tracking `event` ' + event + ' is not a valid Tracking event.\nValid tracking events: ' + VALID_TRACKING_EVENT_TYPES.join(','));
  }
  this.event = event;
  this.url = url;
}

module.exports = TrackingEvent;