import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import Relationship from '../models/Relationship';
import Footer from './Footer';
import Section from './Section';

export default class RateSection extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    style: View.propTypes.style,
    updateRelationshipWithUser: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired,
  };
  render() {
    const {
      title, style, uid, updateRelationshipWithUser,
    } = this.props;
    return (
      <Section title={title} style={[style, styles.container]}>
        <Footer
          uid={uid}
          selectedData={uid}
          footerVisible
          onLike={() => updateRelationshipWithUser(uid, Relationship.like)}
          onDislike={() =>
            updateRelationshipWithUser(uid, Relationship.dislike)
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
