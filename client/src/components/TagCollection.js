import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import Section from '../components/Section';
import Tag from '../components/Tag';
import Meta from '../constants/Meta';

export default class TagCollection extends Component {
  static propTypes = {
    title: PropTypes.string,
    style: View.propTypes.style,
    tags: PropTypes.array,
    isUser: PropTypes.bool,
    name: PropTypes.string,
  };
  static defaultProps = {
    title: null,
    style: {},
    tags: null,
    name: null,
    isUser: false,
  };

  _renderContents = (tags, isUser, name) => {
    if (!tags) {
      const hint = isUser ? Meta.no_tags_inward : `${name} ${Meta.no_tags_outward}`;

      return <Text style={{ textAlign: 'center' }}>{hint}</Text>;
    }
    const _tags = tags.sort((a, b) => a.created_time - b.created_time).map(v => v.name);
    return _tags.map((tag, index) => <Tag key={index} title={tag} style={styles.tag} />);
  };
  render() {
    const {
      title, style, tags, isUser, name,
    } = this.props;

    return (
      <Section title={title} style={[styles.container, style]}>
        <View style={styles.wrapper}>{this._renderContents(tags, isUser, name)}</View>
      </Section>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    minWidth: Dimensions.get('window').width,
  },
  wrapper: {
    paddingHorizontal: 8,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  tag: {
    margin: 2,
  },
});
