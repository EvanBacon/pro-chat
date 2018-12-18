import { dispatch } from '../../rematch/dispatch';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, ViewPropTypes } from 'react-native';

import Relationship from '../../models/Relationship';
import Footer from '../Footer';
import Section from '../primitives/Section';
import Settings from '../../constants/Settings';

export default class RateSection extends Component {
  static propTypes = {
    title: PropTypes.string,
    style: ViewPropTypes.style,
    uid: PropTypes.string.isRequired,
  };

  static defaultProps = {
    title: undefined,
  };

  render() {
    const { title, style, uid } = this.props;

    if (!Settings.isADatingApp) {
      return null;
    }
    return (
      <Section title={title} style={[style, styles.container]}>
        <Footer
          uid={uid}
          selectedData={uid}
          footerVisible
          onLike={() =>
            dispatch.relationships.updateAsync({
              uid,
              type: Relationship.like,
            })
          }
          onDislike={() =>
            dispatch.relationships.updateAsync({
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
