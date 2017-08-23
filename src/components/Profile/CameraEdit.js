import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  TouchableWithoutFeedback,
  Animated,
  ToastAndroid,
  StatusBar,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';
import { NavigationActions } from 'react-navigation';
import Animation from 'lottie-react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';
import { validate } from '../../actions';
import { HumaniqPhotoValidation } from 'react-native-android-library-humaniq-api';
import * as actions from '../../actions/index';

import CustomStyleSheet from '../../utils/customStylesheet';
import Modal from '../Shared/Components/Modal';

const close = require('../../assets/icons/close_dark.png');
const repeat = require('../../assets/icons/repeat.png');
const confirm = require('../../assets/icons/ic_confirm_dark.png');

const emojiHappy = require('../../assets/icons/emojiHappy.png');
const disgustEmoji = require('../../assets/icons/disgustEmoji.png');
const neutralEmoji = require('../../assets/icons/neutralEmoji.png');
const sadEmoji = require('../../assets/icons/sadEmoji.png');
const angryEmoji = require('../../assets/icons/angryEmoji.png');
const fearEmoji = require('../../assets/icons/fearEmoji.png');
const surpriseEmoji = require('../../assets/icons/surpriseEmoji.png');

const whiteMask = require('../../assets/icons/white_mask.png');
const emergeAnimation = require('../../assets/animations/emerge.json');
const pressAnimation = require('../../assets/animations/press.json');
const scaleAnimation = require('../../assets/animations/scale.json');
const doneAnimation = require('../../assets/animations/done.json');

export class CameraEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      path: '',
      base64: '',
      count: 1,
      facialImageId: '',
      facialImageValidation: '',
      error: false,
      errorCode: null,
      progress: new Animated.Value(0),
      animation: pressAnimation,
      requiredEmotions: [],
      isButtonVisible: true,
      emoji: emojiHappy,
      emojiAnimation: new Animated.Value(0),
      capturing: false,
      lastPath: '',
    };
  }

  componentWillMount() {
  }

  animateEmoji = (callback) => {
    Animated.timing(this.state.emojiAnimation, {
      toValue: 1,
      duration: 2000,
    }).start(callback);
  };

  replayEmoji = () => {
    this.setState({ isButtonVisible: false });
    this.state.emojiAnimation.setValue(0);
    this.animateEmoji(() => {
      this.setState({ isButtonVisible: true, animation: emergeAnimation });
      this.animate(1000, 0, 1, () => {
        this.state.progress.setValue(0);
        this.setState({ animation: pressAnimation });
      });
    });
  };

  handleCameraClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  };

  handleImageCapture = () => {
    console.log('handleImageCapture::');
    if (!this.state.path && !this.state.capturing) {
      this.setState({ capturing: true });
      this.camera.capture({ jpegQuality: 60 })
          .then((data) => {
            this.setState({ capturing: false, path: data.path });
            this.handleImageUpload(data.path);
            this.setState({ animation: scaleAnimation });
            this.state.progress.setValue(0);
            Animated.sequence([
              Animated.timing(this.state.progress, {
                toValue: 1,
                duration: 1500,
              }),
              Animated.timing(this.state.progress, {
                toValue: 4,
                duration: 10000,
              }),
            ]).start();
          })
          .catch((err) => {
            this.setState({ capturing: false });
            console.log('error during image capture', err);
          });
    }
  };

  handleImageDelete = () => {
    this.state.progress.setValue(0);
    this.setState({ path: '', animation: pressAnimation });
  };

  animate = (time, fr = 0, to = 1, callback) => {
    console.log('press in');
    this.state.progress.setValue(fr);
    const animationref = Animated.timing(this.state.progress, {
      toValue: to,
      duration: time,
    }).start(callback);
    this.setState({ animationref });
  }

  handleImageUpload = (path) => {
    console.log('handleImageUpload::');
    RNFetchBlob.fs.readFile(path, 'base64')
      .then((base64) => {
        this.checkIsRegistered(base64);
      })
      .catch((err) => { console.log(err.message); });
  };

  renderCamera() {
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.camera}
        aspect={Camera.constants.Aspect.fill}
        captureQuality={Camera.constants.CaptureQuality.preview}
        type={Camera.constants.Type.front}
        // captureTarget={Camera.constants.CaptureTarget.memory}
      />
    );
  }

  renderImage() {
    return (
      <Image
        // resizeMode={'center'}
        source={{ uri: this.state.path }}
        style={styles.camera}
      />
    );
  }

  handleDismissModal = () => {
    this.state.progress.stopAnimation();
    this.setState({ error: false, errorCode: null, animation: pressAnimation });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Modal
          onPress={this.handleDismissModal}
          code={this.state.errorCode}
          visible={this.state.error}
        />
        <View style={styles.cameraImageContainer}>
          {this.state.path ? this.renderImage() : this.renderCamera() }
        </View>
        <View style={styles.maskLayer}>
          <Image source={whiteMask} style={styles.maskImageStyle} />
        </View>
        <View style={styles.buttonsLayer}>
          <View style={styles.navbar}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={this.state.path ? this.handleImageDelete : this.handleCameraClose}
            >
              <Image source={close} />
            </TouchableOpacity>
          </View>
          {
              this.state.isButtonVisible ? <View /> :
              <Animated.Image
                source={this.state.emoji}
                style={[styles.emojiImage, {
                  transform: [{ scale: this.state.emojiAnimation }],
                  opacity: this.state.emojiAnimation,
                }]}
              />}
          <View style={styles.captureContainer}>
            {
              this.state.isButtonVisible ? <TouchableWithoutFeedback
                activeOpacity={1}
                style={[styles.captureBtn, this.state.path && styles.uploadBtn]}
                onPress={this.handleImageCapture}
                onPressIn={() => !this.state.path && this.animate(200, 0, 0.7)}
                onPressOut={() => !this.state.path && this.animate(200, 0.7, 0)}
              >
                {
                  <Animation
                    style={styles.animationStyle}
                    source={this.state.animation}
                    progress={this.state.progress}
                  />
                }
              </TouchableWithoutFeedback> : null
            }
            {
                  this.state.count === 2 && this.state.isButtonVisible ?
                    <TouchableOpacity style={styles.repeat} onPress={this.replayEmoji}>
                      <Image source={repeat} />
                    </TouchableOpacity> : <View />
              }
          </View>
        </View>
      </View>
    );
  }

  createValidation(resp) {
    console.log('create Validation::');
    const { path } = this.state;
    console.warn(path);
    // returns emotions
    HumaniqPhotoValidation.createValidation(resp.facial_image_id)
      .then((resp2) => {
        console.log('create Validation Success::', resp2);
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
        this.setState({ animation: doneAnimation });
        this.animate(1000, 0, 1, () => {
          this.setState({
            lastPath: path,
            isButtonVisible: false,
            count: 2,
            facialImageValidation: resp2.facial_image_validation_id,
            emoji: this.getEmoji(resp2.required_emotions[0].emotion),
          });
          this.handleImageDelete();
          // After state is updated, need to animate emoji there
          setTimeout(() => { this.replayEmoji(); }, 1000);
        });
      })
      .catch((err) => {
        console.log('create Validation Error::', err);
        this.setState({ animation: doneAnimation });
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
      });
  }

  validate(base64) {
    HumaniqPhotoValidation.validate(this.state.facialImageValidation, base64)
      .then((response) => {
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
        if (response.code === 3008) {
          this.setState({ animation: doneAnimation });
          this.animate(1000, 0, 1, () => {
            ToastAndroid.show(response.message, ToastAndroid.LONG);
            this.props.setLocalPath(this.state.lastPath);
            this.handleCameraClose();
          });
        } else {
          console.warn(JSON.stringify(response));
          this.setState({ error: true, errorCode: response.code });
          this.handleImageDelete();
          ToastAndroid.show('Try again', ToastAndroid.LONG);
        }
      })
      .catch((err) => {
        console.warn(JSON.stringify(err));
      });
  }

  checkIsRegistered(base64) {
    console.log('checkIsRegistered::');
    if (this.state.count === 1) {
      HumaniqPhotoValidation.isRegistered(base64)
        .then((resp) => {
          console.log('isRegistered Success::', resp);
          if (resp && resp.code === 400) {
            // error
            this.setState({ error: true, errorCode: 3001 });
            this.handleImageDelete();
          } else {
            this.setState({ facialImageId: resp.facial_image_id });
            this.createValidation(resp);
          }
        })
        .catch((err) => {
          console.log('isRegistered Error::', err);
          this.state.progress.stopAnimation();
          this.state.progress.setValue(0);
          this.handleImageDelete();
          ToastAndroid.show('Try again', ToastAndroid.LONG);
          this.setState({ error: true, errorCode: 3001 });
        });
    } else if (this.state.count === 2) {
      this.validate(base64);
    }
  }

  getEmoji(emoji) {
    switch (emoji) {
      case 'happy':
        return emojiHappy;
        break;
      case 'neutral':
        return neutralEmoji;
        break;
      case 'surprise':
        return surpriseEmoji;
        break;
      case 'fear':
        return fearEmoji;
        break;
      case 'disgust':
        return disgustEmoji;
        break;
      case 'angry':
        return angryEmoji;
        break;
      case 'sad':
        return sadEmoji;
        break;
      default:
        return emojiHappy;
        break;
    }
  }
}

export default connect(
    state => ({
      user: state.user,
      photo: state.user.tempPhoto || '',
    }),
    dispatch => ({
      validate: validate.request,
      setLocalPath: path => dispatch(actions.setTempLocalPath(path)),
    }),
)(CameraEdit);


const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  maskLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  maskImageStyle: {
    height: 660,
    width: 360,
  },
  buttonsLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  navbar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  camera: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  cameraImageContainer: {
    flex: 1,
    marginTop: 56,
    marginBottom: 224,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  previewImage: {
    height: 640,
    width: 360,
  },
  captureContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 224,
    paddingBottom: 29.5,
  },
  captureBtn: {
    width: 79,
    height: 79,
    alignSelf: 'center',
  },
  uploadBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeat: {
    position: 'absolute',
    right: 68,
    bottom: 68,
    alignSelf: 'center',
  },
  closeBtn: {
    marginTop: 16,
    marginRight: 16,
  },
  animationStyle: {
    width: 100,
    height: 100,
  },
  emojiImage: {
    alignSelf: 'center',
  },
});
