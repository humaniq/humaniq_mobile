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
  };

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
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
      inputVal = VMasker.toPattern(VMasker.toNumber(inputVal), '(999) 999 9999');
      this.setState({ phone: inputVal });
    }
  };

  handleBackspacePress = () => {
    let phone = this.state.phone.slice(0, -1);
    phone = VMasker.toPattern(VMasker.toNumber(phone), '(999) 999 9999');
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
        <TouchableOpacity style={{ height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Image style={{width: 32, height: 28}} source={{uri: 'picture'}}/>
          <Text style={{fontSize: 25, color: 'white', marginLeft: 4.5, lineHeight: 29}}>{"+1"}</Text>
          <Image style={{marginTop: 28.5, marginBottom: 24.5, width: 19, height: 19}} source={arrowDownWhite}/>
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
            {this.renderInput()}
          </View>
        </View>
        <View style={{height: 61, width: 360, justifyContent: 'space-between', flexDirection: 'row', paddingLeft: 16, paddingRight: 16}}>
          <HelpButton onPress={this.handleHelpPress} />
          <ConfirmButton onPress={this.handleConfirmPress} />
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
});
