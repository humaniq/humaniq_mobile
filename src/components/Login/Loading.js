import React, { Component } from 'react';
import {
  View,
  Image,
  StatusBar,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomStyleSheet from '../../utils/customStylesheet';

const logo_face = require('../../assets/icons/logo_face.png');
const logo_text = require('../../assets/icons/logo_text.png');

class Loading extends Component {
  static propTypes = {
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
    console.log(this.props.accounts.primaryAccount);
    this.props.navigation.navigate(this.props.accounts.primaryAccount != null ? 'Accounts' : 'Tutorial');
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden/>
        <Image source={logo_face} />
        <Image style={styles.logo} source={logo_text} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts
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
