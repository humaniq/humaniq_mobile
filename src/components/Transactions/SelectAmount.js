import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Animated, Text, ScrollView, TextInput } from 'react-native';
import VMasker from 'vanilla-masker';

import { HumaniqContactsApiLib, HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation'

import { colors } from '../../utils/constants';
import { newTransaction } from '../../actions';

import PhoneKeyboard from '../Shared/Components/PhoneKeyboard';

const backWhite = require('./../../assets/icons/back_white.png');
const paymentBig = require('./../../assets/icons/payment_big.png');
const arrowDownWhite = require('../../assets/icons/arrow_down_white.png');
const searchWhite = require('./../../assets/icons/search_white.png');
const closeWhite = require('./../../assets/icons/close_white.png');
const doneWhite = require('./../../assets/icons/done_white.png');
const qr = require('./../../assets/icons/qr.png');
const phoneNumber = require('./../../assets/icons/phone_number.png');
const send = require('./../../assets/icons/send.png');

const pattern = { pattern: '999.99', placeholder: '0' }

class SelectAmount extends React.Component {
  constructor() {
    super();
    this.state = {
      currency: 'HMQ',
      rate: 0,
      adress: '',
      contactID: '',
      maxAmountLength: 5,
      amount: '',
      maskedAmount: VMasker.toPattern(0, pattern),
    };
  }

  getExchange = (C, A) => {
    HumaniqProfileApiLib.getExchangeUsd(1).then(data=>alert(data))
  }
  componentDidMount() {
    HumaniqProfileApiLib.getExchangeUsd('1').then(data=>{
      const { USD = 0 } = data;
      this.setState({
        rate: USD
      })
    })
  }

  handleNumberPress = (number) => {
    if (this.state.amount.length < this.state.maxAmountLength) {
      let inputVal = this.state.amount;
      inputVal += number;
      const m = VMasker.toPattern(inputVal, pattern);
      this.setState({ amount: inputVal, maskedAmount: m });
    }
  };

  handleBackspacePress = () => {
    const inputVal = this.state.amount.slice(0, -1);
    const m = VMasker.toPattern(inputVal, pattern);
    this.setState({ amount: inputVal, maskedAmount: m });
  };

  setAmount = () => {
    const { amount, maskedAmount } = this.state;
    const { setTrAmount, navigation: { navigate } } = this.props;
    setTrAmount(parseFloat(maskedAmount));
  }

  renderContent() {
    const { contacts } = this.props;
    const { navigation: { navigate, state: { params = {} } } } = this.props;
    const { maskedAmount, currency, rate } = this.state;
    const am = maskedAmount.split('.');
    const amFloat = Math.round(parseFloat(maskedAmount) * rate * 100) / 100;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.amountInput}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={[styles.number, { fontSize: 60, color: 'black' }]}>{`${am[0]}.`}</Text>
            <Text style={[styles.number, { marginBottom: 6 }]}>{`${am[1]} ${currency}`}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={[styles.number, { fontSize: 15 }]}>{`${amFloat} $`}</Text>
          </View>
        </View>
        <PhoneKeyboard
          onNumberPress={this.handleNumberPress}
          onBackspacePress={this.handleBackspacePress}
          onHelpPress={this.setPhoneNumber}
        />
      </View>
    );
  }

  renderHeader() {
    const { selectedID, code, phone } = this.state;
    const { contacts, setTrPhone, navigation } = this.props;
    const { dispatch, navigate, state } = navigation;
    const { key } = state

    return (
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => dispatch(NavigationActions.back())}>
            <Image source={backWhite} style={styles.headerImage} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={paymentBig} style={styles.paymentImage} />
          </View>
          <TouchableOpacity onPress={this.setAmount}>
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
  // >>
  amountInput: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    width: 32,
    height: 28,
  },
  arrow: {
    marginTop: 28.5,
    marginBottom: 24.5,
    width: 19,
    height: 19,
  },
  code: {
    fontSize: 25,
    color: colors.white_two,
    marginLeft: 4.5,
    lineHeight: 29,
  },
  number: {
    textAlign: 'center',
    fontSize: 35,
    color: colors.white_two,
  },
  error: {
    color: '#f01434',
  },
});

const mapStateToProps = state => ({
  newTransaction: state.newtransaction,
  contacts: state.contacts,
});

export default connect(mapStateToProps, {
  setTrAmount: newTransaction.setTrAmount,
  setTrAdress: newTransaction.setTrAdress,
  setTrPhone: newTransaction.setTrPhone,
  setTrContact: newTransaction.setTrContact,
})(SelectAmount);
