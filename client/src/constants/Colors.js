const colors = {
  blackColor: '#494953',
  redColor: '#FF5656',
  grayColor: '#EDF2F6',
  blueColor: '#6A7EFC',
  purpleColor: '#702cfb',
  darkPurpleColor: '#331a71',
  darkBlackColor: '#212121',
};

const tintColor = colors.purpleColor;

const statusBar = {
  borderColor: 'white',
  unfilledColor: 'white',
  color: tintColor,
  fontColor: 'white',
};

export default {
  white: '#ffffff',
  transparent: 'transparent',
  dark: 'black',

  card: '#58537A',
  lightUnderlay: 'rgba(255,255,255, 0.5)',
  tintColor,
  statusBar,

  purple: '#702cfb',
  tabIconDefault: '#4A4A4A',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};
