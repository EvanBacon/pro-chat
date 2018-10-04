import { AuthSession } from 'expo';

import Secret from '../../Secret';

// Make an app https://github.com/settings/applications/new
// Firebase Docs: https://firebase.google.com/docs/auth/web/github-auth

// The github auth callback should be something like: https://auth.expo.io/@bacon/bute
const REDIRECT_URL = AuthSession.getRedirectUrl();

function authUrlWithId(id) {
  return (
    'https://github.com/login/oauth/authorize' +
    `?client_id=${id}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
    `&scope=${encodeURIComponent('user public_repo repo repo_deployment repo:status read:repo_hook read:org read:public_key read:gpg_key')}`
  );
}

function createTokenWithCode(code) {
  const url =
    'https://github.com/login/oauth/access_token' +
    `?client_id=${Secret.github.id}` +
    `&client_secret=${Secret.github.secret}` +
    `&code=${code}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
}

async function getGithubTokenAsync() {
  // console.log('`Authorization callback URL` should be: ', REDIRECT_URL);

  try {
    const { type, params } = await AuthSession.startAsync({
      authUrl: authUrlWithId(Secret.github.id),
    });

    console.log('getGithubTokenAsync: A: ', { type, params });

    if (type !== 'success') {
      // Cancel
      // Error - if you click "no" on the redirect page
      return null;
    }

    if (params.error) {
      const { error, error_description, error_uri } = params;

      // alert(error, error_description);
      // error": "redirect_uri_mismatch",
      // [15:30:51]     "error_description": "The redirect_uri MUST match the registered callback URL for this application.",
      // [15:30:51]     "error_uri
      // return;
      throw new Error(`Github Auth: ${error} ${error_description}`);
    }

    const { code } = params;
    const result = await createTokenWithCode(code);
    console.log('getGithubTokenAsync: B: ', { result });
    // { token_type, scope, access_token }
    return result.access_token;
  } catch ({ message }) {
    throw new Error(`Github Auth: ${message}`);
  }
}

// import firebase from 'firebase';

// async function githubAuthWithFirebase() {
//   // const provider = new firebase.auth.GithubAuthProvider();
//   // // Scopes: https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
//   // provider.addScope('repo'); //ex: "repo,gist"
//   // // provider.setCustomParameters({ 'allow_signup': 'false' });
// }

export default getGithubTokenAsync;
