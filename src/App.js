import React from 'react';
import { AppRegistry } from 'react-native';
import {
  StackNavigator,
  // TabNavigator,
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
  CountryCode
} from './components/Login';
import Dashboard from './components/Dashboard';
import Tutorial from './components/Shared/Components/Tutorial';
import Chat from './components/Chat';
import Chats from './components/Chats';
import { Instructions } from './components/Instructions/Instructions';
import Choose from './components/Transactions/Choose';
import Temp from './components/Transactions/Temp';
import Input from './components/Transactions/Input';
import SelectAmount from './components/Transactions/SelectAmount';
import { Profile, ProfileSettings, ProfileEdit, ProfileEditPassword } from './components/Profile/index';
import CameraEdit from './components/Profile/CameraEdit';
import PasswordEdit from './components/Profile/PasswordEdit';

/*
const Dashboard = TabNavigator(
  {
    Chat: { screen: Chat },
    Contacts: { screen: Contacts },
    Dapp: { screen: Dapp },
    Profile: { screen: Profile },
  },
  {
    tabBarPosition: 'bottom',
    backBehavior: 'none',
  },
);
*/

const stack = {

  // Chats: { screen: Chats },
  // Chat: { screen: Chat },
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
};

const LoginStack = StackNavigator(
  stack,
  {
    headerMode: 'none',
  },
);

const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }

  return { routeName: route.routeName, routeParams: route.params || {} };
};

const App = () => (
  <Provider store={store}>
    <LoginStack onNavigationStateChange={(prevState, currentState) => {
      const { routeName, routeParams } = getCurrentRouteName(currentState);
      if (routeName === 'Camera' && routeParams.mode === 'qr') {
        oncetrig.blockCall(false);
        newTransaction.setTrAdress('');
      }
    }}
    />
  </Provider>
);

AppRegistry.registerComponent('humaniq_mobile', () => App);
