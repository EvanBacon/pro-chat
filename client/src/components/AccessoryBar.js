import firebase from '../universal/firebase';
import React, { Component } from 'react';
import { View } from 'react-native';

import getLocation from '../utils/getLocation';
import { fromCamera, fromLibrary } from '../utils/SelectImage';
import Button from './Button';

if (!firebase.analytics) {
  firebase.analytics = function () {
    this.logEvent = () => {};
  };
} else if (!firebase.analytics.logEvent) {
  firebase.analytics.logEvent = function () {};
}
export default class AccessoryBar extends Component {
  state = {
    showGif: false,
  };
  render() {
    const {
      onSend, channel, onGif, text, gifActive,
    } = this.props;
    const gifDisabled = !(text && text.length > 0);
    return (
      <View
        style={{
          height: 44,
          width: '100%',
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Button.Gallery
          onPress={async () => {
            const image = await fromLibrary();
            if (image) {
              onSend([{ image }]);
              if (firebase.analytics) {
firebase
                  .analytics()
                  .logEvent('sent_library_picture', { url: image, channel });
}
            }
          }}
        />
        <Button.Camera
          style={{}}
          onPress={async () => {
            const image = await fromCamera();
            if (image) {
              onSend([{ image }]);
              if (firebase.analytics) {
firebase
                  .analytics()
                  .logEvent('sent_camera_picture', { url: image, channel });
}
            }
          }}
        />
        <Button.ShareLocation
          onPress={async () => {
            const location = await getLocation();
            if (location) {
              onSend([{ location }]);
              if (firebase.analytics) {
firebase
                  .analytics()
                  .logEvent('shared_location', { location, channel });
}
            }
          }}
        />
        <Button.Gif
          selected={gifActive}
          style={{ opacity: gifDisabled ? 0.5 : 1 }}
          disabled={gifDisabled}
          onPress={async () => {
            if (onGif) onGif(!this.props.gifActive);
          }}
        />
      </View>
    );
  }
}
