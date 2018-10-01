import React, { Component } from 'react';
import { View } from 'react-native';

import Button from './Button';
import firebase from 'firebase';
import { getLocation } from '../provider/GeoFireProvider';
import { fromCamera, fromLibrary } from '../utils/SelectImage';

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
          onPress={async (_) => {
            const image = await fromLibrary();
            if (image) {
              onSend([{ image }]);
              firebase.analytics().logEvent('sent_library_picture', { url: image, channel });
            }
          }}
        />
        <Button.Camera
          style={{}}
          onPress={async (_) => {
            const image = await fromCamera();
            if (image) {
              onSend([{ image }]);
              firebase.analytics().logEvent('sent_camera_picture', { url: image, channel });
            }
          }}
        />
        <Button.ShareLocation
          onPress={async (_) => {
            const location = await getLocation();
            if (location) {
              onSend([{ location }]);
              firebase.analytics().logEvent('shared_location', { location, channel });
            }
          }}
        />
        <Button.Gif
          selected={gifActive}
          style={{ opacity: gifDisabled ? 0.5 : 1 }}
          disabled={gifDisabled}
          onPress={async (_) => {
            onGif && onGif(!this.props.gifActive);
          }}
        />
      </View>
    );
  }
}
