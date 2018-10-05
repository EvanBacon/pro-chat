import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import Meta from '../constants/Meta';

import EmptyListMessage from './EmptyListMessage';
import MatchesRow from './MatchesRow';
import UserList from './UserList';
import Assets from '../Assets';
import { dispatch } from '@rematch/core';
import NavigationService from '../navigation/NavigationService';
import Fire from '../Fire';
import IdManager from '../IdManager';
import tabBarImage from './Tabs/tabBarImage';

const Images = Assets.images;
const EmptyMatchesScreen = ({ goHome }) => (
  <EmptyListMessage
    onPress={goHome}
    buttonTitle={Meta.no_matches_action}
    image={Images.empty.matches}
    title={Meta.no_matches_title}
    subtitle={Meta.no_matches_subtitle}
  />
);
// const ConnectedEmptyMatchScreen = connect(
//   () => ({}),
//   {
//     goHome: () => dispatch =>
//       dispatch(NavigationActions.navigate({ routeName: 'Home' })),
//   },
// )(EmptyMatchesScreen);

class MatchesList extends React.PureComponent {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    dispatch.users.getPaged({ size: 2 });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true }, () =>
      this.setState({ refreshing: false }));
  };

  onPressRow = async ({ uid }) => {
    console.log('GO TO:', { uid });
    if (IdManager.isInteractable(uid)) {
      // NavigationService.navigateToUserSpecificScreen('Profile', uid);
      NavigationService.navigateToUserSpecificScreen(
        'Chat',
        'fHgE92IvgLbUmbG2nU7DOyLsk5e2',
      );
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

  render() {
    const { style, data } = this.props;
    return (
      <UserList
        style={style}
        data={data}
        renderItem={this.renderItem}
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}
        ListEmptyComponent={EmptyMatchesScreen}
      />
    );
  }
}
const MatchesScreen = connect(({ users }) => {
  const { [Fire.shared.uid]: currentUser, ...otherUsers } = users;

  return {
    data: Object.values(otherUsers).filter(({ uid }) =>
      IdManager.isInteractable(uid)),
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
