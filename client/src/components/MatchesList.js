import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import Meta from '../constants/Meta';

import EmptyListMessage from './EmptyListMessage';
import MatchesRow from './MatchesRow';
import UserList from './UserList';
import Assets from '../Assets';

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
const ConnectedEmptyMatchScreen = connect(
  () => ({}),
  {
    goHome: () => dispatch =>
      dispatch(NavigationActions.navigate({ routeName: 'Home' })),
  },
)(EmptyMatchesScreen);

class MatchesList extends React.PureComponent {
  state = {
    refreshing: false,
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
  };

  onPressRow = async ({ uid }) => this.props.navigate('OtherProfile', { uid });

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
      ListEmptyComponent={ConnectedEmptyMatchScreen}
      refreshing={this.state.refreshing}
      onRefresh={this._onRefresh}
      data={Object.keys(this.props.matches)}
      renderItem={this.renderItem}
    />
  );
}
export default connect(
  ({ match }) => ({
    matches: (match || {}).matches,
  }),
  {
    navigate: (routeName, params) => dispatch =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  },
)(MatchesList);
