import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Animated,
} from 'react-native';

import PropTypes from 'prop-types';
import Animation from 'lottie-react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import IMEI from 'react-native-imei';
import { HumaniqTokenApiLib } from 'react-native-android-library-humaniq-api';

import Keyboard from '../Shared/Components/Keyboard';
import CustomStyleSheet from '../../utils/customStylesheet';

const spinner = require('../../assets/animations/s-spiner.json');

import { login, signup, setPassword, addPrimaryAccount, addSecondaryAccount } from '../../actions';
import Modal from '../Shared/Components/Modal';
import { vw } from '../../utils/units';

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

    addPrimaryAccount: PropTypes.func.isRequired,
    addSecondaryAccount: PropTypes.func.isRequired,
  };

  state = {
    maxPasswordLength: 4,
    password: '',
    imei: Math.floor((10000000 + Math.random()) * 90000000).toString(),
    match: null,
    progress: new Animated.Value(0),
    passwordError: new Animated.Value(0),
    error: false,
    errorCode: null,
  };

  componentDidMount() {
  }

  animateCycle = (time, fr = 0, to = 1, callback) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.progress, {
          toValue: 1,
          duration: 2000,
        }),
        Animated.timing(this.state.progress, {
          toValue: 0,
          duration: 0,
        }),
      ]),
    ).start();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user.account.isFetching && nextProps.user.account.isFetching) {
      this.animateCycle(2000, 0, 1);
    } else if (this.props.user.account.isFetching && !nextProps.user.account.isFetching) {
      this.state.progress.stopAnimation();
      this.state.progress.setValue(0);

      if (!nextProps.user.account.payload) {
        return;
      }

      const code = nextProps.user.account.payload.code;
      const password = nextProps.user.password;

      if (!password) {
        switch (code) {
          case 6000:
            this.setState({
              error: true,
              errorCode: nextProps.user.account.payload.code,
            });
            break;

          case 1001:
            const registeredAcc = nextProps.user.account.payload.payload.account_information;
            console.log('registeredAccount ::', registeredAcc)
            this.props.setPassword(this.state.password);
            // this.props.navigation.navigate('TelInput');
            const map2 = {
              token: nextProps.user.account.payload.payload.token,
              account_id: registeredAcc.account_id,
              facial_image_id: this.props.user.validate.payload.payload.facial_image_id,
              password,
              device_imei: IMEI.getImei(),
            };
            HumaniqTokenApiLib.saveCredentials(map2)
                .then((res) => {
              console.log(res)
                })
                .catch(err => console.log(err));
            // TODO: replace with validated??
            if (registeredAcc.phone_number.country_code) {
              // secondary user, redirect to dash
              this.props.addSecondaryAccount({
                accountId: registeredAcc.account_id,
                photo: this.props.user.photo,
                number: `${registeredAcc.phone_number.country_code}${registeredAcc.phone_number.phone_number}`,
              });

              this.props.navigation.navigate('Profile');
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
            const map = {
              token: nextProps.user.account.payload.payload.token,
              account_id: nextProps.user.account.payload.payload.account_id,
              facial_image_id: this.props.user.validate.payload.payload.facial_image_id,
              password,
              device_imei: IMEI.getImei(),
            };
            HumaniqTokenApiLib.saveCredentials(map)
                .then((res) => {
                  this.props.setPassword(this.state.password);
                  this.props.navigation.navigate('Profile');
                })
                .catch(err => console.log(err));
            break;

          case 2002:
            // Authentication Failed
            this.setState({
              password: '',
              error: true,
              errorCode: nextProps.user.account.payload.code,
            });
            break;

          case 3003:
            // Facial Image Not Found
            this.setState({
              error: true,
              errorCode: nextProps.user.account.payload.code,
            });
            break;

          default:
            this.setState({
              error: true,
              errorCode: nextProps.user.account.payload.code,
            });
        }
      }
    }
  }

  handleDismissModal = () => {
    this.setState({ error: false, errorCode: null });
  };

  handleNumberPress = (number) => {
    const params = this.props.navigation.state.params;
    const res = this.state.password + number;
    if (res.length <= this.state.maxPasswordLength) {
      this.setState({ password: res });
    }

    if (params) {
      if (params.password) {
        // Registration step 2
        if (this.state.maxPasswordLength === res.length && params.password === res) {
          this.handlePasswordConfirm(true, res);
        } else if (this.state.maxPasswordLength === res.length && params.password !== res) {
          // incorrect password
          this.setState({ error: true });
          this.animatePasswordError();
        }
      } else if (res.length === this.state.maxPasswordLength) {
        // Registration step 1
        this.handlePasswordConfirm(false, res);
      }
    } else if (res.length === this.state.maxPasswordLength) {
        // Auth
      console.log('authenticate');
      this.handlePasswordConfirm(false, res);
    }
  };

  handleBackspacePress = () => {
    const password = this.state.password.slice(0, -1);
    this.setState({ password });
  };

  handleHelpPress = () => {
    alert('В шаббат у нас с мамой традиция — зажигать свечи и смотреть „Колесо фортуны“');
  };

  handlePasswordConfirm = (match, password) => {
    // TODO: CHANGE
    // 3002 - registered
    // 3003 - new user
    const registered = this.props.user.validate.payload.code === 3002;

    if (registered) {
      this.authenticate(password);
    } else if (match) {
      // TODO: go to tel input with reset
      this.createRegistration(password);
    } else {
      this.props.navigation.navigate('Password', { password });
    }
  };

  authenticate = (password) => {
    // image_id, password, imei
    this.props.login({
      facial_image_id: this.props.user.validate.payload.payload.facial_image_id,
      device_imei: this.state.imei,
      password,
    });
  };

  createRegistration = (password) => {
    // DEV
    // TODO: set real ID;
    const isEmulator = DeviceInfo.isEmulator();
    const randomImei = Math.floor((10000000 + Math.random()) * 90000000).toString();
    // const imei = isEmulator ? randomImei : IMEI.getImei();
    const imei = randomImei.toString();
    // const imei = '1111111111925';

    this.props.signup({
      facial_image_id: this.props.user.validate.payload.payload.facial_image_id,
      device_imei: imei,
      password,
    });
  };

  renderPassMask = () => {
    const { password, maxPasswordLength } = this.state;
    const digits = [];
    let style = null;

    for (let i = 0; i < maxPasswordLength; i += 1) {
      if (password[i]) {
        if (this.state.error) {
          style = styles.passError;
        } else {
          style = styles.passFilled;
        }
      } else {
        style = styles.passEmpty;
      }
      digits.push(
        <View key={i}>
          <View style={style} />
        </View>,
      );
    }
    return (
      <Animated.View style={[{ marginRight: this.state.passwordError }, styles.passContainer]}>
        {digits}
      </Animated.View>
    );
  };

  animatePasswordError = () => {
    Animated.sequence([
      Animated.timing(this.state.passwordError, {
        toValue: vw(-30),
        duration: 50,
      }),
      Animated.timing(this.state.passwordError, {
        toValue: vw(30),
        duration: 100,
      }),
      Animated.timing(this.state.passwordError, {
        toValue: vw(-30),
        duration: 100,
      }),
      Animated.timing(this.state.passwordError, {
        toValue: vw(30),
        duration: 100,
      }),
      Animated.timing(this.state.passwordError, {
        toValue: vw(0),
        duration: 50,
      }),
    ]).start(() => { this.setState({ error: null }); });
  }

  renderInputStep = () => {
    // 3002 - registered
    // 3003 - new user
    const params = this.props.navigation.state.params;
    const code = this.props.user.validate.payload.code;
    if (params) {
      if (code === 3003 && !params.password) {
        return (<Text style={styles.stage}>{'1 / 2'}</Text>);
      } else if (params.password) {
        return (
          <Text style={styles.stage}>{'2 / 2'}</Text>
        );
      }
    }

    return null;
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal
          onPress={this.handleDismissModal}
          code={this.state.errorCode}
          visible={this.state.error != null && this.state.errorCode != null}
        />
        <View style={styles.header}>
          <View style={styles.animationContainer}>
            <Animation
              style={styles.animation}
              source={spinner}
              progress={this.state.progress}
            />
          </View>
          <Image style={styles.userPhoto} source={{ uri: this.props.user.photo }} />
          {this.renderInputStep() }
          {this.renderPassMask() }
        </View>
        <View style={styles.keyboardContainer}>
          <Keyboard
            isBackspaceEnabled={(this.state.password.length > 0) && !this.props.user.account.isFetching}
            onNumberPress={this.handleNumberPress}
            onBackspacePress={this.handleBackspacePress}
            onHelpPress={this.handleHelpPress}
          />
        </View>
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
    alignItems: 'center',
  },
  header: {
    width: 360,
    height: 188,
    alignItems: 'center',
  },
  animationContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  animation: {
    width: 24,
    height: 24,
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
    marginTop: 8.5,
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
  passError: {
    round: 12,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: '$cLipstick',
  },
  error: {
    borderColor: 'tomato',
  },
  success: {
    borderColor: '#B8E986',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 113,
  },
});
