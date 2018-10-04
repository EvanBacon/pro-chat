import { AsyncStorage } from 'react-native';
/**
 *
 * @param urlAsKey
 * @param expireInMinutes
 * @returns {Promise.<*>}
 */

async function setItemWithExpiration(key, value, minutes) {
  // set expire at
  const _value = { value, expireAt: getExpireDate(minutes) };
  // stringify object
  const objectToStore = JSON.stringify(_value);
  // store object
  return AsyncStorage.setItem(key, objectToStore);
}

async function getItemWithExpiration(urlAsKey) {
  let data;
  await AsyncStorage.getItem(urlAsKey, async (err, value) => {
    data = JSON.parse(value);

    // there is data in cache && cache is expired
    if (
      data !== null &&
      data.expireAt &&
      new Date(data.expireAt) < new Date()
    ) {
      // clear cache
      AsyncStorage.removeItem(urlAsKey);

      // update res to be null
      data = null;
    } else {
      console.log('read data from cache  ');
    }
  });
  if (data) {
    return data.value;
  }
  return null;
}

function getExpireDate(expireInMinutes) {
  const now = new Date();
  const expireTime = new Date(now);
  expireTime.setMinutes(now.getMinutes() + expireInMinutes);
  return expireTime;
}

export default {
  setItemWithExpiration,
  getItemWithExpiration,
  getExpireDate,
};
