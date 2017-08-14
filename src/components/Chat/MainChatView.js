import React, { PureComponent } from 'react';
import {
  View,
  Image,
  StatusBar,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import CustomStyleSheet from '../../utils/customStylesheet';
import Chats from '../Chats/Chats';

const ic_contacts = require('../../assets/icons/two_person_dark.png');
const ic_chat_white = require('./../../assets/icons/ic_chat_white.png');
const ic_group = require('../../assets/icons/ic_one_person.png');

export class MainChatView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: '1' },
        { key: '2' },
        { key: '3' },
      ],
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      renderIcon={this._renderIcon}
      indicatorStyle={styles.indicator}
      tabStyle={styles.tabItem}
    />
  );


  _renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return (
          <Chats navigation={this.props.navigation}/>
        );
      case '2':
        return (
          <Chats navigation={this.props.navigation} />
        );
      case '3':
        return (
          <Chats navigation={this.props.navigation} />
        );
      default:
        return null;
    }
  };

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
          backgroundColor="#527da3"
        />
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
        />
      </View>
    );
  }

  getIcon(key) {
    switch (key) {
      case '1':
        return ic_contacts;
      case '2':
        return ic_chat_white;
      case '3':
        return ic_group;
    }
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
});

export default connect(
    state => ({
    }),
    dispatch => ({
    }),
)(MainChatView);

