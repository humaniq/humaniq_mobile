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
import { validate, setAvatarLocalPath } from '../../actions';

// console.log('action typesрџ”‘', ActionTypes.setAvatarLocalPath());

import CustomStyleSheet from '../../utils/customStylesheet';

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
      photo: PropTypes.string,
    }).isRequired,

    setAvatarLocalPath: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
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
      progress: new Animated.Value(0),
      animation: pressAnimation,
    };
  }

  componentWillMount() {
    // console.log('props camera', this.props);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: MOVE TO SAGA TO PREVENT LAG
    // console.log('рџ“ћ nextProps', nextProps.user.validate);
    if (nextProps.user.validate.payload) {
      const code = nextProps.user.validate.payload.code;
      const photo = nextProps.user.photo;

      if (!photo) {
        this.state.progress.stopAnimation();
        this.state.progress.setValue(0);
        switch (code) {
          case 6000:
            this.setState({ path: '', animation: pressAnimation });
            alert(nextProps.user.validate.payload.message);
            break;

          case 3002:
            // registered user
            this.setState({ animation: doneAnimation });
            this.animate(1000, 0, 1);
            this.props.setAvatarLocalPath(this.state.path);
            this.props.navigation.navigate('Password');
            break;

          case 3003:
            // new user
            this.setState({ animation: doneAnimation });
            this.animate(1000, 0, 1, () => {
              this.props.setAvatarLocalPath(this.state.path);
              this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
            });
            break;

          case 3000:
            this.setState({ path: '', animation: pressAnimation });
            alert(nextProps.user.validate.payload.message);
            // reset payload?
            break;

          default:
            this.setState({ path: '', animation: pressAnimation });
            alert(`Unknown code ${nextProps.user.validate.payload.code}, no info in Postman`);
        }
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
    if (!this.state.path) {
      this.camera.capture()
        .then((data) => {
          this.setState({ path: data.path });
          setTimeout(() => this.handleImageUpload(data.path), 1000);
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

  handleImageDelete = () => {
    this.state.progress.setValue(0);
    this.setState({ path: '', animation: pressAnimation });
  };

  handleImageUpload = (path) => {
    RNFetchBlob.fs.readFile(path, 'base64')
      .then((data) => {
        this.props.validate(data);
      })
      .catch((err) => { console.log(err.message); });
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
        />
    );
  }

  render() {
    return (
      <View style={styles.container}>
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
                onPress={this.handleImageCapture}
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
  validate: validate.request,
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
