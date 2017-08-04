import React, { Component, PropTypes } from 'react';
import {
  View,
  StatusBar,
  ToolbarAndroid,
  TextInput,
  StyleSheet,
} from 'react-native';

import * as actions from '../../actions/index';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';
import CustomStyleSheet from '../../utils/customStylesheet';

const ic_close = require('../../assets/icons/ic_close_white.png');
const ic_done_white = require('../../assets/icons/ic_white.png');
const ic_photo = require('../../assets/icons/ic_photo_white.png');

export class ProfileEditPassword extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };
  constructor(props) {
    super(props);
    this.state = {
      fieldChanged: false,
      old_password: '',
      new_password: '',
    };
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <StatusBar
          backgroundColor="#598FBA"
        />
        <ToolbarAndroid
          style={styles.toolbar}
          onIconClicked={() => this.handleClose()}
          onActionSelected={position => this.onActionClick(position)}
          navIcon={ic_close}
          actions={[{ title: '', icon: ic_done_white, show: 'always' }]}
        />
        <View style={styles.content}>
          {/* render inputs */}
          {this.renderInputs()}
        </View>
      </View>
    );
  }

  handleClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  }

  onActionClick = (position) => {
    switch (position) {
      case 0:
        return this.doneAction();
    }
  };

  renderInputs() {
    return (
      <View style={{ marginTop: 20 }}>
        <TextInput
          keyboardType="numeric"
          placeholder="Old password"
          placeholderTextColor="#e0e0e0"
          value={this.state.old_password}
          onChangeText={text => this.setState({ old_password: text, fieldChanged: true })}
          style={styles.input}
        />
        <TextInput
          keyboardType="numeric"
          placeholder="New password"
          placeholderTextColor="#e0e0e0"
          value={this.state.new_password}
          onChangeText={text => this.setState({ new_password: text, fieldChanged: true })}
          style={styles.input}
        />
      </View>
    );
  }

  doneAction = () => {
    // make request
    if (this.state.fieldChanged) {
      // do your stuff here
      HumaniqProfileApiLib.changeProfilePassword(
            this.props.profile.account_id,
            this.state.old_password,
            this.state.new_password,
          ).then((resp) => {
            console.warn(JSON.stringify(resp));
          })
           .catch((err) => {
             console.warn(JSON.stringify(err));
           });
    }
  };
}

const styles = CustomStyleSheet({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  offlineStatus: {
    borderColor: '#999999',
    width: 10,
    height: 10,
    borderRadius: 40,
    marginLeft: 5,
    marginTop: 4,
    borderWidth: 2,
  },
  onlineStatus: {
    backgroundColor: '#7ed321',
    width: 10,
    height: 10,
    borderRadius: 40,
    marginLeft: 5,
    marginTop: 4,
  },
  avatarInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  avatar: {
    height: 65,
    width: 65,
    borderRadius: 65,
  },
  infoContainer: { marginLeft: 13 },
  title: {
    color: '#212121',
    fontSize: 23,
  },
  closeButton: {
    marginLeft: 20,
  },
  editButton: {
    marginRight: 20,
  },
  firstSection: {
    backgroundColor: '#fff',
  },
  secondSection: {
    backgroundColor: '#fff',
    marginTop: 20,
  },
  divider: {
    backgroundColor: '#e0e0e0',
    height: 0.5,
    flex: 1,
  },
  input: {
    fontSize: 20,
    color: '#212121',
    paddingBottom: 20,
    paddingTop: 15,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#598FBA',
  },
  content: {
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoHolder: {
    position: 'absolute',
    height: 34,
    width: 34,
  },
  statusText: {
    fontSize: 16.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default connect(
    state => ({
      user: state.user,
      profile: state.user.profile || {},
    }),
    dispatch => ({
      setProfile: profile => dispatch(actions.setProfile(profile)),
    }),
)(ProfileEditPassword);
