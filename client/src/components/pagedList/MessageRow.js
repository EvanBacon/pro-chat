import React from 'react';
import { Image, Text, View } from 'react-native';
import { List } from 'react-native-paper';

export class MessageRow extends React.Component {
  onPress = () => {
    this.props.onPress({ item: this.props });
  };

  render() {
    const {
      name,
      photoURL,
      message,
      isSeen,
      timeAgo,
      // groupId,
      // uid,
      // isGroupChat,
      // isSent,
    } = this.props;
    return (
      <List.Item
        title={name}
        description={message}
        onPress={this.onPress}
        left={props => <Left {...props} isSeen={isSeen} photoURL={photoURL} />}
        right={({ style, ...props }) => <Text style={[style, { textAlign: 'right' }]}>{timeAgo}</Text>}
      />
    );
  }
}

const Left = ({ isSeen, photoURL }) => (
  <View>
    {photoURL && <Avatar uri={photoURL} />}
    {!isSeen && <NotificationDot />}
  </View>
);

const NotificationDot = () => (
  <View
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: 'cyan',
      position: 'absolute',
    }}
  />
);

const Avatar = ({ uri }) => (
  <Image
    style={{
      resizeMode: 'cover',
      backgroundColor: 'gray',
      height: 50,
      width: 50,
      borderRadius: 25,
      marginRight: 8,
    }}
    source={{ uri }}
  />
);
