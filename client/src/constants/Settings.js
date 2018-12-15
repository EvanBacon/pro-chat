// @flow

import { Constants, Permissions } from 'expo';
import { Platform } from 'react-native';

import sizeInfo from '../utils/whatAmI';
import Secret from '../../Secret';

const isInAppleReview = false;

const realName = 'Bütē Alert';

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

const debugging =
  global.isDebuggingInChrome ||
  __DEV__ ||
  process.env.NODE_ENV === 'development';

const giphyAPI = debugging ? Secret.giphy.debug : Secret.giphy.production;

const googleLoginProps = {
  // behavior: "web", "system" //<= this should be best by default >:(

  // https://gsuite-developers.googleblog.com/2012/01/tips-on-using-apis-discovery-service.html
  scopes: ['profile', 'email'],
  androidClientId: '',
  iosClientId: '',
  androidStandaloneAppClientId: '',
  iosStandaloneAppClientId: '',
  webClientId: '',
};

const Settings = {
  refs: {
    channels: 'chat_groups',
    messages: 'messages',
    relationships: 'relationships',
    users: 'users',
    complaints: 'complaints',
    instanceID: 'instance_id',
  },
  isDetached: false,
  googleLoginProps,
  facebookFields: fields,
  facebookLoginProps: {
    permissions: [
      'public_profile',
      'email',
      // 'user_friends'
    ],
    behavior: 'system',
  },
  permissions: [
    Permissions.LOCATION,
    Permissions.NOTIFICATIONS,
    Permissions.CONTACTS,
  ],
  hideBooty: false,
  noName: 'Sasuke Uchiha',
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
  debug,
  ignoredYellowBox: ['Class ABI', 'Module ABI', "Audio doesn't exist"],
  slug: debug ? 'crossy-road' : 'users',
  isCacheProfileUpdateActive: !debug || false,
  shouldDelayFirebaseProfileSyncInMinutes: 60,
  canEditPhoto: false,
  mainInitialRouteName: 'MainTab', // 'ChooseInterest', // 'Settings', // 'UnderAge', // 'MainTab', // 'Chat'
  testOnboarding: false,
  needsProfileImage: true,
  location: {
    enableHighAccuracy: true,
    maximumAge: 2000,
    timeout: 20000,
  },
  debugGoToChat: false,
  avatarSize: 96,
  minimumAge: 17,
  email: 'bootyalertapp@gmail.com',
  // testingUID: "KukzZOJZaAefeh334uqElUWDjc92",
  messagesPageSize: 15,
  simulator: !Constants.isDevice,
  /*
      So many of these...
  */
  isChatEnabled: true,
  isMatchesEnabled: false,

  isInAppleReview,
  name: isInAppleReview ? 'Beauty' : 'Bütē',
  user: isInAppleReview ? 'Art' : 'Bütē',
  userPlural: isInAppleReview ? 'Artists' : 'Bütēs',
  debugging,
  giphyAPI,
  fakeLikes: [
    {
      name: 'Young Thug',
      created_time: Date.now(),
    },
    {
      name: 'XXXTENTACION',
      created_time: Date.now(),
    },
    {
      name: 'Lil Tay',
      created_time: Date.now(),
    },
    {
      name: 'Batman',
      created_time: Date.now(),
    },
    {
      name: 'Legos',
      created_time: Date.now(),
    },
    {
      name: 'Thiccness',
      created_time: Date.now(),
    },
    {
      name: 'Dexter',
      created_time: Date.now(),
    },
  ],
};

export default Settings;
