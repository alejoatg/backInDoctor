import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.db = app.firestore();
    this.auth = app.auth();
  }
}

const firebase = new Firebase();
export default firebase;
