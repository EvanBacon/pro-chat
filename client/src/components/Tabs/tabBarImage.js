import * as React from 'react';
import { Image } from 'react-native';

const tabBarImage = ({ active, inactive }) => ({ tintColor, focused }) => (
  <Image
    style={{
      backgroundColor: 'transparent',
      tintColor,
      resizeMode: 'contain',
      aspectRatio: 1,
      width: 24,
      height: 24,
    }}
    source={focused ? active : inactive}
  />
);

export default tabBarImage;
