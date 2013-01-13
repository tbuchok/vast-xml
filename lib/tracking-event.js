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

function TrackingEvent(type, url) {
  if (VALID_TRACKING_EVENT_TYPES.indexOf(type) < 0) { 
    throw new Error('The supplied Tracking `type` is not a valid VAST TrackingEvent type.');
  }
  this.type = type;
  this.url = url;
}

module.exports = TrackingEvent;