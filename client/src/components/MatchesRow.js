import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import UserImage from './UserImage';
import Settings from '../constants/Settings';

export default class MatchesRow extends React.Component {
  static defaultProps = {
    underlayColor: '#ddd',
    name: Settings.noName,
    // image: require('../assets/icons/expo.png'),
  };

  static propTypes = {
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    underlayColor: PropTypes.string,
  };

  onPress = () => {
    const { onPress, uid } = this.props;
    onPress({ uid });
  };

  render() {
    const { image, name, underlayColor } = this.props;
    return (
      <TouchableHighlight underlayColor={underlayColor} onPress={this.onPress}>
        <View style={styles.container}>
          <UserImage
            containerStyle={{
              marginRight: 0,
            }}
            name={name}
            image={image}
            size={64}
          />
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
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
