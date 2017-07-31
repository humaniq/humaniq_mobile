import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    TextInput
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CustomStyleSheet from '../../utils/customStylesheet';
import VMasker from 'vanilla-masker';
import Confirm from '../Shared/Buttons/Confirm';
import PhoneKeyboard from '../Shared/Components/PhoneKeyboard';
import ConfirmButton from '../Shared/Buttons/ConfirmButton';
import HelpButton from '../Shared/Buttons/HelpButton';
import { phoneNumberCreate, savePhone } from '../../actions';
import { vw } from '../../utils/units';

const ic_user = require('../../assets/icons/ic_user.png');

export class SmsCodeInput extends Component {
    static propTypes = {
        user: PropTypes.shape({
            account: PropTypes.shape({
                payload: PropTypes.object,
                isFetching: PropTypes.bool,
            }).isRequired,
            phoneCreate: PropTypes.shape({
                payload: PropTypes.object,
                isFetching: PropTypes.bool,
            }).isRequired,
            photo: PropTypes.string.isRequired,
            phoneNumber: PropTypes.string,
        }).isRequired,

        phoneNumberCreate: PropTypes.func.isRequired,
        savePhone: PropTypes.func.isRequired,
        navigation: PropTypes.shape({
            navigate: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
        }),
    };

    state = {
        phone: '',
        code: '',
        codeError: new Animated.Value(0)
    };

    componentWillReceiveProps(nextProps) {
        // TODO: MOVE TO SAGA TO PREVENT LAG
        console.log(nextProps);
        console.log('📞 nextProps', nextProps.user);
        /*if (nextProps.user.phoneCreate.payload) {
          const code = nextProps.user.phoneCreate.payload.code;
          const phone = nextProps.user.phoneNumber;
    
          if (!phone) {
            switch (code) {
              case 6000:
                alert(nextProps.user.phoneCreate.payload.message);
                break;
    
              case 4005:
                // registered user
                // Account Phone Number Created Successfully. Validation Code Sent
                this.props.savePhone(VMasker.toNumber(this.state.phone));
                this.props.navigation.navigate('CodeInput');
                // alert('Proceed to codeInput');
                break;
    
              case 4011:
                // The Account Already Has A Phone Number
                alert('The Account Already Has A Phone Number');
                // this.props.setAvatarLocalPath(this.state.path);
                // this.props.navigation.navigate('Tutorial', { nextScene: 'Password' });
                break;
    
              default:
                alert(`Unknown code ${nextProps.user.phoneCreate.payload.code}, no info in Postman`);
            }
          }
        }*/
    }

    handleNumberPress = (number) => {
        const c = this.state.code + number;
        console.log(c.length);
        if (c.length < 7) {
            this.setState({ code: c });
        } else {
            this.setState({error: true});
            this.animatePasswordError();
        }
    };

    handleBackspacePress = () => {
        const code = this.state.code.slice(0, -1);
        this.setState({ code: code });
    };

    handleHelpPress = () => {
        this.props.navigation.navigate('Instructions');
    };

    handlePhoneConfirm = () => {
        const phone_number = this.state.smscode;
    };

    animatePasswordError = () => {
        Animated.sequence([
            Animated.timing(this.state.codeError, {
                toValue: vw(20),
                duration: 50,
            }),
            Animated.timing(this.state.codeError, {
                toValue: vw(-20),
                duration: 100
            }),
            Animated.timing(this.state.codeError, {
                toValue: vw(20),
                duration: 100,
            }),
            Animated.timing(this.state.codeError, {
                toValue: vw(-20),
                duration: 100,
            }),
            Animated.timing(this.state.codeError, {
                toValue: vw(0),
                duration: 50,
            }),
        ]).start(() => { this.setState({ error: null }) });
    }

    renderInput = () => {
        return (
            VMasker.toPattern(this.state.code, { pattern: "999999", placeholder: "0" }).split("").map((o, i) => {
                if (i == 2) {
                    return [
                        <View style={[styles.numberContainer, this.state.error ? styles.errorContainer : null]}>
                            <Text style={[styles.codeInput, this.state.error ? styles.errorText : null]}>
                                {o}
                            </Text>
                        </View>,
                        <View style={[styles.numberContainer, this.state.error ? styles.errorContainer : null]}>
                            <Text style={[styles.codeInput, this.state.error ? styles.errorText : null]}>
                                {"-"}
                            </Text>
                        </View>
                    ]
                }
                return (
                    <View style={[styles.numberContainer, this.state.error ? styles.errorContainer : null]}>
                        <Text style={[styles.codeInput, this.state.error ? styles.errorText : null]}>
                            {o}
                        </Text>
                    </View>
                )
            })
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Animated.View style={[styles.codeInputContainer, { marginLeft: this.state.codeError }]}>
                        {this.renderInput() }
                    </Animated.View>
                </View>
                <View style={styles.buttonsContainer}>
                    <HelpButton onPress={this.handleHelpPress} />
                    <ConfirmButton onPress={this.handlePhoneConfirm} />
                </View>
                <PhoneKeyboard
                    onNumberPress={this.handleNumberPress}
                    onBackspacePress={this.handleBackspacePress}
                    onHelpPress={this.handleHelpPress}
                    />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps, {
    phoneNumberCreate: phoneNumberCreate.request,
    savePhone,
})(SmsCodeInput);

const styles = CustomStyleSheet({
    container: {
        flex: 1,
        backgroundColor: '#439fe0',
    },
    header: {
        flex: 1,
        paddingTop: 120,
        paddingLeft: 16,
        paddingRight: 16
    },
    codeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 72,
        width: 328,
    },
    numberContainer: {
        width: 30,
        height: 56,
        borderBottomWidth: 1,
        borderColor: 'white',
        marginRight: 12,
        justifyContent: 'center'
    },
    codeInput: {
        marginTop: 4,
        lineHeight: 36,
        fontSize: 36,
        textAlign: 'center',
        color: 'white',
    },
    dash: {
        lineHeight: 36,
        fontSize: 18,
        width: 36,
        height: 56,
        color: 'white',
        textAlign: 'center',
    },
    buttonsContainer: {
        height: 61,
        width: 360,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16
    },
    errorContainer: {
        borderBottomColor: "#f01434"
    },
    errorText: {
        color: "#f01434"
    }
});
