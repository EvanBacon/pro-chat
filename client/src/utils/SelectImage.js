import { ImagePicker } from 'expo';

import { NavigationActions } from 'react-navigation';
import { store } from '../App';
import Meta from '../constants/Meta';
import getPermission from './getPermission';
import { Permissions } from 'expo';
import reduceImageAsync from './shrinkImageAsync';

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
    (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          if (onSelectCamera) {
            onSelectCamera();
            return;
          }
          store.dispatch(NavigationActions.navigate({
            routeName: 'Camera',
            params: { complete: callback },
          }));
          break;
        case 1:
          // Open Image Library:
          ImagePicker.launchImageLibrary(_options, (response) => {
            complete(response, callback);
          });
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
    allowsEditing: false,
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
    allowsEditing: false,
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
