import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import NavigationService from '../../navigation/NavigationService';
import AvatarImage from '../Image/AvatarImage';

const PADDING = 12;
const IMAGE_SIZE = 64;
class Cell extends React.PureComponent {
  onPress = () => {
    NavigationService.navigateToUserSpecificScreen('Profile', this.props.uid);
  };
  render() {
    const { image, name } = this.props;

    return (
      <View style={styles.touchable}>
        <AvatarImage
          onPress={this.onPress}
          name={name}
          avatar={image}
          avatarStyle={styles.avatarStyle}
        />
        <Text style={styles.text}>{name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: PADDING,
  },
  text: {
    textAlign: 'center',
    maxWidth: IMAGE_SIZE + PADDING * 2,
  },
  avatarStyle: {
    flex: 1,
    maxWidth: IMAGE_SIZE,
    minWidth: IMAGE_SIZE,
    minHeight: IMAGE_SIZE,
    maxHeight: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default Cell;
