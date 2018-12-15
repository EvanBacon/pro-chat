import React from 'react';
import { connect } from 'react-redux';

import Assets from '../Assets';
import Meta from '../constants/Meta';
import Fire from '../Fire';
import IdManager from '../IdManager';
import NavigationService from '../navigation/NavigationService';
import { dispatch } from '../rematch/dispatch';
import EmptyListMessage from './EmptyListMessage';
import MatchesRow from './MatchesRow';
import PagedListFooter from './pagedList/PagedListFooter';
import tabBarImage from './Tabs/tabBarImage';
import UserList from './UserList';

const EmptyMatchesScreen = () => (
  <EmptyListMessage
    onPress={() => NavigationService.goBack()}
    buttonTitle={Meta.no_matches_action}
    image={Assets.images.empty.matches}
    title={Meta.no_matches_title}
    subtitle={Meta.no_matches_subtitle}
  />
);
class MatchesList extends React.PureComponent {
  state = {
    refreshing: false,
  };

  componentDidMount() {}

  _onRefresh = () => {
    this.setState({ refreshing: true });

    dispatch.hasMoreUsers.clear();
    dispatch.isLoadingUsers.end();

    dispatch.users.refreshAsync({
      callback: () => this.setState({ refreshing: false }),
    });
  };

  // Nic: anon PeVeHK92uoWQceDHqcOZokFsUHY2
  onPressRow = async ({ uid }) => {
    console.log('GO TO:', { uid });
    if (IdManager.isInteractable(uid)) {
      // NavigationService.navigateToUserSpecificScreen('Profile', uid);
      NavigationService.navigateToUserSpecificScreen('Chat', uid);
    }
  };

  renderItem = ({ item }) => {
    const { name, image, uid } = item;
    return (
      <MatchesRow
        name={name}
        image={image}
        uid={uid}
        onPress={this.onPressRow}
      />
    );
  };

  // TODOD: This...
  // getItemLayout = (data, index) => ({
  //   length: itemSize,
  //   offset: itemSize * index,
  //   index,
  // });

  handleLoadMore = () => {
    dispatch.users.getPaged({ size: 5 });
  };

  render() {
    const {
      style, data, hasMore, isLoading,
    } = this.props;
    return (
      <UserList
        style={style}
        data={data}
        renderItem={this.renderItem}
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={EmptyMatchesScreen}
        ListFooterComponent={
          <PagedListFooter hasMore={hasMore} isLoading={isLoading} />
        }
      />
    );
  }
}

const MatchesScreen = connect(({ users, hasMoreUsers, isLoadingUsers }) => {
  const { [Fire.shared.uid]: currentUser, ...otherUsers } = users;

  return {
    data: Object.values(otherUsers).filter(({ uid }) => IdManager.isInteractable(uid)),
    hasMore: hasMoreUsers,
    isLoading: isLoadingUsers,
  };
})(MatchesList);

MatchesScreen.navigationOptions = {
  title: 'Matches',
  tabBarIcon: tabBarImage({
    active: Assets.images.match_active,
    inactive: Assets.images.match_inactive,
  }),
};

export default MatchesScreen;
