import firebase from 'firebase';

import faker from 'faker';
import Fire from '../Fire';

export const uploadProfileImage = async (image, onProgress) => {
  console.warn(image);

  const uid = Fire.shared.uid;
  if (!Fire.shared.uid || !image) {
    return;
  }
  let file;
  if (typeof image === 'string') {
    file = image
      .split('\\')
      .pop()
      .split('/')
      .pop()
      .split('.');
    image = { uri: image };
  } else {
    file = image.uri
      .split('\\')
      .pop()
      .split('/')
      .pop()
      .split('.');
  }

  // Get the part without dots on the end
  const extension = file.pop();
  const filename = file.pop();

  const path = `images/users/${uid}/profile/image.${extension}`;
  const res = await uploadAsset({ path, image, onProgress });
  console.log('Uploaded image', res);
  const key = 'img_a';
  const url = `users/${uid}/images/${key}`;

  await saveReferenceToImage(res, url);

  return url;
};

export const saveReferenceToImage = async (snapshot, path) => {
  if (snapshot) {
    console.log('Image Uploaded!', path, snapshot);

    const timestamp = new Date().getTime();

    const {
      downloadUrl,
      ref: { path: fullPath },
    } = snapshot;
    if (downloadUrl) {
      console.log('save upload', path, downloadUrl, fullPath);
      return firebase
        .database()
        .ref(path)
        .update({
          url: downloadUrl,
          path: fullPath,
          timestamp,
        });
    }
  } else {
    console.error('ERROR: snapshot is undefined, uploadProfileImage', path);
  }
};

const getProfileUrl = async (uid, update = false) => {
  if (uid == undefined || !(typeof uid === 'string')) {
    console.warn(`Invalid UID ${JSON.stringify(uid || {})}`);
    return;
  }

  const route = `users/${uid}/images/img_a`;
  const profileRef = firebase.database().ref(route);

  try {
    const snapshot = await new Promise((res, rej) =>
      profileRef.once('value', res).catch(rej));
    const value = snapshot.val();

    console.log('obtained image data', route, value, snapshot.key);
    if (value != null && value.hasOwnProperty('url')) {
      return value.url;
    }
  } catch (error) {
    return error;
  }
};

export const getDownloadURLforAsset = async (url, onProgress) => {
  if (typeof url !== 'string') {
    return;
  }
  // / Handle Downloading from Firebase
  if (url.startsWith('gs://')) {
    const path = url.substring(url.indexOf('.com') + 4, url.length);
    const ref = firebase.storage().ref(path);

    const payload =
      (await new Promise((resolve, reject) =>
        ref
          .getDownloadURL()
          .then(resolve)
          .catch(reject))) || {};
    console.log('IMIIT', payload);
    return payload;

    // return (await (new Promise((res, rej) => firebase.storage().ref(path).downloadFile(firebase.storage.Native.TEMP_DIRECTORY_PATH)
    //                 .on('state_changed', snapshot => {
    //                     //Current download state
    //                     onProgress && onProgress(snapshot);
    //                 }, rej, res))));
  }
  return url;
};

export const getProfileImage = async (uid) => {
  console.warn('image for uid', uid);
  if (uid.split('-')[0] === 'fake') {
    return faker.image.avatar();
  }
  if (!uid) {
    uid = Fire.shared.uid;
    console.log('get profile image for user', uid);
  } else {
    console.log('get profile image', uid);
  }

  try {
    const url = await getProfileUrl(uid);
    if (url) {
      return await getDownloadURLforAsset(url);
    }
  } catch (error) {
    console.error(error);
  }
};

// import ImageResizer from 'react-native-image-resizer';
// /TODO: Implement this / add this to the server.
export const reduceImage = async (uri) => {
  const CompressFormat = {
    JPEG: 'JPEG',
    PNG: 'PNG',
    WEBP: 'WEBP', // Android only
  };

  const settings = {
    width: 1080,
    height: 1920,
    compressFormat: CompressFormat.JPEG,

    /*
        A number between 0 and 100.
        Used for the JPEG compression.
        */
    quality: 80,

    /*
        Rotation to apply to the image, in degrees, for android.
        On iOS, rotation is limited (and rounded) to multiples of 90 degrees.
        */
    rotation: 0, // default

    /*
        The resized image path. If null, resized image will be stored in cache folder.
        To set outputPath make sure to add option for rotation too (if no rotation is needed, just set it to 0).
        */
    outputPath: null,
  };

  try {
    // const {uri, path, name, size} = await (new Promise( (res, rej) => ImageResizer.createResizedImage(uri, settings.width, settings.height, settings.compressFormat, settings.quality, settings.rotation, settings.outputPath).then(res).catch(rej)));
    // response.uri is the URI of the new image that can now be displayed, uploaded...
    // response.path is the path of the new image
    // response.name is the name of the new image with the extension
    // response.size is the size of the new image
    return {
      uri,
      // path,
      // name,
      // size
    };
  } catch (error) {
    // Oops, something went wrong. Check that the filename is correct and
    // inspect err to get more details.
  }
  return uri;
  // return new Promise((res, rej) => {

  //     // ImageResizer['default'].createResizedImage(uri, 960, 960, 'JPEG', 80, 0, null).then((resizedImageUri) => {
  //     //   console.log(resizedImageUri);
  //     // resizeImageUri is the URI of the new image that can now be displayed, uploaded...
  //     res(resizedImageUri);
  //     // }).catch((err) => rej(err));
  // });
};

const Routes = {
  images: 'images',
  users: 'users',
  messaging: 'messaging',
  profile: 'profile',
};

export const routeForTestImage = ({ name, ext }) => {
  if (name && ext) {
    return `Test/${name}.${ext}`;
  }
  return null;
};

export const routeForProfileImage = ({ uid, name, ext }) => {
  if (uid && name && ext) {
    return `${Routes.images}/${Routes.users}/${uid}/${
      Routes.profile
    }/${name}${ext}`;
  }
  return null;
};

const TaskState = {
  resumed: 'upload_resumed',
  progress: 'upload_progress',
  paused: 'upload_paused',
};
export const uploadAsset = async ({
  image,
  path,
  contentType = 'image/jpeg',
  contentEncoding = 'base64',
  onProgress,
  resumed,
  paused,
}) =>
  new Promise((res, rej) => {
    const {
      uri,
      fileSize,
      origURL,
      longitude,
      fileName,
      height,
      width,
      latitude,
      timestamp,
      isVertical,
    } = image;

    console.log('Upload Asset', path, uri);

    const unsubscribe = firebase
      .storage()
      .ref(path)
      .putFile(uri)
      .on(
        'state_changed',
        (nState) => {
          const {
            metadata,
            bytesTransferred,
            downloadUrl,
            ref,
            task,
            totalBytes,
            state,
          } = nState;
          console.log('State Change', nState, onProgress);
          onProgress && onProgress(bytesTransferred / totalBytes);
          // Current upload state

          switch (state) {
            case 'running': // or 'running'
              console.log('Upload is resumed');
              // resumed && resumed();
              break;
            case 'success': // or 'running'
              // console.log('Upload is progress');
              // var _progress = (bytesTransferred / totalBytes);
              // onProgress && onProgress(_progress);
              break;
          }
        },
        (err) => {
          // Error
          console.log("Error: Couldn't upload image");
          unsubscribe();
          rej(err);
        },
        (uploadedFile) => {
          // Success
          console.log('Image uploaded!');
          unsubscribe();
          res(uploadedFile);
        },
      );

    /*
         fileSize: 182091,
  origURL: 'assets-library://asset/asset.JPG?id=51255493-AF0E-44EA-B3FD-FDCF0E36C1A1&ext=JPG',
  longitude: -73.972345,
  fileName: 'IMG_3267.JPG',
  height: 1024,
  width: 769,
  latitude: 40.692945,
  timestamp: '2017-07-30T18:03:23Z',
  isVertical: true,
  uri: 'file:///var/mobile/Containers/Data/Application/26F082A0-3278-4304-BBC7-44022020A14D/Documents/images/47B513A3-8C52-4FC1-B04D-8B04F93E903E.jpg'
        */
  });
