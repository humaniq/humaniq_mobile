import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Text,
    StatusBar,
    Animated,
    ActivityIndicator,
    WebView,
    Dimensions
} from 'react-native';

import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import CustomStyleSheet from '../../utils/customStylesheet';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import {Bar} from 'react-native-progress';
import {downloadVideo} from '../../utils/videoCache'

const closeIcon = require('../../assets/icons/ic_close.png');
const botIcon = require('../../assets/icons/ic_help.png');

export class Instructions extends Component {
    video: Video;

    constructor(props) {
        super(props);
        this.state = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: false,
            progress: 0,
            source: '',
            loading: true,
            downloaded: true,
        };
    }

    async componentDidMount() {
        downloadVideo('http://clips.vorwaerts-gmbh.de/VfE_html5.mp4', 'intro')
        .then(res => {
            this.setState({source: res, loading: false})
        })
        .catch(err => {
            this.setState({loading: false})
        })
    }

    componentWillUnmount() {
    }

    onProgress = (data) => {
        this.setState({progress: data.currentTime / this.state.duration});
    };

    onPressEnd = () => {
        // starts video again
        this.setState({paused: false})
    };

    onPressStart = () => {
        // on click pauses video
        this.setState({paused: true})
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
        this.setState({duration: data.duration});
    };


    onEnd = () => {
        this.setState({paused: true, progress: 1});
        setTimeout(() => {
            if (this.video) {
                this.setState({paused: false, progress: 0});
                this.video.seek(0)
            }
        }, 250)
    };

    render() {
        var {height, width} = Dimensions.get('window');

        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPressOut={() => this.onPressEnd()}
                    onPressIn={() => this.onPressStart()}>
                    <Video
                        ref={(ref: Video) => {this.video = ref}}
                        source={{uri: this.state.source}}
                        style={[styles.fullScreen, {height, width}]}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        onProgress={this.onProgress}
                        onLoad={this.onLoad}
                        resizeMode="cover"
                        onEnd={this.onEnd}
                    />
                </TouchableWithoutFeedback>

                <LinearGradient
                    colors={['rgba(170, 170, 170, 0.6)', 'rgba(186, 186, 186, 0.4)', 'rgba(186, 186, 186, 0.05)']}>
                    <View>
                        <Bar
                            animated={true}
                            style={styles.progress}
                            height={1.5}
                            borderWidth={0}
                            borderColor={'transparent'}
                            borderRadius={0}
                            color="#fff"
                            unfilledColor="#B4B4B4"
                            progress={this.state.progress}
                            width={null}/>

                        <View style={styles.buttonsContainer}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.onBotPress()}>
                                    <Image
                                        resizeMode='contain'
                                        style={styles.bot}
                                        source={botIcon}/>
                                </TouchableOpacity>

                                <Text style={{color: '#fff', fontSize: 15}}>
                                    Instructions Caption
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => this.onClosePress()}>
                                <Image
                                    resizeMode='contain'
                                    style={styles.close}
                                    source={closeIcon}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>


                <ActivityIndicator
                    animating={this.state.loading}
                    color={'#000'}
                    size={100}
                    style={styles.indicator}/>

            </View>
        );
    }

}
const styles = CustomStyleSheet({
    container: {
        flex: 1
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 8,
        marginRight: 10,
        marginLeft: 2,
        justifyContent: 'space-between',
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
        height: 18,
    },
    close: {
        height: 15,
    },
    progress: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 8,
    },
    indicator: {
        flex:1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default connect(
    (state) => ({
        user: state.user,
    }),
    (dispatch) => ({})
)(Instructions);
