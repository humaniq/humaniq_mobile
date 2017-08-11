import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Ripple from 'react-native-material-ripple';

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
    const allAccounts = [accounts.primaryAccount];

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header} >
          <Image style={styles.illustration} source={authillustration} />
        </View>

        <View style={styles.accountsContainer}>
          {allAccounts.map((acc) => {
            const name = acc.person
                ? `${acc.person.first_name} ${acc.person.last_name}`
                : '';
            const p_code = (acc.phone_number && acc.phone_number.country_code)
                ? `+(${acc.phone_number.country_code})` : '';
            const p_num = (acc.phone_number && acc.phone_number.phone_number)
                ? acc.phone_number.phone_number : '';
            const phone = acc.phone || acc.phone_number
                ? `${p_code} ${p_num}`
                : '';
            return (
              <Ripple
                onPress={this.validateUser}
                key={acc.accountId}
              >
                <View style={styles.accountBtn}>
                  <View style={styles.accountInfoContainer}>
                    {acc.photo.length > 0 &&
                    <Image style={styles.profilePhoto} source={{ uri: acc.photo }} />
                    }
                    {
                      name ?
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={styles.nameRow}>{name}</Text>
                          <Text style={styles.phoneRow}>{phone}</Text>
                        </View>
                      :
                        <Text style={styles.phone}>{phone}</Text>
                    }
                  </View>
                  <Image source={ic_chevrone_right} />
                </View>
              </Ripple>
            );
          }) }
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  user: state.user,
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
    elevation: 2,
  },
  illustration: {
    width: 360,
    height: 147,
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
    height: 41,
    width: 41,
    marginRight: 11,
    borderRadius: 20,
    backgroundColor: '$cBrand',
  },
  phone: {
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
    color: 'white',
  },
  nameRow: {
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'left',
    color: 'white',
  },
  phoneRow: {
    fontFamily: 'Roboto',
    fontSize: 12,
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  newUserBtn: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 11,
  },
});
