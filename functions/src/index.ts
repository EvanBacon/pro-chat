import * as functions from 'firebase-functions';
import admin from './admin';

import sendPushNotificationAsync from './sendPushNotificationAsync';

import { getOtherUserIDsFromChatGroupId } from './IdManager';

// export const updateChapters = functions.https.onRequest(
//   async (request, response) => {
//     response.status(500).end();
//   },
// );

const onChatMessageSentHandler = async (snap, { params }) => {
  const { groupId, messageId } = params;
  console.log('onChatMessageSent: Run function', { groupId, messageId });

  /*
  {
    seen: null
    text: "What’s gude main"
    timestamp: 1544857824436
    uid: "RBtdzxJzzpOEBnSOPinWPO6j2hi1"
  }
  */
  const message = snap.data();

  console.log('Got Message', message);

  let pushNotification: admin.messaging.NotificationMessagePayload = {};
  let pushNotificationUserData: admin.messaging.DataMessagePayload = {};
  let pushNotificationOptions: admin.messaging.MessagingOptions = undefined;

  if (message.pushNotification) {
    pushNotification = message.pushNotification.notification;
    pushNotificationUserData = message.pushNotification.data;
    pushNotificationOptions = message.pushNotification.options;
  }

  let messageType = 'unknown';
  let pushNotificationBody = '???';

  if (message.text) {
    pushNotificationBody = message.text;
    messageType = 'text';
  } else if (message.location) {
    pushNotificationBody = 'Shared a location';
    messageType = 'location';
  } else if (message.image) {
    pushNotificationBody = 'Sent an image';
    messageType = 'image';
  }

  pushNotification = {
    /* Send the name of the sender as the title of the notification */
    title: message.senderName || 'Mystery Bütē',

    /* The parsed message will be sent as the body of the notification */
    body: pushNotificationBody,
    /* TODO: get the current badge and update it */
    // badge: 1,
    // sound: 'default',
    /* TODO: I forgot what this does */
    tag: 'message:' + message.uid,
    ...pushNotification,
  };

  pushNotificationUserData = {
    type: `message-${messageType}`,
    senderId: message.uid,
    groupId,
    screen: 'Chat',
    ...pushNotificationUserData,
  };

  const senderId = message.uid;

  // A list of user IDs that are in the chat group, excluding the sender. (Typically this will just be a list of one other user)
  const usersToNotify = getOtherUserIDsFromChatGroupId(groupId, senderId);

  await sendPushNotificationAsync(
    usersToNotify,
    pushNotificationUserData,
    pushNotification,
    pushNotificationOptions,
  );
};

export const onChatMessageSent = functions.firestore
  .document('chat_groups/{groupId}/messages/{messageId}')
  .onCreate(onChatMessageSentHandler);
