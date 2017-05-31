import React from 'react';
import { AppRegistry } from 'react-native';
import {
  StackNavigator,
  // TabNavigator,
} from 'react-navigation';

import { Provider } from 'react-redux';
import store from './utils/store';

import Login from './components/Login';

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

const LoginStack = StackNavigator(
  {
    Login: { screen: Login },
    // Dashboard: { screen: Dashboard },
  },
  {
    headerMode: 'none',
  },
);

let App = () => (
  <Provider store={store}>
    <LoginStack />
  </Provider>
);

AppRegistry.registerComponent('humaniq_mobile', () => App);