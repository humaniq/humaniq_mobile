import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing,
  DeviceEventEmitter,
} from 'react-native';

import { HumaniqDownloadFileLib } from 'react-native-android-library-humaniq-api';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../utils/customStylesheet';

const closeIcon = require('../../assets/icons/ic_close_white.png');
const botIcon = require('../../assets/icons/ic_humaniq_bot.png');

export class Instructions extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
    url: PropTypes.string.isRequired,
  };
  video: Video;
  activity = true;
  animationValue = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      paused: false,
      source: '',
      loading: true,
      width: 0,
      videoUrl: this.props.url || 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4',
      progressText: 0,
    };
  }

  componentWillMount() {
  }

  animateIndicator = (reset = true) => {
    if (reset) this.animationValue.setValue(0);
    requestAnimationFrame(() => {
      Animated.timing(this.animationValue, {
        toValue: 1,
        easing: Easing.linear,
        duration: (this.state.duration * 1000) * (1 - this.animationValue._value),
      }).start();
    });
  }

  async componentDidMount() {
    HumaniqDownloadFileLib.downloadVideoFile(this.state.videoUrl).then((uri) => {
      if (this.activity) {
        this.setState({ source: uri.uri, loading: false });
      }
    }).catch((error) => {
      if (this.activity) {
        this.setState({ loading: false });
      }
    });
    //
    DeviceEventEmitter.addListener('EVENT_PROGRESS_CHANGED', (event) => {
      if (this.activity) {
        this.setState({ progressText: event.progress });
      }
    });
  }

  componentWillUnmount() {
    this.activity = false;
    DeviceEventEmitter.removeListener('EVENT_PROGRESS_CHANGED');
  }

  onPressEnd = () => {
    // starts video again
    this.setState({ paused: false });
    this.animateIndicator(false);
  };

  onPressStart = () => {
    // on click pauses video
    this.setState({ paused: true });
    this.animationValue.stopAnimation((value) => {
      this.setState({ pausedValue: value });
    });
  };

  onBotPress = () => {
  };

  onClosePress = () => {
    // close component
    const backAction = NavigationActions.back({
      key: null,
    });
    this.props.navigation.dispatch(backAction);
  };

  onLoad = (data) => {
    this.setState({ duration: data.duration });
    this.animateIndicator();
  };

  onEnd = () => {
    this.setState({ paused: true });
    setTimeout(() => {
      if (this.video) {
        this.setState({ paused: false });
        this.video.seek(0);
        this.animateIndicator(true);
      }
    }, 250);
  };

  setWidthFromLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    this.setState({ width });
  };

  renderLoadingComponent = () => (
    <ActivityIndicator
      color="#fff"
      size={24}
      style={styles.indicator}
    />
    );

  renderCloseButton = () => (
    <TouchableOpacity onPress={() => this.onClosePress()}>
      <Image
        resizeMode="contain"
        style={styles.close}
        source={closeIcon}
      />
    </TouchableOpacity>
    );

  render() {
    const { height, width } = Dimensions.get('window');
    const style = this.animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.width],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        {!this.state.loading ? this.showVideoPlayer(height, width) : this.showProgress()}
        <LinearGradient
          colors={['rgba(170, 170, 170, 0.6)', 'rgba(186, 186, 186, 0.4)', 'rgba(186, 186, 186, 0.05)']}
        >
          {/* Progress Bar */}
          <View>
            <View style={styles.progress}>
              <View style={styles.line} onLayout={event => this.setWidthFromLayout(event)}>
                <Animated.View style={[styles.progress2, { width: style }]} />
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <View style={styles.leftContainer}>
                <TouchableOpacity onPress={() => this.onBotPress()}>
                  <Image
                    resizeMode="contain"
                    style={styles.bot}
                    source={botIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.captionText}>
                  {''}
                </Text>
              </View>
              {this.state.loading ? this.renderLoadingComponent() : this.renderCloseButton()}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  showVideoPlayer(height, width) {
    return (
      <TouchableWithoutFeedback
        delayPressIn={0}
        delayPressOut={0}
        onPressOut={() => this.onPressEnd()}
        onPressIn={() => this.onPressStart()}
      >
        <Video
          ref={(ref) => {
            this.video = ref;
          }}
          source={{ uri: this.state.source }}
          style={[styles.fullScreen, { height, width }]}
          paused={this.state.paused}
          volume={this.state.volume}
          muted={this.state.muted}
          onProgress={this.onProgress}
          onLoad={this.onLoad}
          resizeMode="cover"
          onEnd={this.onEnd}
        />
      </TouchableWithoutFeedback>
    );
  }

  showProgress() {
    return (
      <View style={styles.progressTextContainer}>
        <Text style={{ fontSize: 26 }}>{this.state.progressText}%</Text>
      </View>
    );
  }
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bot: {
    height: 24,
  },
  close: {
    height: 24,
  },
  progress: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 8,
  },
  indicator: {
  },
  captionText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  line: {
    flex: 1,
    backgroundColor: '#B4B4B4',
    marginHorizontal: 1,
    height: 1.1,
    borderRadius: 2,
  },
  progress2: {
    backgroundColor: '#fff',
    height: 1.1,
    borderRadius: 2,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(
    state => ({
      user: state.user,
    }),
    dispatch => ({}),
)(Instructions);
