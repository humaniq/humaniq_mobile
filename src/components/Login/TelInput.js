import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RNFetchBlob from 'react-native-fetch-blob';
import VMasker from 'vanilla-masker';

import CustomStyleSheet from '../../utils/customStylesheet';
import Confirm from '../Shared/Buttons/Confirm';
import { ActionCreators } from '../../actions';
import Keyboard from './Keyboard';

const ic_user = require('../../assets/icons/ic_user.png');

export class TelInput extends Component {
  static navigationOptions = {
    // header: null,
  };
  state = {
    maxPhoneLength: 19,
    phone: '',
  };

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
    this.setState({ uploading: true });
    let phone = VMasker.toNumber(this.state.phone);

    RNFetchBlob.fetch(
      'POST',
      'https://beta-api.humaniq.co/tapatybe/api/v1/account/phone_number',
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        account_id: this.props.user.id,
        phone_number: {
          country_code: phone.slice(0, 1),
          phone_number: phone.slice(1),
        },
      }),
    )
      .then(resp => resp.json())
      .then((resp) => {
        this.setState({ uploading: false });
        if (resp.code === 20100) {
          this.props.saveUserPhone(this.state.phone);
          this.props.navigation.navigate('Dashboard');
        }
      })
      .catch((err) => {
        this.setState({ uploading: false });
        alert('something happened during upload, try one more time');
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
        {!this.state.uploading ?
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

const mapDispatchToProps = dispatch => (
  bindActionCreators(ActionCreators, dispatch)
);

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(TelInput);

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
