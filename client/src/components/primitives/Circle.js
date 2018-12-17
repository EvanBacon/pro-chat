import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class Circle extends React.Component {
  state = {};

  constructor(props) {
    super(props);

    const style = props.style || {};
    const width = style.width || style.minWidth;
    const height = style.height || style.minHeight;
    this.state = {
      width,
    };
  }

  onLayout = event => {
    if (this.props.onLayout) this.props.onLayout(event);
    const {
      nativeEvent: { layout },
    } = event;
    this.setState({ ...layout });
  };

  render() {
    const { style, onLayout, ...props } = this.props;
    let width;
    if (this.state.width && typeof this.state.width === 'number') {
      width = this.state.width;
    }
    const _style = width ? { borderRadius: width / 2 } : { opacity: 0 };
    return (
      <View
        style={StyleSheet.flatten([
          style,
          {
            aspectRatio: 1,
            overflow: 'visible',
          },
          _style,
        ])}
      >
        <View
          {...props}
          onLayout={this.onLayout}
          style={{
            flex: 1,
            ..._style,
            overflow: 'hidden',
          }}
        />
      </View>
    );
  }
}
