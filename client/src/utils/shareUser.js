import { Share } from 'react-native';

import Colors from '../constants/Colors';
import Links from '../constants/Links';
import Meta from '../constants/Meta';

export default async function shareUser() {
  const message = Meta.share_message;
  const url = Links.standardShare;
  // const url = await ImageProvider.getProfileImage(uid);
  return Share.share(
    {
      message,
      url,
      title: Meta.share_title,
    },
    {
      dialogTitle: Meta.share_dialog_title,
      excludedActivityTypes: [
        'com.apple.UIKit.activity.Print',
        'com.apple.UIKit.activity.AssignToContact',
        'com.apple.UIKit.activity.AddToReadingList',
        'com.apple.UIKit.activity.AirDrop',
        'com.apple.UIKit.activity.OpenInIBooks',
        'com.apple.UIKit.activity.MarkupAsPDF',
        'com.apple.reminders.RemindersEditorExtension', // Reminders
        'com.apple.mobilenotes.SharingExtension', // Notes
        'com.apple.mobileslideshow.StreamShareService', // iCloud Photo Sharing - This also does nothing :{
      ],
      tintColor: Colors.tintColor,
    },
  );
}
