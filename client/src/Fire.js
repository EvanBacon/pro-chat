// @flow
import { dispatch } from './rematch/dispatch';
import moment from 'moment';
import uuid from 'uuid';

import Secret from '../Secret';
import Settings from './constants/Settings';
import IdManager from './IdManager';
import { Constants } from './universal/Expo';

import firebase from './universal/firebase';
// const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

class Fire {
  constructor() {}

  init = () => {
    // if (!Settings.isFirebaseEnabled) {
    //   return;
    // }

    // firebase.initializeApp(Secret.firebase);
    // firebase.firestore().settings({ timestampsInSnapshots: true });
    dispatch.user.observeAuth();

    // dispatch.users.clear();
    // dispatch.user.clear();
  };

  submitComplaint = (targetUid, complaint) => {
    this.db.collection(Settings.refs.complaints).add({
      slug: Constants.manifest.slug,
      uid: this.uid,
      targetUid,
      complaint,
      timestamp: this.timestamp,
    });
  };

  _getUserInfoAsync = ({ uid }) =>
    this.db
      .collection(Settings.refs.users)
      .doc(uid)
      .get();

  ensureChatGroupExists = async uids => {
    const keys = [...IdManager.ensureIdArray(uids), this.uid];
    console.log('keys', keys);
    const key = IdManager.getGroupId(keys);
    const chatGroupExists = await this._checkChatGroupExistence(key);
    console.log({ key, chatGroupExists });
    if (chatGroupExists) {
      return true;
    }
    await this._createChatGroup(key, keys);
    return true;
  };

  _checkChatGroupExistence = async key => {
    const doc = await this.getChatGroupDoc(key).get();
    return doc.exists;
  };

  getChatGroupCollection = () => this.db.collection(Settings.refs.channels);

  getChatGroupDoc = groupId => this.getChatGroupCollection().doc(groupId);

  getMessagesCollection = groupId =>
    this.getChatGroupDoc(groupId).collection(Settings.refs.messages);

  _createChatGroup = async (key, uids) =>
    this.getChatGroupDoc(key).set({ members: uids });

  /*
    Get paged messages for populating chat or getting last message
  */
  getMessagesForChatGroup = ({ groupId, size, start, order }) =>
    this.getDataPaged({
      start,
      ref: this.getMessagesCollection(groupId)
        .orderBy('timestamp', order || 'desc')
        .limit(size || 25),
    });

  uploadImageAsync = uri =>
    new Promise(async (res, rej) => {
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
        snapshot => {
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
        error => {
          rej(error);
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
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
      //order: 'asc',
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

    return ref.onSnapshot(snapshot => {
      console.log('GOT MESSAGES', snapshot.docs.length);
      return dispatch.chats.receivedMessage({ groupId, snapshot });
    });
  };

  formatMessageForPreview = (
    message,
    groupId,
    user,
    // members,
  ) => {
    // const isGroupChat = members.length > 1;
    if (!message) {
      return null;
    }
    const { uid, name, image } = user || message.user || {};

    let preview = '';
    let timeAgo;
    let isSeen;
    if (message) {
      timeAgo = moment(message.timestamp).fromNow(true);
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
      name,
      groupId: groupId || message.groupId,
      image,
      uid,
      // isGroupChat,
      message: preview,
      isSeen,
      isSent: uid === this.uid,
      timeAgo,
    };
  };

  getMessageList = async (force = true) => {
    // / lol debug....

    // console.log('debugging getMessageList()');
    // const _debugPreviewMessages = {
    //   '0UUOFoP8xMTQ0lD5g8ax5CnIo2o2_k6rCUoV1ckMnej3zx31Pr9GJT143': {
    //     name: 'Evan Bacon',
    //     groupId: '0UUOFoP8xMTQ0lD5g8ax5CnIo2o2_k6rCUoV1ckMnej3zx31Pr9GJT143',
    //     photoURL: 'https://graph.facebook.com/10209358712923544/picture',
    //     uid: 'k6rCUoV1ckMnej3zx31Pr9GJT143',
    //     isGroupChat: false,
    //     message: 'Sent an image',
    //     isSeen: false,
    //     isSent: false,
    //     timeAgo: '15 hours ago',
    //   },
    // };
    // dispatch.messages.update(_debugPreviewMessages);
    // return _debugPreviewMessages;

    const chatGroups = await this.getChatGroups({});

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
      const message = data[0] || {};
      const group = memberUids;
      // TODO: Evan: Handle groups yolo
      const sender = group[0]; //message.uid ||
      const user = await new Promise(res =>
        dispatch.users.ensureUserIsLoadedAsync({ uid: sender, callback: res }),
      );
      const previewMessage = this.formatMessageForPreview(
        message,
        groupId,
        user,
        // group,
      );
      if (!previewMessage) return null;
      previewMessages[groupId] = previewMessage;
    }

    if (force) {
      dispatch.messages.clear();
    }

    dispatch.messages.update(previewMessages);
    return previewMessages;
  };

  updateLastMessageForGroupId = async groupId => {
    console.log('updateLastMessageForGroupId', groupId);
    const group = IdManager.getOtherUsersFromChatGroup(groupId);

    const { data } = await this.getLastMessageForChatGroup({ groupId });

    const message = data[0] || {};

    const sender = group[0];

    const user = await new Promise(res =>
      dispatch.users.ensureUserIsLoadedAsync({ uid: sender, callback: res }),
    );

    const previewMessage = this.formatMessageForPreview(message, groupId, user);

    if (!previewMessage) {
      return null;
    }

    dispatch.messages.update({ [groupId]: previewMessage });

    console.log('updateLastMessageForGroupId', previewMessage);
    return previewMessage;
  };

  // TODO: dont get all data for each user
  _getUserInfoAsync = ({ uid }) =>
    this.db
      .collection(Settings.refs.users)
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

  // observeUser = ({ uid }) => {
  //   const doc = this.db.collection(Settings.refs.users).doc(uid);

  //   const unsub = doc.onSnapshot({
  //     // Listen for document metadata changes
  //     // includeMetadataChanges: true
  //   }, (snapshot) => {
  //     snapshot.docChanges.forEach((change) => {
  //       const data = change.doc.data();
  //       if (change.type === 'added') {
  //         console.log('New city: ', data);
  //       }
  //       if (change.type === 'modified') {
  //         console.log('Modified city: ', data);
  //       }
  //       if (change.type === 'removed') {
  //         console.log('Removed city: ', data);
  //         // dispatch.users.update({ uid, })
  //       }
  //     });
  //   });
  //   return unsub;
  // }

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

  getUsersPaged = ({ size, start, orderBy }) =>
    this.getDataPaged({
      start,
      ref: this.db
        .collection(Settings.refs.users)
        .orderBy(orderBy || 'uid', 'desc')
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
      querySnapshot.forEach(doc => {
        const _data = doc.data();
        data.push({ key: doc.id, ..._data });
      });
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { data, cursor: lastVisible };
    } catch ({ message }) {
      throw new Error(`Error getting documents: ${message}`);
    }
  };

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
