import admin from './admin';

const functions = require('firebase-functions');

async function getPushTokenForUserAsync(userID) {
  const snapshot = await admin
    .database()
    .ref(`instance_id/${userID}`)
    .once('value');
  return snapshot.val();
}

async function sendPushNotificationAsync({
  usersToNotify,
  data,
  notification,
  //   priority = 'normal',
}) {
  let pushTokens = [];

  for (const userID of usersToNotify) {
    const pushToken = await getPushTokenForUserAsync(userID);
    if (pushToken) {
      console.log(`Send notification to ${userID}:`, data);
      pushTokens.push(pushToken);
    }
  }

  if (pushTokens.length === 0) {
    return;
  }

  // TODO: Remove legacy...
  if (data.hasOwnProperty('from')) {
    delete data.from;
  }

  if (data.timestamp && typeof data.timestamp !== 'string') {
    data.timestamp = `${data.timestamp}`;
  }
  const payload = {
    //priority,
    data,
    notification,
  };

  try {
    const result = await admin.messaging().sendToDevice(pushTokens, payload);
    console.log(result);
  } catch (error) {
    console.log('Error sending push notification: ', error.message);
    //   throw error;
  }
}

export default sendPushNotificationAsync;
