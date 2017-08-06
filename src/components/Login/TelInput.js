import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VMasker from 'vanilla-masker';
import phoneFormat from 'phoneformat-react-native';

import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';
import PhoneKeyboard from '../Shared/Components/PhoneKeyboard';
import ConfirmButton from '../Shared/Buttons/ConfirmButton';
import HelpButton from '../Shared/Buttons/HelpButton';
import { phoneNumberCreate, savePhone } from '../../actions';
import { NavigationActions } from 'react-navigation';
import { vw } from '../../utils/units';

const ic_user = require('../../assets/icons/ic_user.png');
const arrowDownWhite = require('../../assets/icons/arrow_down_white.png');

export class TelInput extends Component {
  static propTypes = {
    user: PropTypes.shape({
      account: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      phoneCreate: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      photo: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string,
    }).isRequired,

    phoneNumberCreate: PropTypes.func.isRequired,
    savePhone: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };

  state = {
    maxPhoneLength: 10,
    phone: '',
    maskedPhone: VMasker.toPattern(0, { pattern: "(999) 999-9999", placeholder: "0" }),
    code: '+1',
    countryCode: "US",
    flag: 'united_states',
    phoneError: new Animated.Value(0)
  };

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    // console.log(nextProps);
    // console.log('📞 nextProps > Telinput', nextProps.user);
    if (nextProps.user.phoneCreate.payload) {
      const code = nextProps.user.phoneCreate.payload.code;
      const phone = nextProps.user.phoneNumber;

      if (!phone) {
        switch (code) {
          case 6000:
            alert(nextProps.user.phoneCreate.payload.message);
            break;

          case 4005:
            // registered user
            // Account Phone Number Created Successfully. Validation Code Sent
            this.props.savePhone(VMasker.toNumber(`${this.state.code}${this.state.phone}`));
            this.navigateTo('CodeInput');
            // alert('Proceed to codeInput');
            break;

          case 4011:
            // The Account Already Has A Phone Number
            alert('The Account Already Has A Phone Number');
            // this.props.setAvatarLocalPath(this.state.path);
            // this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
            break;

          default:
            alert(`Unknown code ${nextProps.user.phoneCreate.payload.code}, no info in Postman`);
        }
      }
    }
  }

  navigateTo = (screen, params) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screen, params: params })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  handleNumberPress = (number) => {
    if (this.state.phone.length < this.state.maxPhoneLength) {
      let inputVal = this.state.phone;
      inputVal += number;
      let m = VMasker.toPattern(inputVal, { pattern: "(999) 999-9999", placeholder: "0" });
      this.setState({ phone: inputVal, maskedPhone: m });
    }
  };

  handleBackspacePress = () => {
    let inputVal = this.state.phone.slice(0, -1);
    let m = VMasker.toPattern(inputVal, { pattern: "(999) 999-9999", placeholder: "0" });
    this.setState({ phone: inputVal, maskedPhone: m });
  };

  handleHelpPress = () => {
    this.navigateTo('Instructions');
  };

  handlePhoneConfirm = () => {
    const phone_number = this.state.phone;

    if (this.phonenumber(this.state.phone, this.state.countryCode)) {
      this.props.phoneNumberCreate({
        account_id: this.props.user.account.payload.payload.account_information.account_id,
        phone_number: VMasker.toNumber(`${this.state.code}${phone_number}`),
      });
    } else {
      this.setState({ error: true });
      this.animatePasswordError();
    }
  };

  phonenumber = (inputtxt, code) => {
    //let phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneFormat.isValidNumber(inputtxt, code);
  }

  animatePasswordError = () => {
    Animated.sequence([
      Animated.timing(this.state.phoneError, {
        toValue: vw(30),
        duration: 50,
      }),
      Animated.timing(this.state.phoneError, {
        toValue: vw(-30),
        duration: 100
      }),
      Animated.timing(this.state.phoneError, {
        toValue: vw(30),
        duration: 100,
      }),
      Animated.timing(this.state.phoneError, {
        toValue: vw(-30),
        duration: 100,
      }),
      Animated.timing(this.state.phoneError, {
        toValue: vw(0),
        duration: 50,
      }),
    ]).start(() => { this.setState({ error: null }) });
  }

  renderInput = () => {
    return (
      <View style={styles.telInput}>
        <TouchableOpacity
          style={styles.countryCodeContainer}
          onPress={() => {
            this.navigateTo('CountryCode',
              { refresh: (dialCode, code, flag) => { dialCode != null ? this.setState({ code: dialCode, countryCode: code, flag: flag }) : null } })
          } }>
          <Image style={styles.flag} source={{ uri: this.state.flag }}/>
          <Text style={[styles.code, this.state.error ? styles.error : null]}>{this.state.code}</Text>
          <Image style={[styles.arrow, this.state.error ? { tintColor: 'red' } : null]} source={arrowDownWhite}/>
        </TouchableOpacity>
        <Text style={[styles.number, this.state.error ? styles.error : null]}>{this.state.maskedPhone}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Animated.View style={[styles.passContainer, { marginLeft: this.state.phoneError }]}>
            {this.renderInput() }
          </Animated.View>
        </View>
        <View style={styles.buttonsContainer}>
          <HelpButton onPress={this.handleHelpPress} />
          <ConfirmButton onPress={this.handlePhoneConfirm} />
        </View>
        <PhoneKeyboard
          onNumberPress={this.handleNumberPress}
          onBackspacePress={this.handleBackspacePress}
          onHelpPress={this.handleHelpPress}
          />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  phoneNumberCreate: phoneNumberCreate.request,
  savePhone,
})(TelInput);

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#439fe0',
  },
  header: {
    flex: 1,
    paddingTop: 120,
    paddingLeft: 16
  },
  countryCodeContainer: {
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },
  flag: {
    width: 32,
    height: 28
  },
  arrow: {
    marginTop: 28.5,
    marginBottom: 24.5,
    width: 19,
    height: 19
  },
  code: {
    fontSize: 25,
    color: 'white',
    marginLeft: 4.5,
    lineHeight: 29
  },
  passContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 328,
  },
  telInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    textAlign: 'center',
    fontSize: 25,
    marginLeft: 10,
    color: 'white'
  },
  buttonsContainer: {
    height: 61,
    width: 360,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16
  },
  error: {
    color: "#f01434"
  }
});
