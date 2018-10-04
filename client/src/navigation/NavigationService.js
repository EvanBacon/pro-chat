// NavigationService.js

import { NavigationActions } from 'react-navigation';
import { dispatch } from '@rematch/core';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(NavigationActions.navigate({
    routeName,
    params,
  }));
}

function navigateToUserSpecificScreen(routeName, uid, params = {}) {
  dispatch.users.ensureUserIsLoadedAsync({ uid });
  navigate(routeName, { ...params, uid });
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
