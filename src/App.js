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
  CodeInput
} from './components/Login';
import Dashboard from './components/Dashboard';
import Tutorial from './components/Shared/Components/Tutorial';
import Instructions from './components/Instructions/Instructions'
import Profile from './components/Profile/Profile'
import ProfileSettings from './components/Profile/ProfileSettings'
import ProfileEdit from './components/Profile/ProfileEdit'
import Chat from './components/Chat';

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
    //Chat: { screen: Chat },
    //Profile: {screen: Profile},
    //ProfileSettings: {screen: ProfileSettings},
    //ProfileEdit: {screen: ProfileEdit},
    Tutorial: { screen: Tutorial },
    Camera: { screen: Camera },
    Password: { screen: Password },
    TelInput: { screen: TelInput },
    CodeInput: { screen: CodeInput },
    Dashboard: { screen: Dashboard },
    Instructions: { screen: Instructions },
  },
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
