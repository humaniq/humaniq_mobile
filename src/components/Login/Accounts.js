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

// assets
const authillustration = require('../../assets/icons/auth_illustration.png');
const ic_chevrone_right = require('../../assets/icons/ic_chevrone_right.png');
const ic_add_user = require('../../assets/icons/ic_add_user.png');

export class Accounts extends Component {
  static propTypes = {
    accounts: PropTypes.shape({
      primaryAccount: PropTypes.object.isRequired,
      secondaryAccounts: PropTypes.array,
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.object,
    }).isRequired,
  };

  validateUser = () => {
    this.props.navigation.navigate('Camera');
  };

  render() {
    const accounts = this.props.accounts;
    const allAccounts = [accounts.primaryAccount, ...accounts.secondaryAccounts];

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header} >
          <Image style={styles.illustration} source={authillustration} />
        </View>

        <View style={styles.accountsContainer}>
          {allAccounts.map(acc => (
            <TouchableOpacity
              style={styles.accountBtn}
              onPress={this.validateUser}
              key={acc.accountId}
            >
              <View style={styles.accountInfoContainer}>
                <Image style={styles.profilePhoto} source={{ uri: acc.photo }} />
                <Text style={styles.id}>{`${acc.accountId} / phone: ${acc.phone}`}</Text>
              </View>
              <Image source={ic_chevrone_right} />
            </TouchableOpacity>
          )) }
        </View>
        <TouchableOpacity style={styles.newUserBtn} onPress={this.validateUser}>
          <Image source={ic_add_user} />
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
    backgroundColor: '$cBrand_dark',
  },
  header: {
    height: 147,
    marginBottom: 24,
    backgroundColor: '$cBrand_dark',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    elevation: 2
  },
  illustration: {
    width: 360,
    height: 147
  },
  accountBtn: {
    flexDirection: 'row',
    height: 63,
    paddingHorizontal: 21,
    paddingVertical: 11,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    round: 41,
    marginRight: 11,
    borderRadius: 20,
    backgroundColor: '$cBrand',
  },
  id: {
    fontSize: 15,
    color: '$cPaper',
    fontWeight: '700',
  },
  newUserBtn: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 11,
  },
});
