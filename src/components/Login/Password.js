import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import Keyboard from './Keyboard';
import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';
import { login, signup, setPassword } from '../../actions';


export class Password extends Component {
  static navigationOptions = {
    // header: null,
  };
  state = {
    maxPasswordLength: 4,
    password: '',
    imei: Math.floor((10000000 + Math.random()) * 90000000).toString(),
    match: null,
  };

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    if (nextProps.user.account.payload) {
      const code = nextProps.user.account.payload.code;
      const password = nextProps.user.password;
      if (code === 3002 && !password) {
        // registered user
        // this.props.setAvatarLocalPath(this.state.path);
        // this.props.navigation.navigate('Password');
      } else if (code === 1001 && !password) {
        // auth
        // password good (save password & token?)
        this.props.setPassword(this.state.password);
        this.props.navigation.navigate('TelInput');
      } else if (code === 2001 && !password) {
      // password good (save password & token?)
        this.props.setPassword(this.state.password);
        this.props.navigation.navigate('Dashboard');
      } else if (code === 900000000000000) {
        alert('Бред какой-то, попробуй еще раз');
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
    console.log('image id', this.props.user.validate.payload);
    this.props.signup({
      facial_image_id: this.props.user.validate.payload.payload.facial_image_id,
      device_imei: this.state.imei,
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
})(Password);

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
