import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    StatusBar,
    Animated,
    ActivityIndicator,
    Dimensions,
    ToolbarAndroid,
    FlatList,
    ListView,
} from 'react-native';

import {connect} from 'react-redux';
import Item from './Item'
import * as constants from '../../utils/constants'
import TransactionView from '../../modals/TransactionView'

const HEADER_MAX_HEIGHT = 170;
const DELTA = 20;
const TOOLBAR_HEIGHT = 56;
const HEADER_MIN_HEIGHT = TOOLBAR_HEIGHT + StatusBar.currentHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

let fakeTransactions = [
    {
        phone: "+1 (416) 464 71 35",
        amount: "+12.08",
        type: 0, // incoming
        name: "Серафим",
        surname: "Петров",
        pic: '',
        time: '11.07.2017',
        currency: 'HMQ'
    },
    {
        phone: "+3 (116) 764 17 22",
        amount: "-44.08",
        type: 1, // outgoing
        name: "Джамшид",
        surname: "Джураев",
        pic: '',
        time: '11.07.2017',
        currency: 'HMQ'
    },
    {
        phone: "+998 (97) 720 03 88",
        amount: "+100",
        type: 0, //incoming
        name: "Иван",
        surname: "Белявский",
        pic: '',
        time: '12.07.2017',
        currency: 'HMQ'
    },
    {
        phone: "+998 (90) 144 34 07",
        amount: "+100",
        type: 0, //incoming
        name: "Заир",
        surname: "Огнев",
        pic: '',
        time: '12.07.2017',
        currency: 'HMQ'
    },
    {
        phone: "+971 (58) 273 77 93",
        amount: "+400",
        type: 0, //incoming
        name: "Дониер",
        surname: "Эркабоев",
        pic: '',
        time: '13.07.2017',
        currency: 'HMQ'
    },
]

export class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),
            modalVisibility: false,
            item: {},
        };
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

    // render list
    renderScrollViewContent() {
        let categoryMap = {}
        fakeTransactions.forEach((item, index) => {
            var category = item.time
            if (!categoryMap[category]) {
                categoryMap[category] = []
            }
            categoryMap[category].push(item)
        })

        return (
            <View style={styles.scrollViewContent}>
                {fakeTransactions.map((item, index) => {
                    return(
                        <View key={index}>
                            {index%2 == 0 ?this.renderHeaderSection(index) : null}
                            <Item item={item} currentIndex={index} size={fakeTransactions.length} onClick={() => this.onItemClick(item)}/>
                        </View>
                    )
                })}
            </View>
        );
    }

    renderHeaderSection = (index) => {
        return (
            <Text style={styles.headerSection}>{index+20}.09.2017</Text>
        )
    }
    renderItem = (categoryMap, parentIndex) => {
        return (
            <View key={i} style={{backgroundColor: '#fff'}}>
                {categoryMap.map((child) => {
                    return <Item item={child} currentIndex={i} size={categoryMap.length}/>
                })}
            </View>
        )
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
                {fakeTransactions.length > 0 ? this.renderContent() : this.renderEmptyView()}

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
                                source={require('../../assets/1.png')}/>
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
                            source={require('../../assets/fab1.png')}
                            style={[styles.fabButton]}/>
                    </TouchableOpacity>
                </Animated.View>

                <TransactionView
                    onChatClick={() => this.onChatClick()}
                    item={this.state.item}
                    visibility={this.state.modalVisibility}/>
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
    }

    renderContent() {
        return(
            <Animated.ScrollView
                style={{backgroundColor: '#fff'}}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                onScroll={
                        Animated.event([
                            { nativeEvent: { contentOffset: { y: this.state.scrollY } }
                            }],{ useNativeDriver: true})}>
                {this.renderScrollViewContent()}
            </Animated.ScrollView>
        )
    }

    renderEmptyView() {
        return(
            <View style={styles.emptyViewContainer}>
                <Image
                    resizeMode='contain'
                    style={styles.emptyImage}
                    source={require('../../assets/icons/illustration@1x.png')} />
            </View>
        )
    }

    onItemClick(item) {
        this.setState({
            item: item,
            modalVisibility: true
        })
    }

    onChatClick() {
        this.setState({
            modalVisibility: false
        })
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
        backgroundColor: '#fff',
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
        fontSize: 16.5,
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
    },
    emptyViewContainer: {
        marginTop: HEADER_MAX_HEIGHT,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyImage: {

    }
});

export default connect(
    (state) => ({
        user: state.user,
    }),
    (dispatch) => ({})
)(Profile);