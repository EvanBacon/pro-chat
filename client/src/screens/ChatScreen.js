import { dispatch } from '../rematch/dispatch';
import { Keyboard } from 'expo';
import React from 'react';
import {
  Clipboard,
  InteractionManager,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Bubble, GiftedChat, MessageText } from 'react-native-gifted-chat';
import { connect } from 'react-redux';

import AccessoryBar from '../components/AccessoryBar';
import EmptyChat from '../components/EmptyChat';
import GifScroller from '../components/GifScroller';
import Time from '../components/Time';
import Meta from '../constants/Meta';
import Fire from '../Fire';
import NavigationService from '../navigation/NavigationService';
import firebase from '../universal/firebase';
import CustomView from './CustomView';

class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerStyle: {
      opacity: 1,
    },
  });

  state = {
    // prefs: {},
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
      name: firebase.auth().currentUser.displayName,
      image: firebase.auth().currentUser.photoURL,
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
      };
      ['image', 'text', 'location'].forEach(key => {
        if (message[key]) chat[key] = message[key];
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

  deleteMessage = key => {
    dispatch.chats.deleteMessageFromChannel({
      groupId: this.props.groupId,
      key,
    });
    // this.ref(`messages/${this.state.channel}/users/${this.uid}/${key}`).remove();

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
    <ButeBackground
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
      return <ButeFooter name={otherUser.name} />;
    }
    return null;
  };

  renderBubble = props => <ButeBubble {...props} />;

  onLoadEarlier = () => dispatch.chats.loadEarlier(this.props.channel);

  onPressAvatar = ({ _id: uid }) =>
    NavigationService.navigateToUserSpecificScreen('Profile', uid);

  renderAccessory = () => (
    <AccessoryBar
      channel={this.props.channel}
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
      .logEvent('sent_gif', { channel: this.props.channel, url });
  };

  onInputTextChanged = text => {
    let gifOpen = this.state.gifActive;
    if (gifOpen && !text) {
      gifOpen = false;
    }
    // dispatch.chats.updatedInputText({
    //   channel: this.props.channel,
    //   input: text,
    // });
    this.setState({ userInput: text });
    // dispatch.chats.updatedGifOpened({
    //   channel: this.props.channel,
    //   isOpened: gifOpen,
    // });
    this.isUserEditing = text !== '';
  };

  onLongPress = (context, message) => {
    const {
      // from: _from,
      _id,
    } = message;

    // const canDelete = _from === this.uid;
    if (message.text) {
      const options = [];
      if (message.text) {
        options.push('Copy Text');
      }
      // if (canDelete) {
      options.push('Delete Message');
      // }
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
              this.deleteMessage(_id);
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
          showUserAvatar={true}
          renderAvatarOnTop={false}
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

const ButeFooter = ({ name }) => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>{`${name} ${Meta.is_typing}`}</Text>
  </View>
);

const ButeBackground = ({ image, timestamp, name }) => (
  <View style={StyleSheet.absoluteFill}>
    <EmptyChat image={image} timestamp={timestamp} name={name} />
  </View>
);

const ButeBubble = props => {
  const { currentMessage } = props;

  let backgroundColor;
  if (currentMessage.imageUrl || currentMessage.location) {
    backgroundColor = 'transparent';
  }

  const _wrapperStyle = {
    right: {
      backgroundColor: backgroundColor || wrapperStyle.right.backgroundColor,
    },
    left: {
      backgroundColor: backgroundColor || wrapperStyle.left.backgroundColor,
    },
  };
  // {...props} wrapperStyle={_wrapperStyle}
  return <Bubble {...props} wrapperStyle={_wrapperStyle} />;
};

// loadEarlier={this.props.channelHasMore}
// onLoadEarlier={this.onLoadEarlier}
// isLoadingEarlier={this.props.isLoadingEarlier}
// renderLoading={Loading}

const wrapperStyle = {
  right: {
    backgroundColor: '#6C5891',
    // color: 'white'
  },
  left: {
    backgroundColor: '#E9EDF0',
    // color: '#57585A'
  },
};

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
    const { [otherUserId]: otherUser = {} } = users;
    const { [groupId]: messages = {} } = chats;
    const { [groupId]: _channelHasMore = false } = channelHasMore;
    const { [groupId]: _isTyping = false } = isTyping;
    const { [groupId]: _isLoadingEarlier = false } = isLoadingEarlier;

    chatProps = {
      groupId,
      otherUserId,
      otherUser,

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
});
