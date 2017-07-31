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
} from './components/Login';
import Dashboard from './components/Dashboard';
import Tutorial from './components/Shared/Components/Tutorial';
import Chat from './components/Chat';
import Chats from './components/Chats';
import { Instructions } from './components/Instructions/Instructions';
import Choose from './components/Transactions/Choose';
import Temp from './components/Transactions/Temp';
import Input from './components/Transactions/Input';

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

  //Chats: { screen: Chats },
  //Chat: { screen: Chat },
  Temp: { screen: Temp },
  Choose: { screen: Choose },
  Loading: { screen: Loading },
  Accounts: { screen: Accounts },
  Tutorial: { screen: Tutorial },
  Camera: { screen: Camera },
  Password: { screen: Password },
  TelInput: { screen: TelInput },
  CodeInput: { screen: CodeInput },
  Dashboard: { screen: Dashboard },
  Instructions: { screen: Instructions },
  Input: {screen: Input},
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
        newTransaction.setQr('');
      }
    }}
    />
  </Provider>
);

AppRegistry.registerComponent('humaniq_mobile', () => App);
