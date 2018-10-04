import uuid from 'uuid';

import firebase from './universal/firebase';

class IdManager {
  _groupIdCache = {};

  get uid() {
    // FML... I want this to begon
    return (firebase.auth().currentUser || {}).uid;
  }

  isValid(key) {
    return key && typeof key === 'string' && key !== '';
  }

  ensureIdArray(input) {
    if (input != null) {
      if (Array.isArray(input)) {
        return input;
      } else if (typeof input === 'string') {
        return input.split('_');
      }
    }
    throw new Error('ensureUidGroup: requires valid input');
  }

  sortIDs(...ids) {
    const keys = ids.sort((a, b) => a > b); // +(a.attr > b.attr) || -(a.attr < b.attr));
    return keys;
  }

  sortIDsIntoKey = (...ids) => {
    const groupId = this.sortIDs(...ids).join('_');
    return groupId;
  };

  ensureChatGroupIDs(input) {
    if (input == null || !Array.isArray(input)) {
      throw new Error('ensureChatGroupIDs: Invalid IDs', { input });
    }
    const uids = [...new Set(input)];
    if (uids.length < 2) {
      throw new Error('ensureChatGroupIDs: Not enough IDs', { uids });
    }
    return uids;
  }

  getOtherUserFromChatGroup = groupId =>
    this.getOtherUsersFromChatGroup(groupId)[0];

  getOtherUsersFromChatGroup = (groupId) => {
    if (!this.isValid(groupId)) {
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

  generateGroupId = (input) => {
    const ids = this.ensureChatGroupIDs(input);
    return this.sortIDsIntoKey(...ids);
  };

  getGroupId = (uids) => {
    // This is the dumbest code I've ever written
    const shouldCache = typeof uids === 'string';
    if (shouldCache && this._groupIdCache[uids]) {
      return this._groupIdCache[uids];
    }

    const groupId = this.generateGroupId([
      ...this.ensureIdArray(uids),
      this.uid,
    ]);

    if (shouldCache) this._groupIdCache[uids] = groupId;

    return groupId;
  };

  generateKey() {
    return uuid.v4();
  }

  // Validate the key, then make sure it isn't you.. This is good for lots of stuff.
  isInteractable = uid => this.isValid(uid) && uid !== this.uid;
}

export default new IdManager();
