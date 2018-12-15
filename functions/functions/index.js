const functions = require('firebase-functions');

import sendPushNotificationAsync from './sendPushNotificationAsync';

function isValidUserId(key) {
  return key && typeof key === 'string' && key !== '';
}

function getOtherUserIDsFromChatGroupId(groupId, omitTargetId) {
  if (!isValidUserId(groupId)) {
    console.warn('getOtherUsersFromChatGroup: Invalid group id', { groupId });
    return [];
  }
  // / Remove self from group...
  const userIDs = groupId.split('_');
  if (userIDs.length < 2) return [userIDs[1]];

  const index = userIDs.indexOf(omitTargetId);
  if (index > -1) {
    userIDs.splice(index, 1);
  }
  return userIDs;
}

function convertChatMessageToPushNotification(chatMessage) {
  let messageType = 'unknown';
  let message = '???';
  if (chatMessage.text) {
    message = chatMessage.text;
    messageType = 'text';
  } else if (chatMessage.location) {
    message = 'Shared a location';
    messageType = 'location';
  } else if (chatMessage.image) {
    message = 'Sent an image';
    messageType = 'image';
  }

  return {
    pushNotification: { type: `message-${messageType}` },
    pushNotificationUserData: {
      /* Send the name of the sender as the title of the notification */
      title: chatMessage.senderName,
      senderId: chatMessage.uid,
      /* The parsed message will be sent as the body of the notification */
      body: message,
      /* TODO: get the current badge and update it */
      badge: '1',
      sound: 'default',
      /* TODO: I forgot what this does */
      tag: 'message:' + chatMessage.uid,
    },
  };
}

exports.onChatMessageSent = functions.firestore
  .document('chat_groups/{groupId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    // Get the note document

    /*
  {
    seen: null
    text: "What’s gude main"
    timestamp: 1544857824436
    uid: "RBtdzxJzzpOEBnSOPinWPO6j2hi1"
  }
  */
    const { groupId, messageId } = context.params;

    const message = snap.data();
    const {
      pushNotification,
      pushNotificationUserData,
    } = convertChatMessageToPushNotification(message);
    const senderId = message.uid;

    // A list of user IDs that are in the chat group, excluding the sender. (Typically this will just be a list of one other user)
    const usersToNotify = getOtherUserIDsFromChatGroupId(groupId, senderId);

    await sendPushNotificationAsync({
      usersToNotify,
      data: pushNotificationUserData,
      notification: pushNotification,
    });

    // TODO: Do we return something special here?
    // return Promise.resolve();
  });
