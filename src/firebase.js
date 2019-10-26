import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
   apiKey: "AIzaSyDVSQ7MCZfMdNigAt2aD1Dy0_8HZWGpXF4",
   authDomain: "react-slack-clone-a4778.firebaseapp.com",
   databaseURL: "https://react-slack-clone-a4778.firebaseio.com",
   projectId: "react-slack-clone-a4778",
   storageBucket: "react-slack-clone-a4778.appspot.com",
   messagingSenderId: "212164971159",
   appId: "1:212164971159:web:3c575b0dac7566c3"
 };

 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 export default firebase;