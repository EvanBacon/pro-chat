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
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
  };

  onPressRow = async ({ uid }) => NavigationService.navigate('Chat', { uid });

  renderItem = ({ item: key, index }) => {
    const { image, name, uid } = this.props.matches[key];
    return (
      <MatchesRow
        image={image}
        name={name}
        onPress={event => this.onPressRow({ uid, index, event })}
      />
    );
  };

  render = () => (
    <UserList
      style={this.props.style}
      ListEmptyComponent={EmptyMatchesScreen}
      refreshing={this.state.refreshing}
      onRefresh={this._onRefresh}
      data={Object.keys(this.props.matches)}
      renderItem={this.renderItem}
    />
  );
}
const MatchesScreen = connect(({ users: matches }) => ({
  matches,
}))(MatchesList);

MatchesScreen.navigation = { title: 'Matches' };

export default MatchesScreen;
