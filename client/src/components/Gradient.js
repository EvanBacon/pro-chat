import { LinearGradient } from 'expo';
import React from 'react';

const scheme = {
  dark: {
    colors: [
      // 'blue',
      // 'blue',
      '#52416A',
      '#303865',
    ],
    start: [0.25, 0.01],
    end: [0.75, 0.99],
  },
  light: {
    colors: ['#6509fc', '#742aeb', '#7c3be3'],
  },
};
export default class Gradient extends React.PureComponent {
  render() {
    const { style, ...props } = this.props;
    return <LinearGradient {...scheme.dark} {...props} style={[{ flex: 1 }, style]} />;
  }
}
