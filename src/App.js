import { AppRegistry } from 'react-native';
import {
  StackNavigator,
  // TabNavigator,
} from 'react-navigation';

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

const App = StackNavigator(
  {
    Login: { screen: Login },
    // Dashboard: { screen: Dashboard },
  },
  {
    headerMode: 'none',
  },
);

AppRegistry.registerComponent('humaniq_mobile', () => App);
