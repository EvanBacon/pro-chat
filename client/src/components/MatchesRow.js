import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import UserImage from './UserImage';

export default class MatchesRow extends React.Component {
  static defaultProps = {
    underlayColor: '#ddd',
    name: 'Nameless Bute',
  };

  static propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    underlayColor: PropTypes.string,
  };

  render() {
    const {
      image, name, onPress, underlayColor,
    } = this.props;
    return (
      <TouchableHighlight underlayColor={underlayColor} onPress={onPress}>
        <View style={styles.container}>
          {image && (
            <UserImage
              containerStyle={{
                marginRight: 0,
              }}
              source={{
                uri: image,
              }}
              size={64}
            />
          )}
          {name && (
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 128,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 12,
  },
});
