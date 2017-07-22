import React from 'react';
import { AppRegistry } from 'react-native';
import {
  StackNavigator,
  // TabNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';
import store from './utils/store';

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
import { Instructions } from './components/Instructions/Instructions';

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
  //Chat: { screen: Chat },  
  TelInput: { screen: TelInput },
  Accounts: { screen: Accounts },
  Tutorial: { screen: Tutorial },
  Camera: { screen: Camera },
  Password: { screen: Password },
  CountryCode: { screen: CountryCode },
  CodeInput: { screen: CodeInput },
  Dashboard: { screen: Dashboard },
  Instructions: { screen: Instructions },
};

const LoginStack = StackNavigator(
  stack,
  {
    headerMode: 'none',
  },
);

const App = () => (
  <Provider store={store}>
    <LoginStack />
  </Provider>
);

AppRegistry.registerComponent('humaniq_mobile', () => App);
