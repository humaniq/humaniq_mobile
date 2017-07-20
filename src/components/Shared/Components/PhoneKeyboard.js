import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
import CustomStyleSheet from '../../../utils/customStylesheet';

const ic_help = require('../../../assets/icons/ic_help.png');
const backspaceDark = require('../../../assets/icons/backspace_dark.png');


export default class PhoneKeyboard extends Component {
    static propTypes = {
        color: PropTypes.string,
        onNumberPress: PropTypes.func.isRequired,
        onBackspacePress: PropTypes.func.isRequired,
        onHelpPress: PropTypes.func.isRequired,
    };

    renderRow = (numbersArray) => {
        const cells = numbersArray.map((val, idx, arr) => this.renderCell(val, idx, arr));
        return (
            <View style={styles.row}>
                {cells}
            </View>
        );
    };

    renderCell = (number) => {
        const middleCellValues = [2, 5, 8, 0];
        return (
            <TouchableOpacity
                style={[
                    styles.cell,
                    middleCellValues.includes(number) && styles.middleCell,
                ]}
                key={number}
                accessibilityLabel={number.toString() }
                onPress={() => {
                    this.props.onNumberPress(number.toString());
                } }
                >
                <Text style={[styles.number, { color: this.props.color }]}>{number}</Text>
            </TouchableOpacity>
        );
    };

    renderBackspace = () => (
        <TouchableOpacity
            style={styles.backspace}
            onPress={this.props.onBackspacePress}
            >
            <Image source={backspaceDark}/>
        </TouchableOpacity>
    );

    renderNext = () => (
        <TouchableOpacity
            style={styles.cell}
            onPress={this.props.onHelpPress}
            >
            <Text style={styles.next}>{"Next"}</Text>
        </TouchableOpacity>
    );

    render() {
        return (
            <View style={styles.container}>
                {this.renderRow([1, 2, 3]) }
                {this.renderRow([4, 5, 6]) }
                {this.renderRow([7, 8, 9]) }
                <View style={styles.row}>
                    {this.renderBackspace() }
                    {this.renderCell(0) }
                    {this.renderNext() }
                </View>
            </View>
        );
    } // render
} // return

const styles = CustomStyleSheet({
    container: {
        width: 360,
        height: 248,
        paddingLeft: 3,
        paddingRight: 3,
        backgroundColor: 'white'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#D8D8D8',
    },
    number: {
        fontSize: 35,
        color: '#4a4a4a',
        textAlign: 'center',
    },
    backspace: {
        height: 50.5,
        width: 108.5,
        margin: 5,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 6
    },
    next: {
        fontSize: 20,
        color: '#4a4a4a',
        textAlign: 'center',
    },
    cell: {
        height: 50.5,
        width: 108.5,
        margin: 5,
        elevation: 2,
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 6
    },
    middleCell: {
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#CACCCC',
        borderRightColor: '#CACCCC',
    },
});
