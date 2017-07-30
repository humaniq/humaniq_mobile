import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import Camera from 'react-native-camera';
import { NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';
import { validate, setAvatarLocalPath, faceEmotionCreate, faceEmotionValidate } from '../../actions';

// console.log('action types🔑', ActionTypes.setAvatarLocalPath());

import CustomStyleSheet from '../../utils/customStylesheet';
import Modal from '../Shared/Components/Modal';

// assets

// eslint-disable-next-line import/no-unresolved
const close = require('../../assets/icons/ic_close.png');
// eslint-disable-next-line import/no-unresolved
const confirm = require('../../assets/icons/ic_confirm_dark.png');

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
      path: '',
      base64: '',
      count: 1,
      error: false,
      errorCode: null,
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
            this.props.setAvatarLocalPath(this.state.path);
            this.props.navigation.navigate('Password');
            break;

          case 3003:
            // new user
            this.props.setAvatarLocalPath(this.state.path);
            if (nextProps.user.validate.payload.payload.facial_image_id) { // Emotions case
              this.setState({ photoGoal: 'createFacialRecognitionValidation' });
              this.props.emotionCreate({
                facial_image_id: nextProps.user.validate.payload.payload.facial_image_id,
              });
            } else {
              this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
            }
            break;

          case 3000:
          case 6000:
          default:
            this.setState({
              error: true,
              errorCode: code,
              path: '',
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
        this.setState({
          path: '',
          photoGoal: 'validateFacialRecognitionValidation',
          requiredEmotions: nextProps.user.faceEmotionCreate.payload.payload.required_emotions,
        });
      } else {
        this.setState({
          error: true,
          errorCode: code,
          path: '',
        });
      }
    }
  };

  validateFacialRecognitionValidationReceiveProps = (nextProps) => {
    if (nextProps.user.faceEmotionValidate.payload) {
      const code = nextProps.user.faceEmotionValidate.payload.code;
      if (nextProps.user.faceEmotionValidate.isFetching !== this.props.user.faceEmotionValidate.isFetching) {
        console.log('validateFacialRecognitionValidationReceiveProps', code);
        if (code === 3008) {
          // reduce emotions there
          this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
        } else {
          this.setState({
            error: true,
            errorCode: code,
            path: '',
          });
        }
      }
    }
  };

  handleCameraClose = () => {
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  };

  handleImageCapture = () => {
    console.log('Camera::handleImageCapture BEGIN');
    this.camera.capture()
      .then((data) => {
        console.log('Camera::handleImageCapture DONE');
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
    console.log('Camera::convertToBase64', path);
    RNFetchBlob.fs.readFile(path, 'base64')
      .then((data) => {
        this.setState({ base64: data });
      })
      .catch((err) => { console.log(err.message); });
  };

  handleImageUpload = () => {
    console.log('Camera::handleImageUpload', this.state.photoGoal);
    if (this.state.photoGoal === 'isRegistered') {
      this.props.validate(this.state.base64);
    } else if (this.state.photoGoal === 'validateFacialRecognitionValidation') {
      this.props.emotionValidate({
        facial_image_validation_id: this.props.user.faceEmotionCreate.payload.payload.facial_image_validation_id,
        facial_image: this.state.base64,
      });
    }
    // this.props.checkUserRegStatus(this.state.base64);
    // console.log('this.props.validate', this.props);
  };

  renderCamera() {
    const { mode } = this.props.navigation.state.params;
    alert(JSON.stringify(this.props.navigation))
    const camtype = mode === 'qr' ? 'back' : Camera.constants.Type.front
    const onBarCode = (code) => {
      if (mode === 'qr') {
        if (code.type === 'QR_CODE' && code.data) {
          alert(code.data);
        }
      }
    }
    return (
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.camera}
        aspect={Camera.constants.Aspect.fill}
        captureQuality={Camera.constants.CaptureQuality.low}
        //type={camtype}
        captureTarget={Camera.constants.CaptureTarget.disk}
        // captureTarget={Camera.constants.CaptureTarget.memory}
        onBarCodeRead={onBarCode}
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

  handleDismissModal = () => {
    this.setState({ error: false, errorCode: null });
  };

  render() {
    const isFetching =
      this.props.user.validate.isFetching ||
      this.props.user.faceEmotionCreate.isFetching ||
      this.props.user.faceEmotionValidate.isFetching;

    const { mode } = this.props.navigation.state.params;
    const fn = ()=>null;
    return (
      <View style={styles.container}>
        <Modal
          onPress={this.handleDismissModal}
          code={this.state.errorCode}
          visible={this.state.error}
        />
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
          {this.state.photoGoal === 'validateFacialRecognitionValidation' &&
          <Text>.state.requiredEmotions: {this.state.requiredEmotions.join(', ')}</Text>
          }
          {isFetching ?
            <Text>Uploading</Text>
            :
            <TouchableOpacity
              style={[styles.captureBtn, this.state.path && styles.uploadBtn]}
              onPress={mode === 'qr' ? fn : this.state.path ? this.handleImageUpload : this.handleImageCapture}
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
  emotionCreate: faceEmotionCreate.request,
  emotionValidate: faceEmotionValidate.request,
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
