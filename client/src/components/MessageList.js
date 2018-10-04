import { dispatch } from '@rematch/core';
import React from 'react';
import { connect } from 'react-redux';

import Meta from '../constants/Meta';
import Images from '../Images';
import EmptyListMessage from './EmptyListMessage';
import MessageRow from './MessageRow';
import UserList from './UserList';
import Settings from '../constants/Settings';

import NavigationService from '../navigation/NavigationService';
import Fire from '../Fire';
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
      dispatch.chats.getLastMessage({ uid, channel }));

    await Promise.all(messages);

    this.setState({ refreshing: false });
  };

  onPressRow = async ({ item: { channel } }) => {
    const uid = Fire.shared.getOtherUsersFromChatGroup(channel)[0];
    console.log('CHAT', uid, channel);

    if (Fire.shared.canMessage({ uid })) {
      NavigationService.navigate('Chat', { uid });
    }
  };

  renderItem = ({ item, index }) => (
    <MessageRow
      key={item.uid}
      message={item || {}}
      onPress={event => this.onPressRow({ item, index, event })}
      onLongPress={() => dispatch.chats.deleteChannel(item.channel)}
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
const MessageScreen = connect(
  ({ matches = {}, chats = {} }) => {
    const combined = { ...matches, ...chats };

    // All messages ever [ { [key]: { ... } } ]
    const _channels = Object.keys(combined).map(val => ({
      messages: combined[val],
      id: val,
    }));
    // .sort((a, b) => b.date - a.date);

    const firstMessages = [];

    for (const channel of _channels) {
      const messages = Object.values(channel.messages);
      if (messages.length && messages[0]) {
        firstMessages.push({
          channel: channel.id,
          ...messages[0],
        });
      } else {
        // TODO: Empty...
        firstMessages.push({
          channel: channel.id,
        });
      }
    }

    const badgeCount = 0;
    // for (const channel of _channels) {
    //   if (channel.seen === false) {
    //     badgeCount += 1;
    //   }
    // }

    console.log('MessageList: Props: Users: ONEEEPUNCH', {
      channels: firstMessages,
    });
    return {
      channels: firstMessages,
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

MessageScreen.navigation = { title: 'Messages' };

export default MessageScreen;
