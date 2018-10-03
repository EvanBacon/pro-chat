import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import RefreshControl from './RefreshControl';

const top = 48;
export default class UserList extends React.Component {
  render() {
    const {
      debugTestEmpty = false,
      style,
      onRefresh,
      refreshing,
      data,
      renderItem,
      ListEmptyComponent,
      ...props
    } = this.props;

    return (
      <FlatList
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            tintColor="#B996FC"
            titleColor="#B996FC"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={StyleSheet.flatten([style, { flex: 1 }])}
        contentInset={{ top }}
        contentOffset={{ y: -top }}
        data={debugTestEmpty ? [] : data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={renderItem}
        {...props}
      />
    );
  }
}
