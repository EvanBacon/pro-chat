import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  StyleSheet, ViewPropTypes, Text, View,
} from 'react-native';

export default class Tag extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    style: ViewPropTypes.style,
  };

  render() {
    const { title, style } = this.props;
    return (
      <View style={[style, styles.container]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
});
