// @flow
import { Constants } from 'expo';
import { Platform } from 'react-native';

import sizeInfo from '../utils/whatAmI';

const debug = __DEV__;

const fields = [
  'id',
  'email',
  'birthday',
  'name',
  'first_name',
  'gender',
  'about',
  'picture',
  'interested_in',
  'likes',
];

const Settings = {
  refs: {
    channels: 'channels',
  },
  isDetached: false,
  facebookFields: fields,
  facebookLoginProps: {
    permissions: [
      'public_profile',
      'email',
      // 'user_friends'
    ],
  },
  giphy: {
    giphyKey: '&api_key=dc6zaTOxFJmzC',
    apiKey: 'dc6zaTOxFJmzC',
    endPoint: 'https://api.giphy.com/v1/gifs/search?q=',
  },
  isIos: Platform.OS === 'ios',
  osVersion: sizeInfo.osVersion,
  loginBehavior: sizeInfo.loginBehavior,
  isRunningInExpo: sizeInfo.isRunningInExpo,
  isIPhone: sizeInfo.isIPhone,
  isIPad: sizeInfo.isIPad,
  isIPhoneX: sizeInfo.isIPhoneX,
  bottomInset: sizeInfo.bottomInset,
  topInset: sizeInfo.topInset,
  isSimulator: !Constants.isDevice,
  // isFirebaseEnabled: !debug || false,
  isAutoStartEnabled: false, //! debug && true,
  isScreenshotEnabled: !debug || false,
  isMotionMenuEnabled: !debug || true,
  isComposerEnabled: false, //! debug || false,
  debug,
  ballDistance: 60,
  rotationSpeed: 4,
  epsilon: 15,
  angleRange: [25, 155],
  visibleTargets: 5,
  ignoredYellowBox: ['Class ABI', 'Module ABI', "Audio doesn't exist"],
  slug: debug ? 'crossy-road' : 'users',
  isEveryScoreBest: debug && false,
  isCacheProfileUpdateActive: !debug || false,
  shouldDelayFirebaseProfileSyncInMinutes: 60,

  canEditPhoto: false,
  leaderPageSize: 25,
  mainInitialRouteName: 'Game', // 'Unlockables', // ,

  testOnboarding: false,
  needsProfileImage: true,
  location: {
    enableHighAccuracy: true,
    maximumAge: 2000,
    timeout: 20000,
  },
  minimumAge: 17,
  email: 'bootyalertapp@gmail.com',
  // testingUID: "KukzZOJZaAefeh334uqElUWDjc92",
  messagesPageSize: 15,
  simulator: !Constants.isDevice,
  /*
      So many of these...
  */
  user: 'Art', // Booty
  userPlural: 'Artists', // Bootys
  debugging:
    global.isDebuggingInChrome ||
    __DEV__ ||
    process.env.NODE_ENV === 'development',
  giphyAPI: {
    debug: '8fd94ebef2e642a29137cc7d09412907',
    production: '',
  },
};

export default Settings;
