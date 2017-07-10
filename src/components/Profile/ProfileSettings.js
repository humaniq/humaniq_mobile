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
    Dimensions,
    ToolbarAndroid,
    FlatList,
    ListView,
    Platform
} from 'react-native';

import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import * as constants from '../../utils/constants'
import CustomStyleSheet from '../../utils/customStylesheet';


const HEADER_MAX_HEIGHT = 170;
const DELTA = 20;
const TOOLBAR_HEIGHT = 56;
const HEADER_MIN_HEIGHT = TOOLBAR_HEIGHT + StatusBar.currentHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

export class ProfileSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollY: new Animated.Value(0),
        };
    }

    _renderScrollViewContent() {
        return (
            <View style={styles.scrollViewContent}>
                <View style={styles.firstSection}>
                    <Image
                        source={require('../../assets/phone.png')}
                        style={{width: 12, height: 12, marginTop: 34.5, marginLeft: 16.5, marginBottom: 5.5}}/>

                    <View style={{flexDirection: 'row', marginLeft: 16.5, marginRight: 13, alignItems: 'center'}}>
                        <View style={{flex: 1}}>
                            <Text style={{marginTop: 11, marginBottom: 11.5, fontSize: 17.5, color: '#1b1d1d'}}>
                                +1 (234) 567-8901
                            </Text>

                            <Image
                                source={require('../../assets/phone.png')}
                                style={{width: 12, height: 12, marginBottom: 16}}/>
                        </View>

                        <Image
                            source={require('../../assets/edit_blue.png')}
                            style={{width: 18, height: 18}}/>

                    </View>

                    <View style={styles.divider}/>

                    <View style={{flexDirection: 'row', marginLeft: 16.5, marginRight: 13, alignItems: 'center'}}>
                        <View style={{flex: 1}}>
                            <Text style={{marginTop: 11, marginBottom: 11.5, fontSize: 17.5, color: '#1b1d1d'}}>
                                ****
                            </Text>

                            <Image
                                resizeMode='contain'
                                source={require('../../assets/lock.png')}
                                style={{width: 12, height: 12, marginBottom: 16}}/>
                        </View>

                        <Image
                            source={require('../../assets/edit_blue.png')}
                            style={{width: 18, height: 18}}/>

                    </View>

                    <View style={styles.divider}/>
                </View>

                <View style={styles.secondSection}>
                    <View style={styles.divider}/>
                    <View style={{marginLeft: 16.5}}>
                        <Image
                            source={require('../../assets/edit_blue.png')}
                            style={{width: 12, height: 12, marginTop: 21, marginBottom: 22}}/>

                        <Image
                            source={require('../../assets/edit_blue.png')}
                            style={{width: 15, height: 15, marginBottom: 19.5}}/>
                    </View>
                </View>
                <View style={styles.divider}/>
            </View>
        );
    }

    getAnimationType = (type) => {
        switch (type) {
            case constants.HEADER_TRANSLATE:
                return this.state.scrollY.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE],
                    outputRange: [0, -HEADER_SCROLL_DISTANCE],
                    extrapolate: 'clamp',
                })
            case constants.HEADER_TRANSLATE2:
                return this.state.scrollY.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE],
                    outputRange: [0, HEADER_SCROLL_DISTANCE],
                    extrapolate: 'clamp',
                })
            case constants.VIEW_TRANSLATE:
                return this.state.scrollY.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE],
                    outputRange: [1, 0.70],
                    extrapolate: 'clamp',
                })
            case constants.VIEWY_TRANSLATE:
                return this.state.scrollY.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE],
                    outputRange: [0, TOOLBAR_HEIGHT / 2 + StatusBar.currentHeight + 2],
                    extrapolate: 'clamp',
                })
            case constants.IMAGE_OPACITY:
                return this.state.scrollY.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                })
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="#598FBA"
                />

                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    onScroll={
                        Animated.event([
                            { nativeEvent: { contentOffset: { y: this.state.scrollY } }
                            }],{ useNativeDriver: true})
                    }>
                    {this._renderScrollViewContent()}
                </Animated.ScrollView>

                <Animated.View
                    style={[styles.collapseContainer, {
                        transform: [{translateY: this.getAnimationType(constants.HEADER_TRANSLATE)}]}]
                    }>
                    <Animated.View
                        style={[styles.bar, {
                            transform: [
                                {scale: this.getAnimationType(constants.VIEW_TRANSLATE)},
                                {translateY: this.getAnimationType(constants.VIEWY_TRANSLATE)}]}]
                        }>
                        <Animated.View
                            style={styles.avatarInfoContainer}>
                            <Animated.Image
                                resizeMode='contain'
                                style={styles.avatar}
                                source={require('../../assets/cat.jpg')}/>
                            <Animated.View style={styles.infoContainer}>
                                <Text style={styles.title}>+1 (234) 567-8901</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{fontSize: 16.5, color: '#DAE5EE'}}>online</Text>
                                    <View style={styles.status}/>
                                </View>

                            </Animated.View>
                        </Animated.View>


                    </Animated.View>

                    <Animated.View style={[styles.toolbarItemsContainer, {
                        transform: [{translateY: this.getAnimationType(constants.HEADER_TRANSLATE2)}]}]
                    }>
                        <TouchableOpacity
                            onPress={() => {this.handleClose()}}
                            style={styles.closeButton}>
                            <Image
                                resizeMode='contain'
                                source={require('../../assets/close_white.png')}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {this.editHandle()}}
                            style={styles.editButton}>
                            <Image
                                resizeMode='contain'
                                source={require('../../assets/edit_white.png')}/>
                        </TouchableOpacity>

                    </Animated.View>
                </Animated.View>

                {/* render fab button*/}
                <Animated.Image
                    source={require('../../assets/fab.png')}
                    style={[styles.fabButton,{
                        opacity: this.getAnimationType(constants.IMAGE_OPACITY),
                        transform: [{translateY: this.getAnimationType(constants.HEADER_TRANSLATE)}],
                    }]}/>
            </View>
        )
    }


    handleClose = () => {
        const backAction = NavigationActions.back({
            key: null,
        });
        this.props.navigation.dispatch(backAction);
    }

    editHandle() {
        const navState = this.props.navigation.state;
        this.props.navigation.navigate('ProfileEdit', { ...navState.params });
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    status: {
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
        borderRadius: 60
    },
    toolbarItemsContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        top: StatusBar.currentHeight,
        height: TOOLBAR_HEIGHT
    },
    infoContainer: {marginLeft: 13},
    bar: {
        backgroundColor: 'transparent',
        height: HEADER_MAX_HEIGHT,
        justifyContent: 'flex-end',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: DELTA
    },
    title: {
        color: 'white',
        fontSize: 21,
    },
    scrollViewContent: {
        marginTop: HEADER_MAX_HEIGHT,
    },
    closeButton: {
        marginLeft: 20
    },
    editButton: {
        marginRight: 20
    },
    firstSection: {
        backgroundColor: '#fff',
    },
    secondSection: {
        backgroundColor: '#fff',
        marginTop: 20
    },
    divider: {
        backgroundColor: '#e0e0e0',
        height: 0.5,
        flex: 1
    },
    fabButton: {
        position: 'absolute',
        right: 24.5,
        width: 56,
        height: 56,
        top: HEADER_MAX_HEIGHT-28,
        overflow: 'hidden',
    },
});

export default connect(
    (state) => ({
        user: state.user,
    }),
    (dispatch) => ({})
)(ProfileSettings);