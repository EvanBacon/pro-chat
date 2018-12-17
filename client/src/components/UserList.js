import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';

import RefreshControl from './primitives/RefreshControl';

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
            color="#B996FC"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={StyleSheet.flatten([
          style,
          { flex: 1, backgroundColor: '#EDF2F6' },
        ])}
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
