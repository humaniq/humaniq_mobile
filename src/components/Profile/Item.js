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

import CustomStyleSheet from '../../utils/customStylesheet';

class Item extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {item} = this.props
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.itemContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            resizeMode='contain'
                            style={styles.image}
                            source={require('../../assets/cat.jpg')}/>
                        <Image
                            resizeMode='contain'
                            style={styles.image2}
                            source={require('../../assets/trans_incoming.png')}/>
                    </View>

                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                            <Text style={styles.phone}>
                                {item.phone}
                            </Text>

                            <View style={styles.rightContainer}>
                                <Text style={{fontSize: 16 , color: '#000000'}}>+12.<Text style={{color: '#8B8B8B', fontSize: 14}}>08 HMQ</Text></Text>
                                <Image
                                    style={styles.statusImage}
                                    source={require('../../assets/done.png')}/>
                            </View>
                        </View>

                        <View style={styles.divider}/>

                    </View>
                </TouchableOpacity>
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
        color: '#000000',
        fontSize: 15,
        flex: 1
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
    }
});

export default Item