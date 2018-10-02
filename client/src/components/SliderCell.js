import { dispatch } from '@rematch/core';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { connect } from 'react-redux';

import LoadingImage from './LoadingImage';
import Meta from './Meta';

// import { getProfileImage, getPropertyForUser } from '../redux/profiles';
class SliderCell extends React.PureComponent {
  componentWillMount() {
    this.load(this.props.uid);
  }

  componentWillReceiveProps(next) {
    if (this.props.uid !== next.uid) {
      this.load(next.uid);
    }
  }

  load = async (uid) => {
    if (typeof uid === 'string') {
      dispatch.users.getAsync({ uid });
    }
  };

  render() {
    const {
      itemWidth,
      onPressItem,
      uid,

      about,
      rating,
      firstName,
      image,
    } = this.props;

    const style = {
      width: itemWidth,
      marginTop: 36,
    };

    const styles = {
      image: {
        backgroundColor: 'white',
        width: itemWidth,
        height: itemWidth,
        borderRadius: itemWidth / 2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#F9F9F9',
        shadowColor: 'rgba(114,45,250, 0.2)',
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
      },
    };
    return (
      <View style={style}>
        <View
          style={{
            width: itemWidth,
            aspectRatio: 1,
          }}
        >
          <TouchableBounce
            activeOpacity={0.7}
            style={{ flex: 1 }}
            onPress={() => onPressItem(uid)}
          >
            <LoadingImage
              source={image}
              style={styles.image}
            />
          </TouchableBounce>
        </View>
        <Meta
          color="white"
          title={firstName}
          subtitle={about}
          rating={rating}
        />
      </View>
    );
  }
}

const mergeProps = ({ users, ...state }, actions, { uid, ...localProps }) => {
  const user = users[uid] || {};

  const {
    about,
    rating,
  } = user;
  const userProps = {
    about,
    rating,
    image: user.photoURL,
    firstName: user.first_name,
  };
  return {
    ...state,
    ...localProps,
    ...actions,
    ...userProps,
    uid,
  };
};

export default connect(
  ({ users }) => ({ users }),
  {},
  mergeProps,
)(SliderCell);
