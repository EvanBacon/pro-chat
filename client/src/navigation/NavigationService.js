// NavigationService.js
import firebase from 'expo-firebase-app';
import { NavigationActions } from 'react-navigation';

import { dispatch } from '../rematch/dispatch';
import IdManager from '../IdManager';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  if (!_navigator) return;
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

/* Only allow App navigation when authenticated */
function canNavigateWithinApp() {
  return !!firebase.auth().currentUser;
}

function navigateToUserSpecificScreen(routeName, uid, params = {}) {
  if (!canNavigateWithinApp()) return;

  if (!uid || typeof uid !== 'string') {
    console.log('navigateToUserSpecificScreen: UID: ', uid);
    throw new Error(
      'Trying to navigate to a screen without a valid User ID: ' + uid,
    );
  }
  dispatch.users.ensureUserIsLoadedAsync({ uid });

  let groupId;
  if (IdManager.isInteractable(uid)) groupId = IdManager.getGroupId(uid);

  navigate(routeName, { groupId, ...params, uid });
}

function goBack(routeName) {
  _navigator.dispatch(NavigationActions.back(routeName));
}

// add other navigation functions that you need and export them

export default {
  canNavigateWithinApp,
  navigate,
  goBack,
  setTopLevelNavigator,
  navigateToUserSpecificScreen,
};
