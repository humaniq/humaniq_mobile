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
    TextInput
} from 'react-native';

import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import CustomStyleSheet from '../../utils/customStylesheet';

export class ProfileEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: 'Djamshid',
            surname: 'Djuraev',
        };
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="#598FBA"
                />
                <ToolbarAndroid
                    style={styles.toolbar}
                    onIconClicked={() => this.handleClose()}
                    navIcon={require('../../assets/close_white.png')}
                    actions={[{title: 'Settings', icon: require('../../assets/edit_white.png'), show: 'always'}]}/>

                <View style={styles.content}>
                    <View
                        style={styles.avatarInfoContainer}>
                        <TouchableOpacity>
                            <View style={styles.avatarContainer}>
                                <Image
                                    resizeMode='contain'
                                    style={styles.avatar}
                                    source={require('../../assets/1.png')}/>
                                <View style={[{
                                    position: 'absolute',
                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                }, styles.avatar]}/>

                                <Image
                                    style={styles.photoHolder}
                                    source={require('../../assets/photo_white.png')}
                                    resizeMode='contain'/>

                            </View>
                        </TouchableOpacity>

                        <View style={styles.infoContainer}>
                            <Text style={styles.title}>+1 (234) 567-8901</Text>
                            <View style={styles.statusContainer}>
                                <Text style={styles.statusText}>offline</Text>
                                <View style={styles.status}/>
                            </View>

                        </View>
                    </View>

                    {/* render inputs*/}
                    {this.renderInputs()}
                </View>
            </View>

        )
    }

    handleClose = () => {
        const backAction = NavigationActions.back({
            key: null,
        });
        this.props.navigation.dispatch(backAction);
    }

    renderInputs() {
        return(
            <View style={{marginTop: 20}}>
                <TextInput
                    ref="name"
                    value={this.state.name}
                    onChangeText={(text) => this.setState({name: text})}
                    style={[styles.input]}
                    selectionColor={'#000'}
                    underlineColorAndroid='#37a9f0'
                    autoCapitalize='sentences'/>
                <TextInput
                    ref="surname"
                    value={this.state.surname}
                    onChangeText={(text) => this.setState({surname: text})}
                    style={styles.input}
                    underlineColorAndroid='#37a9f0'
                    autoCapitalize='sentences'/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    status: {
        borderColor: '#999999',
        width: 10,
        height: 10,
        borderRadius: 40,
        marginLeft: 5,
        marginTop: 4,
        borderWidth: 2
    },
    avatarInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 60,
    },
    infoContainer: {marginLeft: 13},
    title: {
        color: '#212121',
        fontSize: 21,
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
    input: {
        fontSize: 18,
        color: '#212121',
        paddingBottom: 16,
        paddingTop: 16
    },
    toolbar: {
        height: 56,
        marginTop: StatusBar.currentHeight,
        backgroundColor: '#598FBA'
    },
    content: {
        marginTop: 24,
        marginLeft: 24,
        marginRight: 24
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    photoHolder: {
        position: 'absolute',
        height: 24,
        width: 24
    },
    statusText: {
        fontSize: 16.5,
        color: '#999999'
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default connect(
    (state) => ({
        user: state.user,
    }),
    (dispatch) => ({})
)(ProfileEdit);