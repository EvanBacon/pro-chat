import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import UserImage from './UserImage';
import IdManager from '../IdManager';
import NavigationService from '../navigation/NavigationService';
import { dispatch } from '../rematch/dispatch';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default class MessageRow extends React.PureComponent {
  onPress = () => {
    const { groupId } = this.props;
    const uid = IdManager.getOtherUserFromChatGroup(groupId);
    if (IdManager.isInteractable(uid)) {
      NavigationService.navigateToUserSpecificScreen('Chat', uid);
    } else {
      console.warn("Can't interact", { uid, groupId });
    }
  };

  onLongPress = () => {
    dispatch.chats.deleteChannel(this.props.groupId);
  };

  render() {
    const { name, image, isSeen, isOutgoing, message, timeAgo } = this.props;
    return (
      <TouchableHighlight
        style={{ backgroundColor: Colors.lightGrayishBlue }}
        underlayColor={Colors.lightishGrayBlue}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
      >
        <View
          style={{
            flex: 1,
            height: 72,
            paddingHorizontal: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <UserImage
              name={name}
              image={image}
              style={{ marginRight: 14 }}
              isNew={isSeen === false}
            />

            <Message isOutgoing={isOutgoing} title={name} subtitle={message} />
          </View>
          <Timestamp>{timeAgo}</Timestamp>
        </View>
      </TouchableHighlight>
    );
  }
}

export const Timestamp = ({ children }) => (
  <Text style={{ textAlign: 'right', opacity: 0.8 }}>{children}</Text>
);

export const Message = ({ title, isOutgoing, subtitle }) => (
  <View>
    <Text
      numberOfLines={1}
      style={{ fontWeight: 'bold', color: Colors.veryDarkGrayishBlue }}
    >
      {title}
    </Text>
    <View style={{ flexDirection: 'row' }}>
      {isOutgoing && (
        <FontAwesome
          name="reply"
          size={10}
          color={Colors.veryDarkGrayishBlue}
          style={{ marginRight: 4, alignSelf: 'center' }}
        />
      )}
      <Text style={{ color: Colors.veryDarkGrayishBlue }} numberOfLines={2}>
        {subtitle}
      </Text>
    </View>
  </View>
);
