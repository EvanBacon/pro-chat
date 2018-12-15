import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { dispatch } from '../rematch/dispatch';

import Meta from '../constants/Meta';
import Images from '../Images';
import Relationship from '../models/Relationship';
import EmptyListMessage from './EmptyListMessage';

export default class Blocked extends Component {
  static propTypes = {
    relationship: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  };

  render() {
    const { relationship, uid } = this.props;
    const outward = relationship === Relationship.blocking;

    const title = outward ? Meta.blocking : Meta.Blocked;
    const subtitle = outward ? Meta.blocking_outward : Meta.blocking_inward;
    return (
      <EmptyListMessage
        style={styles.container}
        inverted
        onPress={() => {
          if (outward) {
            dispatch.relationships.updateAsync({
              uid,
              type: Relationship.none,
            });
          }
        }}
        noButton={!outward}
        buttonTitle={Meta.blocking_button_title}
        color="white"
        image={Images.empty.users}
        title={title}
        subtitle={subtitle}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: '75%',
  },
});
