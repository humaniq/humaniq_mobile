import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StatusBar,
  Animated,
  ToolbarAndroid,
  StyleSheet,
  TouchableNativeFeedback,
  Alert,
  Clipboard,
  ToastAndroid,
} from 'react-native';

import PropTypes from 'prop-types';
import { HumaniqBlockchainApiLib, HumaniqProfileApiLib } from 'react-native-android-library-humaniq-api';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import * as constants from './utils/constants';
import QrModal from './modals/QrModal';
import { secureText } from '../../utils/units';
import Fab from './shared/Fab';

const HEADER_MAX_HEIGHT = 160;
const DELTA = 20;
const TOOLBAR_HEIGHT = 56;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - TOOLBAR_HEIGHT;

const ic_person_blue = require('../../assets/icons/ic_person_blue.png');
const ic_exit_red = require('../../assets/icons/ic_exit_red.png');
const ic_fab = require('../../assets/icons/ic_fab_qr.png');
const ic_close = require('../../assets/icons/ic_close_white.png');
const ic_info = require('../../assets/icons/ic_info_dark.png');
const ic_edit = require('../../assets/icons/ic_edit_white.png');
const ic_phone = require('../../assets/icons/ic_call_dark.png');
const ic_editBlue = require('../../assets/icons/ic_edit_blue.png');
const ic_lock = require('../../assets/icons/ic_pass_dark.png');
const ic_photo_holder = require('../../assets/icons/ic_mock.png');

export class ProfileSettings extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
    user: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    // TODO get user from props (redux)
    const { user } = this.props.navigation.state.params;
    this.state = {
      scrollY: new Animated.Value(0),
      modalVisibility: false,
      user,
      wallet: {},
    };
  }

  componentDidMount() {
    this.getWalletAddress();
  }

  renderScrollViewContent() {
    return (
      <View style={styles.scrollViewContent}>
        {this.renderFirstSection()}
        {this.renderSecondSection()}
        <View style={[styles.divider, { height: 1 }]} />
      </View>
    );
  }

  // animation in order to make collapse effects
  getAnimationType = (type) => {
    switch (type) {
      case constants.HEADER_TRANSLATE:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [0, -HEADER_SCROLL_DISTANCE],
          extrapolate: 'clamp',
        });
      case constants.HEADER_TRANSLATE2:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [0, HEADER_SCROLL_DISTANCE],
          extrapolate: 'clamp',
        });
      case constants.VIEW_TRANSLATE:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [1, 0.7],
          extrapolate: 'clamp',
        });
      case constants.VIEWY_TRANSLATE:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE],
          outputRange: [0, DELTA + (0.7 * DELTA)],
          extrapolate: 'clamp',
        });
      case constants.IMAGE_OPACITY:
        return this.state.scrollY.interpolate({
          inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        });
      default:
        return '';
    }
  };

  renderContent = () => (
    <Animated.ScrollView
      scrollEventThrottle={15}
      onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
          )}
    >
      {this.renderScrollViewContent()}
    </Animated.ScrollView>
  );

  render() {
    const { user } = this.state;
    const { profile, primaryAccount } = this.props;
    const status = user.status === 1 ? 'online' : 'offline';
    return (
      <View style={styles.mainContainer}>
        {/* render status bar */}
        <StatusBar
          backgroundColor="#598FBA"
        />
        {/* render scroll content */}
        {this.renderContent()}
        {/* render collapse view */}
        <Animated.View
          style={[styles.collapseContainer, {
            transform: [{ translateY: this.getAnimationType(constants.HEADER_TRANSLATE) }] }]}
        >
          <Animated.View
            style={[styles.bar, {
              transform: [
                    { scale: this.getAnimationType(constants.VIEW_TRANSLATE) },
                    { translateY: this.getAnimationType(constants.VIEWY_TRANSLATE) }] }]}
          >
            <Animated.View
              style={styles.avatarInfoContainer}
            >
              <Animated.Image
                style={styles.avatar}
                source={primaryAccount.avatar ? { uri: primaryAccount.avatar.url } : ic_photo_holder}
              />
              <Animated.View style={styles.infoContainer}>
                <Text style={styles.title}>{this.showPhoneIfExist(primaryAccount, false)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.statusText}>{status}</Text>
                  {this.getUserStatus(user)}
                </View>
              </Animated.View>
            </Animated.View>
          </Animated.View>
          {/* render toolbar */}
          <Animated.View style={[{
            transform: [{ translateY: this.getAnimationType(constants.HEADER_TRANSLATE2) }] }]}
          >
            <ToolbarAndroid
              onActionSelected={position => this.onActionClick(position)}
              style={{
                height: TOOLBAR_HEIGHT,
                backgroundColor: 'transparent',
                marginLeft: 5,
                marginRight: 5,
              }}
              onIconClicked={() => this.handleClose()}
              navIcon={ic_close}
              actions={[{ title: '', icon: ic_edit, show: 'always' }]}
            />
          </Animated.View>
        </Animated.View>
        {/* render fab button */}
        {this.renderFabButton()}
        {this.state.modalVisibility ? this.showQrModal() : null}
      </View>
    );
  }

  showPhoneIfExist(user, showPhone) {
    const name = user.person
        ? `${user.person.first_name} ${user.person.last_name}`
        : '';
    const phone = user.phone_number
        ? `+(${user.phone_number.country_code}) ${user.phone_number.phone_number}`
        : '';

    if (showPhone && user.phone_number && user.phone_number.phone_number) {
      return phone;
    }
    return name;
  }

  renderFabButton = () => (
    <Fab
      onClick={() => this.onFabButtonPress()}
      source={ic_fab}
      scroll={this.state.scrollY}
      opacity={this.getAnimationType(constants.IMAGE_OPACITY)}
    />
  );

  handleClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  }

  editHandle() {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('ProfileEdit', { ...navState.params, user: this.state.user });
  }

  onActionClick = (position) => {
    switch (position) {
      case 0:
        return this.editHandle();
    }
  }

  renderFirstSection() {
    const { user } = this.state;
    const { profile, primaryAccount } = this.props;
    return (
      <View style={styles.firstSection}>
        <View style={styles.firstSubSection}>
          <Image
            source={ic_info}
            style={styles.info}
          />
          <View style={styles.phoneContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.phoneText}>
                {this.showPhoneIfExist(primaryAccount, true)}
              </Text>
              <Image
                source={primaryAccount.phone_number && primaryAccount.phone_number.phone_number ? ic_phone : ic_lock}
                style={styles.phoneImage}
              />
            </View>
            {/* <TouchableOpacity onPress={() => this.onPhoneEditPress()}> */}
            {/* <Image */}
            {/* source={ic_editBlue} */}
            {/* style={styles.editImage} */}
            {/* /> */}
            {/* </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.secondSubSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.passwordText}>
              {secureText(this.props.password.length)}
            </Text>
            <Image
              source={ic_lock}
              style={styles.lockImage}
            />
          </View>
          <TouchableOpacity onPress={() => this.onPasswordEditPress()}>
            <Image
              source={ic_editBlue}
              style={styles.editImage}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.divider, { height: 1 }]} />
      </View>
    );
  }

  renderSecondSection() {
    return (
      <View style={styles.secondSection}>
        <View style={[styles.divider, { height: 1 }]} />
        <View>
          <View>
            <View style={styles.personContainer}>
              <Image
                source={ic_person_blue}
                style={styles.profileImage}
              />
            </View>
          </View>
          <TouchableNativeFeedback
            delayPressIn={5}
            onPress={() => this.onLogoutPress()}
          >
            <View style={styles.logoutContainer}>
              <Image
                source={ic_exit_red}
                style={styles.logoutImage}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
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

  onPhoneEditPress = () => {
    this.editHandle();
  };

  onPasswordEditPress = () => {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate('PasswordEdit', { ...navState.params });
  };

  onLogoutPress = () => {
    Alert.alert(null, 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => {
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.logOutUser();
        },
      },
    ]);
  };

  onFabButtonPress = () => {
    this.setState({
      modalVisibility: true,
    });
  };

  onClipboardClick = () => {
    Clipboard.setString(this.state.wallet.address);
    this.setState({
      modalVisibility: false,
    });
    ToastAndroid.show('Copied to clipboard', ToastAndroid.LONG);
  };

  logOutUser = () => {
    // deauthenticate user
    HumaniqProfileApiLib.deauthenticateUser(this.props.primaryAccount.account_id)
        .then((response) => {
          // log out
          console.log(response);
          if (response.code === 200) {
            this.navigateTo('Accounts');
          }
        })
        .catch((err) => {
          // handle error
        });
  }

  navigateTo = (screen, params) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screen, params })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  showQrModal() {
    return (
      <QrModal
        onCancelClick={() => { this.setState({ modalVisibility: false }); }}
        wallet={this.state.wallet}
        onClipboardClick={() => this.onClipboardClick()}
        visibility={this.state.modalVisibility}
        profile={this.props.primaryAccount}
      />
    );
  }

  getWalletAddress() {
    console.log('getting wallet address::');
    HumaniqBlockchainApiLib.getUserAddressState(this.props.primaryAccount.account_id)
        .then((response) => {
          console.log('wallet address::>>', response);
          this.setState({ wallet: response });
        })
        .catch((err) => {
          // handle error
          console.log('err::>>', err);
          this.setState({ wallet: { address: '' } });
        });
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
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
  collapseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#598fba',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  avatarInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 60,
  },
  infoContainer: { marginLeft: 13 },
  bar: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: DELTA,
  },
  title: {
    color: 'white',
    fontSize: 21,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    backgroundColor: '#F0F0F0',
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
  firstSubSection: {
    marginTop: 34.5,
    marginLeft: 16.5,
  },
  secondSubSection: {
    flexDirection: 'row',
    marginLeft: 16.5,
    marginRight: 13,
    alignItems: 'center',
  },
  secondSection: {
    backgroundColor: '#fff',
    marginTop: 14,
  },
  divider: {
    backgroundColor: '#e0e0e0',
    height: 0.5,
    flex: 1,
  },
  toolbar: {
    height: TOOLBAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  info: {
    width: 14,
    height: 14,
    marginBottom: 5.5,
  },
  phoneContainer: {
    flexDirection: 'row',
    marginRight: 13,
    alignItems: 'center',
  },
  phoneText: {
    marginTop: 11,
    marginBottom: 11.5,
    fontSize: 17.5,
    color: '#1b1d1d',
  },
  phoneImage: {
    width: 14,
    height: 14,
    marginBottom: 16,
  },
  editImage: {
    width: 20,
    height: 20,
  },
  passwordText: {
    marginTop: 11,
    marginBottom: 11.5,
    fontSize: 17.5,
    color: '#1b1d1d',
  },
  lockImage: {
    width: 14,
    height: 14,
    marginBottom: 16,
  },
  profileImage: {
    width: 15,
    height: 15,
  },
  logoutImage: {
    width: 20,
    height: 20,
  },
  statusText: {
    fontSize: 16.5,
    color: '#DAE5EE',
  },
  personContainer: {
    paddingLeft: 16,
    paddingTop: 20,
    paddingBottom: 15,
  },
  logoutContainer: {
    paddingLeft: 16,
    paddingTop: 15,
    paddingBottom: 20,
  },
});

export default connect(
    state => ({
      user: state.user,
      password: state.user.password || '',
      primaryAccount: state.accounts.primaryAccount,
    }),
    dispatch => ({
      setProfile: profile => dispatch(actions.setProfile(profile)),
    }),
)(ProfileSettings);
