import React from 'react';
import { connect } from 'react-redux';

import { MessagesList } from '../components/pagedList/MessagesList';
import Fire from '../Fire';
import NavigationService from '../navigation/NavigationService';

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages',
  };

  componentDidMount() {
    Fire.shared.getMessageList();
  }

  onPress = ({ item: { groupId, name, uid } }) => {
    NavigationService.navigateToUserSpecificScreen('Chat', uid, {
      groupId,
      title: name,
    });
  };

  render() {
    const { chats } = this.props;
    return <MessagesList data={Object.values(chats)} onPress={this.onPress} />;
  }
}

export default connect(({ chats }) => ({
  chats,
}))(MessagesScreen);
