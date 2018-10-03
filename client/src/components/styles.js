import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');
export const ITEM_SIZE = width * 0.68;
export const EMPTY_ITEM_SIZE = width - ITEM_SIZE;
export const BAR_HEIGHT = height * 0.13; // 0.149925037; // (Constants.statusBarHeight || 20) * 5;

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: BAR_HEIGHT,
    backgroundColor: '#fff',
  },

  shadow: {
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowRadius: 6,
  },
  border: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'white',
  },

  headerShadow: {
    shadowOpacity: 0.6,
    shadowColor: 'rgba(4,4,4,0.16)', // Colors.tintColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
  },

  descriptionText: {
    color: '#000',
    opacity: 0.8,
    fontSize: 14,
  },
});
