import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyBj59ntrPf0WTAn-EXNC7lfc80rHoufdfI",
  authDomain: "diet-e419d.firebaseapp.com",
  databaseURL: "https://diet-e419d-default-rtdb.firebaseio.com",
  projectId: "diet-e419d",
  storageBucket: "diet-e419d.appspot.com",
  messagingSenderId: "365168080680",
  appId: "1:365168080680:web:780fe5497922b31643c21d",
  measurementId: "G-C0DDBXX61Z",
};

var fire = firebase.initializeApp(firebaseConfig);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default fire;
