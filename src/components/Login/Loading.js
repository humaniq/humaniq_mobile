import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
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

    if (savedDataExists) {
      // go to accs
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Accounts' }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      // go to tuts
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Tutorial' }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    }
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
    borderWidth: 8,
    borderColor: 'tomato',
  },
  logo: {
    width: 85,
    height: 20,
  },
});
