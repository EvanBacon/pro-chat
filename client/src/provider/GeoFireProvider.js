import { Permissions, Location } from 'expo';
// import geofire from 'geofire';
import { Platform } from 'react-native';

import firebase from 'firebase';
import Settings from '../constants/Settings';
import Fire from '../Fire';
import getPermission from '../utils/getPermission';

let geoFire;
export const configure = (database) => {
  // geoFire = new geofire(database.ref('locations/'));
};

export const updateLocation = ({ latitude, longitude }) => {
  console.log('Update Location', latitude, longitude);
};

export const deallocate = () => {};

const getCurrentPositionAsync = async settings =>
  new Promise((res, rej) =>
    navigator.geolocation.getCurrentPosition(res, rej, settings));

const syncCoords = async (preventServerUpdate = false, coords, timestamp) => {
  const { latitude, longitude } = coords;

  const center = [latitude, longitude];
  console.warn('found location', center);

  if (Fire.shared.uid) {
    // store.dispatch(updateUserData({ location: center }));
    if (!preventServerUpdate) {
      try {
        await new Promise((res, rej) =>
          geoFire
            .set(Fire.shared.uid, center)
            .then(res)
            .catch(rej));
        console.warn('sent location to server');
      } catch (error) {
        console.log('failed to upload location to server');
        console.error(error);
      }
    } else {
      console.log('Preventing server update');
    }

    return coords;
  }
  return null;
};

export const getLocation = async (preventServerUpdate = false) => {
  const hasit = await getPermission(Permissions.LOCATION);
  if (!hasit) {
    return null;
  }
  if (Settings.simulator && Settings.debuggingLocation) {
    return await syncCoords(
      preventServerUpdate,
      { latitude: 30.14728379721442, longitude: -97.77971597219003 },
      new Date().getTime(),
    );
  }

  const { coords, timestamp } = await Location.getCurrentPositionAsync({});

  // const { coords, timestamp } = await getCurrentPositionAsync(Settings.location);

  return await syncCoords(preventServerUpdate, coords, timestamp);
};
