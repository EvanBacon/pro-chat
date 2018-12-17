import React, { Component } from 'react';
import { FlatList } from 'react-native';

import Section from '../primitives/Section';
import Cell from './Cell';
import NavigationService from '../../navigation/NavigationService';

export default class Carousel extends Component {
  static propTypes = {};
  static defaultProps = {
    destination: 'Profile',
    // users: []
    listProps: {},
  };

  render() {
    const {
      data,
      destination,
      itemTextStyle,
      listProps,
      ...props
    } = this.props;

    return (
      <Section {...props}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{ overflow: 'visible' }}
          data={data}
          keyExtractor={({ uid }, index) => `Carousel-${uid || index}`}
          renderItem={({ item, index }) => {
            const { image, name, uid } = item;
            return (
              <Cell
                textStyle={itemTextStyle}
                destination={destination}
                image={image}
                name={name}
                uid={uid}
                key={index}
              />
            );
          }}
          {...listProps}
        />
      </Section>
    );
  }
}
