// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore  } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";


// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAbKa3tI0MQ86RwrVZUj3Ti7YHmcQS3HiU",
	authDomain: "weshare-2f750.firebaseapp.com",
	projectId: "weshare-2f750",
	storageBucket: "weshare-2f750.appspot.com",
	messagingSenderId: "26806537971",
	appId: "1:26806537971:web:5319857c5b57c82e693186",
	measurementId: "G-0DEK1S8BM3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage();

