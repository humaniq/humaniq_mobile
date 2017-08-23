/* eslint-disable import/no-unresolved */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import VMasker from 'vanilla-masker';
import PropTypes from 'prop-types';

import { HumaniqProfileApiLib, HumaniqContactsApiLib } from 'react-native-android-library-humaniq-api';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import { colors } from '../../utils/constants';
import { newTransaction } from '../../actions';

import PhoneKeyboard from '../Shared/Components/PhoneKeyboard';

const backWhite = require('./../../assets/icons/back_white.png');
const paymentBig = require('./../../assets/icons/payment_big.png');
const doneWhite = require('./../../assets/icons/done_white.png');
const paymentArrow = require('./../../assets/icons/payment_arrow_right.png');
const icUser = require('./../../assets/icons/ic_user.png');
const amountReorder = require('./../../assets/icons/amount_reorder.png');

const pattern = { pattern: '999.99', placeholder: '0' };

class SelectAmount extends React.Component {
  static propTypes = {
    newTransaction: PropTypes.shape({
      rootScreen: PropTypes.string.isRequired,
      contactID: PropTypes.string,
    }),
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
    setTrAmount: PropTypes.func,
    user: PropTypes.object,
    contacts: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {
      currency: 'HMQ',
      rateHMQtoUSD: 0,
      rateUSDtoHMQ: 0,
      adress: '',
      contactID: '',
      maxAmountLength: 5,
      amount: '00000',
      maskedAmount: VMasker.toPattern(0, pattern),
    };
  }

  componentWillMount() {
    const { newTransaction } = this.props;
    console.warn(JSON.stringify(newTransaction));
    if (newTransaction.phone && !newTransaction.adress) {
      this.getAccount(newTransaction);
    }
  }

  componentDidMount() {
    HumaniqProfileApiLib.getExchangeUsd('1').then((data) => {
      const { USD = 0 } = data;
      this.setState({
        rateHMQtoUSD: USD,
      });
    });

    HumaniqProfileApiLib.getExchangeHmq('1').then((data) => {
      const { HMQ = 0 } = data;
      this.setState({
        rateUSDtoHMQ: HMQ,
      });
    });
  }

  setAmount = () => {
    const { maskedAmount, currency, rateHMQtoUSD, rateUSDtoHMQ } = this.state;
    const { newTransaction: { rootScreen }, setTrAmount, navigation: { dispatch } } = this.props;
    const rate = currency === 'HMQ' ? rateHMQtoUSD : rateUSDtoHMQ;
    const amount = currency === 'HMQ' ?
      parseFloat(maskedAmount) :
      Math.round(parseFloat(maskedAmount) * rate * 100) / 100;

    setTrAmount(amount);
    dispatch(
      NavigationActions.back({
        key: rootScreen,
      }),
    );
  };

  handleBackspacePress = () => {
    const inputVal = `0${this.state.amount.slice(0, -1)}`;
    const m = VMasker.toPattern(inputVal, pattern);
    this.setState({ amount: inputVal, maskedAmount: m });
  };

  handleNumberPress = (number) => {
    if (this.state.amount[0] === '0') {
      let inputVal = this.state.amount;
      inputVal = this.state.amount.slice(1) + number;
      const m = VMasker.toPattern(inputVal, pattern);
      this.setState({ amount: inputVal, maskedAmount: m });
    }
  };

  swap = () => {
    const { maskedAmount, currency, rateHMQtoUSD, rateUSDtoHMQ } = this.state;
    const oldRate = currency === 'HMQ' ? rateHMQtoUSD : rateUSDtoHMQ;
    const oldExchange = Math.round(parseFloat(maskedAmount) * oldRate * 100);
    const maskedExchange = String(`00000${oldExchange}`).slice(-5);
    const newCurr = currency === 'HMQ' ? '$' : 'HMQ';
    this.setState({
      currency: newCurr,
      amount: maskedExchange,
      maskedAmount: VMasker.toPattern(maskedExchange, pattern),
    });
  }

  renderContent() {
    const { maskedAmount, currency, rateHMQtoUSD, rateUSDtoHMQ } = this.state;
    const am = maskedAmount.split('.');
    const rate = currency === 'HMQ' ? rateHMQtoUSD : rateUSDtoHMQ;
    const oppositeCurr = currency === 'HMQ' ? '$' : 'HMQ';
    const amFloat = Math.round(parseFloat(maskedAmount) * rate * 100) / 100;
    const user = this.props.user || {};
    const photo = user.photo;
    const myPhoto = photo ? { uri: photo } : icUser;

    const toID = this.props.newTransaction.contactID;
    const contacts = this.props.contacts;
    const toContact = toID ? contacts.find(cnt => cnt.id === toID) || {} : {};
    const toPhoto = toContact.avatar ? { uri: toContact.avatar } : icUser;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.avatars}>
          <View style={{ position: 'absolute', flexDirection: 'row' }}>
            <Image source={paymentArrow} style={styles.arrow_right} />
            <Image source={paymentArrow} style={styles.arrow_right} />
            <Image source={paymentArrow} style={styles.arrow_right} />
            <Image source={paymentArrow} style={styles.arrow_right} />
          </View>
          <Image resizeMode="cover" source={myPhoto} style={[styles.avatarImage, { marginRight: 60 }]} />
          <Image resizeMode="cover" source={toPhoto} style={styles.avatarImage} />
        </View>
        <TouchableOpacity onPress={this.swap} style={styles.amountInput}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={[styles.number, { fontSize: 60, color: 'black' }]}>{`${am[0]}.`}</Text>
            <Text style={[styles.number, { marginBottom: 6 }]}>{`${am[1]} ${currency}`}</Text>
            <Image source={amountReorder} style={{ width: 24, height: 24, marginLeft: 16, alignSelf: 'flex-end' }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={[styles.number, { fontSize: 15 }]}>{`${amFloat} ${oppositeCurr}`}</Text>
          </View>
        </TouchableOpacity>
        <PhoneKeyboard
          onNumberPress={this.handleNumberPress}
          onBackspacePress={this.handleBackspacePress}
          onHelpPress={this.setAmount}
        />
      </View>
    );
  }

  renderHeader() {
    const { navigation } = this.props;
    const { dispatch } = navigation;

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

  getAccount(newTransaction) {
    HumaniqContactsApiLib.extractSinglePhoneNumber(newTransaction.phone)
      .then((contacts) => {
        console.warn(JSON.stringify(contacts));
        if (contacts.length > 0) {
          if (contacts[0].accountId) {
            this.props.setTrContact(contacts[0].accountId);
          }
        } else {
          // show modal or alert message
          Alert.alert(null, "Not found", [
            {
              text: 'Ok',
              onPress: () => {
              },
            },
          ]);
        }
      })
      .catch(err => console.warn(JSON.stringify(err)));
  }

  getProfileInfo(accountId) {
    HumaniqProfileApiLib.getAccountProfile(accountId)
      .then((profile) => {
        //this.props.setTrContact
        console.warn(JSON.stringify(profile));
      })
      .catch((err) => {
        console.warn(JSON.stringify(err));
      });
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 56,
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
    height: 56,
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
  avatars: {
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.white_two,
    borderBottomWidth: 0.5,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 96,
  },
  arrow_right: {
    height: 12.5,
    width: 12.5,
    margin: 7.5 / 2,
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
};

const mapStateToProps = state => ({
  newTransaction: state.newtransaction,
  user: state.user,
  contacts: state.contacts,
});

export default connect(mapStateToProps, {
  setTrAmount: newTransaction.setTrAmount,
  setTrAdress: newTransaction.setTrAdress,
  setTrPhone: newTransaction.setTrPhone,
  setTrContact: newTransaction.setTrContact,
})(SelectAmount);
