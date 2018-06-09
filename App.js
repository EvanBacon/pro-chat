import React from 'react';
import { StyleSheet, Platform, Text, View, CameraRoll } from 'react-native';
import firebase from 'react-native-firebase';
import Expo, { FileSystem } from 'expo';

const FacebookApiKey = '214548308980520';

function setScreenName(name) {
  const { OS } = Platform;
  if (OS === 'android') {
    firebase.analytics().setCurrentScreen(name, 'MainActivity');
  } else {
    firebase.analytics().setCurrentScreen(name, 'EXViewController');
  }
}

async function basicImageUpload(uri, uploadUri) {
  try {
    await firebase
      .storage()
      .ref(uploadUri)
      .putFile(uri);
  } catch (error) {
    console.error(error);
  }
}

async function basicImageDownload(uri, uploadUri) {
  try {
    await firebase
      .storage()
      .ref(uploadUri)
      .downloadFile(uri);
  } catch (error) {
    console.error('basicImageDownload error', error);
  }
}

async function advancedImageUpload(uri, uploadUri) {
  return new Promise((res, rej) => {
    const unsubscribe = firebase
      .storage()
      .ref(uploadUri)
      .downloadFile(uri)
      .on(
        'state_changed',
        nState => {
          const {
            metadata,
            bytesTransferred,
            downloadUrl,
            ref,
            task,
            totalBytes,
            state,
          } = nState;

          const progress = (bytesTransferred || 0) / totalBytes;
          console.log('State Change', state, progress);
          //Current upload state

          switch (state) {
            case 'running': // or 'running'
              // console.log('Upload is resumed');
              // resumed && resumed();
              break;
            case 'success': // or 'running'
              console.log('Upload is done');
              // var _progress = (bytesTransferred / totalBytes);
              // onProgress && onProgress(_progress);
              break;
            default:
              console.log('unhandled state', state, nState);
              break;
          }
        },
        err => {
          //Error
          console.log("Error: Couldn't upload image");
          console.error(err);
          unsubscribe();
          rej(err);
        },
        uploadedFile => {
          //Success
          // console.log('Image uploaded!', uploadedFile);
          unsubscribe();
          res(uploadedFile);
        },
      );
  });
}

//// Go crazy: https://rnfirebase.io/docs/v3.2.x/getting-started

export default class App extends React.Component {
  state = {
    uid: null,
  };

  _loginToFacebook = () =>
    Expo.Facebook.logInWithReadPermissionsAsync(FacebookApiKey, {
      permissions: ['public_profile', 'email', 'user_friends'],
      behavior: 'native',
    });

  _doFacebookLoginFlow = async () => {
    const { type, token } = await this._loginToFacebook();

    console.log('Facebook sign in', { token, type });
    if (type === 'success') {
      // await AsyncStorage.setItem(FBTokenKey, token);
      this.facebookToken = token;
      return { token };
    } else {
      console.log("couldn't sign in:", { type });
      // Maybe the user cancelled
      alert("Couldn't to sign-in :p");
    }
  };
  _firebaseLoginWithFacebookToken = async token => {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    try {
      // login with credential
      const currentUser = await firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential);

      console.info(JSON.stringify(currentUser.user.toJSON()));
    } catch (error) {
      console.warn('Add Error for login', error);
      alert('Add Error for login', error);
    }
  };

  login = async () => {
    const { token } = await this._doFacebookLoginFlow();

    if (token) {
      this._firebaseLoginWithFacebookToken(token);
    }
  };

  doRemoteConfig = async () => {
    //https://rnfirebase.io/docs/v4.2.x/config/example
    if (__DEV__) {
      firebase.config().enableDeveloperMode();
    }

    // Set default values
    firebase.config().setDefaults({
      hasExperimentalFeature: false,
    });

    firebase
      .config()
      .fetch()
      .then(() => firebase.config().activateFetched())
      .then(activated => {
        if (!activated) console.log('Fetched data not activated');
        return firebase.config().getValue('hasExperimentalFeature');
      })
      .then(snapshot => {
        const hasExperimentalFeature = snapshot.val();
        console.log('remote info', hasExperimentalFeature);
        if (hasExperimentalFeature) {
          this.enableSuperCoolFeature();
        }

        // continue booting app
      })
      .catch(console.error);
  };

  enableSuperCoolFeature = () => {
    this.setState({ hasRemoteConfigThing: true });
  };

  logout = async () => await firebase.auth().signOut();

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      console.log('Auth in');
      this.login();
      // try {
      //   // firebase.auth().signInAnonymouslyAndRetrieveData();
      // } catch ({ message }) {
      //   alert(message);
      // }
    } else {
      this.startDoingStuff();
      // this.logout();
    }
  };

  doPerfStuff = () => {
    firebase.perf().setPerformanceCollectionEnabled(true);
  };

  startDoingStuff = async () => {
    const uid = firebase.auth().currentUser.uid;
    this.setState({ uid });

    // this.doCrashStuff();
    this.doAnalyticsStuff(uid);
    this.doRemoteConfig();
    this.doNotificationStuff();
    // this.doStorageStuff();
  };

  getDeviceToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
    } else {
      // user doesn't have a device token yet
      console.warn('getDeviceToken: no token yet');
    }
    return fcmToken;
  };
  componentWillUnmount() {
    this.messageListener && this.messageListener();
    this.onTokenRefreshListener && this.onTokenRefreshListener();
    this.notificationDisplayedListener && this.notificationDisplayedListener();
    this.notificationListener && this.notificationListener();
  }

  doNotificationStuff = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.notificationDisplayedListener = firebase
        .notifications()
        .onNotificationDisplayed(notification => {
          console.log('heyheyyouyou: display', notification);
          // Process your notification as required
          // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
      this.notificationListener = firebase
        .notifications()
        .onNotification(notification => {
          console.log('heyheyyouyou: process', notification);
          // Process your notification as required
        });

      this.onTokenRefreshListener = firebase
        .messaging()
        .onTokenRefresh(fcmToken => {
          // Process your token as required
          console.log('tokeeen', { fcmToken });
        });

      this.messageListener = firebase.messaging().onMessage(message => {
        // Process your message as required
        console.log('benafflex', { message });
      });

      let token = await this.getDeviceToken();
      console.log({ token });
      // if (token) {

      // }
    } catch (error) {
      console.error(error);
      // User has rejected permissions
    }
  };

  doCrashStuff = () => {
    firebase.crash().setCrashCollectionEnabled(true);
  };

  doAnalyticsStuff = uid => {
    firebase.analytics().setAnalyticsCollectionEnabled(true); // This is default I think...
    firebase.analytics().setUserId(uid);
    firebase
      .analytics()
      .setUserProperty('least_favorite_actor', 'keira knightley');

    setScreenName('BaconLoveHome');
  };

  doStorageStuff = async () => {
    console.log('doStorageStuff()');

    const imageUri = await this.getImageFromGallery();
    console.log('got image', imageUri);
    const uploadUri = 'images/image.jpeg';
    // basicImageUpload(imageUri, uploadUri);

    const downloadUri = Expo.FileSystem.cacheDirectory + 'baconPhoto.jpeg';
    console.log('try download', downloadUri);
    try {
      const info = await FileSystem.getInfoAsync(downloadUri, { size: true });
      console.log('found info', info);
    } catch (error) {
      console.error('info Error', error);
    }
    try {
      advancedImageUpload(downloadUri, uploadUri);
    } catch (error) {
      console.error('advancedImageUpload download', error);
    }
    // advancedImageUpload(imageUri, uploadUri);
  };

  getImageFromGallery = async () => {
    const { status } = await Expo.Permissions.askAsync(
      Expo.Permissions.CAMERA_ROLL,
    );
    if (status !== 'granted') {
      alert('failed to get library asset, please enable and restart demo');
      return;
    }

    const { edges } = await CameraRoll.getPhotos({ first: 1 });
    const assetLibraryImage = edges.map(
      ({ node: { image, timestamp } }, index) => image.uri,
    )[0];

    return assetLibraryImage;
  };

  async componentDidMount() {
    this.observeAuth();
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.state.hasRemoteConfigThing
              ? 'green'
              : 'white',
          },
        ]}
      >
        <Text>{this.state.uid || 'loading...'}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
