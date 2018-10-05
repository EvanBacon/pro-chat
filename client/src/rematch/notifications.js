import { dispatch } from '@rematch/core';
import { Notifications, Permissions } from '../universal/Expo';

const notifications = {
  state: {
    status: null,
  },
  reducers: {
    setStatus: (state, status) => ({ ...state, status }),
  },
  effects: {
    registerAsync: async () => {
      console.log('registerAsync');
      const { status: existingStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      console.log('registerAsync:B', existingStatus);
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        console.log('registerAsync:C', existingStatus);
        return;
      }
      // Get the token that uniquely identifies this device
      const token = await Notifications.getExpoPushTokenAsync();
      console.log({ token });
      dispatch.notifications.setStatus(finalStatus);
    },
  },
};
export default notifications;
