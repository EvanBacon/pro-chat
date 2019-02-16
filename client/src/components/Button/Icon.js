import { FontAwesome } from '@expo/vector-icons';
import React, { Component } from 'react';
import { Platform, StyleSheet } from 'react-native';

import TouchableBounce from '../../universal/TouchableBounce'; // eslint-disable-line
import Colors from '../../constants/Colors';

export default class Icon extends Component {
  static defaultProps = {
    soundIn: 'button_in',
    soundOut: 'button_out',
    size: 24,
    color: Colors.white,
    onPress: () => {},
  };

  render() {
    const {
      onPress,
      size,
      color,
      name,
      soundOut,
      soundIn,
      source,
      style,
      iconStyle,
    } = this.props;
    return (
      <TouchableBounce onPress={onPress} style={[styles.container, style]}>
        <FontAwesome
          size={size}
          color={color}
          name={name}
          style={[styles.icon, iconStyle]}
        />
      </TouchableBounce>
    );
  }
}

const size = 56;

const styles = StyleSheet.create({
  container: {
    width: size,
    minWidth: size,
    aspectRatio: 1,
    height: size,
    minHeight: size,
    maxHeight: size,
    backgroundColor: 'transparent',
    borderBottomWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  icon: {
    backgroundColor: 'transparent',
    marginBottom: Platform.select({ web: '1rem', default: 0 }),
  },
});
