import React, { PureComponent } from 'react';
import {
  View,
  Image,
  StatusBar,
  TouchableNativeFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import CustomStyleSheet from '../../utils/customStylesheet';
import Chats from '../Chats/Chats';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import HumaniqTabBar from '../Chats/HumaniqTabBar';

const ic_contacts = require('../../assets/icons/two_person_dark.png');
const ic_chat_white = require('./../../assets/icons/ic_chat_white.png');
const ic_group = require('../../assets/icons/ic_one_person.png');

export class MainChatView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _renderIcon = ({ route }) => (
    <Image
      resizeMode="contain"
      source={this.getIcon(route.key)}
      style={{ height: 26 }}
    />
    );

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#598fba"
        />
        {/* <ScrollableTabView */}
        {/* initialPage={1} */}
        {/* renderTabBar={() => <HumaniqTabBar />}> */}
        {/* <Chats navigation={this.props.navigation} tabLabel="React1"/> */}
        {/* <Chats navigation={this.props.navigation} tabLabel="React2"/> */}
        {/* <Chats navigation={this.props.navigation} tabLabel="React3"/> */}
        {/* </ScrollableTabView> */}


        <View style={styles.toolbar}>
          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
          >
            <View style={styles.item}>
              <Image
                resizeMode="contain"
                style={{ height: 27, tintColor: '#A8BED1' }}
                source={ic_contacts}
              />
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
          >
            <View style={[styles.item, {borderBottomWidth: 2, borderBottomColor: 'white'}]}>
              <Image
                resizeMode="contain"
                style={{ height: 27 }}
                source={ic_chat_white}
              >
                <View style={styles.onlineStatus} />
              </Image>
            </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
          >
            <View style={styles.item}>
              <Image
                resizeMode="contain"
                style={{ height: 27, tintColor: '#A8BED1' }}
                source={ic_group}
              />
            </View>

          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
  },
  tabBar: {
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#527da3',
  },
  indicator: {
    backgroundColor: 'white',
  },
  tabItem: {
    width: 65,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#598FBA',
    alignItems: 'center',
    flexDirection: 'row',
  },
  onlineStatus: {
    position: 'absolute',
    backgroundColor: '#7ed321',
    width: 10,
    height: 10,
    borderRadius: 40,
    marginLeft: 5,
    marginTop: 4,
    bottom: 0,
  },
  item: {
    width: 60,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(
    state => ({
    }),
    dispatch => ({
    }),
)(MainChatView);

