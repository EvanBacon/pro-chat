import React from 'react';
import { connect } from 'react-redux';

import { MessagesList } from '../components/pagedList/MessagesList';
import Fire from '../Fire';

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages',
  };

  componentDidMount() {
    Fire.shared.getMessageList();
  }

  onPress = ({ item: { groupId, name, uid } }) => {
    this.props.navigation.navigate('Chat', {
      groupId,
      title: name,
      uid, // : Fire.shared.getOtherUsersFromChatGroup(groupId)[0],
    });
  };

  render() {
    const { messages } = this.props;
    return (
      <MessagesList data={Object.values(messages)} onPress={this.onPress} />
    );
  }
}

export default connect(({ messages }) => ({
  messages,
}))(MessagesScreen);
