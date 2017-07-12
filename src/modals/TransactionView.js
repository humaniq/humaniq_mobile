import React, {Component, PropTypes} from 'react';
import {
    ActivityIndicator,
    AppRegistry,
    AsyncStorage,
    StyleSheet,
    Image,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    StatusBar,
    TouchableOpacity,
    ToastAndroid,
    Navigator,
    ScrollView,
    ListView,
    Platform,
    Dimensions,
    Modal,
    TextInput,
    View,
    Alert,
} from 'react-native';

class TransactionView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {onChatClick, visibility, item} = this.props
        let priceBeforePoint = item.amount ? item.amount.split('.')[0] : ''
        let priceAfterPoint = item.amount ? item.amount.split('.')[1] : ''

        return (
            <View>
                <Modal
                    onRequestClose={onChatClick}
                    animationType={"fade"}
                    transparent={true}
                    visible={visibility}>

                    <View style={styles.rootContainer}>
                        <View style={styles.content}>

                            <View style={styles.header}>
                                <View style={{flexDirection: 'row', flex: 1}}>
                                    <Text style={styles.date}>{item.time}</Text>
                                    <Image
                                        style={styles.statusImage}
                                        source={require('../assets/done.png')}/>
                                </View>

                                <TouchableOpacity onPress={onChatClick}>
                                    <Image
                                        resizeMode='contain'
                                        style={styles.chat}
                                        source={require('../assets/chat_blue.png')}/>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.avatarContainer}>
                                <Image
                                    resizeMode='contain'
                                    style={styles.avatar}
                                    source={item.type == 1 ? require('../assets/2.png') : require('../assets/1.png')}/>
                                <Image
                                    resizeMode='contain'
                                    style={styles.image2}
                                    source={item.type == 1 ? require('../assets/trans_payment.png') : require('../assets/trans_incoming.png')}/>
                            </View>

                            <Text style={styles.name}>{item.name + ' ' + item.surname}</Text>
                            <Text style={styles.phone}>{item.phone}</Text>

                            <View style={styles.priceContainer}>
                                <Text style={styles.priceInt}>
                                    {priceBeforePoint + '.'}
                                    <Text style={styles.priceDecimal}>
                                        { priceAfterPoint ? priceAfterPoint : '00'} {item.currency}</Text>
                                </Text>
                            </View>

                            <Text style={styles.price}>19.87 $</Text>

                        </View>
                    </View>

                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rootContainer: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.68)'
    },
    content: {
        margin: 16,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 18
    },
    date: {
        fontSize: 14,
        color: '#1b1d1d',
        marginRight: 9,
    },
    statusImage: {
        width: 20,
        height: 20,
    },
    chat: {
        width: 30,
        height: 30,
    },
    avatar: {
        width: 100,
        height: 100
    },
    avatarContainer: {
        paddingRight: 8,
        paddingBottom: 8,
        marginTop: 20,
        marginBottom: 20,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    image2: {
        position: 'absolute',
        right: -5,
        bottom: -5,
        width: 35,
        height: 35,
    },
    name: {
        fontSize: 18,
        color: '#1b1d1d'
    },
    phone: {
        fontSize: 14,
        color: '#1b1d1d'
    },
    priceContainer: {
        marginTop: 25
    },
    priceInt: {
        fontSize: 30 ,
        color: '#212121'
    },
    priceDecimal: {
        color: '#8b8b8b',
        fontSize: 18
    },
    price: {
        fontSize: 16,
        color: '#4d4d4d',
        marginBottom: 30
    }
});

export default TransactionView