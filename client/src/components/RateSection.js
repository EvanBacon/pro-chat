import { dispatch } from '@rematch/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import Relationship from '../models/Relationship';
import Footer from './Footer';
import Section from './Section';

export default class RateSection extends Component {
  static propTypes = {
    title: PropTypes.string,
    style: View.propTypes.style,
    uid: PropTypes.string.isRequired,
  };

  static defaultProps = {
    title: undefined,
  };

  render() {
    const { title, style, uid } = this.props;
    return (
      <Section title={title} style={[style, styles.container]}>
        <Footer
          uid={uid}
          selectedData={uid}
          footerVisible
          onLike={() =>
            dispatch.users.updateRelationshipWithUser({
              uid,
              type: Relationship.like,
            })
          }
          onDislike={() =>
            dispatch.users.updateRelationshipWithUser({
              uid,
              type: Relationship.dislike,
            })
          }
        />
      </Section>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    minWidth: Dimensions.get('window').width,
  },
});
