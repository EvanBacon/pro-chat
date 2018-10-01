import React, { Component } from 'react';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { connect } from 'react-redux';

import { getProfileImage, getPropertyForUser } from '../../redux/profiles';
import Circle from '../Circle';
import LoadingImage from '../LoadingImage';

class Cell extends Component {
  componentWillMount() {
    this.load(this.props.uid);
  }

  componentWillReceiveProps(next) {
    if (this.props.uid != next.uid) {
      this.load(next.uid);
    }
  }

  load = async (uid) => {
    if (uid) {
      if (!this.props.image) {
        this.props.getProfileImage({ uid });
      }
      if (!this.props.first_name) {
        this.props.getPropertyForUser({ uid, property: 'first_name' });
      }
    }
  };

  render() {
    const {
      image, first_name, style, onPress,
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

        {true && <DinPro.Medium style={{ textAlign: 'center' }}>{first_name}</DinPro.Medium>}
      </TouchableBounce>
    );
  }
}

const mergeProps = (state, actions, { uid, ...localProps }) => {
  const { users, images, ...props } = state;

  const user = users[uid] || {};
  const image = images[uid];

  return {
    ...localProps,
    ...props,
    image,
    uid,
    first_name: user.first_name,
    ...actions,
  };
};

export default connect(
  ({ profiles: { users, images } }) => ({ users, images }),
  { getPropertyForUser, getProfileImage },
  mergeProps,
)(Cell);
