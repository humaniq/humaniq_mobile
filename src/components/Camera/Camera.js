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
// eslint-disable-next-line import/no-unresolved
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
      base64: '',
      error: false,
      errorCode: null,
      progress: new Animated.Value(0),
      animation: pressAnimation,
      photoGoal: 'isRegistered',
      requiredEmotions: [],
    };
  }

  componentWillMount() {
    // console.log('props camera', this.props);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    // console.log('📞 nextProps', nextProps.user.validate);
    this[`${this.state.photoGoal}ReceiveProps`](nextProps);
  }

  isRegisteredReceiveProps = (nextProps) => {
    if (nextProps.user.validate.payload) {
      const code = nextProps.user.validate.payload.code;

      if (nextProps.user.validate.isFetching !== this.props.user.validate.isFetching) {
        switch (code) {
          case 3002:
            // registered user
            this.state.progress.stopAnimation();
            this.state.progress.setValue(0);
            this.setState({ animation: doneAnimation });
            this.animate(1000, 0, 1, () => {
              this.setState({ animation: pressAnimation });
              this.props.setAvatarLocalPath(this.state.path);
              this.props.navigation.navigate('Password');
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
              this.state.progress.stopAnimation();
              this.state.progress.setValue(0);
              this.setState({ animation: doneAnimation });
              this.animate(1000, 0, 1, () => {
                this.setState({ animation: pressAnimation });
                this.props.setAvatarLocalPath(this.state.path);
                this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
              });
            }

            break;
          default:
            this.state.progress.stopAnimation();
            this.state.progress.setValue(0);
            this.setState({
              error: true,
              errorCode: code,
              path: '',
              animation: pressAnimation
            });
        }
      }
    }
  };

  createFacialRecognitionValidationReceiveProps = (nextProps) => {
    if (nextProps.user.faceEmotionCreate.payload) {
      const code = nextProps.user.faceEmotionCreate.payload.code;
      console.log('createFacialRecognitionValidationReceiveProps', code);
      if (code === 3006) {
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
        this.setState({ animation: doneAnimation });
        this.animate(1000, 0, 1, () => {
          this.setState({
            path: '',
            photoGoal: 'validateFacialRecognitionValidation',
            requiredEmotions: nextProps.user.faceEmotionCreate.payload.payload.required_emotions,
            animation: pressAnimation
          });
        });
      } else {
        this.setState({
          error: true,
          errorCode: code,
          path: '',
          animation: doneAnimation
        });
      }
    }
  };

  validateFacialRecognitionValidationReceiveProps = (nextProps) => {
    if (nextProps.user.faceEmotionValidate.payload) {
      this.state.progress.stopAnimation();
      this.state.progress.setValue(0);
      const code = nextProps.user.faceEmotionValidate.payload.code;
      if (nextProps.user.faceEmotionValidate.isFetching !== this.props.user.faceEmotionValidate.isFetching) {
        console.log('validateFacialRecognitionValidationReceiveProps', code);
        if (code === 3008) {
          // reduce emotions there
          this.setState({ animation: doneAnimation });
          this.animate(1000, 0, 1, () => {
            this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
          });
        } else {
          this.setState({
            animation: pressAnimation,
            error: true,
            errorCode: code,
            path: '',
          });
        }
      }
    }
  };

  handleImageCapture = () => {
    console.log('Camera::handleImageCapture BEGIN');
    if (!this.state.path) {
      this.camera.capture()
        .then((data) => {
          console.log('Camera::handleImageCapture DONE');
          this.setState({ path: data.path });
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
        .catch((err) => { console.error('error during image capture', err); });
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

    // this.props.checkUserRegStatus(this.state.base64);
    // console.log('this.props.validate', this.props);
  };

  // TODO: вынести
  convertToBase64 = (path) => {
    console.log('Camera::convertToBase64', path);
    RNFetchBlob.fs.readFile(path, 'base64')
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => { console.log(err.message); });
  };

  handleImageDelete = () => {
    this.state.progress.setValue(0);
    this.setState({ path: '', animation: pressAnimation });
  };

  handleCameraClose = () => {

    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  };

  // Animation
  animate = (time, fr = 0, to = 1, callback) => {
    console.log('press in');
    this.state.progress.setValue(fr);
    const animationref = Animated.timing(this.state.progress, {
      toValue: to,
      duration: time,
    }).start(callback);
    this.setState({ animationref });
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

  renderCamera() {
    const { mode } = this.props.navigation.state.params;
    const { qr } = this.state;
    const { setQr } = this.props;
    const camtype = mode === 'qr' ? 'back' : Camera.constants.Type.front
    const { navigate } = this.props.navigation;
    oncetrig.setFunction(() => { navigate('Input'); });
    const onBarCode = (code) => {
      if (mode === 'qr') {
        if (code.type === 'QR_CODE' && code.data) {
          setQr(code.data);
          oncetrig.callFunction();
          alert(code.data);
        }
      }
    }
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        } }
        style={styles.camera}
        aspect={Camera.constants.Aspect.fill}
        captureQuality={Camera.constants.CaptureQuality.low}
        type={camtype}
        captureTarget={Camera.constants.CaptureTarget.disk}
        onBarCodeRead={onBarCode}
        // captureTarget={Camera.constants.CaptureTarget.memory}
        />
    );
  }

  handleDismissModal = () => {
    this.state.progress.stopAnimation();
    this.setState({ error: false, errorCode: null, animation: pressAnimation });
  };

  render() {
    const isFetching =
      this.props.user.validate.isFetching ||
      this.props.user.faceEmotionCreate.isFetching ||
      this.props.user.faceEmotionValidate.isFetching;
    const { mode } = this.props.navigation.state.params;
    const isQR = mode === 'qr'
    const fn = ()=>null;
    return (
      <View style={styles.container}>
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
          <View style={styles.captureContainer}>
            {
              <TouchableWithoutFeedback
                activeOpacity={1}
                style={[styles.captureBtn, this.state.path && styles.uploadBtn]}
                onPress={isQR ? fn : this.handleImageCapture}
                onPressIn={() => !this.state.path && this.animate(200, 0, 0.7) }
                onPressOut={() => !this.state.path && this.animate(200, 0.7, 0) }
                >
                {
                  <Animation
                    style={styles.animationStyle}
                    source={this.state.animation}
                    progress={this.state.progress}
                    />
                }
              </TouchableWithoutFeedback>
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
  setQr: newTransaction.setQr,
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
    backgroundColor: 'transparent',
  },
  camera: {
    height: 640,
    width: 360,
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
  },
  uploadBtn: {
    alignItems: 'center',
    justifyContent: 'center',
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
