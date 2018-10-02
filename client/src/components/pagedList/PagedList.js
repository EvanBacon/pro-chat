import React, { Component } from 'react';
import { Dimensions } from 'react-native';

import MessagesList from './MessagesList';

const { width } = Dimensions.get('window');
const itemHeight = 64;
const gutter = 4;
const totalGutter = gutter * 2;
const itemSize = itemHeight + totalGutter;
const PAGE_SIZE = 5;
const DEBUG = false;

const userData = {
  k6rCUoV1ckMnej3zx31Pr9GJT143: {
    key: 'k6rCUoV1ckMnej3zx31Pr9GJT143',
    apiKey: 'AIzaSyAfgPq82VdNqEZ8hqnOvYdD7kSPiFK9W1k',
    appName: '[DEFAULT]',
    appOwnership: 'expo',
    authDomain: 'keira-knightley-51df6.firebaseapp.com',
    createdAt: '1524107268000',
    deviceId: 'B2025F19-772E-46B2-9976-74F7EE66C020',
    deviceName: 'Expo iPhone X',
    deviceYearClass: 2017,
    displayName: 'Evan Bacon',
    emailVerified: false,
    expoVersion: '2.5.9.1014765',
    isAnonymous: false,
    isDevice: true,
    lastLoginAt: '1528532707000',
    name: '"Evan Bacon"',
    phoneNumber: null,
    photoURL: 'https://graph.facebook.com/10209358712923544/picture',
    platform: {
      ios: {
        buildNumber: '2.5.9.1014765',
        model: 'iPhone X',
        platform: 'iPhone10,6',
        systemVersion: '11.3.1',
        userInterfaceIdiom: 'handset',
      },
    },
    providerData: [
      {
        displayName: 'Evan Bacon',
        phoneNumber: null,
        photoURL: 'https://graph.facebook.com/10209358712923544/picture',
        providerId: 'facebook.com',
        uid: '10209358712923544',
      },
    ],
    redirectEventId: null,
    slug: 'test-app',

    uid: 'k6rCUoV1ckMnej3zx31Pr9GJT143',
  },
  iFDnPddQulWwmIeWZy2nr6iujI23: {
    key: 'iFDnPddQulWwmIeWZy2nr6iujI23',
    appOwnership: 'expo',
    deviceId: 'C3E4FF66-E23F-4671-BFCE-E67F09A566B2',
    deviceName: 'Jonathan',
    photoURL:
      'https://www.geek.com/wp-content/uploads/2018/09/bowsetteyellow-625x352.jpg',
    deviceYearClass: 2016,
    expoVersion: '2.5.9.1014765',
    isDevice: true,
    platform: {
      ios: {
        model: 'iPhone 7 Plus',
        platform: 'iPhone9,4',
        systemVersion: '11.3.1',
        userInterfaceIdiom: 'handset',
      },
    },
    score: 2,
    slug: 'users',
    timestamp: 1527197933844,
    uid: 'iFDnPddQulWwmIeWZy2nr6iujI23',
  },
  '0UUOFoP8xMTQ0lD5g8ax5CnIo2o2': {
    key: '0UUOFoP8xMTQ0lD5g8ax5CnIo2o2',
    apiKey: 'AIzaSyAfgPq82VdNqEZ8hqnOvYdD7kSPiFK9W1k',
    appName: '[DEFAULT]',
    appOwnership: 'expo',
    authDomain: 'keira-knightley-51df6.firebaseapp.com',
    createdAt: '1528533529000',
    deviceId: 'CDF20BAA-6D0A-4653-8719-CD20006580F7',
    deviceName: 'Expo iPhone X',
    deviceYearClass: 2017,
    displayName: 'Charlie',
    email: null,
    emailVerified: false,
    expoVersion: '2.5.9.1014765',
    isAnonymous: true,
    isDevice: true,
    lastLoginAt: '1528533529000',
    phoneNumber: null,
    photoURL: 'https://media.comicbook.com/2018/09/bowsette-1136107.jpeg',
    platform: {
      ios: {
        buildNumber: '2.5.9.1014765',
        model: 'iPhone X',
        platform: 'iPhone10,6',
        systemVersion: '11.3.1',
        userInterfaceIdiom: 'handset',
      },
    },
    providerData: [],
    redirectEventId: null,
    slug: 'test-app',
    uid: '0UUOFoP8xMTQ0lD5g8ax5CnIo2o2',
  },
};

class PagedList extends Component {
  items = [];
  lastKnownKey = null;

  state = {
    loading: false,
    data: {}, // userData,
    page: 1,
    seed: 1,
    error: null,
    refreshing: false,
  };

  addChild = (item) => {
    this.setState(previousState => ({
      data: {
        ...previousState.data,
        [item.key]: item,
      },
    }));
  };

  makeRemoteRequest = async () => {
    if (DEBUG) return;

    if (this.state.loading) return;

    this.setState({ loading: true });
    const timeout = setTimeout(
      () => this.setState({ loading: false, refreshing: false }),
      2000,
    );
    const { data, cursor } = await this.props.getPagedData({
      size: this.props.pageSize,
      start: this.lastKnownKey,
    });

    this.lastKnownKey = cursor;

    for (const child of data) {
      this.addChild(child);
    }
    this.setState({
      loading: false,
      refreshing: false,
      page: this.state.page + 1,
    });
    clearTimeout(timeout);
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  componentDidMount() {
    this.makeRemoteRequest();
  }

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page,
      },
      () => {
        // this.makeRemoteRequest();
      },
    );
  };

  getItemLayout = (data, index) => ({
    length: itemSize,
    offset: itemSize * index,
    index,
  });

  render() {
    const data = Object.keys(this.state.data).map(key => this.state.data[key]);

    return (
      <MessagesList
        data={data}
        getItemLayout={this.getItemLayout}
        onEndReachedThreshold={10}
        {...this.props}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this.handleLoadMore}
      />
    );
  }
}

// ListFooterComponent={
//   <Footer hasMore={true} isLoading={this.state.loading} />
// }

export default PagedList;
