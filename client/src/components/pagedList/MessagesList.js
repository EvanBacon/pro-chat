import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import { MessageRow } from './MessageRow';
import { FlatList } from 'react-native-gesture-handler';
import AppleStyleSwipeableRow from './AppleStyleSwipeableRow';

export default class MessagesList extends React.Component {
  renderItem = ({ item }) => {
    return (
      <AppleStyleSwipeableRow>
        <MessageRow onPress={this.props.onPress} {...item} />
      </AppleStyleSwipeableRow>
    );
  };
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
