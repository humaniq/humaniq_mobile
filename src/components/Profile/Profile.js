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

import {connect} from 'react-redux';
import Item from './Item'
import * as constants from '../../utils/constants'
import CustomStyleSheet from '../../utils/customStylesheet';

const HEADER_MAX_HEIGHT = 170;
const DELTA = 20;
const TOOLBAR_HEIGHT = 56;
const HEADER_MIN_HEIGHT = TOOLBAR_HEIGHT + StatusBar.currentHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const fakeTransactions = [
    {
        phone: "+1 (416) 464 71 35",
        amount: "+12.08",
        type: 0, // incoming
        name: "Серафим",
        surname: "Петров",
        pic: '',
        time: '11.07.2017'
    },
    {
        phone: "+3 (116) 764 17 22",
        amount: "-44.08",
        type: 1, // outgoing
        name: "Джамшид",
        surname: "Джураев",
        pic: '',
        time: '11.07.2017'
    },
    {
        phone: "+998 (97) 720 03 88",
        amount: "+100",
        type: 0, //incoming
        name: "Иван",
        surname: "Белявский",
        pic: '',
        time: '12.07.2017'
    },
    {
        phone: "+998 (90) 144 34 07",
        amount: "+100",
        type: 0, //incoming
        name: "Заир",
        surname: "Огнев",
        pic: '',
        time: '12.07.2017'
    },
    {
        phone: "+971 (58) 273 77 93",
        amount: "+400",
        type: 0, //incoming
        name: "Дониер",
        surname: "Эркабоев",
        pic: '',
        time: '13.07.2017'
    },
]

export class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),
        };
    }

    componentWillMount() {
        console.warn(this.convertToMap(fakeTransactions).length)
    }

    convertToMap = (array) => {
        let transactionMaps = []
        for(var i = 0; i < array.length; i++) {
            if (!transactionMaps[array[i].time]) {
                transactionMaps[array[i].time] = []
            }
            console.warn(JSON.stringify(transactionMaps[array[i].time]))
        }
        console.warn(JSON.stringify(transactionMaps))
        return transactionMaps
    }

    // render list
    async renderScrollViewContent() {
        let maps = await this.convertToMap(fakeTransactions)
        return (
            <View style={styles.scrollViewContent}>
                {maps.map((childMap, i) => (
                    this.renderItem(childMap, i)
                ))}
            </View>
        );
    }

// {i == 0 ?  : null}

    renderHeaderSection = (item) => {
        return (
            <Text style={styles.headerSection}>{item.time}</Text>
        )
    }

    renderItem = (categoryMap, parentIndex) => {
        return (
            <View key={i} style={{backgroundColor: '#fff'}}>
                {this.renderHeaderSection(categoryMap[0])}
                {categoryMap.map((child) => {
                    return <Item item={child}/>
                })}
            </View>
        )
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
                    outputRange: [0, TOOLBAR_HEIGHT / 2 + StatusBar.currentHeight + 5],
                    extrapolate: 'clamp',
                })
            case constants.IMAGE_OPACITY:
                return this.state.scrollY.interpolate({
                    inputRange: [0, HEADER_SCROLL_DISTANCE],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                })
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {/* render status bar*/}
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="#598fba"/>

                {/* render list */}
                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    onScroll={
                        Animated.event([
                            { nativeEvent: { contentOffset: { y: this.state.scrollY } }
                            }],{ useNativeDriver: true})}>
                    {this.renderScrollViewContent()}
                </Animated.ScrollView>

                {/* render collapse layout */}
                <Animated.View
                    style={[styles.collapseContainer, {
                        transform: [{translateY: this.getAnimationType(constants.HEADER_TRANSLATE)}]}]}>
                    <Animated.View
                        style={[styles.bar, {
                            transform: [
                                {scale: this.getAnimationType(constants.VIEW_TRANSLATE)},
                                {translateY: this.getAnimationType(constants.VIEWY_TRANSLATE)}]}]}>
                        <Animated.View
                            style={styles.avatarInfoContainer}>
                            <Animated.Image
                                resizeMode='contain'
                                style={styles.avatar}
                                source={require('../../assets/cat.jpg')}/>
                            <Animated.View style={styles.infoContainer}>
                                <Text style={styles.title}>23,456.<Text style={{fontSize: 17.5, color: '#DAE5EE'}}>78 HMQ</Text></Text>
                                <Text style={{fontSize: 16, color: '#DAE5EE', marginTop: 3}}>19.01 $</Text>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>

                    {/* render toolbar */}
                    <Animated.View style={[{
                        transform: [{translateY: this.getAnimationType(constants.HEADER_TRANSLATE2)}]}]}>
                        <ToolbarAndroid
                            onActionSelected={(position) => this.onActionClick(position)}
                            style={styles.toolbar}
                            onIconClicked={() => this.backButtonHandle()}
                            navIcon={require('../../assets/back.png')}
                            actions={[{title: 'Settings', icon: require('../../assets/settings_white.png'), show: 'always'}]}/>
                    </Animated.View>
                </Animated.View>

                {/* render fab button*/}
                <Animated.View style={[styles.fabContainer,{
                    opacity: this.getAnimationType(constants.IMAGE_OPACITY),
                    transform: [{translateY: this.getAnimationType(constants.HEADER_TRANSLATE)}],
                    }]}>
                    <TouchableOpacity onPress={() => this.onFabButtonPress()}>
                        <Animated.Image
                            source={require('../../assets/fab.png')}
                            style={[styles.fabButton]}/>
                    </TouchableOpacity>
                </Animated.View>


            </View>
        );
    }

    backButtonHandle() {
    }

    settingsButtonHandle() {
        const navState = this.props.navigation.state;
        this.props.navigation.navigate('ProfileSettings', {...navState.params});
    }

    onActionClick = (position) => {
        switch (position) {
            case 0:
                return this.settingsButtonHandle()
        }
    }
    onFabButtonPress = () => {
        console.warn('axax')
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        borderRadius: 60,
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
        fontSize: 28,
    },
    scrollViewContent: {
        marginTop: HEADER_MAX_HEIGHT,
    },
    backButton: {
        marginLeft: 16
    },
    settingsButton: {
        marginRight: 16,
    },
    headerSection: {
        marginLeft: 16.5,
        marginTop: 35,
        marginBottom: 13,
        color: '#2586C6',
        fontSize: 16.5
    },
    fabButton: {
        width: 56,
        height: 56,
    },
    back: {
        height: 24,
        width: 24,
    },
    settings: {
        height: 24,
        width: 24,
    },
    toolbar: {
        height: TOOLBAR_HEIGHT,
        marginTop: StatusBar.currentHeight,
        backgroundColor: 'transparent'
    },
    fabContainer: {
        top: HEADER_MAX_HEIGHT - 28,
        position: 'absolute',
        overflow: 'hidden',
        right: 24.5,
    }
});

export default connect(
    (state) => ({
        user: state.user,
    }),
    (dispatch) => ({})
)(Profile);