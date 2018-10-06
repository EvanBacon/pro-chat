/*
image, name, message, timestamp, seen, sender, groupId
*/
import { Permissions } from '../universal/Expo';

import { dispatch } from '@rematch/core';

export const messages = {
  state: {},
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
    set: (state, payload) => payload,
  },
};

export const permissions = {
  state: {
    location: undefined,
  },
  reducers: {
    update: (state, payload) => ({ ...state, ...payload }),
    set: (state, payload) => payload,
  },
  effects: {
    getAsync: async ({ permission }) => {
      const { status } = await Permissions.getAsync(permission);
      dispatch.permissions.update({ [permission]: status });
    },
  },
};

export { default as isLoadingUsers } from './isLoadingUsers';
export { default as hasMoreUsers } from './hasMoreUsers';
export { default as auth } from './auth';
export { default as channelHasMore } from './channelHasMore';
export { default as chats } from './chats';
export { default as isLoadingEarlier } from './isLoadingEarlier';
export { default as isTyping } from './isTyping';
export { default as location } from './location';
export { default as notifications } from './notifications';
export { default as onBoarding } from './onBoarding';
export { default as popular } from './popular';
export { default as relationships } from './relationships';
export { default as user } from './user';
export { default as users } from './users';
