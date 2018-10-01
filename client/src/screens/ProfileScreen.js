import firebase from 'firebase';
import React, { Component } from 'react';
import { Animated, LayoutAnimation, View } from 'react-native';
import { connect } from 'react-redux';
import Blocked from '../components/Blocked'
import Carousel from '../components/Carousel'
import Gradient from '../components/Gradient'
import RateSection from '../components/RateSection'
import RefreshControl from '../components/RefreshControl'
import TagCollection from '../components/TagCollection'
import UserInfo from '../components/UserInfo'
import styles, { BAR_HEIGHT } from '../components/styles';
import Meta from '../constants/Meta';
import * as ProfileProvider from '../provider/ProfileProvider';
import * as RelationshipProvider from '../provider/RelationshipProvider';
import { getPopularUsers } from '../redux/popular';
import { changeRating, getProfileImage, getPropertyForUser } from '../redux/profiles';
import { getRelationshipWithUser, updateRelationshipWithUser } from '../redux/relationship';
import { Relationship } from '../provider/RelationshipProvider';

class Profile extends Component {
  state = {
    refreshing: false,
  };
  componentWillMount() {
    this.props.getPopularUsers();
  }
  componentDidMount() {
    const { uid } = this.props;
    this.updateWithUID(uid);
    ProfileProvider.observePropertyForUser({ uid, property: 'rating', callback: this.updateRating });
  }
  componentWillUnmount() {
    ProfileProvider.unobservePropertyForUser({ uid: this.props.uid, property: 'rating', callback: this.updateRating });
  }
  updateRating = ({ val }) => this.setState({ rating: val() });
  componentWillReceiveProps(nextProps) {
    if (nextProps.uid != this.props.uid) {
      this.updateWithUID(nextProps.uid);
    }
  }

  updateWithUID = async (uid, update) => {
    if (!uid) return;
    const {
      image, first_name, about, likes, rating, relationship,
    } = this.props;
    if (!image || update) {
      this.props.getProfileImage({ uid });
    }
    if (!first_name || update) {
      this.props.getPropertyForUser({ uid, property: 'first_name' });
    }
    if (!about || update) {
      this.props.getPropertyForUser({ uid, property: 'about' });
    }
    if (!likes || update) {
      this.props.getPropertyForUser({ uid, property: 'likes' });
    }
    if (!rating || update) {
      this.props.getPropertyForUser({ uid, property: 'rating' });
    }
    if (!relationship || update) {
      this.props.getRelationshipWithUser(uid);
    }

    const isMatched = await RelationshipProvider.isMatched(uid);

    // this.props.navigation.setParams({ isMatched, name, uid });
    LayoutAnimation.easeInEaseOut();

    this.setState({ isMatched });
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.updateWithUID(this.props.uid, true);
    this.setState({ refreshing: false });
  };

  renderPopular = () => {
    // const users = Object.keys(this.props.popular);
    const users = ['fake-a', 'fake-b', 'fake-c', 'fake-d', 'fake-e', 'fake-01', 'fake-02'];
    return (
      <Carousel
        title={Meta.popular_title}
        navigation={this.props.navigation}
        style={{
          minHeight: 128,
          marginTop: 16,
          minWidth: '100%',
        }}
        users={users}
      />
    );
  };

  renderTags = (tags, isUser, first_name) => (
    <TagCollection style={{}} title={Meta.user_interests_title} tags={tags} isUser={isUser} name={first_name} />
  );

  get isBlocked() {
    const { relationship } = this.props;
    return relationship === Relationship.blocked || relationship === Relationship.blocking;
  }
  renderProfileContents = () => {
    const {
      isUser,
      uid,
      first_name,
      likes,
      about,
      relationship,
      rating,
      isMatched,
      changeRating,
      image,
      updateRelationshipWithUser,
      getProfileImage,
      navigation,
    } = this.props;
    if (this.isBlocked) {
      <Blocked uid={uid} relationship={relationship} updateRelationshipWithUser={updateRelationshipWithUser} />;
    }

    return (
      <View>
        <UserInfo
          navigation={navigation}
          onImageUpdated={async _ => getProfileImage({ uid })}
          onRatingPressed={changeRating}
          image={{ uri: image }}
          title={first_name}
          subtitle={about}
          rating={rating}
          uid={uid}
          isUser={isUser}
          isMatched={isMatched}
          hasLightbox
        />

        {!isUser && <RateSection uid={uid} updateRelationshipWithUser={updateRelationshipWithUser} />}
        {this.renderTags(likes, isUser, first_name)}
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
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
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

const mergeProps = (state, actions, localProps) => {
  const currentUID = ((localProps.navigation.state || {}).params || {}).uid;
  const userUID = firebase.uid();
  const uid = currentUID || userUID;
  const isUser = userUID === uid && currentUID == null;

  console.warn(currentUID, userUID, uid, isUser);

  const {
    users, images, relationships, ...props
  } = state;
  const relationship = relationships[uid];
  const user = users[uid] || {};
  const image = images[uid];

  return {
    ...localProps,
    ...props,
    image,
    uid,
    isUser,
    relationship,
    first_name: user.first_name,
    about: user.about,
    rating: user.rating,
    likes: (user.likes || {}).data,
    ...actions,
  };
};

export default connect(
  ({ profiles: { users, images }, relationship: { uid }, popular: { users: popular } }) => ({
    users,
    popular,
    images,
    relationships: uid,
  }),
  {
    getPopularUsers,
    getPropertyForUser,
    getProfileImage,
    changeRating,
    getRelationshipWithUser,
    updateRelationshipWithUser,
  },
  mergeProps,
)(Profile);
