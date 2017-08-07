import RNFetchBlob from 'react-native-fetch-blob';

const API_ROOT = 'https://beta-api.humaniq.co/tapatybe/api/v1/';

function callApi(endpoint, body) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
  console.log('api request body', fullUrl, body);
  // console.log('full url', fullUrl);
  return RNFetchBlob.fetch(
    'POST',
    fullUrl,
    {
      'Content-Type': 'application/json',
    },
    JSON.stringify(body),
  )
    .then((response) => {
      console.log('API response', response);
      return response.json();
    })
    .then((response) => {
      // let code = response.code.toString();
      // if (code.slice(0, 1) == 4) {
      //   return Promise.reject(response);
      // }
      return { response };
    })
    .catch(error => ({ response: { error: error.toString() } }));
}

export const validate = body => callApi('registered', body);
export const login = body => callApi('authenticate/user', body);
export const signup = body => callApi('registration', body);
export const phoneNumberCreate = body => callApi('account/phone_number', body);
export const phoneNumberValidate = body => callApi('account/phone_number/validate', body);
export const faceEmotionCreate = body => callApi('facial_recognition/validation', body);
export const faceEmotionValidate = body => callApi('facial_recognition/validate', body);
