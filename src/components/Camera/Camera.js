import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Camera from 'react-native-camera';
import _ from 'underscore';
import { NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { validate, setAvatarLocalPath } from '../../actions';

// console.log('action types🔑', ActionTypes.setAvatarLocalPath());

import CustomStyleSheet from '../../utils/customStylesheet';

// assets
const close = require('../../assets/icons/ic_close.png');
const confirm = require('../../assets/icons/ic_confirm_dark.png');

console.log('validate', validate);

/*
  on second run check permissions http://facebook.github.io/react-native/docs/permissionsandroid.html
  before: https://github.com/lwansbrough/react-native-camera/issues/224
  cache user image
 */

export class Cam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      path: '',
      base64: '',
      count: 1,
    };
  }

  componentWillMount() {
    // console.log('props camera', this.props);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    if (nextProps.user.validate.payload) {
      const code = nextProps.user.validate.payload.code;
      const photo = nextProps.user.photo;

      if (code === 6000) {
        alert(nextProps.user.validate.payload.message);
      } else if (code === 3002 && !photo) {
        // registered user
        this.props.setAvatarLocalPath(this.state.path);
        this.props.navigation.navigate('Password');
      } else if (code === 3003 && !photo) {
        // new user
        this.props.setAvatarLocalPath(this.state.path);
        this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
      } else if (code === 3000) {
        this.setState({ path: '' });
        alert(nextProps.user.validate.payload.message);
        // reset payload?
      } else {
        alert('Unknown code, no info in Postman');
      }
    }
  }

  handleCameraClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  };

  handleImageCapture = () => {
    this.camera.capture()
      .then((data) => {
        this.setState({ path: data.path });
        this.convertToBase64(data.path);
      })
      .catch((err) => { console.error('error during image capture', err); });
  };

  handleImageDelete = () => {
    this.setState({ path: '' });
  };

  // TODO: вынести
  convertToBase64 = (path) => {
    RNFetchBlob.fs.readFile(path, 'base64')
      .then((data) => {
        this.setState({ base64: data });
      })
      .catch((err) => { console.log(err.message); });
  };

  handleImageUpload = () => {
    this.props.validate(this.state.base64);
    // this.props.checkUserRegStatus(this.state.base64);
    // console.log('this.props.validate', this.props);
  };

  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.camera}
        aspect={Camera.constants.Aspect.fill}
        captureQuality={Camera.constants.CaptureQuality.low}
        // type={Camera.constants.Type.front}
        captureTarget={Camera.constants.CaptureTarget.disk}
        // captureTarget={Camera.constants.CaptureTarget.memory}
      />
    );
  }

  renderImage() {
    return (
      <Image
        // resizeMode={'center'}
        source={{ uri: this.state.path }}
        style={styles.previewImage}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={this.state.path ? this.handleImageDelete : this.handleCameraClose}
          >
            <Image source={close} />
          </TouchableOpacity>
        </View>
        <View style={{ borderWidth: 5, flex: 1, borderColor: 'tomato' }}>
          {this.state.path ? this.renderImage() : this.renderCamera()}
        </View>
        <View style={styles.captureContainer}>
          {this.props.user.validate.isFetching ? <Text>Uploading</Text> :
          <TouchableOpacity
            style={[styles.captureBtn, this.state.path && styles.uploadBtn]}
            onPress={this.state.path ? this.handleImageUpload : this.handleImageCapture}
          >
            {this.state.path ? <Image source={confirm} /> : null}
          </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  validate: validate.request,
  setAvatarLocalPath,
})(Cam);

const styles = CustomStyleSheet({
  container: {
    flex: 1,
  },
  navbar: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
  },
  captureContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  captureBtn: {
    round: 50,
    borderRadius: 55,
    borderWidth: 5,
  },
  uploadBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 10,
  },
});
