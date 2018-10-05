import { dispatch } from '@rematch/core';
import React from 'react';
import { connect } from 'react-redux';

import Meta from '../constants/Meta';
import Fire from '../Fire';
import IdManager from '../IdManager';
import Images from '../Images';
import NavigationService from '../navigation/NavigationService';
import firebase from '../universal/firebase';
import EmptyListMessage from './EmptyListMessage';
import MessageRow from './MessageRow';
import UserList from './UserList';
import tabBarImage from './Tabs/tabBarImage';
import Assets from '../Assets';

class MessageList extends React.Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    dispatch.notifications.registerAsync();

    this.unsubscribe = firebase.messaging().onMessage(async ({ type }) => {
      if (type.split('-').shift() === 'message') {
        await Fire.shared.getMessageList();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentWillReceiveProps({ badgeCount }) {
    if (badgeCount !== this.props.badgeCount) {
      firebase.messaging().setBadgeNumber(badgeCount);
    }
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await Fire.shared.getMessageList();
    this.setState({ refreshing: false });
  };

  onPressRow = async ({ item: { groupId: channel } }) => {
    const uid = IdManager.getOtherUserFromChatGroup(channel);
    console.log('Int', uid, channel);
    if (IdManager.isInteractable(uid)) {
      NavigationService.navigateToUserSpecificScreen('Chat', uid);
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

  render() {
    return (
      <UserList
        ListEmptyComponent={MessagesEmptyListMessage}
        style={this.props.style}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        data={this.props.data}
        renderItem={this.renderItem}
      />
    );
  }
}

const MessagesEmptyListMessage = () => (
  <EmptyListMessage
    onPress={() => NavigationService.goBack()}
    image={Images.empty.messages}
    buttonTitle={Meta.no_messages_action}
    title={Meta.no_messages_title}
    subtitle={Meta.no_messages_subtitle}
  />
);

const MessageScreen = connect(
  ({ messages = {} }) => {
    const badgeCount = 0;
    return {
      data: Object.values(messages),
      badgeCount,
    };
  },
  {},
)(MessageList);

MessageScreen.navigationOptions = {
  title: 'Chat',
  tabBarIcon: tabBarImage({
    active: Assets.images.chat_active,
    inactive: Assets.images.chat_inactive,
  }),
};

export default MessageScreen;
