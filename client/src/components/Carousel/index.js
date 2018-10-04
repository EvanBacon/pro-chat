import React, { Component } from 'react';
import { FlatList } from 'react-native';

import Section from '../Section';
import Cell from './Cell';

export default class Carousel extends Component {
  static propTypes = {};
  static defaultProps = {
    // users: []
  };

  render() {
    const { users, navigation, ...props } = this.props;
    return (
      <Section {...props}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{ overflow: 'visible' }}
          data={users}
          keyExtractor={(item, index) => `Carousel-${item || index}`}
          renderItem={({ item: uid, index }) => (
            <Cell
              uid={uid}
              key={index}
              onPress={event =>
                navigation.navigateToUserSpecificScreen('OtherProfile', uid)
              }
            />
          )}
        />
      </Section>
    );
  }
}
