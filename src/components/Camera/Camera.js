import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import Camera from 'react-native-camera';
import { NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../actions';

import {readFromStorage} from '../../utils/testutils';

import CustomStyleSheet from '../../utils/customStylesheet';

// assets
const close = require('../../assets/icons/ic_close.png');
const confirm = require('../../assets/icons/ic_confirm_dark.png');

const photo = 'file:///storage/emulated/0/DCIM/Camera/IMG_20170629_161313.jpg';

/*
  on second run check permissions http://facebook.github.io/react-native/docs/permissionsandroid.html
  before: https://github.com/lwansbrough/react-native-camera/issues/224
  cache user image
 */

class Cam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imagePath: '',
      imageB64: '',
      count: 0,
    };
  }

  handleCameraClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  };

  handleImageCapture = () => {
    if (this.state.count == 0) {
      this.setState({ imagePath: 'faces/S1/1.jpg', count: 1 });
    } else {
      this.setState({ imagePath: 'faces/S1/1.jpg' });
    }
    
    /*this.camera
      .capture()
      .then((data) => {
        this.setState({ imagePath: data.path });
      })
      .catch((err) => {
        console.error('error during image capture', err);
      });*/
  };

  handleImageDelete = () => {
    this.setState({ imagePath: '' });
  };

  handleImageUpload = () => {
    this.setState({ uploading: true });
    // TODO: reset navigation stack to prevent back action on android!!
    readFromStorage(this.state.imagePath)
      .then((res) => {
        this.setState({ imageB64: res });
        this.handleIsRegisteredCheck(res);
      })
      .catch((err) => {
        err => console.log('error converting image to base64', err)
      });
  };

  handleIsRegisteredCheck = (image) => {
    RNFetchBlob.fetch(
      'POST',
      'https://beta-api.humaniq.co/tapatybe/api/v1/registered',
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        facial_image: image,
      }),
    )
      .then(resp => resp.json())
      .then((resp) => {
        this.setState({ uploading: false });
        // update codes after registration will be uploaded
        if (resp.code === 40000) {
          this.handleUploadError();
        } else if (resp.code === 40400) {
          this.createRegistration();
        } else {
          this.authenticate();
        }
      })
      .catch((err) => {
        this.setState({ uploading: false });
        alert('network error');
        // console.log('err');
      });
  };

  createRegistration = () => {
    this.props.updateUserRegStatus(false);
    this.props.setAvatarPath({
      localPath: this.state.imagePath,
      b64: this.state.imageB64,
    });
    this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
  };

  authenticate = () => {
    this.props.updateUserRegStatus(true);
    this.props.setAvatarPath({
      localPath: this.state.imagePath,
      b64: this.state.imageB64,
    });
    this.props.navigation.navigate('Password');
  };

  handleUploadError = () => {
    this.setState({ imagePath: null });
    alert('Face not found');
  };

  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        } }
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
        source={{ uri: this.state.imagePath }}
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
            onPress={this.state.imagePath ? this.handleImageDelete : this.handleCameraClose}
            >
            <Image source={close} />
          </TouchableOpacity>
        </View>
        <View style={{ borderWidth: 5, flex: 1, borderColor: 'tomato' }}>
          {this.state.imagePath ? this.renderImage() : this.renderCamera() }
        </View>
        <View style={styles.captureContainer}>
          {this.state.uploading
            ? <Text>Uploading</Text>
            : <TouchableOpacity
              style={[styles.captureBtn, this.state.imagePath && styles.uploadBtn]}
              onPress={this.state.imagePath ? this.handleImageUpload : this.handleImageCapture}
              >
              {this.state.imagePath ? <Image source={confirm} /> : null}
            </TouchableOpacity>}
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(ActionCreators, dispatch);

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(Cam);

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
