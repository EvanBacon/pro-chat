// NavigationService.js
import { dispatch } from '../rematch/dispatch';
import { NavigationActions } from 'react-navigation';

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

function navigateToUserSpecificScreen(routeName, uid, params = {}) {
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
  navigate,
  goBack,
  setTopLevelNavigator,
  navigateToUserSpecificScreen,
};
