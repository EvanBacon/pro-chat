import firebase from 'firebase';
import { Alert } from 'react-native';

import { store } from '../App';
import Meta from '../constants/Meta';
import formatDate from '../utils/formatDate';
import * as ImageProvider from './ImageProvider';
import * as ProfileProvider from './ProfileProvider';
import { updateChannel } from './redux/messages';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export const MessageType = {
  message: 'message',
  image: 'image',
  location: 'location',
};

const formatLastMessage = (data) => {
  if (!data) {
    console.warn('INVALID CANNOT FORMAT LAST MESSAGE');
    return;
  }

  const {
    timestamp, message, from, seen: seenTime,
  } = data;

  const date = new Date(timestamp);
  const payload = {
    _timestamp: timestamp,
    timestamp: formatDate(date),
    date,

    outgoing: from === firebase.uid(),
    seen: null,
    text: null,
    type: null,
  };

  const hasSeen = seenTime && seenTime !== -1;

  if (payload.outgoing) {
    payload.seen = true;
  } else {
    payload.seen = hasSeen || false;
  }

  if (data.hasOwnProperty('message')) {
    payload.text = message;
    payload.type = MessageType.message;
  } else if (data.hasOwnProperty('image')) {
    payload.text = 'sent a picture!';
    payload.type = MessageType.image;
  } else if (data.hasOwnProperty('location')) {
    payload.text = 'sent a location!';
    payload.type = MessageType.location;
  }

  return payload;
};

export const getLastMessage = async ({ channel, uid }) => {
  const message = await _getLastMessage({ channel, uid });
  store.dispatch(updateChannel({ uid, ...message }));
  return message;
};

const messageCache = {};
const _getLastMessage = async ({ channel, uid }) => {
  if (channel) {
    const ref = firebase.database().ref(`messages/${channel}/users/${firebase.uid()}`);

    // firebase.database().ref('messages/').once('value', _channelSnap => {
    //     _channelSnap.forEach(channel => {

    //         let route = `messages/${channel.key}/users/`;
    //         let ref = firebase.database().ref(route);

    //         ref.once("value", snap => {

    //             snap.forEach(user => {
    //                 // console.warn(snap.key, snap.val(), new Date(snap.val()).getTime());
    //                 ref.child(user.key).once("value", _snap => {
    //                     let messages = {};
    //                     _snap.forEach(message => {
    //                         messages[message.key] = new Date(message.val()).getTime();
    //                         // console.warn(user.key, message.key, message.val());
    //                     });

    //                     // console.warn("outkey", `messages/${channel.key}/users/`, user.key);
    //                     ref.child(user.key).update(messages);
    //                 });
    //             });
    //         });

    //     });
    // });

    const snapshot = await new Promise((res, rej) =>
      ref
        .orderByKey()
        .limitToLast(1)
        .once('child_added', res)
        .catch(rej));

    if (messageCache[channel]) {
      if (messageCache[channel][snapshot.key]) {
        return messageCache[channel] && messageCache[channel][snapshot.key];
      }
    } else {
      messageCache[channel] = {};
    }

    const messageSnapshot = await new Promise((res, rej) =>
      firebase
        .database()
        .ref(`messages/${channel}/messages/${snapshot.key}/`)
        .once('value', res)
        .catch(rej));

    const messages = messageSnapshot.val();
    const __message = formatLastMessage(messages);
    __message.image = await ImageProvider.getProfileImage(uid);
    __message.name = await ProfileProvider.getPropertyForUser({ uid, property: 'first_name' });

    messageCache[channel][snapshot.key] = __message;
    return __message;
  }

  // TODO: Maybe make this a default in the cell
  return {
    seen: false,
    outgoing: false,
    text: Meta.no_messages_placeholder,
    type: 'message',
    date: new Date(),
  };
};

const uploadMessageReferences = async (channel, timestamp, key) => {
  console.log('Upload Message References', channel, key);

  firebase
    .database()
    .ref(`messages/${channel}/users/${uid}/${key}`)
    .set({ timestamp });
};

const pathForImage = ({ channel, key, image }) => {
  if (image) {
    const { uri } = image;
    const file = uri
      .split('\\')
      .pop()
      .split('/')
      .pop()
      .split('.');
    const extension = file.pop();
    const photourl = `images/messaging/${channel}/images/${key}/image.${extension}`;
    return photourl;
  }
};
const uploadMessageData = async (image, message, channel, key, onProgress, overridePath) => {
  const _uid = firebase.uid();

  // const { image } = message;
  if (image) {
    const { uri } = image;

    // let filename = file.pop();

    let photourl;
    if (!overridePath) {
      photourl = pathForImage({ channel, key, image });
    } else {
      photourl = overridePath;
    }
    const res = await ImageProvider.uploadAsset({ path: photourl, image, onProgress });
    console.log('Uploaded Image', res, (res || {}).metadata);
    const {
      downloadUrl,
      ref: { path: fullPath },
    } = res;
    if (downloadUrl) {
      console.log('Message:Image', downloadUrl, fullPath);
      message.image = {
        path: fullPath,
        url: downloadUrl,
      };
    } else {
      // TODO: Send to server to delete the image because no reference exists for retrival.
      console.error('Invalid Metadata uploadMessageData');
    }

    const update = await new Promise((res, rej) =>
      firebase
        .database()
        .ref(`messages/${channel}/messages/${key}`)
        .update(message)
        .then(res)
        .catch(rej));
    return update;
  }
};

export const sendMessage = async (channel, uid, message) => {
  const messageUrl = `messages/${channel}/messages/`;
  const chatKey = firebase
    .database()
    .ref(messageUrl)
    .push().key;

  const { image } = message;
  if (image) {
    const photourl = pathForImage({ channel, key: chatKey, image });
    message.image = {
      path: photourl,
      url: image.uri,
    };
    (async () => {
      await uploadMessageData(image, message, channel, chatKey, (_) => {}, photourl);
      new Promise((res, rej) =>
        firebase
          .database()
          .ref(messageUrl)
          .child(chatKey)
          .set(message)
          .then(res)
          .catch(rej));
    })();
  } else {
    new Promise((res, rej) =>
      firebase
        .database()
        .ref(messageUrl)
        .child(chatKey)
        .set(message)
        .then(res)
        .catch(rej));
  }

  return {
    message,
    chatKey,
  };
};

export const deleteChannel = (channel) => {
  // TODO: Add Message Deleting
  return;
  Alert.alert(
    Meta.delete_message_channel_title,
    Meta.delete_message_channel_subtitle,
    [
      {
        text: Meta.delete_message_channel_action,
        onPress: () => {
          const ref = firebase
            .database()
            .ref(`messages/${channel}/users/${firebase.uid()}`)
            .set(true);
          // const ref = firebase.database().ref(`messaging/${firebase.uid()}/chats/${channel}`).update({hidden: new Date().getTime() });
          // ref.remove();
        },
      },
      { text: Meta.delete_message_channel_destructive, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    ],
    { cancelable: true },
  );
};

export const getChannelKey = async ({ uid }) => {
  const _uid = firebase.uid();
  const ref = firebase.database().ref(`messaging/${_uid}/chats`);
  const snapshot = await new Promise((resolve, reject) =>
    ref
      .orderByChild('uid')
      .equalTo(uid)
      .once('value', resolve)
      .catch(reject));
  // console.log("got cheeet rmom", snapshot.key, snapshot.val())
  if (snapshot.val() != null) {
    return Object.keys(snapshot.val())[0];
  }
  // Get the unique ID generated by push()

  const pushRef = firebase.database().ref(`messaging/${_uid}/chats`);
  const snapshot = await new Promise((resolve, reject) =>
    pushRef
      .push({ uid })
      .then(resolve)
      .catch(reject));
  const postID = snapshot.key;

  firebase
    .database()
    .ref(`messaging/${uid}/chats/${postID}`)
    .set({ uid: _uid });
  firebase
    .database()
    .ref(`messages/${postID}/users`)
    .update({ [uid]: true, [_uid]: true });
  return postID;
};
