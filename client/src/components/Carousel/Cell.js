import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import NavigationService from '../../navigation/NavigationService';
import AvatarImage from '../Image/AvatarImage';

const PADDING = 12;
const IMAGE_SIZE = 64;
class Cell extends React.PureComponent {
  static defaultProps = {
    destination: 'Profile',
  };

  onPress = () => {
    NavigationService.navigateToUserSpecificScreen(
      this.props.destination,
      this.props.uid,
    );
  };
  render() {
    const { image, name, textStyle } = this.props;

    return (
      <View style={styles.touchable}>
        <AvatarImage
          onPress={this.onPress}
          name={name}
          avatar={image}
          avatarStyle={styles.avatarStyle}
        />
        <Text numberOfLines={2} style={[styles.text, textStyle]}>
          {name}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: PADDING,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    maxWidth: IMAGE_SIZE,
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
