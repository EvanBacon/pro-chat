import Meta from '../constants/Meta';
import shareUser from './shareUser';

// ImagePicker
export default ({ showActionSheetWithOptions, uid, reportUser }) => {
  // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
  const options = [
    Meta.option_report,
    Meta.option_recommend,
    Meta.option_cancel,
  ];
  const destructiveButtonIndex = 0;
  const cancelButtonIndex = 2;
  showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
      destructiveButtonIndex,
    },
    (buttonIndex) => {
      if (buttonIndex === 1) {
        shareUser(uid);
      } else if (buttonIndex === 0) {
        reportUser(uid);
      }
      // Do something here depending on the button index selected
    },
  );
};
