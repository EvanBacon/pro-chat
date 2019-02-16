import { dispatch } from './dispatch';

let _timeout;
export default {
  state: false,
  reducers: {
    set: (state, props) => props,
    clear: () => false,
  },
  effects: {
    start: (timeout = 2000) => {
      _timeout = setTimeout(() => dispatch.isLoadingUsers.set(false), timeout);
    },
    end: () => {
      clearTimeout(_timeout);
      dispatch.isLoadingUsers.set(false);
    },
  },
};
