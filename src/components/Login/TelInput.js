import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VMasker from 'vanilla-masker';

import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';
import PhoneKeyboard from '../Shared/Components/PhoneKeyboard';
import ConfirmButton from '../Shared/Buttons/ConfirmButton';
import HelpButton from '../Shared/Buttons/HelpButton';
import { phoneNumberCreate, savePhone } from '../../actions';

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
    maxPhoneLength: 19,
    phone: '',
    code: '+1',
    flag: 'united_states'
  };

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    console.log(nextProps);
    console.log('📞 nextProps', nextProps.user);
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
            this.props.savePhone(VMasker.toNumber(this.state.phone));
            this.props.navigation.navigate('CodeInput');
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

  handleNumberPress = (number) => {
    if (this.state.phone.length < this.state.maxPhoneLength) {
      let inputVal = this.state.phone;
      inputVal += number;
      inputVal = VMasker.toPattern(VMasker.toNumber(inputVal),  {pattern: "(999) 999-9999", placeholder: "0"});
      this.setState({ phone: inputVal });
    }
  };

  handleBackspacePress = () => {
    let phone = VMasker.toNumber(this.state.phone).slice(0, -1);
    phone = VMasker.toPattern(VMasker.toNumber(phone), {pattern: "(999) 999-9999", placeholder: "0"});
    this.setState({ phone });
  };

  handleHelpPress = () => {
    alert('В шаббат у нас с мамой традиция — зажигать свечи и смотреть „Колесо фортуны“');
  };

  handlePhoneConfirm = () => {
    const phone_number = VMasker.toNumber(this.state.phone);
    this.props.phoneNumberCreate({
      account_id: this.props.user.account.payload.payload.account_information.account_id,
      phone_number,
    });
  };

  renderInput = () => {
    return (
      <View style={styles.telInput}>
        <TouchableOpacity
          style={styles.countryCodeContainer}
          onPress={() => {
            this.props.navigation.navigate('CountryCode',
              { refresh: (t, flag) => { t != null ? this.setState({ code: t, flag: flag }) : null } })
          } }>
          <Image style={styles.flag} source={{ uri: this.state.flag }}/>
          <Text style={styles.code}>{this.state.code}</Text>
          <Image style={styles.arrow} source={arrowDownWhite}/>
        </TouchableOpacity>
        <Text style={styles.number}>{this.state.phone}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.passContainer}>
            {this.renderInput() }
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <HelpButton onPress={this.handleHelpPress} />
          <ConfirmButton onPress={this.handleHelpPress} />
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
    marginLeft: 16
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
});
