import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';
import Animation from 'lottie-react-native';
import { NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';
import { validate, setAvatarLocalPath, faceEmotionCreate, faceEmotionValidate, newTransaction } from '../../actions';

// console.log('action typesрџ”‘', ActionTypes.setAvatarLocalPath());

import CustomStyleSheet from '../../utils/customStylesheet';
import oncetrig from '../../utils/oncetrig';
import Modal from '../Shared/Components/Modal';

// assets

// eslint-disable-next-line import/no-unresolved
const close = require('../../assets/icons/close_dark.png');
const whiteMask = require('../../assets/icons/white_mask.png');
const repeat = require('../../assets/icons/repeat.png');
// eslint-disable-next-line import/no-unresolved

// Emoji assetss
const emojiHappy = require('../../assets/icons/emojiHappy.png');
const disgustEmoji = require('../../assets/icons/disgustEmoji.png');
const neutralEmoji = require('../../assets/icons/neutralEmoji.png');
const sadEmoji = require('../../assets/icons/sadEmoji.png');
const angryEmoji = require('../../assets/icons/angryEmoji.png');
const fearEmoji = require('../../assets/icons/fearEmoji.png');
const surpriseEmoji = require('../../assets/icons/surpriseEmoji.png');

// Button animations
const emergeAnimation = require('../../assets/animations/emerge.json');
const pressAnimation = require('../../assets/animations/press.json');
const scaleAnimation = require('../../assets/animations/scale.json');
const doneAnimation = require('../../assets/animations/done.json');


/*
  on second run check permissions http://facebook.github.io/react-native/docs/permissionsandroid.html
  before: https://github.com/lwansbrough/react-native-camera/issues/224
  cache user image
 */

export class Cam extends Component {
  static propTypes = {
    user: PropTypes.shape({
      validate: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      faceEmotionCreate: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      faceEmotionValidate: PropTypes.shape({
        payload: PropTypes.object,
        isFetching: PropTypes.bool,
      }).isRequired,
      photo: PropTypes.string,
    }).isRequired,

    setAvatarLocalPath: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    emotionCreate: PropTypes.func.isRequired,
    emotionValidate: PropTypes.func.isRequired,

    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      qr: '',
      path: '',
      capturing: false,
      error: false,
      errorCode: null,
      progress: new Animated.Value(0),
      animation: pressAnimation,
      emoji: emojiHappy,
      emojiAnimation: new Animated.Value(0),
      photoGoal: 'isRegistered',
      requiredEmotions: [],
      isButtonVisible: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    // console.log('📞 nextProps', nextProps.user.validate);
    this[`${this.state.photoGoal}ReceiveProps`](nextProps);
  }

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

  isRegisteredReceiveProps = (nextProps) => {
    if (nextProps.user.validate.payload && this.props.user.validate.isFetching && !nextProps.user.validate.isFetching) {
      const code = nextProps.user.validate.payload.code;

      switch (code) {
        case 3002:
          // registered user
          this.props.setAvatarLocalPath(this.state.path);
          this.state.progress.stopAnimation();
          this.state.progress.setValue(0);
          this.setState({ animation: doneAnimation });
          this.animate(1000, 0, 1, () => {
            this.setState({ animation: pressAnimation });
            this.navigateTo('Password');
          });
          break;

        case 3003:
          // new user
          if (nextProps.user.validate.payload.payload.facial_image_id) { // Emotions case
            this.setState({ photoGoal: 'createFacialRecognitionValidation' });
            this.props.emotionCreate({
              facial_image_id: nextProps.user.validate.payload.payload.facial_image_id,
            });
          } else {
            this.props.setAvatarLocalPath(this.state.path);
            this.state.progress.stopAnimation();
            this.state.progress.setValue(0);
            this.setState({ animation: doneAnimation });
            this.animate(1000, 0, 1, () => {
              this.setState({ animation: pressAnimation });
              this.navigateTo('Tutorial', { nextScene: 'Password' });
            });
          }

          break;
        default:
          this.setState({
            error: true,
            errorCode: code,
            path: '',
          });
          this.rollBackAnimation();
      }
    }
  };

  createFacialRecognitionValidationReceiveProps = (nextProps) => {
    if (
      nextProps.user.faceEmotionCreate.payload &&
      this.props.user.faceEmotionCreate.isFetching && !nextProps.user.faceEmotionCreate.isFetching
    ) {
      const code = nextProps.user.faceEmotionCreate.payload.code;
      console.log('createFacialRecognitionValidationReceiveProps', code);
      if (code === 3006) {
        this.props.setAvatarLocalPath(this.state.path);
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
        this.setState({ animation: doneAnimation });
        // Emotions received, need to animate them there
        this.animate(1000, 0, 1, () => {
          this.setState({
            path: '',
            photoGoal: 'validateFacialRecognitionValidation',
            requiredEmotions: nextProps.user.faceEmotionCreate.payload.payload.required_emotions,
            isButtonVisible: false,
            emoji: this.getEmoji(nextProps.user.faceEmotionCreate.payload.payload.required_emotions[0])
          });
          // After state is updated, need to animate emoji there
          setTimeout(() => { this.replayEmoji() }, 1000)
        });
      } else {
        this.setState({
          error: true,
          errorCode: code,
          path: '',
        });
        this.rollBackAnimation();
      }
    }
  };

  validateFacialRecognitionValidationReceiveProps = (nextProps) => {
    if (
      nextProps.user.faceEmotionValidate.payload &&
      this.props.user.faceEmotionValidate.isFetching && !nextProps.user.faceEmotionValidate.isFetching
    ) {
      this.state.progress.stopAnimation();
      this.state.progress.setValue(0);
      let code = 0;
      if (nextProps.user.faceEmotionValidate.payload.errors) {
        code = Number(nextProps.user.faceEmotionValidate.payload.errors[0].code);
      } else {
        code = nextProps.user.faceEmotionValidate.payload.code;
      }
      console.log('validateFacialRecognitionValidationReceiveProps', code);
      if (code === 3008) {
        // reduce emotions there
        this.setState({ animation: doneAnimation });
        this.animate(1000, 0, 1, () => {
          this.navigateTo('Tutorial', { nextScene: 'Password' });
        });
      } else {
        this.setState({
          error: true,
          errorCode: code,
          path: '',
        });
        this.rollBackAnimation();
      }
    }
  };

  handleImageCapture = () => {
    console.log('Camera::handleImageCapture BEGIN');
    if (!this.state.path && !this.state.capturing) {
      this.setState({ capturing: true });
      console.log('Camera::handleImageCapture BEGIN!!!');
      this.camera.capture()
        .then((data) => {
          console.log('Camera::handleImageCapture DONE');
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
          console.error('error during image capture', err);
        });
    }
  };

  handleImageUpload = (path) => {
    console.log('Camera::handleImageUpload', this.state.photoGoal);
    console.log('Camera::convertToBase64', path);
    RNFetchBlob.fs.readFile(path, 'base64')
      .then((base64) => {
        if (this.state.photoGoal === 'isRegistered') {
          this.props.validate(base64);
        } else if (this.state.photoGoal === 'validateFacialRecognitionValidation') {
          this.props.emotionValidate({
            facial_image_validation_id: this.props.user.faceEmotionCreate.payload.payload.facial_image_validation_id,
            facial_image: base64,
          });
        }
      })
      .catch((err) => { console.log(err.message); });
  };

  convertToBase64 = (path) => {
    console.log('Camera::convertToBase64', path);
    RNFetchBlob.fs.readFile(path, 'base64')
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => { console.log(err.message); });
  };

  navigateTo = (screen, params) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: screen, params })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  handleCameraClose = () => {
    this.state.progress.setValue(0);
    this.setState({ path: '', animation: pressAnimation });
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  };

  handleDismissModal = () => {
    this.state.progress.stopAnimation();
    this.setState({ error: false, errorCode: null, animation: pressAnimation });
  };

  // Animation

  animate = (time, fr = 0, to = 1, callback) => {
    this.state.progress.setValue(fr);
    const animationref = Animated.timing(this.state.progress, {
      toValue: to,
      duration: time,
    }).start(callback);
    this.setState({ animationref });
  };

  rollBackAnimation = () => {
    this.state.progress.stopAnimation();
    this.state.progress.setValue(0);
    this.setState({
      animation: pressAnimation,
    });
  };

  animateEmoji = (callback) => {
    Animated.timing(this.state.emojiAnimation, {
      toValue: 1,
      duration: 2000,
    }).start(callback);
  };

  renderCamera() {
    const { params = {} } = this.props.navigation.state;
    const { mode } = params;
    const { qr } = this.state;
    const { setTrAdress } = this.props;
    const camtype = mode === 'qr' ? 'back' : Camera.constants.Type.front;
    const { navigate } = this.props.navigation;
    oncetrig.setFunction(() => { navigate('Input', { mode: 'adress' }); });
    const onBarCode = (code) => {
      if (mode === 'qr') {
        if (code.type === 'QR_CODE' && code.data) {
          setTrAdress(code.data);
          oncetrig.callFunction();
        }
      }
    };
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.camera}
        aspect={Camera.constants.Aspect.fill}
        captureQuality={Camera.constants.CaptureQuality.low}
        type={camtype}
        captureTarget={Camera.constants.CaptureTarget.disk}
        onBarCodeRead={onBarCode}
      />
    );
  }


  renderImage = () => (<Image source={{ uri: this.state.path }} style={styles.previewImage} />);

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

  render() {
    const isFetching =
      this.props.user.validate.isFetching ||
      this.props.user.faceEmotionCreate.isFetching ||
      this.props.user.faceEmotionValidate.isFetching;
    const { params = {} } = this.props.navigation.state;
    const { mode } = params;
    const isQR = mode === 'qr';
    const fn = () => null;
    return (
      <View style={styles.container}>
        <Modal
          onPress={this.handleDismissModal}
          code={this.state.errorCode}
          visible={this.state.error}
        />
        <View style={styles.cameraImageContainer}>
          {this.state.path ? this.renderImage() : this.renderCamera()}
        </View>
        <View style={styles.maskLayer}>
          <Image source={whiteMask} style={styles.maskImageStyle} />
        </View>
        <View style={styles.buttonsLayer}>
          <View style={styles.navbar}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={this.handleCameraClose}>
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
              />
          }
          <View style={styles.captureContainer}>
            {
              this.state.isButtonVisible ? <TouchableWithoutFeedback
                activeOpacity={1}
                style={[styles.captureBtn, this.state.path && styles.uploadBtn]}
                onPress={isQR ? fn : this.handleImageCapture}
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
              </TouchableWithoutFeedback> : <View />

            }
            {
              this.state.requiredEmotions.length !== 0 && this.state.isButtonVisible ?
                <TouchableOpacity style={styles.repeat} onPress={this.replayEmoji}>
                  <Image source={repeat} />
                </TouchableOpacity> : <View />
            }
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setTrAdress: newTransaction.setTrAdress,
  validate: validate.request,
  emotionCreate: faceEmotionCreate.request,
  emotionValidate: faceEmotionValidate.request,
  setAvatarLocalPath,
})(Cam);

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
    backgroundColor: 'white',
  },
  camera: {
    height: 640,
    width: 360,
  },
  cameraImageContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  previewImage: {
    height: 640,
    width: 360,
  },
  emojiImage: {
    alignSelf: 'center',
  },
  captureContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 224,
    width: 360,
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
});
