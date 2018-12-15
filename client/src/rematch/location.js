import Settings from '../constants/Settings';
import { Permissions, Location } from '../universal/Expo';
import getPermission from '../utils/getPermission';

// import GameStates from '../Game/GameStates';
// function mergeInternal(state, { uid, user }) {
//   const { [uid]: currentUser, ...otherUsers } = state;
//   return {
//     ...otherUsers,
//     [uid]: { ...(currentUser || {}), ...user },
//   };
// }
// function parseName(inputName, backupName) {
//   let name = inputName || backupName || 'Markipillar';
//   if (typeof name === 'string') {
//     name = name.trim();
//   }
//   return name;
// }
const location = {
  state: {},
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => {},
  },
  effects: {
    getAsync: async () => {
      const hasit = await getPermission(Permissions.LOCATION);
      if (!hasit) {
        return null;
      }
      if (Settings.simulator && Settings.debuggingLocation) {
        // return syncCoords(
        //   false,
        //   { latitude: 30.14728379721442, longitude: -97.77971597219003 },
        //   new Date().getTime(),
        // );
      }
      const { coords, timestamp } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      // Add to user profile
    },
  },
};
export default location;
