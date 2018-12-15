import { ImagePicker, Location, Permissions } from 'expo';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, ViewPropTypes, TouchableOpacity, View } from 'react-native';

import Fire from '../../Fire';

export default class CustomActions extends React.Component {
  _images = [];
  state = {
    modalVisible: false,
  };

  setImages = images => (this._images = images);

  getImages() {
    return this._images;
  }

  setModalVisible(visible = false) {
    this.setState({ modalVisible: visible });
  }

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  };

  _pickImageAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access photos was denied',
      });
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      const storageUrl = await Fire.shared.uploadImageAsync(result.uri);
      console.log('local', result.uri, 'global', storageUrl);
      return storageUrl;
    }
    // Maybe do something

    return null;
  };

  _takePictureAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access camera was denied',
      });
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      const storageUrl = await Fire.shared.uploadImageAsync(result.uri);
      console.log('local', result.uri, 'global', storageUrl);
      return storageUrl;
    }
    // Maybe do something

    return null;
  };

  onActionsPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            {
              const image = await this._pickImageAsync();
              if (image) {
                this.props.onSend({ image });
              }
            }
            break;
          case 1:
            {
              const image = await this._takePictureAsync();
              if (image) {
                this.props.onSend({ image });
              }
            }
            break;
          case 2:
            {
              const position = await this._getLocationAsync();
              if (position) {
                this.props.onSend({
                  location: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                });
              }
            }
            break;
          default:
        }
      },
    );
  };

  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.onActionsPress}
      >
        {this.renderIcon()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  icon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style,
};
