import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
// import { FlatList } from 'react-native-gesture-handler';

import RefreshControl from './primitives/RefreshControl';
import Colors from '../constants/Colors';

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
            color={Colors.tintColor}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={StyleSheet.flatten([
          style,
          { flex: 1, backgroundColor: Colors.lightGrayishBlue },
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
