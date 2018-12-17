import React from 'react';
import { Animated, Image, TouchableWithoutFeedback } from 'react-native';

import Circle from './primitives/Circle';
import Meta from './Meta';
import Colors from '../constants/Colors';
import styles from './styles';

export default class Slide extends React.Component {
  render() {
    const {
      onPress,
      index,
      scroll,
      itemWidth,
      title,
      subtitle,
      accessoryView,
      image,
    } = this.props;

    const center = index * itemWidth;

    const inputRange = [center - itemWidth, center, center + itemWidth];

    const _translateX = -40;
    const _translateY = 100;
    const _textTranslate = -80;

    const translateX = scroll.interpolate({
      inputRange,
      outputRange: [-_translateX, 0, _translateX],
    });
    const translateY = scroll.interpolate({
      inputRange,
      outputRange: [-_translateY, 0, -_translateY],
    });
    const textTranslateX = scroll.interpolate({
      inputRange,
      outputRange: [-_textTranslate, 0, _textTranslate],
    });
    const textTranslateY = scroll.interpolate({
      inputRange,
      outputRange: [_translateY, 0, _translateY],
    });

    const style = {
      width: itemWidth,
      alignItems: 'stretch',
    };

    const animatedImageStyle = {
      transform: [{ translateX }, { translateY }],
      height: itemWidth,
    };

    const animatedTextStyle = {
      transform: [
        { translateX: textTranslateX },
        { translateY: textTranslateY },
      ],
    };

    const circleStyle = [
      styles.shadow,
      {
        backgroundColor: Colors.card,
        alignItems: 'center',
      },
    ];

    const imageStyle = {
      resizeMode: 'contain',
      flex: 1,
      margin: 32,
    };

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Animated.View style={style}>
          <Animated.View style={animatedImageStyle}>
            <Circle style={circleStyle}>
              <Image source={image} style={imageStyle} />
            </Circle>
          </Animated.View>

          <Animated.View style={animatedTextStyle}>
            <Meta title={title} subtitle={subtitle} />
            {accessoryView}
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
