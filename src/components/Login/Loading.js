import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomStyleSheet from '../../utils/customStylesheet';

const logo_face = require('../../assets/icons/logo_face.png');
const logo_text = require('../../assets/icons/logo_text.png');

class Loading extends Component {
  static propTypes = {
    accounts: PropTypes.shape({
      primaryAccount: PropTypes.object.isRequired,
      secondaryAccounts: PropTypes.array,
      saved: PropTypes.bool,
    }).isRequired,

    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.object,
    }),
  };

  state = {
    timeout: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ timeout: true }, this.onTimeoutFinish);
    }, 2000);
  }

  onTimeoutFinish = () => {
    const savedDataExists = this.props.accounts.saved === true;
    // go to accs or tuts
    this.props.navigation.navigate(savedDataExists ? 'Accounts' : 'Tutorial');
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={logo_face} />
        <Image style={styles.logo} source={logo_text} />
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
    paddingTop: 122,
    paddingBottom: 22,
    backgroundColor: '$cPaper',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 85,
    height: 20,
  },
});
