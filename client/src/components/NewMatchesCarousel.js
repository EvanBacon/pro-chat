import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import IdManager from '../IdManager';
import Carousel from './Carousel';
import { dispatch } from '../rematch/dispatch';
import Colors from '../constants/Colors';
class NewMatchesCarousel extends React.Component {
  static defaultProps = {
    data: [],
  };

  static propTypes = {
    data: PropTypes.array,
    hasMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  state = {
    refreshing: false,
  };

  componentDidMount() {
    if (!this.props.data.length) {
      this.handleLoadMore();
    }
  }

  handleLoadMore = () => {
    console.log('LOADMOREUSERS');
    dispatch.users.getPaged({ size: 5 });
  };

  _onRefresh = () => {
    if (this.state.refreshing) {
      return;
    }
    this.setState({ refreshing: true });

    dispatch.hasMoreUsers.clear();
    dispatch.isLoadingUsers.end();

    dispatch.users.refreshAsync({
      callback: () => this.setState({ refreshing: false }),
    });
  };

  render() {
    // TODO: Fix screen
    return (
      <Carousel
        listProps={{
          refreshing: this.state.refreshing,
          onRefresh: this._onRefresh,
          onEndReached: this.handleLoadMore,
          onEndReachedThreshold: 0.1,
        }}
        screen="Messages"
        destination="Chat"
        title={'Users'}
        style={styles.container}
        titleStyle={styles.title}
        data={this.props.data}
      />
    );
  }
}

const ConnectedNewMatchesCarousel = connect(
  ({ users, hasMoreUsers, isLoadingUsers }) => {
    const { [IdManager.uid]: currentUser, ...otherUsers } = users;

    const data = Object.values(otherUsers).filter(({ uid }) =>
      IdManager.isInteractable(uid),
    );
    console.log('Users: ', data);
    return {
      data,
      hasMore: hasMoreUsers,
      isLoading: isLoadingUsers,
    };
  },
)(NewMatchesCarousel);

export default ConnectedNewMatchesCarousel;

const styles = StyleSheet.create({
  container: {
    minHeight: 96,
    marginTop: 0,
    minWidth: '100%',
    backgroundColor: Colors.lightGrayishBlue,
    borderTopWidth: 0,
    paddingTop: 0,
    paddingBottom: 10,
    paddingVertical: undefined,
  },
  title: {
    textAlign: 'left',
    marginHorizontal: 16,
    color: 'black',
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
