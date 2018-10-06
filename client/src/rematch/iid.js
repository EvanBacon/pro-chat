import Settings from '../constants/Settings';
import Fire from '../Fire';
import firebase from '../universal/firebase';

export default {
  state: null,
  reducers: {
    set: (state, payload) => payload,
  },
  effects: {
    setAsync: async () => {
      const route = `${Settings.refs.instanceID}/${Fire.shared.uid}`;
      const ref = firebase.database().ref(route);

      const token = await firebase.iid().getToken();
      ref.set(token);
    },
  },
};
