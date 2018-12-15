import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, ViewPropTypes, Text, View } from 'react-native';

export default class Section extends React.Component {
  static defaultProps = {
    title: null,
    children: null,
    style: null,
  };

  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
    ]),
  };

  render() {
    const { style, children, title, titleStyle } = this.props;
    return (
      <View style={StyleSheet.flatten([styles.container, style])}>
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#B996FC',
    backgroundColor: 'rgba(44,49,84, 0.1)',
    paddingVertical: 10,
  },
  title: {
    fontSize: 13,
    backgroundColor: 'transparent',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
});
