import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';

export async function readFromStorage(path) {
    return RNFS.readFileAssets(path, 'base64');
    /*RNFetchBlob.fs.readFile(this.state.imagePath, 'base64')
  .then((data) => {
    this.setState({ imageB64: data });
    this.handleIsRegisteredCheck(data);
  })
  .catch(err => console.log('error converting image to base64', err));*/
}