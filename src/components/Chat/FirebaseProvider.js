import firebase from 'firebase';
export default class FirebaseProvider {
  let uid = ''
  constructor(authKeys) {
    firebase.initializeApp(authKeys);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
      } else {
        firebase.auth().signInAnonymously().catch((error) => {
          alert(error.message);
        });
      }
    });
  }

}