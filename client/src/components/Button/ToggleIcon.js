import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles';
import { Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';

export default class Icon extends Component {
    static defaultProps = {
      onPress: () => {},
      noShadow: false,
    }
    render() {
      const {
        active, style, inactive, selected, onPress, noShadow,
      } = this.props;
      return (
        <TouchableOpacity onPress={() => onPress(this.props)}>
          <Image
            style={[
                    (noShadow ? {} : styles.shadow),
                    {
                        width: 28,
                        height: 28,
                        overflow: 'visible',
                        resizeMode: 'contain',
                    },
                    style,
                ]}
            source={selected ? active : inactive}
          />
        </TouchableOpacity>
      );
    }
}
