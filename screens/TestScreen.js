import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import { db, auth } from "../constants/ApiKeys";

import * as firebase from "firebase";

import { TestComponent } from "./../components/AppComponents";
import LoginScreen from "./auth/LoginScreen";

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
    // console.log(this.props.user, "From testscreen");
    console.log(this.state.user, "From testscreen");
  }

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ["profile"],
      webClientId:
        "448806748779-mldp0sim81htt9oapau99r1647m26278.apps.googleusercontent.com",
      offlineAccess: true
    });
    this.setUser();
  }

  setUser = async () => {
    console.log(this.state.user, "From setUser");
    if (this.state.user) {
      var user = firebase.auth().currentUser;
      console.log(user, "from setUser If");
      let name, email, photoUrl, uid, emailVerified;

      // const usersRef = db.collection("users").doc(user.uid);

      if (this.state.user != null) {
        displayName = this.state.user.name;
        email = this.state.user.email;
        phoneNumber = this.state.user.phoneNumber;
        photoUrl = this.state.user.photo;
        emailVerified = this.state.user.emailVerified;
        uid = this.state.user.id; // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
      }
      // User is signed in.
      // console.log(user.uid, "From user");

      var userRef = db.collection("users").doc(uid);

      var getDoc = userRef
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");

            var data = {
              displayName,
              phoneNumber: "914-323-3456",
              email,
              photoUrl,
              uid
            };
            var setDoc = db
              .collection("users")
              .doc(uid)
              .set(data);

            var setWithOptions = setDoc.set(
              {
                capital: true
              },
              { merge: true }
            );
            console.log(uid, "Document added");
          } else {
            console.log("Document data:", doc.data());
          }
        })
        .catch(err => {
          console.log("Error getting document", err);
        });
    } else {
      // No user is signed in.
      return;
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  _signOut = async () => {
    try {
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
          console.log("Signed out");
        });
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      this.setState({ user: null, error: null });
    } catch (error) {
      this.setState({
        error
      });
    }
  };

  render() {
    // if (this.state.user === null) {
    //   return;
    // }
    return this.state.user === null ? (
      <LoginScreen />
    ) : (
      <View style={{ paddingTop: 20 }}>
        <TestComponent />
        <Button title="Signout" onPress={this._signOut} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
