import React from 'react';
import { Text, View } from 'react-native';

import RatingTitle from './RatingTitle';

export default ({
  style,
  title,
  subtitle,
  rating,
  color = '#ffffff',
  uid,
  onRatingPressed,
}) => (
  <View style={[style, styles.container]}>
    <Text numberOfLines={1} style={[styles.title, { color }]}>
      {title}
    </Text>
    <Text numberOfLines={3} style={[styles.subtitle, { color }]}>
      {subtitle}
    </Text>
    <RatingTitle
      title={rating}
      uid={uid}
      style={{}}
      onRatingPressed={onRatingPressed}
    />
  </View>
);

const styles = {
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    minHeight: 25,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    minHeight: 60,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
};
