import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';

import UserImage from './UserImage';

export default class MessageRow extends React.PureComponent {
  render() {
    const {
      message: {
        name, image, isSeen, isSent, message, timeAgo,
      },
      onPress,
      onLongPress,
    } = this.props;
    return (
      <TouchableHighlight
        underlayColor="#ddd"
        onPress={onPress}
        onLongPress={onLongPress}
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
            <Message title={name} subtitle={message} />
          </View>
          <Timestamp>{timeAgo}</Timestamp>
        </View>
      </TouchableHighlight>
    );
  }
}

export const Timestamp = ({ children }) => (
  <Text style={{ textAlign: 'right' }}>{children}</Text>
);

export const Message = ({ title, subtitle }) => (
  <View>
    <Text numberOfLines={1}>{title}</Text>
    <Text numberOfLines={2}>{subtitle}</Text>
  </View>
);
