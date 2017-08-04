import RNFetchBlob from 'react-native-fetch-blob';

export const downloadVideo = (url, name) => {
  const path = `${RNFetchBlob.fs.dirs.CacheDir}/videocache/${name}`;
  return RNFetchBlob.fs.exists(path).then((exists) => {
    if (exists) {
      return path;
    }
    return RNFetchBlob.config({ path })
      .fetch('GET', url)
      .then(res => res.path())
      .catch((err) => {
        console.warn(`error ${JSON.stringify(err)}`);
        return deleteFile(path);
      });
  });
};

export const deleteFile = path => RNFetchBlob.fs.stat(path)
  .then(res => res && res.type === 'file')
  .then(exists => exists && RNFetchBlob.fs.unlink(path)) // if file exist
  .catch((err) => {
    console.log('delete file error', err);
  });
