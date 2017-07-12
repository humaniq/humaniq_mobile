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

class QrModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {onClipboardClick, visibility} = this.props

        return(
            <View>
                <Modal
                    onRequestClose={() => {}}
                    animationType={"fade"}
                    transparent={true}
                    visible={visibility}>
                    <View style={styles.rootContainer}>
                        <View style={styles.content}>
                            <Image
                                source={require('../assets/qrcode.jpg')}
                                resizeMode='contain'
                                style={styles.image}/>

                            <View style={{backgroundColor: '#e0e0e0', height: 1}}/>
                            <TouchableOpacity
                                onPress={onClipboardClick}
                                style={{margin: 17, alignItems: 'center'}}>
                                <Image
                                    resizeMode='contain'
                                    style={styles.clipboard}
                                    source={require('../assets/copy_blue.png')}/>
                            </TouchableOpacity>


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
    },
    image: {
        width: null,
        height: 270,
        margin: 28
    },
    clipboard: {
        width: 28,
        height: 28,
    }
});

export default QrModal