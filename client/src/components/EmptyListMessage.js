import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import Button from './Button';
import { BAR_HEIGHT } from './styles';

const { width, height } = Dimensions.get('window');

const tabBarHeight = 49;
export default class EmptyListMessage extends React.Component {
  render() {
    const {
      inverted, noButton, style, color, image, title, subtitle, buttonTitle, onPress,
    } = this.props;

    return (
      <View
        style={[
          style,
          {
            flex: 1,
            width,
            height: height - BAR_HEIGHT - tabBarHeight,
            paddingTop: 24,
            alignItems: 'stretch',
          },
        ]}
      >
        {inverted && (
          <Animatable.Image
            useNativeDriver
            duration={1000}
            animation="zoomIn"
            delay={100}
            style={{
              width,
              height: width * 0.6,
              resizeMode: 'contain',
              marginBottom: 33,
            }}
            source={image}
          />
        )}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: color || 'black',
              backgroundColor: 'transparent',
              textAlign: 'center',
              fontSize: 24,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: color || 'black',
              backgroundColor: 'transparent',
              textAlign: 'center',
              fontSize: 14,
              paddingHorizontal: 24,
              marginBottom: 16,
            }}
          >
            {subtitle}
          </Text>
          {!noButton && (
            <Button.Outline
              color={color || 'black'}
              onPress={onPress}
              title={(buttonTitle || 'Start Swiping').toUpperCase()}
              style={{ width: '75%' }}
            />
          )}
        </View>
        {/* <Animatable.Image iterationCount="infinite" useNativeDriver duration={2000} animation="pulse" style={{ width, height: width, resizeMode: 'contain' }} source={image} /> */}
        {!inverted && (
          <Image
            iterationCount="infinite"
            useNativeDriver
            duration={2000}
            animation="pulse"
            style={{ width, height: width, resizeMode: 'contain' }}
            source={image}
          />
        )}
      </View>
    );
  }
}
