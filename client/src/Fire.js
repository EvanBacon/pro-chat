// @flow
import { dispatch } from '@rematch/core';
import { Constants } from './universal/Expo';

import Settings from './constants/Settings';
import Secret from '../Secret';


import uuid from 'uuid';
import { store } from './rematch/Gate';

const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

const collectionName = Settings.slug;

function isValidKey(key) {
  return key && typeof key === 'string' && key !== '';
}
function ensureUidGroup(input) {
  if (input != null) {
    if (Array.isArray(input)) {
      return input;
    } else if (typeof input === 'string') {
      return input.split('_');
    }
  }
  throw new Error('ensureUidGroup: requires valid input');
}

function ensureChatGroupIDs(input) {
  if (input == null || !Array.isArray(input)) {
    throw new Error('ensureChatGroupIDs: Invalid uids', { input });
  }
  const uids = [...new Set(input)];
  if (uids.length < 2) {
    throw new Error('ensureChatGroupIDs: Not enough uids', { uids });
  }
  return uids;
}


class Fire {
  constructor() {}

  init = () => {
    // if (!Settings.isFirebaseEnabled) {
    //   return;
    // }

    firebase.initializeApp(Secret);
    firebase.firestore().settings({ timestampsInSnapshots: true });
    dispatch.user.observeAuth();

    // dispatch.users.clear();
    // dispatch.user.clear();
  };

  /*
    negative values are also accepted... Use this for spending and for updating after a game.
  */
  addCurrency = amount =>
    new Promise((res, rej) => {
      this.db
        .runTransaction(transaction =>
          transaction.get(this.doc).then((userDoc) => {
            if (!userDoc.exists) {
              throw new Error('Document does not exist!');
            }

            const data = userDoc.data();
            const currency = data.currency || 0;
            const newCurrency = currency + amount;
            transaction.update(this.doc, { currency: newCurrency });
            this.user.currency = newCurrency;
            return newCurrency;
          }))
        .then(res)
        .catch(rej);
    });

  upgradeAccount = async () => {
    dispatch.facebook.upgradeAccount();
  };

  submitComplaint = (targetUid, complaint) => {
    this.db.collection('complaints').add({
      slug: Constants.manifest.slug,
      uid: this.uid,
      targetUid,
      complaint,
      timestamp: this.timestamp,
    });
  };

  _getUserInfoAsync = ({ uid }) =>
    this.db
      .collection('users')
      .doc(uid)
      .get();


  getOtherUsersFromChatGroup = (groupId) => {
    if (!isValidKey(groupId)) {
      console.warn('getOtherUsersFromChatGroup: Invalid group id', { groupId });
      return [];
    }
    // / Remove self from group...
    const uids = groupId.split('_');
    if (uids.length < 2) return uids[1];

    const idx = uids.indexOf(this.uid);
    if (idx > -1) {
      uids.splice(idx, 1);
    }
    return uids;
  };


  getGroupId = (...uids) => {
    const shouldCache = typeof uids === 'string';
    if (shouldCache && this._groupIdCache[uids]) return this._groupIdCache[uids];

    const groupId = this._getChatGroupId([...ensureUidGroup(uids), this.uid]);

    if (shouldCache) this._groupIdCache[uids] = groupId;

    return groupId;
  };

  _groupIdCache = {};
  _getChatGroupId = (input) => {
    const uids = ensureChatGroupIDs(input);
    const keys = uids.sort((a, b) => +(a.attr > b.attr) || -(a.attr < b.attr));
    const groupId = keys.join('_');
    return groupId;
  };

  ensureChatGroupExists = async (uids) => {
    const keys = [...ensureUidGroup(uids), this.uid];
    const key = this._getChatGroupId(keys);
    const chatGroupExists = await this._checkChatGroupExistence(key);
    console.log({ key, chatGroupExists });
    if (chatGroupExists) {
      return true;
    }
    await this._createChatGroup(key, keys);
    return true;
  };

  _checkChatGroupExistence = async (key) => {
    const doc = await this.getChatGroupDoc(key).get();
    return doc.exists;
  };
  
  canMessage = ({ uid }) => {
    return (isValidKey(uid) && uid !== this.uid);
  }
  getChatGroupCollection = () => this.db.collection('chat_groups');

  getChatGroupDoc = groupId => this.getChatGroupCollection().doc(groupId);

  getMessagesCollection = groupId =>
    this.getChatGroupDoc(groupId).collection('messages');

  _createChatGroup = async (key, uids) => this.getChatGroupDoc(key).set({ members: uids });

  /*
    Get paged messages for populating chat or getting last message
  */
  getMessagesForChatGroup = ({ groupId, size, start }) =>
    this.getDataPaged({
      start,
      ref: this.getMessagesCollection(groupId)
        .orderBy('timestamp', 'desc')
        .limit(size || 25),
    });

  uploadImageAsync = uri => new Promise(async (res, rej) => {
    // todo: meta data is cool
    const metadata = {
      contentType: 'image/jpeg',
    };

    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref(`${this.uid}/images`)
      .child(`${uuid.v4()}.jpg`);

    const uploadTask = ref.put(blob, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        rej(error);
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          res(downloadURL);
        });
      },
    );
  });

  /*
    Get paged messages for populating chat or getting last message
    //TODO: Cache whenever we get a message.
  */
  getLastMessageForChatGroup = ({ groupId }) =>
    this.getMessagesForChatGroup({
      groupId,
      size: 1,
    });

  loadMoreFromChatGroup = async ({ groupId, startBefore }) => {
    const PAGE_SIZE = 5;
    const ref = this.getMessagesCollection(groupId)
      .orderBy('timestamp', 'desc')
      .limit(PAGE_SIZE)
      .startBefore(startBefore);

    const snapshot = await ref.get();
    dispatch.chats.receivedMessage({ groupId, snapshot });

    return snapshot;
  };

  subscribeToChatGroup = ({ groupId, cursor }) => {
    const PAGE_SIZE = 5;

    let ref = this.getMessagesCollection(groupId)
      .orderBy('timestamp', 'desc')
      .limit(PAGE_SIZE);
    if (cursor) {
      ref = ref.startAfter(cursor);
    }

    return ref.onSnapshot((snapshot) => {
      console.log('GOT MESSAGES', snapshot.docs.length);
      return dispatch.chats.receivedMessage({ groupId, snapshot });
    });
  };

  getMessageList = async () => {
    // / lol debug....

    console.log('debugging getMessageList()');
    const _debugPreviewMessages = {
      '0UUOFoP8xMTQ0lD5g8ax5CnIo2o2_k6rCUoV1ckMnej3zx31Pr9GJT143': {
        name: 'Evan Bacon',
        groupId: '0UUOFoP8xMTQ0lD5g8ax5CnIo2o2_k6rCUoV1ckMnej3zx31Pr9GJT143',
        photoURL: 'https://graph.facebook.com/10209358712923544/picture',
        uid: 'k6rCUoV1ckMnej3zx31Pr9GJT143',
        isGroupChat: false,
        message: 'Sent an image',
        isSeen: false,
        isSent: false,
        timeAgo: '15 hours ago',
      },
    };
    dispatch.messages.update(_debugPreviewMessages);
    return _debugPreviewMessages;

    const chatGroups = await this.getChatGroups({});

    const parseMessage = (
      {
        uid, displayName, deviceName, photoURL,
      },
      message,
      groupId,
      members,
    ) => {
      const isGroupChat = members.length > 1;

      let preview = '';
      let timeAgo;
      let isSeen;
      if (message) {
        timeAgo = timeago().format(message.timestamp);
        isSeen = message.seen != null;
        if (message.text) {
          preview = message.text;
        } else if (message.location) {
          preview = 'Sent a location';
        } else if (message.image) {
          preview = 'Sent an image';
        } else {
          preview = '😅 404: Message not found!';
        }
      } else {
        preview = 'Start Chatting!';
      }

      return {
        name: displayName || deviceName,
        groupId,
        photoURL,
        uid,
        isGroupChat,
        message: preview,
        isSeen,
        isSent: uid === this.uid,
        timeAgo,
      };
    };

    const uid = this.uid;
    if (!chatGroups) {
      return null;
    }

    const previewMessages = {};

    for (const chatGroup of chatGroups.data) {
      const { key: groupId, members } = chatGroup;
      const memberUids = members;

      // / Remove self from group...
      const idx = memberUids.indexOf(uid);
      if (idx > -1) memberUids.splice(idx, 1);

      // TODO: Evan: Promise.all([])
      const { data } = await this.getLastMessageForChatGroup({ groupId });
      const message = data[0];
      const group = memberUids;
      // TODO: Evan: Handle groups yolo
      const sender = group[0];
      const user = await this.getUserAsync({ uid: sender });

      console.log('previewMessage:try', {
        user, message, groupId, members,
      });
      const previewMessage = parseMessage(user, message, groupId, group);

      previewMessages[groupId] = previewMessage;
    }

    console.log('heeyyooo', JSON.stringify(previewMessages));
    dispatch.messages.update(previewMessages);
    return previewMessages;
  };

  getUserAsync = async ({ uid, forceUpdate }) => {
    if (!isValidKey(uid)) {
      console.warn('getUserAsync: Invalid Key', { uid });
      return null;
    }
    const { users } = store.getState();

    console.log('getUserAsync', uid, users[uid]);
    if (
      forceUpdate === true ||
      !users[uid] ||
      Object.keys(users[uid]).length === 0
    ) {
      try {
        const snapshot = await this._getUserInfoAsync({ uid });
        // yolo pull some stuff -- todo: do this in the rules
        const userData = snapshot.data();
        if (userData) {
          const {
            stsTokenManager,
            redirectEventId,
            phoneNumber,
            apiKey,
            authDomain,
            emailVerified,
            appName,
            ...user
          } = snapshot.data();
          dispatch.users.update({
            uid,
            user,
            // {
            //   ...user,
            //   name: user.displayName,
            //   avatar: user.photoURL,
            //   _id: uid,
            // },
          });
          return user;
        }
        console.log('Invalid user data', { uid, userData });
      } catch (error) {
        console.error(error);
      }
    }
    return users[uid];
  };

  // TODO: dont get all data for each user
  _getUserInfoAsync = ({ uid }) =>
    this.db
      .collection('users')
      .doc(uid)
      .get();

  /*
    Get all the chats to populate the message list
  */
  getChatGroups = ({ start }) =>
    this.getDataPaged({
      start,
      ref: this.getChatGroupCollection().where(
        'members',
        'array-contains',
        this.uid,
      ),
    });

    observeUser = ({ uid }) => {
      const doc = this.db.collection(Settings.refs.users).doc(uid);

      const unsub = doc.onSnapshot({
        // Listen for document metadata changes
        // includeMetadataChanges: true
      }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          if (change.type === 'added') {
            console.log('New city: ', data);
          }
          if (change.type === 'modified') {
            console.log('Modified city: ', data);
          }
          if (change.type === 'removed') {
            console.log('Removed city: ', data);
            // dispatch.users.update({ uid, })
          }
        });
      });
      return unsub;
    }

  sendMessage = (props, groupId) => {
    const message = {
      timestamp: this.timestamp,
      ...props,
      uid: this.uid,
    };
    console.log('send message', message);
    const key = uuid.v4();
    this.getMessagesCollection(groupId)
      .doc(key)
      .set(message);

    dispatch.chats._parseMessage({ message: { ...message, key }, groupId });
  };

  getUsersPaged = ({ size, start }) =>
    this.getDataPaged({
      start,
      ref: this.db
        .collection(Settings.refs.users)
        .orderBy('timestamp', 'desc')
        .limit(size),
    });

  getDataPaged = async ({ ref, start }) => {
    // let ref = this.db.collection(key).orderBy(key, 'desc').limit(size);
    try {
      if (start) {
        ref = ref.startAfter(start);
      }

      const querySnapshot = await ref.get();
      const data = [];
      querySnapshot.forEach((doc) => {
        const _data = doc.data();
        data.push({ key: doc.id, ..._data });
      });
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { data, cursor: lastVisible };
    } catch ({ message }) {
      throw new Error(`Error getting documents: ${message}`);
    }
  };


  get collection() {
    return this.db.collection(collectionName);
  }

  get doc() {
    return this.collection.doc(this.uid);
  }

  get db() {
    return firebase.firestore();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return Date.now();
  }

  get isAuthed() {
    return !!this.uid;
  }
}

Fire.shared = new Fire();
export default Fire;