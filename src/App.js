import React from 'react';
import { AppRegistry } from 'react-native';
import {
  NavigationActions,
  StackNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';
import store from './utils/store';
import oncetrig from './utils/oncetrig';
import { newTransaction } from './actions';

import Camera from './components/Camera';
import {
  Password,
  TelInput,
  CodeInput,
  Accounts,
  Loading,
  CountryCode,
} from './components/Login';
import Dashboard from './components/Dashboard';
import Tutorial from './components/Shared/Components/Tutorial';
import Chat from './components/Chat';
import Chats from './components/Chats';
import { Instructions } from './components/Instructions/Instructions';
import Choose from './components/Transactions/Choose';
import Input from './components/Transactions/Input';
import SelectAmount from './components/Transactions/SelectAmount';
import { Profile, ProfileSettings, ProfileEdit, ProfileEditPassword } from './components/Profile/index';
import CameraEdit from './components/Profile/CameraEdit';
import PasswordEdit from './components/Profile/PasswordEdit';
import ChatContacts from './components/Chats/ChatContacts';

const stack = {
  // Temp: { screen: Temp },
  Loading: { screen: Loading },
  Accounts: { screen: Accounts },
  Tutorial: { screen: Tutorial },
  Camera: { screen: Camera },
  Password: { screen: Password },
  TelInput: { screen: TelInput },
  CountryCode: { screen: CountryCode },
  CodeInput: { screen: CodeInput },
  Dashboard: { screen: Dashboard },
  Instructions: { screen: Instructions },
  Choose: { screen: Choose },
  Input: { screen: Input },
  SelectAmount: { screen: SelectAmount },
  Profile: { screen: Profile },
  ProfileSettings: { screen: ProfileSettings },
  ProfileEdit: { screen: ProfileEdit },
  ProfileEditPassword: { screen: ProfileEditPassword },
  CameraEdit: { screen: CameraEdit },
  PasswordEdit: { screen: PasswordEdit },
  Chats: { screen: Chats },
  ChatContacts: { screen: ChatContacts },
  Chat: { screen: Chat },
};

const LoginStack = StackNavigator(
  stack,
  {
    headerMode: 'none',
  },
);

const defaultGetStateForAction = LoginStack.router.getStateForAction;

function kickRoutes(prevRouteName, nextRouteName) {
  switch (prevRouteName) {
    case 'Camera':
      return 1;
    case 'Password':
      return nextRouteName === 'Password' ? 1 : 2;
    default: 
      break;
  }
  return 0;
}

LoginStack.router.getStateForAction = (action, state) => {
  let newState = state;
  let newAction = action;
  if (action.type === 'Navigation/NAVIGATE' && state.index >= 0) {
    const prevRouteName = state.routes[state.index].routeName;
    if (prevRouteName === 'Loading' || action.routeName === 'Profile') {
      newAction = NavigationActions.reset({
        actions: [action],
        index: 0,
      });
    } else {
      const kickCount = kickRoutes(prevRouteName, action.routeName);
      if (kickCount > 0) {
        const newIndex = state.index - kickCount;
        newState = {
          ...state,
          routes: state.routes.slice(0, 1 + newIndex),
          index: Math.max(newIndex, 0),
        };
      }
    }
  }
  return defaultGetStateForAction(newAction, newState);
};

const App = () => (
  <Provider store={store}>
    <LoginStack onNavigationStateChange={(prevState, { routes, index }) => {
      if (routes && index >= 0) {
        const { routeName, params } = routes[index];
        if (routeName === 'Camera' && params && params.mode === 'qr') {
          oncetrig.blockCall(false);
          newTransaction.setTrAdress('');
        }
      }
    }}
    />
  </Provider>
);

AppRegistry.registerComponent('humaniq_mobile', () => App);
