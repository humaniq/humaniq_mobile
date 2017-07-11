import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Alert,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VMasker from 'vanilla-masker';

import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';
import Keyboard from '../Shared/Components/Keyboard';
import { phoneNumberCreate } from '../../actions';


const ic_user = require('../../assets/icons/ic_user.png');

export class TelInput extends Component {
  static propTypes = {
    user: PropTypes.shape({
      account: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      phone: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      photo: PropTypes.string.isRequired,
    }).isRequired,

    phoneNumberCreate: PropTypes.func.isRequired,
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
    // console.log('📞 nextProps', nextProps.user.validate);
    if (nextProps.user.phone.payload) {
      const code = nextProps.user.phone.payload.code;

      if (code) {
        switch (code) {
          case 6000:
            alert(nextProps.user.validate.payload.message);
            break;

          case 4005:
            // registered user
            // Account Phone Number Created Successfully. Validation Code Sent
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
            alert(`Unknown code ${nextProps.user.validate.payload.code}, no info in Postman`);
        }
      }
    }
  }

  handleNumberPress = (number) => {
    if (this.state.phone.length < this.state.maxPhoneLength) {
      let inputVal = this.state.phone;
      inputVal += number;
      inputVal = VMasker.toPattern(VMasker.toNumber(inputVal), '+ 9 (999) 999-99-99');
      this.setState({ phone: inputVal });
    }
  };

  handleBackspacePress = () => {
    let phone = this.state.phone.slice(0, -1);
    phone = VMasker.toPattern(VMasker.toNumber(phone), '+ 9 (999) 999-99-99');
    this.setState({ phone });
  };

  handleHelpPress = () => {
    alert('В шаббат у нас с мамой традиция — зажигать свечи и смотреть „Колесо фортуны“');
  };

  handlePhoneConfirm = () => {
    console.log(this.props.user.account);
    const phone_number = VMasker.toNumber(this.state.phone);
    this.props.phoneNumberCreate({
      account_id: this.props.user.account.payload.payload.account_information.account_id,
      phone_number,
    });
  };

  renderInput = () => {
    return (
      <View style={styles.telInput}>
        <Text style={styles.number}>{this.state.phone}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.userPhoto} source={ic_user} />
          <Text>{this.state.password}</Text>
          <View style={styles.passContainer}>
            {this.renderInput()}
          </View>
        </View>
        {!this.props.user.phone.isFetching ?
          <Confirm
            active={this.state.phone.length === this.state.maxPhoneLength}
            onPress={this.handlePhoneConfirm}
          /> : <Text>uploading</Text>
        }
        <Keyboard
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
})(TelInput);

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  userPhoto: {
    alignSelf: 'center',
  },
  passContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
  },
  telInput: {
    flex: 1,
    height: 30,
    backgroundColor: '$cGray',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    textAlign: 'center',
    fontSize: 30,
  },
});
