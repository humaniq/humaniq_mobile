import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  StatusBar,
  PermissionsAndroid,
  Alert
} from 'react-native';
import CustomStyleSheet from '../../../utils/customStylesheet';
import ConfirmButton from '../Buttons/ConfirmButton';
import HelpButton from '../Buttons/HelpButton';
// assets
const cameraIllustration = require('../../../assets/icons/camera_illustration.png');
const passwordIllustration = require('../../../assets/icons/password_illustration.png');
const telephoneIllustration = require('../../../assets/icons/telephone_illustration.png');
// const play = require('../../../assets/icons/ic_play.png');
const Permissions = require('react-native-permissions');

export default class Tutorial extends Component {
  static propTypes = {
    // nextScene: PropTypes.string.isRequired,
  };
  static navigationOptions = {
    // header: null,
  };

  state = {
    watched: false,
    nextScene: 'Camera',
  };

  componentWillMount() {
    const navState = this.props.navigation.state;
    if (navState.params && navState.params.nextScene) {
      const nextScene = this.props.navigation.state.params.nextScene;
      this.setState({ nextScene });
    }
  }

  componentDidMount() {
    //this.getMyGeoLocation();
    Permissions.request('location')
      .then(response => {
        //returns once the user has chosen to 'allow' or to 'not allow' access
        //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        this.setState({ photoPermission: response })
        console.log(response);
        Alert.alert(
          response,
        )
      });
  }

  handleConfirmPress = () => {
    const navState = this.props.navigation.state;
    this.props.navigation.navigate(this.state.nextScene, { ...navState.params });
  };

  handleHelpPress = () => {
    this.props.navigation.navigate('Instructions');
  };

  async getMyGeoLocation() {
    // Permissions.request('location')
    //   .then(response => {
    //     //returns once the user has chosen to 'allow' or to 'not allow' access
    //     //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    //     this.setState({ photoPermission: response })
    //     console.log(response);
    //     Alert.alert(
    //       "You can use the camera",
    //     )
    //   });

    // try {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     {
    //       'title': 'Cool Photo App Camera Permission',
    //       'message': 'Cool Photo App needs access to your camera ' +
    //                  'so you can take awesome pictures.'
    //     }
    //   )
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     Alert.alert(
    //       "You can use the camera",
    //     )
    //   } else {
    //     Alert.alert(
    //       "Camera permission denied",
    //     )
    //   }
    // } catch (err) {
    //   console.warn(err)
    // }

    //navigator.geolocation.requestAuthorization();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //var initialPosition = JSON.stringify(position);
        let c = {
          latitude: Number(position.coords.latitude), // selected marker lat
          longitude: Number(position.coords.longitude) // selected marker lng
        }
        Alert.alert(
          "Geo",
          Number(position.coords.latitude) + " " + Number(position.coords.longitude)
        )
        //var { region } = this.state.userCurrentRegion;


        /*this.setState({
            userCurrentRegion: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: this.state.userCurrentRegion.latitudeDelta,
                longitudeDelta: this.state.userCurrentRegion.longitudeDelta
            }
        });*/
      },
      (error) => {
        console.log(error);
        Alert.alert(
          "Geo",
          error.message + " " + error.code
        )
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    let source = "";
    switch (this.state.nextScene) {
      case "Camera":
        source = cameraIllustration;
        break;
      case "Password":
        source = passwordIllustration;
        break;
      case "TelInput":
        source = telephoneIllustration;
        break;
      default:
        break;
    }

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor='#3aa3e3'
        />
        <Image style={styles.illustration} source={source} />
        <View style={styles.buttonsContainer}>
          {/*<HelpButton onPress={this.handleHelpPress} />*/}
          <ConfirmButton onPress={this.handleConfirmPress} containerStyle={{ flex: 1 }} />
        </View>
      </View>
    );
  }
}

const styles = CustomStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '$cBrand',
  },
  illustration: {
    width: "100%",
    height: "100%"
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    height: 77,
    flexDirection: 'row',
    padding: 16,
  },
});
