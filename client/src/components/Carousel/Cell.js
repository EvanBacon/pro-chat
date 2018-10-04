import { dispatch } from '@rematch/core';
import React, { Component } from 'react';
import { Text } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { connect } from 'react-redux';

import Circle from '../Circle';
import LoadingImage from '../Image/ProgressImage';

// import { getProfileImage, getPropertyForUser } from '../../redux/profiles';
class Cell extends Component {
  componentWillMount() {
    this.load(this.props.uid);
  }

  componentWillReceiveProps(next) {
    if (this.props.uid !== next.uid) {
      this.load(next.uid);
    }
  }

  load = async (uid) => {
    if (uid) {
      if (!this.props.image) {
        dispatch.users.getProfileImage({ uid });
      }
      if (!this.props.first_name) {
        dispatch.users.getPropertyForUser({ uid, property: 'first_name' });
      }
    }
  };

  render() {
    const {
      image, firstName, style, onPress,
    } = this.props;

    const size = 64;
    return (
      <TouchableBounce style={{ marginHorizontal: 12 }} onPress={onPress}>
        <Circle
          style={[
            {
              overflow: 'visible',
              backgroundColor: '#eee',
              maxWidth: size,
              minWidth: size,
              aspectRatio: 1,
              borderRadius: size / 2,
              borderColor: 'white',
            },
            style,
          ]}
        >
          <LoadingImage
            source={image}
            style={{
              flex: 1,
              maxWidth: size,
              minWidth: size,
              minHeight: size,
              maxHeight: size,
              borderRadius: size / 2,
              borderWidth: 2,
              borderColor: 'white',
            }}
          />
        </Circle>

        <Text style={{ textAlign: 'center' }}>{firstName}</Text>
      </TouchableBounce>
    );
  }
}

const mergeProps = (state, actions, { uid, ...localProps }) => {
  const { users, ...props } = state;

  const user = users[uid] || {};
  // const image = images[uid];

  return {
    ...localProps,
    ...props,
    image: user.photoURL,
    uid,
    firstName: user.firstName,
    ...actions,
  };
};

export default connect(
  ({ users }) => ({ users }),
  {
    // getPropertyForUser, getProfileImage
  },
  mergeProps,
)(Cell);
