import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  ViewPropTypes,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firebase from '../universal/firebase';

import Meta from '../constants/Meta';
import Settings from '../constants/Settings';
import styles from './styles';
import Fire from '../Fire';
import Colors from '../constants/Colors';

export default class RatingTitle extends React.Component {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    color: PropTypes.string,
    uid: PropTypes.string,
    onRatingPressed: PropTypes.func,
  };

  static defaultProps = {
    color: Colors.white,
    onRatingPressed: () => {},
  };

  render() {
    const { style, title, color, uid, onRatingPressed } = this.props;
    const str = (title
      ? `${Meta.rated_as} ${title.toUpperCase()} ${Settings.user}`
      : Meta.tap_to_get_rating
    ).toUpperCase();

    const isUser = Fire.shared.uid === uid && uid != null;
    if (!isUser && !title) {
      return null;
    }
    return (
      <View style={[{ alignItems: 'center', overflow: 'visible' }, style]}>
        <View
          style={{
            marginVertical: 8,
            height: StyleSheet.hairlineWidth,
            width: 62,
            backgroundColor: Colors.gray,
            overflow: 'visible',
          }}
        />
        <TouchableOpacity
          disabled={!isUser}
          style={{
            flexDirection: 'row',
            height: 18,
            overflow: 'visible',
            alignItems: 'center',
          }}
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
              color={Colors.white}
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
              size={22}
              style={{
                backgroundColor: 'transparent',
                opacity: 0.63,
                marginLeft: 8,
                textAlign: 'center',
              }}
              color={Colors.white}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
