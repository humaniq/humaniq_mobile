import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomStyleSheet from '../../utils/customStylesheet';

//const icHelp = require('../../../assets/icons/chat_white.png');
//const backSpaceWhite = require('../../../assets/icons/back_space_white.png');

export class CountryCode extends Component {
  static propTypes = {

    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.object,
    }),
  };

    renderSection = (letter, countryarray) => {
        return (
            <View>
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                </View>
                <View style={styles.row}>
                    <ScrollView style={styles.scroll}>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
});

export default connect(mapStateToProps)(CountryCode);

const styles = CustomStyleSheet({
    container: {
        flex: 1,
        backgroundColor: 'red'
    },
    header: {
        height: 56,
    },
    row: {
        flex: 1,
    },
    scroll: {

    },
    number: {
        fontSize: 30,
        textAlign: 'center',
        color: '$cPaper',
    },
    backspace: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 37.5,
    },
    help: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 23.5,
        marginRight: 14,
    },
    cell: {
        width: 23.5,
        borderRadius: 100,
        justifyContent: 'center',
    },
    middleCell: {
    },
});
