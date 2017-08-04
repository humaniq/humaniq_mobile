/* eslint-disable import/no-unresolved */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import VMasker from 'vanilla-masker';
import PropTypes from 'prop-types';

import { HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';

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
      amount: '',
      maskedAmount: VMasker.toPattern(0, pattern),
    };
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
    const { maskedAmount } = this.state;
    const { newTransaction: { rootScreen }, setTrAmount, navigation: { dispatch } } = this.props;
    setTrAmount(parseFloat(maskedAmount));
    dispatch(
      NavigationActions.back({
        key: rootScreen,
      }),
    );
  };

  handleBackspacePress = () => {
    const inputVal = this.state.amount.slice(0, -1);
    const m = VMasker.toPattern(inputVal, pattern);
    this.setState({ amount: inputVal, maskedAmount: m });
  };

  handleNumberPress = (number) => {
    if (this.state.amount.length < this.state.maxAmountLength) {
      let inputVal = this.state.amount;
      inputVal += number;
      const m = VMasker.toPattern(inputVal, pattern);
      this.setState({ amount: inputVal, maskedAmount: m });
    }
  };

  const swap = () => {
    const { maskedAmount, currency, rateHMQtoUSD, rateUSDtoHMQ } = this.state;
    const newCurr = currency === 'HMQ' ? 'USD' : 'HMQ'
    const rate
    this.setState({
      currency: newCurr
    })
  }
  renderContent() {
    const { maskedAmount, currency, rateHMQtoUSD, rateUSDtoHMQ } = this.state;
    const am = maskedAmount.split('.');
    const amFloat = Math.round(parseFloat(maskedAmount) * rateHMQtoUSD * 100) / 100;
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
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
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
