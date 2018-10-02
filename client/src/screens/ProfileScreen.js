import { dispatch } from '@rematch/core';
import React, { Component } from 'react';
import { Animated, Dimensions, LayoutAnimation, View } from 'react-native';
import { connect } from 'react-redux';

import Blocked from '../components/Blocked';
import Carousel from '../components/Carousel';
import Gradient from '../components/Gradient';
import RateSection from '../components/RateSection';
import RefreshControl from '../components/RefreshControl';
import { BAR_HEIGHT } from '../components/styles';
import TagCollection from '../components/TagCollection';
import UserInfo from '../components/UserInfo';
import Meta from '../constants/Meta';
import Fire from '../Fire';
import Relationship from '../models/Relationship';


const { width } = Dimensions.get('window');

class Profile extends Component {
  state = {
    refreshing: false,
    rating: null,
  };
  componentWillMount() {
    dispatch.popular.getAsync();
  }
  componentDidMount() {
    const { uid } = this.props;
    this.updateWithUID(uid);
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
      this.updateWithUID(nextProps.uid);
    }
  }

  updateWithUID = async (uid, update) => {
    if (!uid) return;
    const {
      image, firstName, about, likes, rating, relationship,
    } = this.props;
    if (!image || update) {
      dispatch.users.getProfileImage({ uid });
    }
    if (!firstName || update) {
      dispatch.users.getPropertyForUser({ uid, property: 'first_name' });
    }
    if (!about || update) {
      dispatch.users.getPropertyForUser({ uid, property: 'about' });
    }
    if (!likes || update) {
      dispatch.users.getPropertyForUser({ uid, property: 'likes' });
    }
    if (!rating || update) {
      dispatch.users.getPropertyForUser({ uid, property: 'rating' });
    }
    if (!relationship || update) {
      dispatch.relationships.getAsync({ uid });
    }

    const isMatched = await (new Promise(res => dispatch.relationships.isMatched({ uid, callback: res })));

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
    const users = [
      'fake-a',
      'fake-b',
      'fake-c',
      'fake-d',
      'fake-e',
      'fake-01',
      'fake-02',
    ];
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

  renderTags = (tags, isUser, firstName) => (
    <TagCollection
      style={{}}
      title={Meta.user_interests_title}
      tags={tags}
      isUser={isUser}
      name={firstName}
    />
  );

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
      firstName,
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
    if (this.isBlocked) {
      return (
        <Blocked
          uid={uid}
          relationship={relationship}
          updateRelationshipWithUser={dispatch.users.updateRelationshipWithUser}
        />
      );
    }

    return (
      <View>
        <UserInfo
          navigation={navigation}
          onImageUpdated={async () => dispatch.users.getProfileImage({ uid })}
          onRatingPressed={dispatch.user.changeRating}
          image={{ uri: image }}
          title={firstName}
          subtitle={about}
          rating={rating}
          uid={uid}
          isUser={isUser}
          isMatched={isMatched}
          hasLightbox
        />

        {!isUser && (
          <RateSection
            uid={uid}
            updateRelationshipWithUser={
              dispatch.users.updateRelationshipWithUser
            }
          />
        )}
        {this.renderTags(likes, isUser, firstName)}
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

const mergeProps = (state, actions, localProps) => {
  const { params = {} } = localProps.navigation.state;
  const currentUID = params.uid;

  const userUID = Fire.shared.uid;
  const uid = currentUID || userUID;
  const isUser = userUID === uid && currentUID == null;

  // console.warn(currentUID, userUID, uid, isUser);

  const { users, relationships, ...props } = state;
  const relationship = relationships[uid];
  const user = users[uid] || {};

  return {
    ...localProps,
    ...props,
    image: user.photoURL,
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
  ({ users = {}, relationships = {}, popular = {} }) => ({
    users,
    popular,
    // images,
    relationships,
  }),
  {},
  mergeProps,
)(Profile);
