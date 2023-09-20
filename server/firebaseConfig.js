// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import  { getFireStore } from  "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDEMQ2-Lpui9zGgxcUOIar5a4vyG1_giOs",
    authDomain: "deliveryservice-53ecb.firebaseapp.com",
    projectId: "deliveryservice-53ecb",
    storageBucket: "deliveryservice-53ecb.appspot.com",
    messagingSenderId: "227157398737",
    appId: "1:227157398737:web:446cf83452e4bd9e4021f0",
    measurementId: "G-5JHCJ5ZRHL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getFireStore(app);