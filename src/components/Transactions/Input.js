import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, TextInput } from 'react-native';

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

class Input extends React.Component {
  constructor() {
    super();
    this.state = {
      adress: '',
      contactID: '',
      phone: ''
    }
  }

  componentDidMount() {
    HumaniqContactsApiLib.extractAllPhoneNumbers().then((response) => {
      console.log('contacts.ok--->', JSON.stringify(response));
    }).catch((err) => {
      console.log('contacts.err--->', JSON.stringify(err));
    });
  }

  renderContent() {
    const { contacts } = this.props;

    return (
      <View>
        <Text> {contacts.length} </Text>
      </View>
    );
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
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => dispatch(NavigationActions.back())}>
            <Image source={backWhite} style={styles.headerImage} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={paymentBig} style={styles.paymentImage} />
          </View>
          <TouchableOpacity onPress={this.setSearch}>
            <Image source={doneWhite} style={styles.headerImage} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
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
    //position: 'absolute',
    height: 66,
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
  headerImage: {
    height: 24,
    width: 24,
    margin: 7,
  },
  paymentImage: {
    width: 38,
    height: 38,
  },
});

const mapStateToProps = state => ({
  newTransaction: state.newtransaction,
  contacts: state.contacts,
});

export default connect(mapStateToProps, {
  setQr: newTransaction.setQr,
  setTrPhone: newTransaction.setTrPhone,
  setTrContact: newTransaction.setTrContact,
})(Input);
