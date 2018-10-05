import React, { Component } from 'react';
import { FlatList } from 'react-native';

import Section from '../Section';
import Cell from './Cell';
import NavigationService from '../../navigation/NavigationService';

export default class Carousel extends Component {
  static propTypes = {};
  static defaultProps = {
    // users: []
  };

  render() {
    const { data, ...props } = this.props;

    console.log('mikejudge', { data });
    return (
      <Section {...props}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{ overflow: 'visible' }}
          data={data}
          keyExtractor={({ uid }, index) => `Carousel-${uid || index}`}
          renderItem={({ item: { image, name, uid }, index }) => (
            <Cell image={image} name={name} uid={uid} key={index} />
          )}
        />
      </Section>
    );
  }
}
