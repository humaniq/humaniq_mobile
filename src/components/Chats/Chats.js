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
    ScrollView
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

const fakeTransactions = [
  {
    id: 1,
    phone: '+1 (416) 464 71 35',
    amount: '+12.08',
    type: 0, // incoming
    name: 'Серафим',
    surname: 'Петров',
    pic: '',
    time: '15.07.2017',
    currency: 'HMQ',
  },
  {
    id: 2,
    phone: '+1 (416) 464 71 35',
    amount: '+12.08',
    type: 0, // incoming
    name: 'Серафим',
    surname: 'Петров',
    pic: '',
    time: '14.07.2017',
    currency: 'HMQ',
  },
  {
    id: 3,
    phone: '+1 (416) 464 71 35',
    amount: '+12.08',
    type: 0, // incoming
    name: 'Серафим',
    surname: 'Петров',
    pic: '',
    time: '13.07.2017',
    currency: 'HMQ',
  },
  {
    id: 4,
    phone: '+1 (416) 464 71 35',
    amount: '+12.08',
    type: 0, // incoming
    name: 'Серафим',
    surname: 'Петров',
    pic: '',
    time: '13.07.2017',
    currency: 'HMQ',
  },
  {
    id: 5,
    phone: '+3 (116) 764 17 22',
    amount: '-44.08',
    type: 1, // outgoing
    name: 'Джамшид',
    surname: 'Джураев',
    pic: '',
    time: '14.07.2017',
    currency: 'HMQ',
  },
  {
    id: 6,
    phone: '+998 (97) 720 03 88',
    amount: '+100',
    type: 0, // incoming
    name: 'Иван',
    surname: 'Белявский',
    pic: '',
    time: '12.07.2017',
    currency: 'HMQ',
  },
  {
    id: 7,
    phone: '+998 (90) 144 34 07',
    amount: '+100',
    type: 0, // incoming
    name: 'Заир',
    surname: 'Огнев',
    pic: '',
    time: '12.07.2017',
    currency: 'HMQ',
  },
  {
    id: 8,
    phone: '+971 (58) 273 77 93',
    amount: '+400',
    type: 0, // incoming
    name: 'Дониер',
    surname: 'Эркабоев',
    pic: '',
    time: '12.07.2017',
    currency: 'HMQ',
  },
  {
    id: 9,
    phone: '+971 (58) 273 77 93',
    amount: '+400',
    type: 0, // incoming
    name: 'Дониер',
    surname: 'Эркабоев',
    pic: '',
    time: '11.07.2017',
    currency: 'HMQ',
  },
  {
    id: 10,
    phone: '+971 (58) 273 77 93',
    amount: '+400',
    type: 0, // incoming
    name: 'Дониер',
    surname: 'Эркабоев',
    pic: '',
    time: '11.07.2017',
    currency: 'HMQ',
  },
  {
    id: 11,
    phone: '+971 (58) 273 77 93',
    amount: '+400',
    type: 0, // incoming
    name: 'Дониер',
    surname: 'Эркабоев',
    pic: '',
    time: '14.07.2017',
    currency: 'HMQ',
  },
  {
    id: 12,
    phone: '+971 (58) 273 77 93',
    amount: '+400',
    type: 0, // incoming
    name: 'Дониер',
    surname: 'Эркабоев',
    pic: '',
    time: '10.07.2017',
    currency: 'HMQ',
  },
  {
    id: 13,
    phone: '+971 (58) 273 77 93',
    amount: '+400',
    type: 0, // incoming
    name: 'Дониер',
    surname: 'Эркабоев',
    pic: '',
    time: '11.07.2017',
    currency: 'HMQ',
  },
];

export class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderContent() {
    return (
      <ScrollView
        style={{ backgroundColor: '#fff' }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
      >
        {this.renderScrollViewContent()}
      </ScrollView>
    );
  }

  renderScrollViewContent() {
    return (
      <View style={styles.scrollViewContent}>
        {fakeTransactions.map((child, childIndex) => (
          <View key={child.id}>
            <Item
              item={child}
              currentIndex={childIndex}
              size={1}
              onClick={() => alert('Go to the chat')}
            />
          </View>
          ))}
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>

      </View>
    )
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.renderContent()}
      </View>
    );
  }

}

const screenMargin = 20;
const headerHeight = 60;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    marginTop: screenMargin,
    left: 0,
    right: 0,
    top: 0,
  },
  scrollViewContent: {
    marginTop: screenMargin + headerHeight,
    backgroundColor: '#fff',
  },
});

export default connect(
  state => ({
    user: state.user,
  }),
  dispatch => ({}),
)(Chats);
