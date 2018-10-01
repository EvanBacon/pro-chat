import { Font } from 'expo';
import React, { Component } from 'react';
import * as Progress from 'react-native-progress';

import Colors from '../constants/Colors';

export default class Indicator extends Component {
  static propTypes = {};

  static defaultProps = {
    size: 80,
    formatText: progress => `${(progress * 100) | 0}`,
    textStyle: {},
  };

  render() {
    const {
      size, textStyle, progress, formatText, ...props
    } = this.props;

    return (
      <Progress.Circle
        textStyle={[
          {
            ...Font.style('DINPro-medium'),
            color: Colors.statusBar.fontColor,
            fontSize: 24,
            textShadowColor: 'black',
            textShadowOffset: {
              width: 0,
              height: 0,
            },
            textShadowRadius: 1,
          },
          textStyle,
        ]}
        progress={progress}
        formatText={() => formatText(progress)}
        borderWidth={0}
        thickness={10}
        borderColor={Colors.statusBar.borderColor}
        unfilledColor={Colors.statusBar.unfilledColor}
        size={size || 75}
        color={Colors.statusBar.color}
        showsText
        {...props}
      />
    );
  }
}
