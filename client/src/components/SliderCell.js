import { dispatch } from '@rematch/core';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { connect } from 'react-redux';

import LoadingImage from './Image/ProgressImage';
import Meta from './Meta';

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
      dispatch.users.ensureUserIsLoadedAsync({ uid });
    }
  };

  onPress = () => this.props.onPressItem(this.props.uid);

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
        overflow: 'hidden',
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
            style={{ flex: 1, overflow: 'hidden' }}
            onPress={this.onPress}
          >
            <LoadingImage source={image} style={styles.image} />
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
  // console.warn(user, uid);
  const { about, rating } = user;
  const userProps = {
    uid,
    about: about || 'I am not interesting, but I do like to pretend.',
    rating: 'moth',
    image: user.photoURL,
    firstName: user.first_name || user.name || user.displayName,
  };
  return {
    ...state,
    ...localProps,
    ...actions,
    ...userProps,
  };
};

export default connect(
  ({ users }) => ({ users }),
  {},
  mergeProps,
)(SliderCell);
