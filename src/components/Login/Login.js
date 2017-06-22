import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import CustomStyleSheet from '../../utils/customStylesheet';

class Login extends Component {
  componentDidMount() {
    this.props.initApp();
  }

  componentWillReceiveProps(newProps) {
    console.log('new props Login', newProps.init)
  }

  static navigationOptions = {
    // header: null,
  };

  handleOpenChat = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Chat',
          params: {
            signUp: true,
          },
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Login</Text>
        <TouchableOpacity onPress={this.handleOpenChat} style={styles.btn}>
          <Text>START</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => (bindActionCreators(ActionCreators, dispatch));
const mapStateToProps = state => ({
  init: state.init,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = CustomStyleSheet({
  test: {
    width: 100,
    height: 100,
  },
  container: {
    flex: 1,
    paddingTop: 300,
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 50,
  },
  btn: {
    width: 250,
    height: 50,
    margin: 10,
    backgroundColor: '$cGray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
