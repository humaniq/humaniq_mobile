/* eslint-disable */
// will be modified entirely

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

class Loading extends Component {
  state = {
    timeout: false,
  };

  static propTypes = {
    accounts: PropTypes.shape({
      primaryAccount: PropTypes.object.isRequired,
      secondaryAccounts: PropTypes.array,
    }).isRequired,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({timeout: true}, this.onTimeoutFinish)
    }, 2000);
  }

  onTimeoutFinish = () => {
    let savedDataExists = this.props.accounts.saved === true;

    if (savedDataExists) {
      // go to accs
      this.props.navigation.navigate('Accounts');
    } else {
      // go to tuts
      this.props.navigation.navigate('Tutorial');
    }
  };

  render() {
    let savedDataExists = this.props.accounts.saved === true;
    let timeoutFinished = this.state.timeout;

    return (
      <View style={styles.container}>
        <Text style={styles.loadingTxt}>LOADING, timeout 3 seconds</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
});

export default connect(mapStateToProps)(Loading);

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTxt: {
    fontSize: 25,
  },
});
