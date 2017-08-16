const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');

const {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
} = ReactNative;
const Button = require('./Button');

const ic_contacts = require('../../assets/icons/two_person_dark.png');
const ic_chat_white = require('./../../assets/icons/ic_chat_white.png');
const ic_group = require('../../assets/icons/ic_one_person.png');

const DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: ViewPropTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler, image) {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props;
    const textColor = isTabActive ? 'white' : '#A8BED1';
    const fontWeight = isTabActive ? 'bold' : 'normal';

    return (<Button
      style={{ flex: 1 }}
      key={name}
      accessible
      accessibilityLabel={name}
      accessibilityTraits="button"
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle]}>
        {/* <Text style={[{ color: textColor, fontWeight }, textStyle]}> */}
        {/* {name} */}
        {/* </Text> */}
        <View>
          <Image
            resizeMode="contain"
            style={{ height: 27, tintColor: textColor }}
            source={this.getIcon(page)}
          />
          {isTabActive ? <View style={styles.onlineStatus}/> : null}
        </View>

      </View>
    </Button>);
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: 65,
      height: 2,
      backgroundColor: 'white',
      bottom: 0,
    };

    const translateX = this.props.scrollValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 65],
    });
    return (
      <View style={[styles.tabs, { backgroundColor: '#598fba' }, this.props.style]}>
        {this.props.tabs.map((name, page, image) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage, image);
        })}
        <Animated.View
          style={[
            tabUnderlineStyle,
            {
              transform: [
                    { translateX },
              ],
            },
            this.props.underlineStyle,
          ]}
        />
      </View>
    );
  },

  getIcon(key) {
    switch (key) {
      case 0:
        return ic_contacts;
      case 1:
        return ic_chat_white;
      case 2:
        return ic_group;
    }
  },
});

const styles = StyleSheet.create({
  tab: {
    justifyContent: 'center',
    width: 65,
    alignItems: 'center',
  },
  tabs: {
    height: 56,
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
  onlineStatus: {
    position: 'absolute',
    backgroundColor: '#7ed321',
    width: 10,
    height: 10,
    borderRadius: 40,
    marginLeft: 5,
    marginTop: 4,
    bottom: 0,
  },
});

module.exports = DefaultTabBar;
