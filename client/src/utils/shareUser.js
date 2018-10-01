import { Share } from 'react-native';

import Meta from '../constants/Meta';

export default async () =>
  new Promise(async (res, rej) => {
    const message = Meta.share_message;
    const url = 'http://bootyalert.net/';
    // const url = await ImageProvider.getProfileImage(uid);
    Share.share(
      {
        message,
        url,
        title: Meta.share_title,
      },
      {
        dialogTitle: Meta.share_dialog_title,
        excludedActivityTypes: [
          'com.apple.UIKit.activity.AirDrop', // This speeds up showing the share sheet by a lot
          'com.apple.UIKit.activity.AddToReadingList', // This is just lame :)
        ],
        tintColor: '#373a66',
      },
    )
      .then(res)
      .catch(rej);
  });
