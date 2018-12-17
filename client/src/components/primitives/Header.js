import { Svg } from 'expo';
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';

import styles, { BAR_HEIGHT } from '../styles';

const { Stop, Defs, LinearGradient, G, Use, Ellipse } = Svg;

const scheme = {
  dark: {
    a: '#513E76',
    b: '#513E76',
  },
  light: {
    a: '#712cfb',
    b: '#702cfb',
  },
};

export default class Header extends Component {
  static defaultProps = {
    renderLeft: () => {},
    renderRight: () => {},
    title: 'Profile',
  };
  renderGradient = () => (
    <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <Stop offset="0" stopColor={scheme.dark.a} stopOpacity="1" />
      <Stop offset="1" stopColor={scheme.dark.b} stopOpacity="1" />
    </LinearGradient>
  );
  renderBackground = width => (
    <Defs>
      {this.renderGradient()}
      <G id="shape">
        <G>
          <Ellipse
            cx={width / 2}
            cy="0"
            rx={BAR_HEIGHT + width * 0.5}
            ry={BAR_HEIGHT}
          />
        </G>
      </G>
    </Defs>
  );

  render() {
    // const { navigation } = this.props.navigation;
    const { width } = Dimensions.get('window');

    // const right = this.props.renderRight({ navigation });
    // console.log(right);
    return (
      <View
        style={{
          // position: 'absolute',
          paddingHorizontal: 16,
          height: BAR_HEIGHT,
          // top: 0,
          // left: 0,
          // right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Svg
          height={BAR_HEIGHT}
          width={width}
          style={[
            styles.headerShadow,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            },
          ]}
        >
          {this.renderBackground(width)}
          <Use href="#shape" x="0" y="0" fill="url(#grad)" />
        </Svg>
      </View>
    );
  }
}
