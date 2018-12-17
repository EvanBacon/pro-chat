import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import IdManager from '../IdManager';
import Carousel from './Carousel';
import { dispatch } from '../rematch/dispatch';
class NewMatchesCarousel extends React.Component {
  static defaultProps = {
    data: [],
  };

  static propTypes = {
    data: PropTypes.array,
    hasMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    dispatch.users.getPaged({ size: 5 });
  }

  render() {
    // TODO: Fix screen
    return (
      <Carousel
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

    return {
      data: Object.values(otherUsers).filter(({ uid }) =>
        IdManager.isInteractable(uid),
      ),
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
    backgroundColor: '#EDF2F6',
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
