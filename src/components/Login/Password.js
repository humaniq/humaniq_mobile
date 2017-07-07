import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNFetchBlob from 'react-native-fetch-blob';
import { NavigationActions } from 'react-navigation';

import { ActionCreators } from '../../actions';
import Keyboard from './Keyboard';
import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';

export class Password extends Component {
  static navigationOptions = {
    // header: null,
  };
  state = {
    maxPasswordLength: 4,
    password: '',
    imei: Math.floor((100000 + Math.random()) * 900000).toString(),
    match: null,
  };

  componentWillMount() {
    // TODO: закешировать картинку на этом экране
    // TODO: Получить тут IMEI;
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
    const { registered } = this.props.user;

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
    this.setState({ uploading: true });
    RNFetchBlob.fetch(
      'POST',
      'https://beta-api.humaniq.co/tapatybe/api/v1/authenticate/user',
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        facial_image: this.props.user.avatar.b64,
        password: this.state.password,
        metadata: {
          react_native_imei: {
            device_imei: this.state.imei,
          },
        },
      }),
    )
      .then(resp => resp.json())
      .then((resp) => {
        this.setState({ uploading: false });
        if (resp.code === 20000) {
          this.props.saveUserId(resp.payload.account_id);
          this.props.saveUserToken(resp.payload.token);
          this.props.navigation.navigate('Dashboard');
        } else {
          alert('something wrong with existing user auth or password is incorrect, call Karim :)');
        }
        // TODO: REDIRECT
      })
      .catch((err) => {
        alert('network fail');
        this.setState({ uploading: false });
      });
  };

  createRegistration = () => {
    this.setState({ uploading: true });
    RNFetchBlob.fetch(
      'POST',
      'https://beta-api.humaniq.co/tapatybe/api/v1/registration',
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        facial_image: this.props.user.avatar.b64,
        password: this.state.password,
        metadata: {
          react_native_imei: {
            device_imei: this.state.imei,
          },
        },
      }),
    )
      .then(resp => resp.json())
      .then((resp) => {
        this.setState({ uploading: false });
        if (resp.code === 20100) {
          this.props.saveUserPassword(this.state.password);
          this.props.saveUserImei(this.state.imei);
          this.props.saveUserId(resp.payload.account_id);
          this.props.navigation.navigate('Tutorial', { nextScene: 'TelInput' });
        } else {
          alert('reg fail');
        }
      })
      .catch((err) => {
        this.setState({ uploading: false });
        alert('something happened during upload, try one more time');
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
    const params = this.props.navigation.state.params;
    if (!this.props.user.registered && !params.password) {
      return (<Text style={styles.stage}>{'1 / 2'}</Text>);
    } else if (!this.props.user.registered && params.password) {
      return (<Text style={styles.stage}>{'2 / 2'}</Text>);
    }

    return null;
    /*
    const params = this.props.navigation.state.params;
    if (!params.registered) {
      if (params.password) {
        return (<Text style={styles.stage}>{!params.registered && '2 / 2'}</Text>);
      }
      return (<Text style={styles.stage}>{!params.registered && '1 / 2'}</Text>);
    }
    */
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.userPhoto} source={{ uri: this.props.user.avatar.localPath }} />
          {this.renderInputStep()}
          <Text>{this.state.password}</Text>
          <View style={styles.passContainer}>
            {this.renderPassMask()}
          </View>
        </View>
        {!this.state.uploading ?
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

const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Password);

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
