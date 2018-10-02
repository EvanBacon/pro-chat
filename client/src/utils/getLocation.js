import getPermission from './getPermission';
import { Permissions, Location } from 'expo';
import Settings from '../constants/Settings';


const getLocation = async (preventServerUpdate = false) => {
  const hasit = await getPermission(Permissions.LOCATION);
  if (!hasit) {
    return null;
  }
  if (Settings.simulator && Settings.debuggingLocation) {
    return { latitude: 30.14728379721442, longitude: -97.77971597219003 };
  }

  const { coords } = await Location.getCurrentPositionAsync({});

  return coords;
};


export default getLocation;

