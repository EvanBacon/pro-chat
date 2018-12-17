import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import Meta from '../../constants/Meta';

const ChatFooter = ({ name }) => (
  <View style={styles.footerContainer}>
    <Text style={styles.footerText}>{`${name} ${Meta.is_typing}`}</Text>
  </View>
);

export default ChatFooter;

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
