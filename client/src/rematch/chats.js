import { dispatch } from '@rematch/core';

import Fire from '../Fire';

const firstCursorCollection = {};

const cursorCollection = {};

function transformMessageForGiftedChat({ message, user }) {
  const { key: _id, uid, timestamp: createdAt } = message;
  return {
    ...message,
    _id,
    createdAt,
    user: {
      name: user.displayName,
      avatar: user.photoURL,
      _id: uid,
    },
  };
}

export const chats = {
  state: {
    // [groupId]: {}
  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
    set: (state, payload) => payload,
    addMessages: (state, { groupId, messages }) => {
      if (!groupId || !messages) {
        return state;
      }
      const { [groupId]: currentMessages = {}, ...nextState } = state;
      // TODO: So bad, don't sort every time.
      const nextMessages = { ...currentMessages, ...messages };
      // .sort(
      //   (a, b) => a.createdAt < b.createdAt,
      // );
      return {
        ...nextState,
        [groupId]: nextMessages,
      };
    },
    clear: (state, { uid }) => ({ ...state, [uid]: undefined }),
  },
  effects: {
    subscribeToChannel: () => {
      console.warn('TODO: subscribeToChannel');
    },
    deleteMessageFromChannel: ({ groupId, key }) => {
      console.warn('TODO: deleteMessageFromChannel');
    },
    loadEarlier: () => {
      console.warn('TODO: loadEarlier');
    },
    updatedInputText: () => {
      console.warn('TODO: updatedInputText');
    },
    getLastMessage: () => {
      console.warn('TODO: getLastMessage');
    },
    deleteChannel: () => {
      console.warn('TODO: deleteChannel');
    },
    updatedGifOpened: () => {
      console.warn('TODO: updatedGifOpened');
    },
    didRecieveMessageKey: () => {
      console.warn('TODO: didRecieveMessageKey');
      // / Set the `seen` value
    },
    getChannelForUser: () => {
      console.warn('TODO: getChannelForUser');
    },
    _parseMessage: async ({ message, groupId }, { chats }) => {
      if (chats[groupId] && chats[groupId][message.key]) {
        // prevent duplicates.
        // throw new Error('Found duplicated ' + message.key + ' ' + groupId);
        console.log('FIXME: Duplicate');
        return;
      }
      const { uid } = message;
      if (!uid || uid === '') {
        throw new Error("Invalid UID, can't parse message");
      }

      const user = await new Promise(res =>
        dispatch.users.ensureUserIsLoadedAsync({ uid, callback: res }));
      //   const user = await Fire.shared.getUserAsync({ uid });
      if (user == null) {
        throw new Error("Invalid User data found, can't parse message");
      }
      console.log('Add Message', message.key);
      dispatch.chats.addMessages({
        groupId,
        messages: {
          [message.key]: transformMessageForGiftedChat({ message, user }),
        },
      });
    },
    startChatting: async ({ uids, callback }, { chats }) => {
      const groupId = Fire.shared.getGroupId(uids);
      console.log('start chatting');
      if (!chats[groupId]) {
        const exists = await Fire.shared.ensureChatGroupExists(uids);
        if (exists) {
          dispatch.chats.update({ [groupId]: {} });
        }
      }
      let startAt;
      if (chats[groupId]) {
        startAt = Object.keys(chats[groupId]).length;
      }
      console.log({ startAt });
      const unsubscribe = Fire.shared.subscribeToChatGroup({
        groupId,
        cursor: (cursorCollection[groupId] || {}).ref,
      });
      callback(unsubscribe);
    },
    loadPrevious: async ({ groupId, callback }) => {
      if (firstCursorCollection[groupId]) {
        const startBefore = firstCursorCollection[groupId];
        firstCursorCollection[groupId] = undefined;
        Fire.shared.loadMoreFromChatGroup({ groupId, callback, startBefore });
      }
      // TODO: IDK
      callback(true);
    },
    receivedMessage: async ({ groupId, snapshot }, { chats }) => {
      if (!chats[groupId]) {
        // TODO: This seems leaky... make sure receivedMessage is only called from a subscription
        // const exists = await Fire.shared.ensureChatGroupExists(groupId);
        // if (exists) {
        dispatch.chats.update({ [groupId]: {} });
        // }
      }
      snapshot.docChanges().forEach(({ type, doc }) => {
        console.log('Found message: parseMessagesSnapshot: ', type, doc.id);
        if (type === 'added') {
          const message = { key: doc.id, ...doc.data() };
          dispatch.chats._parseMessage({ message, groupId });
        } else {
          // removed
          console.log('TODO: parseMessagesSnapshot: ', type);
          // TODO: Maybe remove
        }
      });
      if (!firstCursorCollection[groupId]) {
        firstCursorCollection[groupId] = snapshot.docs[0];
      }
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      if (lastVisible) {
        const lastTimestamp = lastVisible.data().timestamp;
        if (
          !cursorCollection[groupId] ||
          lastTimestamp > cursorCollection[groupId].timestamp
        ) {
          cursorCollection[groupId] = {
            ref: lastVisible,
            timestamp: lastTimestamp,
          };
        }
      }
    },
  },
};

export default chats;
