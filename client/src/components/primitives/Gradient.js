import { LinearGradient } from 'expo';
import React from 'react';

import Colors from '../../constants/Colors';

export default class Gradient extends React.PureComponent {
  render() {
    const { style, ...props } = this.props;
    return (
      <LinearGradient
        colors={[
          Colors.veryDarkDesaturatedViolet,
          Colors.veryDarkDesaturatedBlue,
        ]}
        start={[0.25, 0.01]}
        end={[0.75, 0.99]}
        {...props}
        style={[{ flex: 1 }, style]}
      />
    );
  }
}
