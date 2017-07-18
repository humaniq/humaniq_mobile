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

const backWhite = require('../../assets/icons/back_white.png');
const searchWhite = require('../../assets/icons/search_white.png');

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
            [<View style={styles.section}>
                <View style={{ width: 64, backgroundColor: 'red' }}>
                </View>
                <View style={{ width: 296}}>
                    <View style={{ height: 56, backgroundColor: 'red' }}/>
                    <View style={{ height: 56 }}/>
                </View>
            </View> ,
            <View style={styles.section}>
                <View style={{ width: 64, backgroundColor: 'red' }}>
                </View>
                <View style={{ width: 296}}>
                    <View style={{ height: 56, backgroundColor: 'red' }}/>
                    <View style={{ height: 56 }}/>
                </View>
            </View>]
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton}>
                        <Image source={backWhite}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.searchButton}>
                        <Image source={searchWhite}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <ScrollView style={styles.scroll}>
                        {
                            this.renderSection()
                        }
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
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '$cBrand_dark',
        height: 56,
        justifyContent: 'space-between',
    },
    backButton: {
        height: 24,
        width: 24,
        margin: 16
    },
    searchButton: {
        height: 24,
        width: 24,
        margin: 16
    },
    section: {
        flexDirection: 'row'
    },
    row: {
        flex: 1,
    },
    scroll: {
        flex: 1,
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
