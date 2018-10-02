import firebase from 'firebase';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import Meta from '../constants/Meta';
import Images from '../Images';
import * as MessagesProvider from '../provider/MessagesProvider';
import EmptyListMessage from './EmptyListMessage';
import MessageRow from './MessageRow';
import UserList from './UserList';

// import { findMessageChannels, removedMessageChannel } from '../redux/messages';
class MessageList extends React.Component {
  state = {
    refreshing: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.badgeCount !== this.props.badgeCount) {
      // firebase.messaging().setBadgeNumber(nextProps.badgeCount);
    }
  }

  componentWillMount() {
    // dispatch.chats.findMessageChannels();
  }

  componentDidMount() {
    // firebase.messaging().onMessage(({ notification, type, nid }) => {
    //   if (type.split('-').shift() === 'message') {
    //     this._onRefresh();
    //   }
    // });
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    const messages = this.props.channels.map(({ uid, channel }) =>
      MessagesProvider.getLastMessage({ uid, channel }));

    await Promise.all(messages);

    this.setState({ refreshing: false });
  };

  onPressRow = async ({ item: { uid } }) =>
    this.props.navigate('Chat', { uid });

  renderItem = ({ item, index }) => (
    <MessageRow
      key={item.channel}
      message={item || {}}
      onPress={event => this.onPressRow({ item, index, event })}
      onLongPress={() => MessagesProvider.deleteChannel(item.channel)}
    />
  );

  renderEmpty = () => (
    <EmptyListMessage
      onPress={this.props.goHome}
      image={Images.empty.messages}
      buttonTitle={Meta.no_messages_action}
      title={Meta.no_messages_title}
      subtitle={Meta.no_messages_subtitle}
    />
  );

  render = () => (
    <UserList
      ListEmptyComponent={this.renderEmpty}
      style={this.props.style}
      refreshing={this.state.refreshing}
      onRefresh={this._onRefresh}
      data={this.props.channels}
      renderItem={this.renderItem}
    />
  );
}
export default connect(
  ({ matches = {}, chats = {} }) => {
    const combined = { ...matches, ...chats };

    const _channels = Object.keys(combined)
      .map(val => combined[val])
      .sort((a, b) => b.date - a.date);

    let badgeCount = 0;
    for (const channel of _channels) {
      if (channel.seen === false) {
        badgeCount += 1;
      }
    }

    return {
      channels: _channels,
      badgeCount,
    };
  },
  {
    // goHome: () => dispatch =>
    //   dispatch(NavigationActions.navigate({ routeName: 'Home' })),
    // navigate: (routeName, params) => dispatch =>
    //   dispatch(NavigationActions.navigate({ routeName, params })),
    // findMessageChannels,
    // removedMessageChannel,
  },
)(MessageList);
