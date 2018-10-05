import { dispatch } from '@rematch/core';
import Fire from '../Fire';
import IdManager from '../IdManager';

function filterUser(user) {
  function isV(s) {
    if (s && s !== '') return s;
    return null;
  }
  // Remove these....
  const { stsTokenManager, providerData, ..._userProps } = user;

  // Merge These...
  const {
    first_name,
    name: _name,
    displayName,
    deviceName,
    photoURL,
    image: _image,
    uid: _uid,
    key: _key,
    ...__userProps
  } = _userProps;

  const name =
    isV(first_name) ||
    isV(_name) ||
    isV(displayName) ||
    isV(deviceName) ||
    Settings.noName;
  const image = isV(photoURL) || isV(_image);
  const uid = isV(_uid) || isV(_key);

  const nextUser = {
    ...__userProps,
    uid,
    name,
    image,
  };

  return nextUser;
}

const lessThanHoursAgo = (date, hours = 1) =>
  moment(date).isAfter(moment().subtract(hours, 'hours'));

function isValidUser(user, fields = ['name', 'image', 'uid']) {
  if (user == null || typeof user === 'undefined') {
    return false;
  }

  // If user data couldn't be loaded for some reason, then pause to prevent loop. Check again sometime later.
  if (user.ensured && lessThanHoursAgo(user.ensured, 3)) {
    return true;
  }
  for (const field of fields) {
    if (!user[field] || typeof user[field] !== 'string' || user[field] === '') {
      return false;
    }
  }
  return true;
}

const users = {
  state: {},
  reducers: {
    update: (state, { uid, user }) => {
      const { [uid]: currentUser = {}, ...otherUsers } = state;
      return {
        ...otherUsers,
        [uid]: { ...currentUser, ...user },
      };
    },
    set: (state, { uid, user }) => {
      const { [uid]: currentUser, ...otherUsers } = state;
      return {
        ...otherUsers,
        [uid]: user,
      };
    },
    clear: () => ({}),
  },
  effects: {
    debugLoadSomeUsersAsync: () => {
      dispatch.users.getPaged({ size: 2 });
    },
    getAsync: async ({ uid }) => {
      // dispatch.users.getPaged({size: 2})
    },
    ensureUserIsLoadedAsync: async ({ uid, callback }, { users }) => {
      const cb = callback || function () {};
      console.log('ensureUserIsLoadedAsync:A', !IdManager.isInteractable(uid));
      if (!IdManager.isInteractable(uid)) {
        // The current user should always be loaded and up to date.
        cb(null);
        return;
      }
      const storedUser = users[uid];
      console.log(
        'ensureUserIsLoadedAsync:B',
        !!storedUser,
        !isValidUser(storedUser),
      );
      if (!isValidUser(storedUser)) {
        try {
          const snapshot = await Fire.shared._getUserInfoAsync({ uid });
          const userData = snapshot.data();
          if (userData) {
            console.log('userData', userData);
            const nextUser = {
              ...filterUser(userData),
              ensured: Date.now(),
            };
            dispatch.users.update({
              uid,
              user: nextUser,
            });
            cb(nextUser);
            return;
          }
        } catch ({ message }) {
          throw new Error(`getPropForUser ${message}`);
        }
      }
      cb(storedUser);
    },
    getPaged: async ({ size, start }) => {
      const { data } = await Fire.shared.getUsersPaged({ size, start });
      for (const user of data) {
        dispatch.users.update({ uid, user: filterUser(user) });
      }
    },

    update: ({ uid, user }, { users }) => {
      if (!uid || !user) {
        throw new Error(`dispatch.users.update: You must pass in a valid uid and user: ${uid} - ${JSON.stringify(user || {})}`);
      }
      const currentUser = users[uid] || {};
      dispatch.users.set({ uid, user: { ...currentUser, ...user } });
    },
    clearUser: ({ uid }) => dispatch.users.set({ uid, user: null }),
    getProfileImage: ({ uid, forceUpdate }) => {
      dispatch.users.getPropertyForUser({
        uid,
        propName: 'photoURL',
        forceUpdate,
      });
    },
    getPropertyForUser: async (
      {
        propName, uid, forceUpdate, callback: _cb,
      },
      { users },
    ) => {
      const callback = _cb || function () {};
      if (!IdManager.isValid(uid)) {
        console.warn('getPropertyForUser: Invalid Key', { uid });
        callback();
        return null;
      }
      if (
        forceUpdate === true ||
        !users[uid] ||
        Object.keys(users[uid]).length === 0 ||
        users[uid][propName] == null
      ) {
        try {
          const snapshot = await Fire.shared._getUserInfoAsync({ uid });
          const userData = snapshot.data();
          if (userData) {
            dispatch.users.update({
              uid,
              user: { [propName]: userData[propName] },
            });
            callback(userData);
            return null;
          }
        } catch ({ message }) {
          throw new Error(`getPropForUser ${message}`);
        }
        callback(null);
        return null;
      }
    },
  },
};

export default users;
