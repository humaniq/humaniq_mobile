import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import IMEI from 'react-native-imei';

import Keyboard from '../Shared/Components/Keyboard';
import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';
import { login, signup, setPassword, addPrimaryAccount, addSecondaryAccount } from '../../actions';

export class Password extends Component {
  static propTypes = {
    user: PropTypes.shape({
      validate: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,

      account: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,

      password: PropTypes.string,
      photo: PropTypes.string.isRequired,
    }).isRequired,

    setPassword: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.object,
    }),
  };

  state = {
    maxPasswordLength: 4,
    password: '',
    imei: Math.floor((10000000 + Math.random()) * 90000000).toString(),
    match: null,
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    // console.log('next props for password', nextProps.user);
    if (nextProps.user.account.payload) {
      const code = nextProps.user.account.payload.code;
      const password = nextProps.user.password;

      if (!password) {
        switch (code) {
          case 6000:
            alert(nextProps.user.account.payload.message);
            break;

          case 1001:
            const registeredAcc = nextProps.user.account.payload.payload.account_information;
            this.props.setPassword(this.state.password);
            // this.props.navigation.navigate('TelInput');

            // TODO: replace with validated??
            if (registeredAcc.phone_number.country_code) {
              // secondary user, redirect to dash
              this.props.addSecondaryAccount({
                accountId: registeredAcc.account_id,
                photo: this.props.user.photo,
              });
              this.props.navigation.navigate('Dashboard');
            } else {
              // primary user
              this.props.addPrimaryAccount({
                accountId: registeredAcc.account_id,
                photo: this.props.user.photo,
              });
              this.props.navigation.navigate('TelInput');
            }
            break;

          case 2001:
            // login, password ok (save password & token?)
            this.props.setPassword(this.state.password);
            this.props.navigation.navigate('Dashboard');
            break;

          case 2002:
            // Authentication Failed
            this.setState({ password: '' });
            alert(nextProps.user.account.payload.message);
            break;

          case 3003:
            // Facial Image Not Found
            alert(nextProps.user.account.payload.message);
            break;

          default:
            alert(`Unknown code ${nextProps.user.account.payload.code}, no info in Postman`);
        }
      }
    }
  }

  handleNumberPress = (number) => {
    const params = this.props.navigation.state.params;

    if (this.state.password.length < this.state.maxPasswordLength) {
      this.setState({ password: this.state.password += number });
    }

    if (params) {
      if (params.password && params.password.length === this.state.password.length) {
        if (params.password === this.state.password) {
          this.setState({ match: true });
        } else {
          this.setState({ match: false });
        }
      }
    }
  };

  handleBackspacePress = () => {
    this.setState({ match: '' });
    const password = this.state.password.slice(0, -1);
    this.setState({ password });
  };

  handleHelpPress = () => {
    alert('В шаббат у нас с мамой традиция — зажигать свечи и смотреть „Колесо фортуны“');
  };

  handlePasswordConfirm = () => {
    // TODO: CHANGE
    // 3002 - registered
    // 3003 - new user
    const registered = this.props.user.validate.payload.code === 3002;

    if (registered) {
      this.authenticate();
    } else {
      if (this.state.match) {
        // TODO: go to tel input with reset
        this.createRegistration();
      } else {
        this.props.navigation.navigate('Password', { password: this.state.password });
      }
    }
  };

  authenticate = () => {
    // image_id, password, imei
    this.props.login({
      facial_image_id: this.props.user.validate.payload.payload.facial_image_id,
      device_imei: this.state.imei,
      password: this.state.password,
    });
  };

  createRegistration = () => {
    // DEV
    // TODO: set real ID;
    const isEmulator = DeviceInfo.isEmulator();
    const randomImei = Math.floor((10000000 + Math.random()) * 90000000);
    const imei = isEmulator ? randomImei : IMEI.getImei();
    // const imei = randomImei.toString();
    // const imei = '1111111111925';

    this.props.signup({
      facial_image_id: this.props.user.validate.payload.payload.facial_image_id,
      device_imei: imei,
      password: this.state.password,
    });
  };

  passwordConfirmAvailability = () => {
    const { password, maxPasswordLength } = this.state;
    return password.length === maxPasswordLength && this.state.match !== false;
  };

  renderPassMask = () => {
    const { password, maxPasswordLength, match } = this.state;
    const digits = [];

    for (let i = 0; i < maxPasswordLength; i += 1) {
      digits.push(
        <View key={i}>
          {password[i] ?
            <View style={[
              styles.passFilled,
              match === true && styles.success,
              match === false && styles.error,
            ]}
            />
            : <View style={styles.passEmpty} />
          }
        </View>,
      );
    }
    return digits;
  };

  renderInputStep = () => {
    // 3002 - registered
    // 3003 - new user
    const params = this.props.navigation.state.params;
    const code = this.props.user.validate.payload.code;
    if (params) {
      if (code === 3003 && !params.password) {
        return (<Text style={styles.stage}>{'1 / 2'}</Text>);
      } else if (params.password) {
        return (<Text style={styles.stage}>{'2 / 2'}</Text>);
      }
    }

    return null;
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.userPhoto} source={{ uri: this.props.user.photo }} />
          {this.renderInputStep()}
          <Text>{this.state.password}</Text>
          <View style={styles.passContainer}>
            {this.renderPassMask()}
          </View>
        </View>
        {!this.props.user.account.isFetching ?
          <Confirm
            active={this.passwordConfirmAvailability()}
            onPress={this.handlePasswordConfirm}
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
  login: login.request,
  signup: signup.request,
  setPassword,
  addPrimaryAccount,
  addSecondaryAccount,
})(Password);

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '$cBrand',
  },
  header: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  stage: {
    fontSize: 20,
    color: 'red',
  },
  userPhoto: {
    alignSelf: 'center',
    round: 50,
    borderRadius: 50,
  },
  passContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
  },
  passEmpty: {
    round: 30,
    borderRadius: 50,
    borderWidth: 25,
    borderColor: '$cGray',
  },
  passFilled: {
    round: 30,
    borderRadius: 50,
    borderWidth: 20,
    borderColor: '$cGray',
  },
  error: {
    borderColor: 'tomato',

  },
  success: {
    borderColor: '#B8E986',
  },
});
