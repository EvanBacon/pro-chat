import moment from 'moment/min/moment-with-locales.min';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Time extends React.Component {
  static contextTypes = {
    // getLocale: React.PropTypes.func,
  };
  static defaultProps = {
    position: 'left',
    currentMessage: {
      createdAt: null,
    },
    containerStyle: {},
    textStyle: {},
  };
  static propTypes = {
    position: PropTypes.oneOf(['left', 'right']),
    currentMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
      left: View.propTypes.style,
      right: View.propTypes.style,
    }),
    textStyle: PropTypes.shape({
      left: Text.propTypes.style,
      right: Text.propTypes.style,
    }),
  };
  render() {
    const getLocale = this.context.getLocale && this.context.getLocale();
    if (getLocale) {
      const _moment = moment(this.props.currentMessage.createdAt);
      const format = _moment.locale(getLocale).format('LT');
      return (
        <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          <Text style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}>{format}</Text>
        </View>
      );
    }
    return null;
  }
}

const containerStyle = {
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 5,
};

const textStyle = {
  fontSize: 10,
  backgroundColor: 'transparent',
  textAlign: 'right',
};

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#aaa',
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: '#fff',
      ...textStyle,
    },
  }),
};
