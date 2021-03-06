import { Keyboard } from 'expo';
import React from 'react';
import {
  Clipboard,
  InteractionManager,
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';
import { GiftedChat, MessageText } from 'react-native-gifted-chat';
import { connect } from 'react-redux';

import AccessoryBar from '../components/chat/AccessoryBar';
import ChatBackground from '../components/chat/ChatBackground';
import ChatBubble from '../components/chat/ChatBubble';
import ChatFooter from '../components/chat/ChatFooter';
import GifScroller from '../components/chat/GifScroller';
import Time from '../components/Time';
import Fire from '../Fire';
import NavigationService from '../navigation/NavigationService';
import { dispatch } from '../rematch/dispatch';
import firebase from '../universal/firebase';
import CustomView from './CustomView';
import AvatarImage from '../components/Image/AvatarImage';
import ChatOptions from '../components/Button/ChatOptions';

class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title');
    const uid = navigation.getParam('uid');
    return {
      title: title,
      headerStyle: {
        opacity: 1,
      },
      headerRight: (
        <View style={{ marginRight: 24 }}>
          <ChatOptions selected uid={uid} />
        </View>
      ),
    };
  };

  state = {
    // keyboard: 0,
    gifActive: false,
    userInput: '',
  };

  get uid() {
    return Fire.shared.uid;
  }

  get user() {
    return {
      _id: this.uid, // sent messages should have same user._id
      name: this.props.currentUser.name,
      image: this.props.currentUser.image,
    };
  }

  get isUserEditing() {
    return this._isUserEditing;
  }

  set isUserEditing(value) {
    if (this._isUserEditing === value) return;

    this._isUserEditing = value;

    const isTyping = !!value;

    dispatch.isTyping.setAsync({
      isTyping,
      groupId: this.props.groupId,
    });
  }

  _isUserEditing = false;

  constructor(props) {
    super(props);

    const { title } = props;
    if (title && title !== '') {
      props.navigation.setParams({ title });
    }
  }

  componentWillReceiveProps({ title }) {
    if (this.props.title !== title) {
      this.props.navigation.setParams({ title });
    }
  }

  async componentDidMount() {
    const { otherUserId, groupId } = this.props;
    // dispatch.chats.clear({ uid: groupId });
    console.log('mounted chat', otherUserId);
    dispatch.chats.startChatting({
      groupId,
      uids: otherUserId,
      callback: unsubscribe => {
        this.unsubscribe = unsubscribe;
      },
    });
    dispatch.isTyping.observe({ groupId, uid: otherUserId }); // TODO: UNSUB
    // dispatch.users.getProfileImage({ uid: otherUserId });
  }

  componentWillUnmount() {
    // const { channel } = this.state;
    this.isUserEditing = false;
    // TODO: unsubscribe: this.unsubscribe();

    dispatch.isTyping.unsubscribe({
      groupId: this.props.groupId,
    });
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onSendMessage = async (messages = []) => {
    this.isUserEditing = false;
    for (const message of messages) {
      const chat = {
        seen: null,
        senderName: this.user.name,

        // pushNotification: {
        //   notification: {
        //     badge: '1',
        //     // tag?: string;
        //     // body?: string;
        //     // icon?: string;
        //     // badge?: string;
        //     // color?: string;
        //     // sound?: string;
        //     // title?: string;
        //     // bodyLocKey?: string;
        //     // bodyLocArgs?: string;
        //     // clickAction?: string;
        //     // titleLocKey?: string;
        //     // titleLocArgs?: string;
        //   },
        //   data: {
        //     navigation: JSON.stringify({ screen: 'Chat', senderId: this.uid }),
        //   },
        //   options: {
        //     // dryRun?: boolean;
        //     // priority?: string;
        //     // timeToLive?: number;
        //     // collapseKey?: string;
        //     // mutableContent?: boolean;
        //     // contentAvailable?: boolean;
        //     // restrictedPackageName?: string;
        //   },
        // },
      };
      ['image', 'storagePath', 'text', 'location'].forEach(key => {
        if (key in message) chat[key] = message[key];
      });
      Fire.shared.sendMessage(chat, this.props.groupId);
    }
  };

  _keyboardDidShow = () => {
    // this.setState({ keyboard: 0 })
    // this.setState({gifOpen: false })
    InteractionManager.runAfterInteractions(() => {
      dispatch.chats.updatedGifOpened({
        isOpened: false,
      });
      this._GiftedMessenger.setBottomOffset(
        this._GiftedMessenger.getKeyboardHeight(),
      );
    });
  };

  _keyboardDidHide = () => {
    // this.setState({ keyboard: 0 })
    // this.setState({ keyboard: 0 });
  };

  deleteMessage = message => {
    dispatch.chats.deleteMessageFromChannel({
      groupId: this.props.groupId,
      messageId: message._id,
      storagePath: message.storagePath,
    });
    // this.ref(`messages/${this.state.groupId}/users/${this.uid}/${key}`).remove();

    // /// Optimistic UI - Remove Message Right Away ... This Could Be Faster Tho...
    // let _messages = [];
    // for (let i = 0; i < this.state.messages.length; i++) {
    //   const message = this.state.messages[i];
    //   if (message._id !== key) {
    //     _messages.push(message);
    //   }
    // }
    // this.setState({ messages: _messages });
  };

  renderBackground = () => (
    <ChatBackground
      name={this.props.otherUser.name}
      image={this.props.otherUser.image}
      timestamp={this.props.matchedTimestamp}
    />
  );
  // renderActions={CustomActions}

  renderCustomView = props => <CustomView {...props} />;

  renderFooter = () => {
    const { isTyping, otherUser } = this.props;
    if (isTyping) {
      return <ChatFooter name={otherUser.name} />;
    }
    return null;
  };

  renderBubble = props => <ChatBubble {...props} />;

  onLoadEarlier = () => dispatch.chats.loadEarlier(this.props.groupId);

  onPressAvatar = ({ _id: uid }) =>
    NavigationService.navigateToUserSpecificScreen('Profile', uid);

  renderAccessory = () => (
    <AccessoryBar
      groupId={this.props.groupId}
      text={this.state.userInput}
      gifActive={this.state.gifActive}
      onSend={this.onSendMessage}
      onGif={this.onGif}
    />
  );

  onGif = active => {
    this.setState({ gifActive: active });
    Keyboard.dismiss();
  };

  renderChatFooter = () => {
    const { gifActive, userInput } = this.state;
    if (gifActive && userInput && userInput.length > 0) {
      return (
        <GifScroller
          style={{ width: '100%', height: 100, backgroundColor: 'white' }}
          inputText={userInput}
          handleGifSelect={this.handleGifSelect}
        />
      );
    }
    return null;
  };

  handleGifSelect = url => {
    const gifMessage = { image: url };
    this.onSendMessage([gifMessage]);
    // this.onSendMessage([{ image: { uri: url, name: this.state.userInput } }]);
    firebase
      .analytics()
      .logEvent('sent_gif', { groupId: this.props.groupId, url });
  };

  onInputTextChanged = text => {
    let gifOpen = this.state.gifActive;
    if (gifOpen && !text) {
      gifOpen = false;
    }
    // dispatch.chats.updatedInputText({
    //   groupId: this.props.groupId,
    //   input: text,
    // });
    this.setState({ userInput: text });
    // dispatch.chats.updatedGifOpened({
    //   groupId: this.props.groupId,
    //   isOpened: gifOpen,
    // });
    this.isUserEditing = text !== '';
  };

  onLongPress = (context, message) => {
    const {
      // from: _from,
      _id,
      user = {},
    } = message;

    const canDelete = user._id === this.uid;

    const options = [];

    if (message.text) {
      options.push('Copy Text');
    }
    if (canDelete) {
      options.push('Delete Message');
    }

    if (options.length) {
      options.push('Cancel');
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        buttonIndex => {
          switch (options[buttonIndex].toLowerCase()) {
            case 'copy text':
              Clipboard.setString(message.text);
              break;
            case 'delete message':
              this.deleteMessage(message);
              break;
            default:
              break;
          }
        },
      );
    }
  };

  render() {
    return (
      <View style={[styles.container]}>
        {this.props.messages.length === 0 && this.renderBackground()}
        <GiftedChat
          ref={c => {
            this._GiftedMessenger = c;
          }}
          messages={this.props.messages}
          onSend={this.onSendMessage}
          keyboardShouldPersistTaps="handled"
          onPressAvatar={this.onPressAvatar}
          renderAccessory={this.renderAccessory}
          renderChatFooter={this.renderChatFooter}
          parseText
          isAnimated
          showUserAvatar
          renderAvatar={({ onPressAvatar, currentMessage }) => {
            const user =
              currentMessage.user._id === this.uid
                ? this.props.currentUser
                : this.props.otherUser;
            return (
              <AvatarImage
                onPress={() => this.onPressAvatar(currentMessage.user)}
                name={user.name}
                avatar={user.image}
                avatarStyle={styles.avatarStyle}
              />
            );
          }}
          renderCustomView={this.renderCustomView}
          onLongPress={this.onLongPress}
          onInputTextChanged={this.onInputTextChanged}
          renderFooter={this.renderFooter}
          renderTime={props => <Time {...props} />}
          renderMessageText={props => <MessageText {...props} />}
          renderBubble={this.renderBubble}
          listViewProps={listViewProps}
          user={this.user}
        />
      </View>
    );
  }
}

const listViewProps = {
  style: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainerStyle: {
    paddingBottom: 64,
    backgroundColor: 'transparent',
  },
  keyboardDismissMode: 'on-drag',
  keyboardShouldPersistTaps: 'handled',
};

// loadEarlier={this.props.channelHasMore}
// onLoadEarlier={this.onLoadEarlier}
// isLoadingEarlier={this.props.isLoadingEarlier}
// renderLoading={Loading}

const mergeProps = (state, dispatchProps, ownProps) => {
  const { params = {} } = ownProps.navigation.state;
  const { uid, groupId } = params;

  const {
    chats,
    users,
    channelHasMore,
    isLoadingEarlier,
    isTyping,
    ...stateProps
  } = state;

  let chatProps = {};
  if (groupId) {
    const otherUserId = uid;
    const {
      [otherUserId]: otherUser = {},
      [Fire.shared.uid]: currentUser = {},
    } = users;
    const { [groupId]: messages = {} } = chats;
    const { [groupId]: _channelHasMore = false } = channelHasMore;
    const { [groupId]: _isTyping = false } = isTyping;
    const { [groupId]: _isLoadingEarlier = false } = isLoadingEarlier;

    chatProps = {
      groupId,
      otherUserId,
      otherUser,
      currentUser,
      title: otherUser.name,
      channelHasMore: _channelHasMore,
      isTyping: _isTyping,
      isLoadingEarlier: _isLoadingEarlier,
      messages: Object.values(messages).sort(
        (a, b) => a.createdAt < b.createdAt,
      ),
    };
  }
  // TODO: Add: matchedTimestamp
  console.log({ chatProps: chatProps.messages });
  return {
    ...ownProps,
    ...dispatchProps,
    ...chatProps,
    ...stateProps,
  };
};

export default connect(
  ({ isTyping, isLoadingEarlier, channelHasMore, chats, users }) => ({
    isTyping,
    isLoadingEarlier,
    channelHasMore,
    chats,
    users,
  }),
  {},
  mergeProps,
)(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // f7f7f7
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  avatarStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
