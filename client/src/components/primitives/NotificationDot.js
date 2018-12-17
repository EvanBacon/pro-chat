import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const Settings = {
  notificationDotRadius: 8,
};
export default class NotificationDot extends React.PureComponent {
  render() {
    const { style } = this.props;
    return <View style={[styles.container, style]} />;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    overflow: 'hidden',
    width: Settings.notificationDotRadius * 2,
    height: Settings.notificationDotRadius * 2,
    aspectRatio: 1,
    backgroundColor: Colors.tintColor,
    borderColor: Colors.white,
    borderWidth: 3,
    borderRadius: Settings.notificationDotRadius,
  },
});
