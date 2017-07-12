import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomStyleSheet from '../../utils/customStylesheet';

export class Accounts extends Component {
  static propTypes = {
    accounts: PropTypes.shape({
      primaryAccount: PropTypes.object.isRequired,
      secondaryAccounts: PropTypes.array,
    }).isRequired,
  };

  validateUser = () => {
    this.props.navigation.navigate('Camera');
  };

  renderPrimaryAccount = () => (
    <TouchableOpacity style={styles.accountButton} onPress={this.validateUser}>
      <Image style={styles.userPhoto} source={{ uri: this.props.accounts.primaryAccount.photo }} />
      <Text>Account id: {this.props.accounts.primaryAccount.accountId}</Text>
    </TouchableOpacity>
  );

  renderSecondaryAccounts = () => {
    const arr = this.props.accounts.secondaryAccounts;
    let res = [];
    if (arr.length) {
      arr.forEach((acc) => {
        res.push(
          <TouchableOpacity style={styles.accountButton} onPress={this.validateUser} key={acc.accountId}>
            <Image style={styles.userPhoto} source={{ uri: acc.photo }} />
            <Text>Account id: {acc.accountId}</Text>
          </TouchableOpacity>
        );
      });
    }
    return res;
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{flex: 1,}}>
          <Text style={styles.h1}>Primary Account</Text>
          {this.renderPrimaryAccount()}
          {this.props.accounts.secondaryAccounts.length ? <Text style={styles.h1}>Secondary Accounts</Text> : null}
          {this.renderSecondaryAccounts()}
        </View>
        <TouchableOpacity style={styles.newUserBtn} onPress={this.validateUser}>
          <Text style={styles.newUserTxt}>Create New User</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
});

export default connect(mapStateToProps)(Accounts);

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  h1: {
    fontSize: 20,
    paddingVertical: 20,
  },
  accountButton: {
    // flex: 1,
    height: 80,
    backgroundColor: 'lightgray',
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  newUserBtn: {
    height: 100,
    // flex: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newUserTxt: {
    fontSize: 25,
    color: 'white',
  },
});
