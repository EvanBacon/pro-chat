import Settings from '../constants/Settings';
import Fire from '../Fire';
import IdManager from '../IdManager';
import Relationship from '../models/Relationship';
import firebase from '../universal/firebase';

const relationships = {
  state: {},
  reducers: {
    set: (state, props) => props,
  },
  effects: {
    whenWasUserRated: () => {},
    updateAsync: async ({ uid: otherId, type }) => {
      const userId = IdManager.uid;
      if (!IdManager.isInteractable(otherId)) {
        console.warn('Cannot Rate urself');
        return;
      }
      const isPerformingInvalidAction =
        type === Relationship.blocked || type === Relationship.matched;
      if (isPerformingInvalidAction) {
        throw new Error(`Cannot set relationship to ${type} in the client`);
      }
      const groupId = IdManager.getGroupId(otherId);
      console.log('relationships.updateAsync', { otherId, type, groupId });
      // const props = {
      //   members: [userId, otherId],
      //   status: {
      //     [userId]: type,
      //   },
      //   timestamp: {
      //     [userId]: Date.now(),
      //   },
      // };
      const doc = await firebase
        .firestore()
        .collection(Settings.refs.relationships)
        .doc(groupId);
      function createGroupAsync(...ids) {
        const members = IdManager.sortIDs(...ids);
        console.log('Relationship.updateAsync: createGroupAsync', { members });
        return doc.set({ members });
      }
      async function checkGroupExistenceAsync() {
        console.log('Relationship.updateAsync: checkGroupExistenceAsync');
        const _doc = await doc.get();
        return _doc.exists;
      }
      async function ensureGroupExistenceAsync() {
        const exists = await checkGroupExistenceAsync();
        console.log('Relationship.updateAsync: ensureGroupExistenceAsync', {
          exists,
        });
        if (!exists) {
          await createGroupAsync(userId, otherId);
        }
      }
      function getNewStatusGivenCurrentStatus({
        currentUserStatus,
        otherUserStatus,
        inputStatus,
      }) {
        const isNoChange = currentUserStatus === inputStatus;
        const isUserBlockedByOther = currentUserStatus === Relationship.blocked;
        const isUserBlockingOther = currentUserStatus === Relationship.blocking;
        const isUserMatchedToOther =
          currentUserStatus === Relationship.matched &&
          otherUserStatus === Relationship.match;
        const otherUserLikesYou =
          otherUserStatus === Relationship.like ||
          otherUserStatus === Relationship.match;
        console.log(
          'Relationship.updateAsync: getNewStatusGivenCurrentStatus',
          {
            isNoChange,
            isUserBlockedByOther,
            isUserBlockingOther,
            isUserMatchedToOther,
            otherUserLikesYou,
          },
        );
        if (!isNoChange && !isUserBlockedByOther) {
          // Something is gonna happen...
          let nextTypeForOtherUser = otherUserStatus;
          let nextTypeForUser = inputStatus;
          // We've already prevented default. This means any action must be unblocking.
          if (isUserBlockingOther) {
            nextTypeForOtherUser = Relationship.none;
          } else {
            switch (inputStatus) {
              case Relationship.like:
                if (!isUserMatchedToOther && otherUserLikesYou) {
                  nextTypeForOtherUser = Relationship.match;
                  nextTypeForUser = Relationship.match;
                }
                break;
              case Relationship.none:
              case Relationship.dislike:
                if (isUserMatchedToOther) {
                  nextTypeForOtherUser = Relationship.like;
                }
                break;
              case Relationship.blocking:
                nextTypeForOtherUser = Relationship.blocked;
                break;
              default:
                break;
            }
          }
          return {
            [otherId]: nextTypeForOtherUser,
            [userId]: nextTypeForUser,
          };
        }
        return null;
      }
      async function relationshipTransaction(transaction, inputDoc) {
        if (!inputDoc.exists) {
          throw new Error('Document does not exist!');
        }
        const data = inputDoc.data();
        const currentTimestamps = data.timestamps || {};
        const currentStatus = data.status || {};
        const otherUserStatus = currentStatus[otherId] || Relationship.none;
        const currentUserStatus = currentStatus[userId] || Relationship.none;
        const nextStatus = getNewStatusGivenCurrentStatus({
          currentUserStatus,
          otherUserStatus,
          inputStatus: type,
        });
        if (nextStatus) {
          const timestamp = Date.now();
          const timestamps = {
            [otherId]: currentTimestamps[otherId] || timestamp,
            [userId]: timestamp,
          };
          const updates = { status: nextStatus, timestamps };
          transaction.update(doc, updates);
          return updates;
        }
        return Promise.reject(new Error('Sorry! Population is too big.'));
      }
      await ensureGroupExistenceAsync();
      const db = firebase.firestore();
      const _status = await db.runTransaction(transaction =>
        transaction
          .get(doc)
          .then(sfDoc => relationshipTransaction(transaction, sfDoc)));
      console.log({ _status });
    },
    getAsync: async ({ uid: otherId }) => {
      const userId = Fire.shared.uid;
      if (!IdManager.isInteractable(otherId)) return;
      // console.log({ uid });
      const groupId = IdManager.getGroupId(otherId);
      const doc = await firebase
        .firestore()
        .collection(Settings.refs.relationships)
        .doc(groupId);
      const snapshot = await doc.get();
      if (snapshot.exists) {
        const data = snapshot.data();
        if (data) {
          const { status = {} } = data;
          const { [userId]: relationship } = status;
          console.log('do something', { relationship });
        }
      }
    },
    getAllOfTypeAsync: async ({ type }) => {
      console.log({ type });
      // const userId = Fire.shared.uid;
      // const doc = await firebase.firestore().collection(Settings.refs.relationships).where('members', 'array-contains', userId).where(`status.${userId}`, '==', type);
      // doc.get();
    },
    isMatched: ({ uid: otherId, shouldUpdate = false, callback }) => {
      const userId = Fire.shared.uid;
      if (otherId === userId) return;
      // const isMatched = getAsync() === Relationship.match;
      callback(false);
    },
  },
};
export default relationships;
