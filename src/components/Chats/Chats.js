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
      >
        {this.renderScrollViewContent()}
      </ScrollView>
    );
  }

  renderScrollViewContent() {
    const { chats, navigation: { navigate } } = this.props;
    return (
      <View style={styles.scrollViewContent}>
        {chats.map((child, childIndex) => (
          <View key={child.id}>
            <Item
              item={child}
              currentIndex={childIndex}
              size={1}
              onClick={() => navigate('Chat', { id: child.id })}
            />
          </View>
          ))}
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text> header </Text>
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
    backgroundColor: '#fff',
  },
});

/*
export default connect(
  state => ({
    user: state.user,
  }),
  dispatch => ({}),
)(Chats);
*/

const mapStateToProps = state => ({
  chats: state.chats,
});

export default connect(mapStateToProps)(Chats);
