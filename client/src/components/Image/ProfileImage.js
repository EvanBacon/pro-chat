import { ImagePicker, Permissions } from 'expo';
// import firebase from 'expo-firebase-app';
import firebase from '../../universal/firebase';
import React, { Component } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import Settings from '../../constants/Settings';
import getPermissionAsync from '../../utils/getPermission';
import shrinkImageAsync from '../../utils/shrinkImageAsync';
import uploadImageAsync from '../../utils/uploadImageAsync';
import AvatarImage from './AvatarImage';
import { dispatch } from '../../rematch/dispatch';

export default class ProfileImage extends React.Component {
  state = {
    image: null,
    isUploadingImage: false,
    progress: 0,
  };

  componentDidMount() {
    // if (!this.state.image) this._getProfileImageAsync();
  }

  _getProfileImageAsync = async () => {
    const { storagePath } = this;
    if (!storagePath) return;

    try {
      const uri = await firebase
        .storage()
        .ref(storagePath)
        .getDownloadURL();
      this.setState({ image: uri });
    } catch ({ code, message }) {
      console.log('ProfileImage: Warn: ', message);
    }
  };

  _setNewPhoto = async uri => {
    if (!uri || uri === '') return;
    this.setState({ isUploadingImage: true, progress: 0, image: uri });
    const { uri: reducedImageUri } = await shrinkImageAsync(uri);
    try {
      const downloadURL = await uploadImageAsync(
        reducedImageUri,
        this.storagePath,
        this._onProgressUpdated,
      );
      dispatch.user.updateUserProfile({ image: downloadURL });
    } catch ({ code, message }) {
      console.log('ProfileImage: Error: ', message);
      alert(message);
    } finally {
      this.setState({ isUploadingImage: false, progress: 0 });
    }
  };

  _onProgressUpdated = progress => this.setState({ progress });

  get storagePath() {
    const { currentUser } = this;
    if (!currentUser) return null;
    return `images/${this.currentUser.uid}/image.jpeg`;
  }

  get currentUser() {
    const { currentUser } = firebase.auth();
    if (!currentUser) {
      return;
    }
    return currentUser;
  }

  _takePictureAsync = async () => {
    const permission = await getPermissionAsync(Permissions.CAMERA);
    if (!permission) return;
    const { uri } = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });
    return this._setNewPhoto(uri);
  };

  _selectPictureAsync = async () => {
    const permission = await getPermissionAsync(Permissions.CAMERA_ROLL);
    if (!permission) return;
    const { uri } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    return this._setNewPhoto(uri);
  };

  onPress = () => {
    if (this.props.isUser) {
      /* TODO: Bacon: A better UX for changing User Profile Image */
      Alert.alert('Profile Picture', 'Select a new image', [
        {
          text: 'Camera',
          onPress: this._takePictureAsync,
        },
        {
          text: 'Library',
          onPress: this._selectPictureAsync,
        },
      ]);
    } else {
      /* TODO: Bacon: Add light box for other users */
    }
  };

  render() {
    const { size } = this.props;

    let containerStyle = styles.container || {};
    if (size) {
      containerStyle = StyleSheet.flatten([
        containerStyle,
        {
          minWidth: size,
          maxWidth: size,
          minHeight: size,
          maxHeight: size,
          borderRadius: size / 2,
          overflow: 'hidden',
        },
      ]);
    }

    return (
      <View style={[containerStyle, this.props.style]}>
        <AvatarImage
          onPress={this.onPress}
          progress={this.state.progress}
          textStyle={styles.text}
          avatarStyle={styles.avatar}
          name={this.props.name}
          avatar={this.props.image}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Settings.avatarSize,
    width: Settings.avatarSize,
    aspectRatio: 1,
  },
  text: { fontWeight: 'bold', fontSize: 48 },
  avatar: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: Settings.avatarSize / 2,
  },
});
