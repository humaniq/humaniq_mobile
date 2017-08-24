import React, { Component, PropTypes } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StatusBar,
  ToolbarAndroid,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';
import CustomStyleSheet from '../../utils/customStylesheet';

import * as actions from '../../actions/index';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';
import RNFetchBlob from 'react-native-fetch-blob';

const TOOLBAR_HEIGHT = 56;
const ic_close = require('../../assets/icons/ic_close_white.png');
const ic_done_white = require('../../assets/icons/ic_white.png');
const ic_photo = require('../../assets/icons/ic_photo_white.png');
const ic_photo_holder = require('../../assets/icons/ic_mock.png');

export class ProfileEdit extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };
  constructor(props) {
    super(props);
    const { user } = this.props.navigation.state.params;
    const { primaryAccount } = this.props;
    let name,
      lastName;
    if (primaryAccount.person) {
      name = primaryAccount.person.first_name;
      lastName = primaryAccount.person.last_name;
    }
    this.state = {
      user,
      name: name || '',
      surname: lastName || '',
      fieldChanged: false,
      localPath: '',
      uploading: false,
      count: 0,
    };
  }

  render() {
    const { user } = this.state;
    const { primaryAccount } = this.props
    const name = primaryAccount.person
        ? `${primaryAccount.person.first_name} ${primaryAccount.person.last_name}`
        : '';
    const phone = primaryAccount.phone_number
        ? `+(${primaryAccount.phone_number.country_code}) ${primaryAccount.phone_number.phone_number}`
        : '';
    const userCreds = primaryAccount.person
        ? name
        : phone;

    const status = user.status === 1 ? 'online' : 'offline';
    const statusTextColor = user.status === 1 ? '#3AA3E4' : '#aaaaaa';
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          <StatusBar
            backgroundColor="#598FBA"
          />
          <View style={{
            height: 56,
            backgroundColor: '#598FBA',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
          />
          <ToolbarAndroid
            style={{
              height: 56,
              backgroundColor: '#598FBA',
              marginLeft: 5,
              marginRight: 5,
            }}
            onIconClicked={() => this.handleClose()}
            onActionSelected={position => this.onActionClick(position)}
            navIcon={ic_close}
            actions={[{ title: '', icon: ic_done_white, show: 'always' }]}
          />
          <View style={styles.content}>
            <View
              style={styles.avatarInfoContainer}
            >
              <TouchableOpacity onPress={() => this.onPhotoClick()}>
                <View style={styles.avatarContainer}>
                  <Image
                    style={styles.avatar}
                    source={this.props.photo
                            ? { uri: this.props.photo }
                            : primaryAccount.avatar ? { uri: primaryAccount.avatar.url } : ic_photo_holder}
                  />
                  <View style={[{
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                  }, styles.avatar]}
                  />

                  <Image
                    style={styles.photoHolder}
                    source={ic_photo}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{userCreds}</Text>
                <View style={styles.statusContainer}>
                  <Text style={[styles.statusText, { color: statusTextColor }]}>{status}</Text>
                  {this.getUserStatus(user)}
                </View>
              </View>
            </View>
            {/* render inputs */}
            {this.renderInputs()}
          </View>
        </ScrollView>
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
          ref="name"
          value={this.state.name}
          placeholder="First name"
          placeholderTextColor="#e0e0e0"
          onChangeText={text => this.setState({ name: text, fieldChanged: true })}
          style={[styles.input]}
          autoCapitalize="sentences"
        />
        <TextInput
          ref="surname"
          placeholder="Last name"
          placeholderTextColor="#e0e0e0"
          value={this.state.surname}
          onChangeText={text => this.setState({ surname: text, fieldChanged: true })}
          style={styles.input}
          autoCapitalize="sentences"
        />
      </View>
    );
  }

  getUserStatus(user) {
    switch (user.status) {
        // offline status
      case 0:
        return this.offlineView();
        // online status
      case 1:
        return this.onlineView();
        // by default online
      default:
        return this.onlineView();
    }
  }

  offlineView = () => (
    <View style={styles.offlineStatus} />
  );

  onlineView = () => (
    <View style={styles.onlineStatus} />
  );

  doneAction = () => {
    // make request
    if (this.props.photo !== '') {
      // upload avatar if temp path exists
      this.uploadAvatar();
    }
    if (this.state.fieldChanged) {
      // upload name and lastname if any field was changed
      this.uploadPerson();
    }
  };

  convertToBase64 = (path) => {
    const { primaryAccount } = this.props;
    RNFetchBlob.fs.readFile(path, 'base64')
        .then((data) => {
          HumaniqProfileApiLib.uploadProfileAvatar(primaryAccount.account_id, data)
              .then((resp) => {
                if (resp.code === 401) {
                  this.navigateTo('Accounts');
                } else if (resp.code === 5004) {
                  this.setState({ count: this.state.count += 1 });
                  ToastAndroid.show('Success', ToastAndroid.LONG);
                  this.props.saveAvatar({ url: resp.avatar.url });
                  if (this.state.count === 2) {
                    this.handleClose();
                  } else if (!this.state.fieldChanged) {
                    this.handleClose();
                  }
                } else if (resp.code === 3013) {
                    // do some stuff
                }
              })
              .catch((err) => {
              });
        })
        .catch((err) => {
          console.log(err.message);
    });
  };

  onPhotoClick = () => {
    // on photo click
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('CameraEdit', { ...navState.params, user: this.state.user });
  };

  navigateTo = (screen, params) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screen, params })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  uploadPerson() {
    const { primaryAccount } = this.props;
    HumaniqProfileApiLib.updateUserPerson(
        primaryAccount.account_id, this.state.name, this.state.surname,
    )
        .then((resp) => {
          if (resp.code === 401) {
            this.navigateTo('Accounts');
          } else {
            this.setState({ count: this.state.count += 1 });
            this.props.saveNames({
              first_name: resp.payload.person.first_name,
              last_name: resp.payload.person.last_name,
            });
            this.setState({ fieldChanged: false });
            ToastAndroid.show('Success', ToastAndroid.LONG);
            if (this.state.count === 2) {
              this.handleClose();
            } else if (!this.props.photo) {
              this.handleClose();
            }
          }
        })
        .catch((err) => {
        });
  }

  uploadAvatar() {
    this.convertToBase64(this.props.photo);
  }

  componentWillUnmount() {
    this.props.setLocalPath('');
  }
}

const styles = StyleSheet.create({
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
    height: 68,
    width: 68,
    borderRadius: 68,
  },
  infoContainer: { marginLeft: 13, marginRight: 13 },
  title: {
    color: '#212121',
    fontSize: 23,
    marginRight: 13,
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
    height: 40,
    width: 40,
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
      primaryAccount: state.accounts.primaryAccount,
      photo: state.user.tempPhoto,
      accounts: state.accounts,
    }),
    dispatch => ({
      setLocalPath: path => dispatch(actions.setTempLocalPath(path)),
      saveAvatar: avatar => dispatch(actions.saveAvatar(avatar)),
      saveNames: names => dispatch(actions.saveNames(names)),
      addPrimaryAccount: account => dispatch(actions.addPrimaryAccount(account)),
    }),
)(ProfileEdit);
