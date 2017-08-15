import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableNativeFeedback,
  StatusBar,
} from 'react-native';

import { connect } from 'react-redux';
import Item from './Item';

const ic_contacts = require('../../assets/icons/two_person_dark.png');
const ic_chat_white = require('./../../assets/icons/ic_chat_white.png');
const ic_group = require('../../assets/icons/ic_one_person.png');
const ic_search = require('../../assets/icons/search_white.png');

export class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderContent() {
    return (
      <ScrollView
        style={{ backgroundColor: '#fff' }}
        showsVerticalScrollIndicator={false}
      >
        {this.renderScrollViewContent()}
      </ScrollView>
    );
  }

  renderScrollViewContent() {
    const { chats, navigation: { navigate } } = this.props;
    return (
      <View style={styles.scrollViewContent}>
        {chats.map((child, childIndex) => (
          <View key={child.id}>
            <Item
              item={child}
              currentIndex={childIndex}
              size={1}
              onClick={() => navigate('Chat', { id: child.id })}
            />
          </View>
          ))}
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.toolbar}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TouchableNativeFeedback
            onPress={() => this.onContactsPress()}
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackground()}
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
            background={TouchableNativeFeedback.SelectableBackground()}
          >
            <View style={[styles.item, { borderBottomWidth: 3, borderBottomColor: 'white' }]}>
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
            onPress={() => this.onGroupMakePress()}
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackground()}
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

        <TouchableNativeFeedback
          onPress={() => this.onGroupMakePress()}
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          <View style={styles.item}>
            <Image
              resizeMode="contain"
              style={{ height: 28 }}
              source={ic_search}
            />
          </View>

        </TouchableNativeFeedback>

      </View>
    );
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <StatusBar
          backgroundColor="#598fba"
        />
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }

  onContactsPress() {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('ChatContacts', { ...navState.params, mode: 'contacts' });
  }

  onGroupMakePress() {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('ChatContacts', { ...navState.params, mode: 'group' });
  }
}

const screenMargin = 20;
const headerHeight = 60;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    marginTop: screenMargin,
    left: 0,
    right: 0,
    top: 0,
  },
  scrollViewContent: {
    backgroundColor: '#fff',
  },
  toolbar: {
    height: 56,
    backgroundColor: '#598FBA',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 1,
  },
  onlineStatus: {
    position: 'absolute',
    backgroundColor: '#7ed321',
    width: 9,
    height: 9,
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

/*
export default connect(
  state => ({
    user: state.user,
  }),
  dispatch => ({}),
)(Chats);
*/

const mapStateToProps = state => ({
  chats: state.chats,
});

export default connect(mapStateToProps)(Chats);
