import React from 'react';
import { View } from 'react-native';

export default ({ style }) => (
  <View
    style={[
      {
        position: 'absolute',
        top: 0,
        right: 0,
        overflow: 'hidden',
        width: 16,
        aspectRatio: 1,
        backgroundColor: '#703af7',
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 16 / 2,
      },
      style,
    ]}
  />
);
