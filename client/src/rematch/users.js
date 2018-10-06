import { dispatch } from '@rematch/core';
import Fire from '../Fire';
import IdManager from '../IdManager';
import moment from 'moment';

export function filterUser(user) {
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

  const uid = isV(_uid) || isV(_key);

  const name =
    isV(first_name) ||
    isV(_name) ||
    isV(displayName) ||
    isV(deviceName) ||
    uid ||
    Settings.noName;
  const image = isV(photoURL) || isV(_image);

  const nextUser = {
    ...__userProps,
    uid,
    name,
    image,
  };

  return nextUser;
}

export const lessThanHoursAgo = (date, hours = 2) =>
  moment(date).isAfter(moment().subtract(hours, 'hours'));

export function isValidUser(user, hours, fields = ['name', 'image', 'uid']) {
  if (user == null || typeof user === 'undefined') {
    return false;
  }

  // If user data couldn't be loaded for some reason, then pause to prevent loop. Check again sometime later.
  if (user.ensured && lessThanHoursAgo(user.ensured, hours)) {
    return true;
  }
  for (const field of fields) {
    if (!user[field] || typeof user[field] !== 'string' || user[field] === '') {
      return false;
    }
  }
  return true;
}

async function ensureUserIsLoadedAsync(uid, users, hours) {
  console.log('ensureUserIsLoadedAsync:A', !IdManager.isInteractable(uid));

  const storedUser = users[uid];

  if (!IdManager.isInteractable(uid)) {
    // The current user should always be loaded and up to date.
    return { user: storedUser };
  }

  if (storedUser && !IdManager.isThoroughlyValid(uid)) {
    dispatch.users.remove({ uid });
    console.warn('Removed invalid user id', uid);
    return null;
  }

  const shouldForceUpdate = hours !== undefined && hours === 0;

  console.log('ensureUserIsLoadedAsync: AA ', { shouldForceUpdate });
  if (shouldForceUpdate || !isValidUser(storedUser, hours)) {
    try {
      const snapshot = await Fire.shared._getUserInfoAsync({ uid });
      const userData = snapshot.data();
      if (userData) {
        const nextUser = {
          ...filterUser(userData),
          ensured: Date.now(),
        };
        console.log('ensureUserIsLoadedAsync: C: userData', nextUser);

        dispatch.users.update({
          uid,
          user: nextUser,
        });
        return { isUpdated: true, user: nextUser };
      }
      console.log('REMOVED USER', uid);
      dispatch.users.remove({ uid });
      return { isUpdated: true, isRemoved: true };
    } catch ({ message }) {
      throw new Error(`getPropForUser ${message}`);
    }
  }
  return { isUpdated: false, user: storedUser };
}

async function refreshAsync(users) {
  // TODO: OMFG
  const userIds = Object.keys(users);

  console.log('refreshAsync: IDs to refresh', { userIds });

  // If no users, then return.
  if (!userIds.length) {
    console.log('refreshAsync: No users');
    return null;
  }
  const promises = userIds.map(uid => ensureUserIsLoadedAsync(uid, users, 0));
  console.log('refreshAsync: ready to refresh');
  return Promise.all(promises);
}

let _lastPagedCursor;
let _hasMore = true;
const users = {
  state: {},
  reducers: {
    update: (state, { uid, user }) => {
      const _uid = uid || user.uid;
      const { [_uid]: currentUser = {}, ...otherUsers } = state;
      return {
        ...otherUsers,
        [_uid]: { ...currentUser, ...user },
      };
    },
    set: (state, { uid, user }) => {
      const { [uid]: currentUser, ...otherUsers } = state;
      return {
        ...otherUsers,
        [uid]: user,
      };
    },
    remove: (state, { uid }) => {
      const { [uid]: userToRemove, ...otherUsers } = state;
      return {
        ...otherUsers,
      };
    },
    clear: () => ({}),
  },
  effects: {
    getAsync: async ({ uid }) => {},
    ensureUserIsLoadedAsync: async ({ uid, callback }, { users }) => {
      const cb = callback || function () {};

      const payload = await ensureUserIsLoadedAsync(uid, users);
      const { user, isRemoved } = payload || {};
      cb(user);
    },
    getPaged: async ({ size, start }, { hasMoreUsers, isLoadingUsers }) => {
      // console.log('wait.getPaged', { hasMoreUsers, isLoadingUsers });
      if (isLoadingUsers) {
        // console.log('TODO: Already loading');
        return;
      }
      if (!hasMoreUsers) {
        console.log('TODO: No More data');
        return;
      }

      dispatch.isLoadingUsers.start();
      const { data, cursor } = await Fire.shared.getUsersPaged({
        size,
        start: start || _lastPagedCursor,
      });

      console.log('users.getPaged: ', data.length, !!_lastPagedCursor);

      _hasMore = data.length === size;

      dispatch.hasMoreUsers.set(_hasMore);
      _lastPagedCursor = cursor;
      let i = 0;
      for (const user of data) {
        const nextUser = {
          ...filterUser(user),
          ensured: Date.now(),
        };

        console.log('users.getPaged.loop: ', i, nextUser);

        dispatch.users.update({ user: nextUser });
        i++;
      }

      dispatch.isLoadingUsers.end();
    },
    refreshAsync: async ({ callback: _cb }, { users }) => {
      const callback = _cb || function () {};
      const _users = await refreshAsync(users);
      console.log('refreshAsync: refreshed users', _users);
      callback(_users);
    },
    update: ({ uid: _uid, user = {} }, { users }) => {
      const uid = _uid || user.uid;
      
      if (!uid) {
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
