/**
 * Created by root on 7/6/17.
 */
import RNFetchBlob from 'react-native-fetch-blob';

export const downloadVideo = (url, name) => {
    const path = RNFetchBlob.fs.dirs.CacheDir + '/videocache/' + name;
    return RNFetchBlob.fs.exists(path).then(exists => {
        if (exists) {
            return path
        } else {
            return RNFetchBlob.config({path})
            .fetch('GET', url)
            .then((res) => res.path())
            .catch(err => {
                console.warn('error ' + JSON.stringify(err))
                return deleteFile(path)
            })
        }
    })
}

export const deleteFile = (path) => {
    return RNFetchBlob.fs.stat(path)
    .then(res => res && res.type === 'file')
    .then(exists => exists && RNFetchBlob.fs.unlink(path)) //if file exist
    .catch((err) => {
    });
}