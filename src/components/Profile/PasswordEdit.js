import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Animated,
  ToastAndroid,
} from 'react-native';

import Animation from 'lottie-react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import { NavigationActions } from 'react-navigation';
import Keyboard from '../Shared/Components/Keyboard';
import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';
import { HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';
import Modal from '../Shared/Components/Modal';
import { vw } from '../../utils/units';

const spinner = require('../../assets/animations/s-spiner.json');
const ic_photo_holder = require('../../assets/icons/ic_mock.png');

export class PasswordEdit extends Component {
  constructor(props) {
    super(props);
    const { password } = this.props;
    this.state = {
      maxPasswordLength: 4,
      old_password: password || '1234',
      new_password: '',
      password: '',
      match: null,
      loading: false,
      firstStep: true,
      progress: new Animated.Value(0),
      passwordError: new Animated.Value(0),
    };
  }

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

  handleDismissModal = () => {
    this.setState({ error: false, errorCode: null });
  };

  handleNumberPress = (number) => {
    if (this.state.password.length < this.state.maxPasswordLength) {
      this.setState({ password: this.state.password += number });
    }
    if (this.state.password.length == this.state.maxPasswordLength) {
      if (this.state.firstStep) {
        if (this.state.old_password == this.state.password) {
          setTimeout(() => {
            this.setState({ firstStep: false, password: '' });
          }, 100);
        } else {
          setTimeout(() => {
            this.setState({ firstStep: true, error: true });
            this.animatePasswordError();
          }, 50);
        }
      } else {
        this.changePassword(this.state.old_password, this.state.password);
      }
    }
  };

  handleBackspacePress = () => {
    this.setState({ match: '' });
    const password = this.state.password.slice(0, -1);
    this.setState({ password });
  };

  handleHelpPress = () => {
    alert('');
  };

  renderPassMask = () => {
    const { password, maxPasswordLength, match } = this.state;
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
    ]).start(() => { this.setState({ error: null, password: '' }); });
  }

  renderInputStep = () => {
    if (this.state.firstStep) {
      return (<Text style={styles.stage}>{'1 / 2'}</Text>);
    }
    return (<Text style={styles.stage}>{'2 / 2'}</Text>);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.animationContainer}>
            <Animation
              style={styles.animation}
              source={spinner}
              progress={this.state.progress}
            />
          </View>
          <Image
            style={styles.userPhoto}
            source={this.props.profile.avatar
                ? { uri: this.props.profile.avatar.url }
                : ic_photo_holder}
          />
          {this.renderInputStep()}
          {this.renderPassMask()}
        </View>
        <View style={styles.keyboardContainer}>
          <Keyboard
            isBackspaceEnabled={this.state.password !== ''}
            onNumberPress={this.handleNumberPress}
            onBackspacePress={this.handleBackspacePress}
            onHelpPress={this.handleHelpPress}
          />
        </View>
      </View>
    );
  }

  changePassword(oldPassword, newPassword) {
    console.warn(oldPassword);
    console.warn(newPassword);
    this.animateCycle(2000, 0, 1);
    HumaniqProfileApiLib.changeProfilePassword(
        this.props.id,
        oldPassword,
        newPassword,
        )
      .then((resp) => {
        this.props.setPassword(newPassword);
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
        console.warn(JSON.stringify(resp));
        ToastAndroid.show('Success', ToastAndroid.LONG);
        this.handleClose();
      })
      .catch((err) => {
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
        this.handleClose();
        console.warn(JSON.stringify(err.message));
      });
  }

  handleClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  }
}

export default connect(
    state => ({
      user: state.user,
      profile: state.user.profile || {},
      password: state.user.password || '',
      id: state.accounts.primaryAccount.account_id,
    }),
    dispatch => ({
      setProfile: profile => dispatch(actions.setProfile(profile)),
      setPassword: password => dispatch(actions.setPassword(password)),
    }),
)(PasswordEdit);

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
