import { dispatch } from '../rematch/dispatch';
import React, { Component } from 'react';
import { Animated, Dimensions, LayoutAnimation, View } from 'react-native';
import { connect } from 'react-redux';

import Blocked from '../components/Blocked';
import Carousel from '../components/Carousel';
import Gradient from '../components/primitives/Gradient';
import RateSection from '../components/profile/RateSection';
import RefreshControl from '../components/primitives/RefreshControl';
import { BAR_HEIGHT } from '../components/styles';
import TagCollection from '../components/TagCollection';
import UserInfo from '../components/profile/UserInfo';
import Meta from '../constants/Meta';
import Fire from '../Fire';
import Relationship from '../models/Relationship';
import Settings from '../constants/Settings';
import IdManager from '../IdManager';
import tabBarImage from '../components/Tabs/tabBarImage';
import Assets from '../Assets';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

class Profile extends Component {
  static navigationOptions = () => ({
    title: 'Profile',
  });
  state = {
    refreshing: false,
    rating: null,
  };

  componentDidMount() {
    const { uid } = this.props;
    // this.updateWithUID(uid);
    // ProfileProvider.observePropertyForUser({
    //   uid,
    //   property: 'rating',
    //   callback: this.updateRating,
    // });
  }
  componentWillUnmount() {
    // ProfileProvider.unobservePropertyForUser({
    //   uid: this.props.uid,
    //   property: 'rating',
    //   callback: this.updateRating,
    // });
  }
  updateRating = ({ val }) => this.setState({ rating: val() });
  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid) {
      // this.updateWithUID(nextProps.uid);
    }
  }

  updateWithUID = async (uid, update) => {
    const user = await new Promise(res =>
      dispatch.users.ensureUserIsLoadedAsync({
        uid,
        callback: res,
        hours: update ? 0 : undefined,
      }),
    );

    // if (!uid) return;
    // const { image, name, about, likes, rating, relationship } = this.props;
    // if (!image || update) {
    //   dispatch.users.getProfileImage({ uid });
    // }
    // if (!name || update) {
    //   dispatch.users.getPropertyForUser({ uid, property: 'first_name' });
    // }
    // if (!about || update) {
    //   dispatch.users.getPropertyForUser({ uid, property: 'about' });
    // }
    // if (!likes || update) {
    //   dispatch.users.getPropertyForUser({ uid, property: 'likes' });
    // }
    // if (!rating || update) {
    //   dispatch.users.getPropertyForUser({ uid, property: 'rating' });
    // }
    // if (!relationship || update) {
    //   dispatch.relationships.getAsync({ uid });
    // }

    // const isMatched = await new Promise(res =>
    //   dispatch.relationships.isMatched({ uid, callback: res }),
    // );

    // this.props.navigation.setParams({ isMatched, name, uid });
    LayoutAnimation.easeInEaseOut();

    // this.setState({ isMatched });
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.updateWithUID(this.props.uid, true);
    this.setState({ refreshing: false });
  };

  renderPopular = () => (
    <Carousel
      screen="Profile"
      itemTextStyle={{ color: Colors.white, marginTop: 4, fontWeight: 'bold' }}
      title={Meta.popular_title}
      style={{
        minHeight: 128,
        marginTop: 16,
        minWidth: '100%',
      }}
      data={this.props.users}
    />
  );

  renderTags = (tags, isUser, name) => {
    if (!tags || !tags.length) {
      return null;
    }
    return (
      <TagCollection
        style={{}}
        title={Meta.user_interests_title}
        tags={tags}
        isUser={isUser}
        name={name}
      />
    );
  };

  get isBlocked() {
    const { relationship } = this.props;
    return (
      relationship === Relationship.blocked ||
      relationship === Relationship.blocking
    );
  }
  renderProfileContents = () => {
    const {
      isUser,
      uid,
      name,
      likes,
      about,
      relationship,
      rating,
      isMatched,
      image,
      // updateRelationshipWithUser,
      // getProfileImage,
      navigation,
    } = this.props;

    console.log('legoboi', {
      isUser,
      uid,
      name,
      likes,
      about,
      relationship,
      rating,
      isMatched,
      image,
    });
    if (!uid) return null;

    if (this.isBlocked) {
      return <Blocked uid={uid} relationship={relationship} />;
    }

    return (
      <View>
        <UserInfo
          navigation={navigation}
          onImageUpdated={async () => dispatch.users.getProfileImage({ uid })}
          onRatingPressed={dispatch.user.changeRating}
          image={image}
          title={name}
          subtitle={about}
          rating={rating}
          uid={uid}
          isUser={isUser}
          isMatched={isMatched}
          hasLightbox
        />

        {!isUser && <RateSection uid={uid} />}
        {this.renderTags(likes, isUser, name)}
        {this.renderPopular()}
      </View>
    );
  };

  render() {
    return (
      <Gradient style={{ flex: 1 }}>
        <Animated.ScrollView
          pagingEnabled={false}
          style={{ flex: 1, margin: 0, padding: 0 }}
          contentInset={{ top: BAR_HEIGHT / 2 }}
          contentOffset={{ y: -(BAR_HEIGHT / 2) }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
              color={Colors.white}
            />
          }
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {this.renderProfileContents()}
        </Animated.ScrollView>
      </Gradient>
    );
  }
}

const mergeProps = (
  { users = {}, relationships = {}, ...state },
  actions,
  { uid, ...localProps },
) => {
  const { params = {} } = localProps.navigation.state;

  const mainUserId = IdManager.uid;
  const userId = params.uid || uid || IdManager.uid;

  const isUser = mainUserId === userId;

  let relationship = Relationship.none;
  if (!isUser) {
    relationship = relationships[IdManager.getGroupId(userId)];
  }

  const { [userId]: user = {}, ...otherUsers } = users;
  console.log('raw', { user }, otherUsers);
  // console.warn(user, uid);
  const { about, rating } = user;
  const userProps = {
    ...user,
    isUser,
    uid: userId,
    about: about || 'I am not interesting, but I do like to pretend.',
    rating: rating || 'regular',
    // TODO: Standard - decide on one format
    image: user.photoURL || user.image,
    name: user.first_name || user.name || user.displayName || user.deviceName,

    likes: Settings.fakeLikes,
  };
  return {
    ...state,
    ...localProps,
    ...actions,
    ...userProps,
    users: Object.values(otherUsers),
    relationship,
  };
};

const ProfileScreen = connect(
  ({ users = {}, relationships = {} }) => ({
    users,
    relationships,
  }),
  {},
  mergeProps,
)(Profile);

ProfileScreen.navigationOptions = {
  title: 'Profile',

  tabBarIcon: tabBarImage({
    active: Assets.images.profile_active,
    inactive: Assets.images.profile_inactive,
  }),
};

export default ProfileScreen;
