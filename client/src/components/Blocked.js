import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import Meta from '../constants/Meta';
import Images from '../Images';
import EmptyListMessage from './EmptyListMessage';
import Relationship from '../models/Relationship';

export default class Blocked extends Component {
  static propTypes = {
    relationship: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    updateRelationshipWithUser: PropTypes.func.isRequired,
  };
  render() {
    const { relationship, uid, updateRelationshipWithUser } = this.props;
    const outward = relationship === Relationship.blocking;

    const title = outward ? Meta.blocking : Meta.Blocked;
    const subtitle = outward ? Meta.blocking_outward : Meta.blocking_inward;
    return (
      <EmptyListMessage
        style={styles.container}
        inverted
        onPress={(_) => {
          if (outward) {
            updateRelationshipWithUser(uid, Relationship.none);
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
