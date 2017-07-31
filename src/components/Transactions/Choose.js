import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, TextInput, StatusBar } from 'react-native';

import { HumaniqContactsApiLib } from 'react-native-android-library-humaniq-api';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'

import { colors } from '../../utils/constants';
import CustomStyleSheet from '../../utils/customStylesheet';
import ChooseItem from './ChooseItem';
import { newTransaction } from '../../actions';

const backWhite = require('./../../assets/icons/back_white.png');
const paymentBig = require('./../../assets/icons/payment_big.png');
const searchWhite = require('./../../assets/icons/search_white.png');
const closeWhite = require('./../../assets/icons/close_white.png');
const doneWhite = require('./../../assets/icons/done_white.png');
const qr = require('./../../assets/icons/qr.png');
const phoneNumber = require('./../../assets/icons/phone_number.png');
const send = require('./../../assets/icons/send.png');

const getName = (cnt) => cnt.name || cnt.phone || ' ';
const nameSort = (a, b) => (a > b) ? 1 : (a < b) ? -1 : 0;
const sort = (a, b) => nameSort(getName(a), getName(b))

class Choose extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedID: '',
      search: false,
      text: '',
    }
  }

  renderContent() {
    const { contacts } = this.props;
    const { search, text } = this.state;

    const filter = (cnt) => search && text ? getName(cnt).toUpperCase().indexOf(text.toUpperCase()) >= 0 : true
    let groupLetter = '';

    return (
      <ScrollView
        style={{ backgroundColor: colors.white }}
        showsVerticalScrollIndicator={false}
      >
          <View style={styles.contactsHeader} />
          {contacts.filter(filter).sort(sort).map((cnt) => {
            const firstLetter = getName(cnt)[0];
            let showLetter = '';
            if (groupLetter !== firstLetter) {
              groupLetter = firstLetter;
              showLetter = groupLetter;
            } else {
              showLetter = '';
            }
            return (
              <ChooseItem
                onPress={this.selectItem}
                letter={showLetter}
                key={cnt.id}
                contactID={cnt.id}
              />
            );
          })}
      </ScrollView>
    );
  }

  componentDidMount() {
    HumaniqContactsApiLib.extractAllPhoneNumbers().then((response) => {
      console.log('contacts.ok--->', JSON.stringify(response));
    }).catch((err) => {
      console.log('contacts.err--->', JSON.stringify(err));
    });
  }

  selectItem = (id) => {
    const { selectedID } = this.state;
    const newID = selectedID === id ? '' : id
    const { setTrContact } = this.props;
    setTrContact(newID);
    this.setState({
      selectedID: newID,
      search: false,
      text: '',
    });
  }

  setSearch = () => {
    const { search, text } = this.state;
    const newValue = !search;
    this.setState({
      search: newValue,
      text: newValue === false ? '' : text,
    });
  }

  renderHeader() {
    const { selectedID, search } = this.state;
    const { contacts, navigation } = this.props;
    const { dispatch, navigate, state } = navigation;
    const { key } = state

    const curContact = contacts.find(cnt => cnt.id === selectedID) || {};
    const selName = curContact.name || curContact.phone || '';

    return (
      <View style={styles.header}>
        {search ? (
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={() => dispatch(NavigationActions.back())}>
              <Image source={backWhite} style={styles.headerImage} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'stretch' }}>
              <TextInput
                style={styles.inputText}
                underlineColorAndroid="transparent"
                placeholder="Search"
                placeholderTextColor="white"
                onChangeText={text => this.setState({ text })}
                value={this.state.text}
              />
            </View>
            <TouchableOpacity onPress={this.setSearch}>
              <Image source={closeWhite} style={styles.headerImage} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerInner}>
            <TouchableOpacity onPress={() => dispatch(NavigationActions.back())}>
              <Image source={backWhite} style={styles.headerImage} />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Image source={paymentBig} style={styles.paymentImage} />
            </View>
            { selectedID ? (
              <View style={{ flex: 3, alignItems: 'flex-start' }}>
                <Text style={styles.selectedNum}>{selName}</Text>
              </View>
            ) : null }
            { selectedID ? (
              <TouchableOpacity onPress={() => { this.selectItem(selectedID); }}>
                <Image source={closeWhite} style={styles.headerImage} />
              </TouchableOpacity>
              ) : null }
            <TouchableOpacity onPress={selectedID ? () => null : this.setSearch}>
              <Image source={selectedID ? doneWhite : searchWhite} style={styles.headerImage} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigate('Camera', { mode: 'qr' })}>
            <Image source={qr} style={styles.headerImage} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.borderItem]}>
            <Image source={send} style={styles.headerImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={phoneNumber} style={styles.headerImage} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    /*
    <StatusBar
      backgroundColor={colors.orangeish}
      barStyle="light-content"
    />
    */
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}

const styles = ({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    height: 66 + 48,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: colors.orangeish,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  headerInner: {
    marginLeft: 12,
    marginRight: 12,
    height: 66,
    backgroundColor: colors.orangeish,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtonsRow: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    flex: 1,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: colors.pinkish_grey,
    borderBottomColor: colors.pinkish_grey,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  borderItem: {
    borderRightColor: colors.battleship_grey,
    borderLeftColor: colors.battleship_grey,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  headerImage: {
    height: 24,
    width: 24,
    margin: 7,
  },
  paymentImage: {
    width: 38,
    height: 38,
  },
  contactsHeader: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 66 + 48,
  },
  selectedNum: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    color: colors.white,
  },
  inputText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    color: colors.white,
    height: 40,
    bottom: -5,
  },
});

const mapStateToProps = state => ({
  chats: state.chats,
  messages: state.messages,
  contacts: state.contacts,
});

export default connect(mapStateToProps, {
  setTrPhone: newTransaction.setTrPhone,
  setTrContact: newTransaction.setTrContact,
})(Choose);
