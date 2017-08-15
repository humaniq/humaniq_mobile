import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ScrollView,
    TouchableNativeFeedback,
  StatusBar,
  TextInput,
} from 'react-native';

import { connect } from 'react-redux';
import Item from './Item';

const ic_contacts = require('../../assets/icons/two_person_dark.png');
const ic_chat_white = require('./../../assets/icons/ic_chat_white.png');
const ic_group = require('../../assets/icons/ic_one_person.png');
const ic_search = require('../../assets/icons/search_white.png');
const ic_close_white = require('../../assets/icons/ic_close_white.png');
const ic_back_white = require('../../assets/icons/back_white.png');

export class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      text: '',
    };
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
    const { search } = this.state;
    return (
      <View style={styles.toolbar}>
        {!search
            ? <View style={{ flexDirection: 'row', flex: 1 }}>
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
            : <View style={{ flexDirection: 'row', flex: 1 }}>
              <TouchableNativeFeedback
                onPress={() => this.onBackPress()}
                delayPressIn={0}
                background={TouchableNativeFeedback.SelectableBackground()}
              >
                <View style={styles.item}>
                  <Image
                    source={ic_back_white}
                  />
                </View>
              </TouchableNativeFeedback>
              <TextInput
                autoFocus
                ref="searchText"
                style={styles.search}
                placeholder="Search"
                placeholderTextColor="#A8BED1"
                underlineColorAndroid={'transparent'}
                onChangeText={text => this.setState({ text })}
                value={this.state.text}
                onSubmitEditing={() => this.startSearch()}
              />
            </View>
        }

        <TouchableNativeFeedback
          onPress={() => this.onSearchPress(search)}
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          <View style={styles.item}>
            <Image
              resizeMode="contain"
              style={{ height: 28 }}
              source={!search ? ic_search : ic_close_white}
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

  onBackPress() {
    this.setState({
      search: false,
      text: '',
    });
  }

  onContactsPress() {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('ChatContacts', { ...navState.params, mode: 'contacts' });
  }

  onGroupMakePress() {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('ChatContacts', { ...navState.params, mode: 'group' });
  }

  onSearchPress(search) {
    if (!search) {
      this.setState({
        search: true,
      });
    } else {
      this.setState({
        text: '',
      });
    }
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
  search: {
    flex: 1,
    fontSize: 18,
    color: 'white',
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
