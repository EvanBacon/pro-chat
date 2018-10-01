import * as ProfileProvider from './ProfileProvider';

const fbFields = [
  'id',
  'email',
  'birthday',
  'name',
  'first_name',
  'gender',
  'about',
  'picture',
  'interested_in',
  'likes',
];

// /    ["id", "email", "name", "gender", "about", "picture"]
export const callGraph = async ({ token, fields }) => {
  const url = `https://graph.facebook.com/me?access_token=${token}&fields=${fields.join(',')}`;
  const response = await fetch(url);
  return response.json();
};

export const syncFacebookDataWithFirebaseProfile = async (token) => {
  const facebookData = await callGraph({ token, fields: fbFields });
  console.log(`
      syncFacebookDataWithFirebaseProfile: 
      |- Token:   ${token}
      |- Payload: ${facebookData}
    `);
  console.log(facebookData);

  ProfileProvider.updateUserProfile(facebookData);
  return facebookData;
};
