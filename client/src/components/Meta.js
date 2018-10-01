import React from 'react';
import { Text, View } from 'react-native';

import RatingTitle from './RatingTitle';

export default ({
  style, title, subtitle, rating, color = '#ffffff', uid, onRatingPressed,
}) => (
  <View
    style={[
      style,
      {
        alignItems: 'center',
        padding: 20,
      },
    ]}
  >
    <Text
      numberOfLines={1}
      style={{
        fontSize: 22,
        minHeight: 25,
        backgroundColor: 'transparent',
        textAlign: 'center',
        color,
      }}
    >
      {title}
    </Text>
    <Text
      numberOfLines={3}
      style={{
        fontSize: 14,
        minHeight: 60,
        backgroundColor: 'transparent',
        textAlign: 'center',
        color,
      }}
    >
      {subtitle}
    </Text>
    <RatingTitle title={rating} uid={uid} style={{}} onRatingPressed={onRatingPressed} />
  </View>
);
