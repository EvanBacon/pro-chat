import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

class Footer extends React.Component {
  static propTypes = {
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    hasMessage: PropTypes.bool,
    hasMoreTitle: PropTypes.string,
    noMoreTitle: PropTypes.string,
  };

  static defaultProps = {
    hasMore: false,
    isLoading: false,
    hasMessage: false,
    hasMoreTitle: 'Loading more...',
    noMoreTitle: 'No Mas!',
  };

  render() {
    const {
      hasMore,
      hasMessage,
      isLoading,
      hasMoreTitle,
      noMoreTitle,
    } = this.props;
    const title = hasMore ? hasMoreTitle : noMoreTitle;

    return (
      <View style={styles.container}>
        <ActivityIndicator animating={isLoading} />
        {hasMessage && <Text style={styles.title}>{title}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
  },
  title: {
    opacity: 0.7,
    marginLeft: 8,
  },
});

export default Footer;
