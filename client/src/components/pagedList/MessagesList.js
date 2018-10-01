import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import { MessageRow } from './MessageRow';

export default class MessagesList extends React.Component {
  renderItem = ({ item }) => <MessageRow onPress={this.props.onPress} {...item} />;
  render() {
    return (
      <FlatList
        style={styles.container}
        keyExtractor={(item, index) => `ee-${index}`}
        contentContainerStyle={styles.contentContainer}
        renderItem={this.renderItem}
        ItemSeparatorComponent={Divider}
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {},
});
