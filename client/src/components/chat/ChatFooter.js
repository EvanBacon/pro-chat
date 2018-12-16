import React from 'react';
import { Text, View } from 'react-native';

import Meta from '../../constants/Meta';

const ChatFooter = ({ name }) => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>{`${name} ${Meta.is_typing}`}</Text>
  </View>
);

export default ChatFooter;
