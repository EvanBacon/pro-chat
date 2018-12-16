import React from 'react';
import { Bubble } from 'react-native-gifted-chat';

class ChatBackground extends React.Component {
  render() {
    const { props } = this;

    const { currentMessage } = props;

    let backgroundColor;
    if (currentMessage.imageUrl || currentMessage.location) {
      backgroundColor = 'transparent';
    }

    const _wrapperStyle = {
      right: {
        backgroundColor: backgroundColor || '#6C5891',
      },
      left: {
        backgroundColor: backgroundColor || '#E9EDF0',
      },
    };
    return <Bubble {...props} wrapperStyle={_wrapperStyle} />;
  }
}

export default ChatBackground;
