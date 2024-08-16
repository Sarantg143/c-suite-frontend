import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_FTktrjjg-LxunTSEAnmFIXkn7QWWZzk",
  authDomain: "csuite-87770.firebaseapp.com",
  projectId: "csuite-87770",
  storageBucket: "csuite-87770.appspot.com",
  messagingSenderId: "381495381559",
  appId: "1:381495381559:web:62cd9d40cc7030ade339b2",
  measurementId: "G-MKTYBQG69P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth };