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

} from 'react-native';

const user1 = require('../../assets/1.png')
const user2 = require('../../assets/2.png')

const incoming = require('../../assets/trans_incoming.png')
const outgoing = require('../../assets/trans_payment.png')

import CustomStyleSheet from '../../utils/customStylesheet';

class Item extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {item, currentIndex, size, onClick} = this.props
        let priceBeforePoint = item.amount.split('.')[0]
        let priceAfterPoint = item.amount.split('.')[1]
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={onClick}
                    style={styles.itemContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            resizeMode='contain'
                            style={styles.image}
                            source={item.type == 0 ? user1: user2}/>
                        <Image
                            resizeMode='contain'
                            style={styles.image2}
                            source={item.type == 0 ? incoming : outgoing}/>
                    </View>

                    <View style={{flex: 1}}>
                        <View style={styles.transactionContainer}>
                            {item.type == 0 ? this.renderPhone(item) : this.renderNameWithPhone(item)}

                            <View style={styles.rightContainer}>
                                <Text style={styles.priceInt}>
                                    {priceBeforePoint}
                                    <Text style={styles.priceDecimal}>
                                        { priceAfterPoint ? '.' + priceAfterPoint : '.00'} {item.currency}</Text>
                                </Text>
                                <Image
                                    style={styles.statusImage}
                                    source={require('../../assets/done.png')}/>
                            </View>
                        </View>

                        {currentIndex%2 == 0 ? <View style={styles.divider}/> : null}

                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderPhone = (item) => {
        return(
            <View style={{flex: 1}}>
                <Text style={styles.phone}>
                    {item.phone}
                </Text>
            </View>
        )
    }

    renderNameWithPhone = (item) => {
        return(
            <View style={{flex: 1}}>
                <Text style={styles.name}>
                    {item.name + ' ' +item.surname}
                </Text>
                <Text style={styles.phoneSmall}>
                    {item.phone}
                </Text>
            </View>
        )
    }
}

const styles = CustomStyleSheet({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        marginLeft: 14,
        marginRight: 8,
        marginTop: 8,
        marginBottom: 10,
        alignItems: 'center'
    },
    image: {
        height: 39,
        width: 39,
        borderRadius: 100,
    },
    image2: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 17.5,
        height: 17.5,
    },
    phone: {
        color: '#1b1d1d',
        fontSize: 15,
    },
    phoneSmall: {
        color: '#1b1d1d',
        fontSize: 12,
    },
    name: {
        color: '#1b1d1d',
        fontSize: 15,
    },
    rightContainer: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    imageContainer: {
        paddingRight: 4,
        paddingBottom: 4,
        marginRight: 16
    },
    statusImage: {
        width: 15,
        height: 15
    },
    divider: {
        backgroundColor: '#E0E0E0',
        height: 0.5,
        marginTop: 15.5
    },
    transactionContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    priceInt: {
        fontSize: 16 ,
        color: '#000000'
    },
    priceDecimal: {
        color: '#8B8B8B',
        fontSize: 14
    }
});

export default Item