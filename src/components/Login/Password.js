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
    const res = this.state.password += number;
    if (res.length <= this.state.maxPasswordLength) {
      this.setState({ password: res });
      if (res.length == this.state.maxPasswordLength && !params.password) {
        this.handlePasswordConfirm(false);
      }
    }

    if (params) {
      if (params.password && params.password.length === this.state.password.length) {
        if (params.password === this.state.password) {
          this.handlePasswordConfirm(true);
        }
      }
    }
  };

  handleBackspacePress = () => {
    const password = this.state.password.slice(0, -1);
    this.setState({ password });
  };

  handleHelpPress = () => {
    alert('В шаббат у нас с мамой традиция — зажигать свечи и смотреть „Колесо фортуны“');
  };

  handlePasswordConfirm = (match) => {
    // TODO: CHANGE
    // 3002 - registered
    // 3003 - new user
    const registered = this.props.user.validate.payload.code === 3002;

    if (registered) {
      this.authenticate();
    } else {
      if (match) {
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

  renderPassMask = () => {
    const { password, maxPasswordLength} = this.state;
    const digits = [];

    for (let i = 0; i < maxPasswordLength; i += 1) {
      digits.push(
        <View key={i}>
          {password[i] ?
            <View style={styles.passFilled}/>
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
          {this.renderInputStep() }
          <View style={styles.passContainer}>
            {this.renderPassMask() }
          </View>
        </View>

        <Keyboard
          isBackspaceEnabled={this.state.password != ""}
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
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  header: {
    width: 360,
    height: 188,
    alignItems: 'center',
  },
  stage: {
    fontSize: 15,
    lineHeight: 17,
    color: '$cPaper',
    alignSelf: 'center',
    marginTop: 13.5,
  },
  userPhoto: {
    alignSelf: 'center',
    round: 71,
    borderRadius: 50,
    marginTop: 53.5,
  },
  passContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 144,
    height: 24,
    paddingHorizontal: 18,
    marginTop: 8.5
  },
  passEmpty: {
    round: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '$cPaperTransparent',
  },
  passFilled: {
    round: 12,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '$cPaper',
  },
  error: {
    borderColor: 'tomato',

  },
  success: {
    borderColor: '#B8E986',
  },
});
