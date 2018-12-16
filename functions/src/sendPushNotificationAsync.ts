import admin from './admin';

const getPushTokenForUserAsync = async (userID: string) => {
  const snapshot = await admin
    .database()
    .ref(`instance_id/${userID}`)
    .once('value');
  return await snapshot.val();
};

const sendPushNotificationAsync = async (
  usersToNotify: string[],
  data: admin.messaging.DataMessagePayload,
  notification: admin.messaging.NotificationMessagePayload,
  //   priority = 'normal',
) => {
  console.log('sendPushNotificationAsync: props: ', {
    usersToNotify,
    data,
    notification,
  });
  const pushTokens = [];

  for (const userID of usersToNotify) {
    const pushToken = await getPushTokenForUserAsync(userID);
    if (pushToken) {
      console.log(`Send notification to ${userID}:`, data);
      pushTokens.push(pushToken);
    }
  }

  console.log('sendPushNotificationAsync: tokens: ', pushTokens);

  if (pushTokens.length === 0) {
    return;
  }

  if (data.timestamp && typeof data.timestamp !== 'string') {
    data.timestamp = `${data.timestamp}`;
  }
  const payload: admin.messaging.MessagingPayload = {
    //priority,
    data,
    notification,
  };

  const { results } = await admin.messaging().sendToDevice(pushTokens, payload);
  for (const result of results) {
    if (result.error) {
      console.log('sendPushNotificationAsync: Failed: ', result);
      console.log('Error:', JSON.stringify(result));
    }
  }
};

export default sendPushNotificationAsync;
