import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VMasker from 'vanilla-masker';
import SmsListener from 'react-native-android-sms-listener';
import { NavigationActions } from 'react-navigation';
import IMEI from 'react-native-imei';

import CustomStyleSheet from '../../utils/customStylesheet';
import PhoneKeyboard from '../Shared/Components/PhoneKeyboard';
import ConfirmButton from '../Shared/Buttons/ConfirmButton';
import RequestSmsButton from '../Shared/Buttons/RequestSmsButton';
import Modal from '../Shared/Components/Modal';
import { vw } from '../../utils/units';
import { phoneNumberValidate, smsCodeRepeat } from '../../actions';


export class CodeInput extends Component {
  static propTypes = {
    user: PropTypes.shape({
      account: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      phoneValidate: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      photo: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string,
    }).isRequired,

    phoneNumberValidate: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };

  state = {
    phone: '',
    code: '',
    codeError: new Animated.Value(0),
    // for modal
    modalVisible: false,
    errorCode: null,
    cooldownTime: 0,
  };

  componentDidMount() {
    this.listener = SmsListener.addListener((message) => {
      const body = message.body;
      const hmqRegEx = /humaniq/gi;

      if (body.match(hmqRegEx)) {
        // request server;
        const smsCode = body.replace(/\D/g, '');

        this.props.phoneNumberValidate({
          account_id: this.props.user.account.payload.payload.account_information.account_id,
          phone_number: this.props.user.phoneNumber,
          validation_code: smsCode.toString(),
        });
        this.setState({ password: smsCode });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    // console.log('📞 nextProps', nextProps.user.validate);
    if (nextProps.user.phoneValidate.payload) {
      const code = nextProps.user.phoneValidate.payload.code;

      if (true) {
        switch (code) {
          case 6000:
            // alert(nextProps.user.validate.payload.message);
            this.setState({
              modalVisible: true,
              errorCode: code,
            });
            break;

          case 4002:
            this.setState({ code });
            this.navigateTo('Profile')
            break;

          case 4004:
            this.setState({
              modalVisible: true,
              errorCode: code,
            });
            break;

          case 4003:
            this.setState({
              modalVisible: true,
              errorCode: code,
            });
            break;

          case 4010:
            this.setState({
              modalVisible: true,
              errorCode: code,
            });
            break;

          case 4001:
            this.setState({
              modalVisible: true,
              errorCode: code,
            });
            break;

          case 4009:
            this.setState({
              modalVisible: true,
              errorCode: code,
            });
            break;

          default:
            this.setState({
              modalVisible: true,
              errorCode: code,
            });
        }
      }
    }
  }

  handleNumberPress = (number) => {
    const c = this.state.code + number;
    console.log(c.length);
    if (c.length < 7) {
      this.setState({ code: c });
    } else {
      this.setState({ error: true });
      this.animatePasswordError();
    }
  };

  handleBackspacePress = () => {
    const code = this.state.code.slice(0, -1);
    this.setState({ code });
  };

  handleHelpPress = () => {
    this.props.navigation.navigate('Instructions');
  };

  navigateTo = (screen, params) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screen, params: params })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  handleCodeConfirm = () => {
    this.props.phoneNumberValidate({
      account_id: this.props.user.account.payload.payload.account_information.account_id,
      phone_number: this.props.user.phoneNumber,
      validation_code: this.state.code.toString(),
    });
  };

  animatePasswordError = () => {
    Animated.sequence([
      Animated.timing(this.state.codeError, {
        toValue: vw(20),
        duration: 50,
      }),
      Animated.timing(this.state.codeError, {
        toValue: vw(-20),
        duration: 100,
      }),
      Animated.timing(this.state.codeError, {
        toValue: vw(20),
        duration: 100,
      }),
      Animated.timing(this.state.codeError, {
        toValue: vw(-20),
        duration: 100,
      }),
      Animated.timing(this.state.codeError, {
        toValue: vw(0),
        duration: 50,
      }),
    ]).start(() => { this.setState({ error: null }); });
  };

  renderInput = () => (
    VMasker.toPattern(this.state.code, { pattern: '999999', placeholder: '0' }).split('').map((o, i) => {
      if (i == 2) {
        return [
          <View style={[styles.numberContainer, this.state.error ? styles.errorContainer : null]}>
            <Text style={[styles.codeInput, this.state.error ? styles.errorText : null]}>
              {o}
            </Text>
          </View>,
          <View style={[styles.numberContainer, this.state.error ? styles.errorContainer : null]}>
            <Text style={[styles.codeInput, this.state.error ? styles.errorText : null]}>
              {'-'}
            </Text>
          </View>,
        ];
      }
      return (
        <View style={[styles.numberContainer, this.state.error ? styles.errorContainer : null]}>
          <Text style={[styles.codeInput, this.state.error ? styles.errorText : null]}>
            {o}
          </Text>
        </View>
      );
    })
  );

  handleDismissModal = () => {
    this.setState({ modalVisible: false, errorCode: null });
  };

  handleRequestSms = () => {
    this.props.smsCodeRepeat({
      account_id: this.props.user.account.payload.payload.account_information.account_id,
      phone_number: this.props.user.phoneNumber,
      imei: IMEI.getImei().toString(),
    });
    // set cooldown
    this.setState({ cooldownTime: 45 });
    let interval;
    let cooldown = () => {
      if (this.state.cooldownTime > 0) {
        this.setState({ cooldownTime: this.state.cooldownTime -= 1 });
      } else {
        clearInterval(interval);
      }
    };
    interval = setInterval(cooldown, 1000);
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal
          onPress={this.handleDismissModal}
          visible={this.state.modalVisible}
          code={this.state.errorCode}
        />
        <View style={styles.header}>
          <Animated.View style={[styles.codeInputContainer, { marginLeft: this.state.codeError }]}>
            {this.renderInput() }
          </Animated.View>
        </View>
        <View style={styles.buttonsContainer}>
          <RequestSmsButton
            onPress={this.handleRequestSms}
            disabled={this.state.cooldownTime > 0}
            cooldownTime={this.state.cooldownTime}
          />
          <ConfirmButton
            onPress={this.handleCodeConfirm}
            disabled={this.state.code.length < 6}
          />
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
  phoneNumberValidate: phoneNumberValidate.request,
  smsCodeRepeat: smsCodeRepeat.request,
})(CodeInput);

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#439fe0',
  },
  header: {
    flex: 1,
    paddingTop: 120,
    paddingLeft: 16,
    paddingRight: 16,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    width: 328,
  },
  numberContainer: {
    width: 30,
    height: 56,
    borderBottomWidth: 1,
    borderColor: 'white',
    marginRight: 12,
    justifyContent: 'center',
  },
  codeInput: {
    marginTop: 4,
    lineHeight: 36,
    fontSize: 36,
    textAlign: 'center',
    color: 'white',
  },
  dash: {
    lineHeight: 36,
    fontSize: 18,
    width: 36,
    height: 56,
    color: 'white',
    textAlign: 'center',
  },
  buttonsContainer: {
    height: 61,
    width: 360,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  errorContainer: {
    borderBottomColor: '#f01434',
  },
  errorText: {
    color: '#f01434',
  },
});
