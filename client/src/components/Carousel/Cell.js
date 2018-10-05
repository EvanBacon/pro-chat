import React from 'react';
import { StyleSheet, Text } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import NavigationService from '../../navigation/NavigationService';
import AvatarImage from '../Image/AvatarImage';

const IMAGE_SIZE = 64;
class Cell extends React.PureComponent {
  onPress = () => {
    NavigationService.navigateToUserSpecificScreen('Profile', this.props.uid);
  };
  render() {
    const { image, name } = this.props;

    return (
      <TouchableBounce style={styles.touchable} onPress={this.onPress}>
        <AvatarImage
          name={name}
          avatar={image}
          avatarStyle={styles.avatarStyle}
        />
        <Text style={styles.text}>{name}</Text>
      </TouchableBounce>
    );
  }
}

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 12,
  },
  text: {
    textAlign: 'center',
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
