import { MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Meta from '../constants/Meta';
import Settings from '../constants/Settings';
import styles from './styles';

export default class RatingTitle extends React.Component {
  static propTypes = {
    style: View.propTypes.style,
    title: PropTypes.string,
    color: PropTypes.string,
    uid: PropTypes.string,
    onRatingPressed: PropTypes.func,
  };
  static defaultProps = {
    color: '#ffffff',
    onRatingPressed: () => {},
  };

  render() {
    const {
      style, title, color, uid, onRatingPressed,
    } = this.props;
    const str = (title
      ? `${Meta.rated_as} ${title.toUpperCase()} ${Settings.user}`
      : Meta.tap_to_get_rating
    ).toUpperCase();

    const isUser = firebase.uid() === uid && uid != null;
    if (!isUser && !title) {
      return null;
    }
    return (
      <View style={[{ alignItems: 'center' }, style]}>
        <View
          style={{
            marginVertical: 8,
            height: StyleSheet.hairlineWidth,
            width: 62,
            backgroundColor: '#B996FC',
          }}
        />
        <TouchableOpacity
          disabled={!isUser}
          style={{ flexDirection: 'row', height: 18, alignItems: 'center' }}
          onPress={() => {
            if (isUser) {
              onRatingPressed();
            }
          }}
        >
          {isUser && (
            <MaterialIcons
              name="refresh"
              size={24}
              style={{
                backgroundColor: 'transparent',
                opacity: 0,
                marginRight: 8,
                textAlign: 'center',
              }}
              color="white"
            />
          )}
          <Text
            style={[
              styles.descriptionText,
              {
                fontSize: 15,
                textAlign: 'center',
                backgroundColor: 'transparent',
                opacity: 0.63,
                color,
              },
            ]}
          >
            {str}
          </Text>
          {isUser && (
            <MaterialIcons
              name="refresh"
              size={24}
              style={{
                backgroundColor: 'transparent',
                opacity: 0.63,
                marginLeft: 8,
                textAlign: 'center',
              }}
              color="white"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
