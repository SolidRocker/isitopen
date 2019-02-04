import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBInD94CgoHB6Z6tR1qooFIahjVIUd6uMg",
    authDomain: "glints-d7a40.firebaseapp.com",
    databaseURL: "https://glints-d7a40.firebaseio.com",
    projectId: "glints-d7a40",
    storageBucket: "glints-d7a40.appspot.com",
    messagingSenderId: "528186558960"
};

firebase.initializeApp(config);
var db = firebase.firestore();

export default db;