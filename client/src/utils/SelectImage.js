import { ImagePicker, Permissions } from 'expo';
import { NavigationActions } from 'react-navigation';

import { store } from '../rematch/Gate';

import Meta from '../constants/Meta';
import getPermissionAsync from './getPermission';
import shrinkImageAsync from './shrinkImageAsync';
import { dispatch } from '../rematch/dispatch';
import uploadImageAsync from './uploadImageAsync';
import firebase from 'expo-firebase-app';
// More info on all the options is below in the README...just some common use cases shown here
const _options = {
  //   title: 'Select Avatar',
  //   customButtons: [
  //     {name: 'fb', title: 'Choose Photo from Facebook'},
  //   ],
  storageOptions: {
    skipBackup: true,
    path: 'images',
    cameraRoll: false,
  },
  customButtons: [{ name: 'fb', title: Meta.select_image_option_facebook }],

  mediaType: 'photo',
  quality: 0.6,
  maxHeight: 1024, // 1024,
  maxWidth: 960,
  noData: true,
};

const _setNewPhoto = async uri => {
  if (!uri || uri === '') return;
  // this.setState({ isUploadingImage: true, progress: 0, image: uri });
  const { uri: reducedImageUri } = await shrinkImageAsync(uri);
  try {
    const downloadURL = await uploadImageAsync(
      reducedImageUri,
      `images/${firebase.auth().currentUser.uid}/image.jpeg`,
      function() {},
    );
    dispatch.user.updateUserProfile({ image: downloadURL });
  } catch ({ code, message }) {
    console.log('ProfileImage: Error: ', message);
    alert(message);
  } finally {
    // this.setState({ isUploadingImage: false, progress: 0 });
  }
};

const _takePictureAsync = async () => {
  const permission = await getPermissionAsync(Permissions.CAMERA);
  if (!permission) return;
  const { uri } = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
  });
  return _setNewPhoto(uri);
};

const _selectPictureAsync = async () => {
  const permission = await getPermissionAsync(Permissions.CAMERA_ROLL);
  if (!permission) return;
  const { uri } = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
  });
  return _setNewPhoto(uri);
};

export default (selectImage = (show, callback, onSelectCamera) => {
  const options = [
    Meta.select_image_option_camera,
    Meta.select_image_option_library,
    Meta.select_image_option_destructive,
  ];
  const cancelButtonIndex = options.length - 1;
  show(
    {
      options,
      cancelButtonIndex,
    },
    buttonIndex => {
      switch (buttonIndex) {
        case 0:
          _takePictureAsync();
          // if (onSelectCamera) {
          //   onSelectCamera();
          //   return;
          // }
          // store.dispatch(
          //   NavigationActions.navigate({
          //     routeName: 'Camera',
          //     params: { complete: callback },
          //   }),
          // );
          break;
        case 1:
          _selectPictureAsync();
          // Open Image Library:
          // ImagePicker.launchImageLibrary(_options, response => {
          //   complete(response, callback);
          // });
          break;
        default:
          break;
      }
    },
  );

  /**
   * The first arg is the options object for customization (it can also be null or omitted for default options),
   * The second arg is the callback which sends object: response (more info below in README)
   */
  // ImagePicker.showImagePicker(options, (response) => {
  //     complete(response, callback);
  // })
});

const complete = (response, callback) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled image picker');
    // res();
    callback();
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
    throw response.error;
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
    callback();
  } else {
    callback(response);
  }
};

export const fromLibrary = async () => {
  const hasit = await getPermission(Permissions.CAMERA_ROLL);
  if (!hasit) return;

  const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
    base64: false,
    exif: true,
  });

  if (cancelled) {
    return;
  }

  const { uri: reducedUri } = await reduceImageAsync(uri);

  return reducedUri;
};
export const fromCamera = async () => {
  const hasit = await getPermission(Permissions.CAMERA);
  if (!hasit) return;

  const { cancelled, uri } = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
    base64: false,
    exif: true,
  });

  if (cancelled) {
    return;
  }

  const { uri: reducedUri } = await reduceImageAsync(uri);

  return reducedUri;

  // // Launch Camera:
  // new Promise((res) => {
  //   store.dispatch(NavigationActions.navigate({
  //     routeName: 'Camera',
  //     params: { complete: res },
  //   }));

  //   ImagePicker.launchCamera(options, (response) => {
  //       // Same code as in above section!
  //       complete(response, res);
  //   });
};
