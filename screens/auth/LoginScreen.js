import React, { useState } from "react";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  // Button,
  Alert,
  AsyncStorage
} from "react-native";
import { GoogleSignin, statusCodes } from "react-native-google-signin";
import * as firebase from "firebase";
import TestScreen from "../TestScreen";

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: "Welcome To ReCaller",
    headerTitleStyle: {
      fontWeight: "500",
      fontSize: 20,
      alignSelf: "center",
      color: "white",
      textAlign: "center",
      flex: 1
    },
    headerStyle: {
      backgroundColor: "red"
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      userInfo: null,
      error: null
    };
    console.log(this.state.userInfo);
  }

  async componentDidMount() {
    this._configureGoogleSignIn();
    await this._getCurrentUser();
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        "448806748779-mldp0sim81htt9oapau99r1647m26278.apps.googleusercontent.com",
      offlineAccess: false
    });
  }

  async _getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo, error: null });
      // console.log(userInfo.user, "Getting current user");
    } catch (error) {
      const errorMessage =
        error.code === statusCodes.SIGN_IN_REQUIRED
          ? "Please sign in :)"
          : error.message;
      this.setState({
        error: new Error(errorMessage)
      });
    }
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // await GoogleSignin.revokeAccess();
      console.log("Success: ", userInfo);
      this.setState({ userInfo, error: null });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        Alert.alert("cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        Alert.alert("in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("play services not available or outdated");
      } else {
        console.log("Something went wrong: ", error.toString());
        Alert.alert("Something went wrong", error.toString());
        this.setState({
          error
        });
      }
    }
  };

  onPress = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("TestScreen");
      } else {
        this.props.navigation.navigate("LoginScreen");
      }
    });
  };

  onLoginPress = async () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {})
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  onCreateAccountPress = () => {
    this.props.navigation.navigate("Signup");
  };

  onForgotPasswordPress = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  render() {
    const { errorCode } = this.state;
    if (this.state.user || this.state.userInfo !== null) {
      console.log("Authenticated!");
      return <TestScreen user={this.state.userInfo.user} />;
    }
    return (
      <View style={styles.Wrapper}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            marginTop: "5%",
            color: "black"
          }}
        >
          ReCaller
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            marginBottom: "10%",
            marginTop: "10%",
            textDecorationLine: "underline"
          }}
        >
          Login
        </Text>
        <Input
          value={this.state.email}
          onChangeText={text => {
            this.setState({ email: text });
          }}
          placeholder="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput />
        <Input
          value={this.state.password}
          onChangeText={text => {
            this.setState({ password: text });
          }}
          placeholder="Password"
          secureTextEntry={true}
          leftIcon={{ type: "font-awesome", name: "lock" }}
        />

        <View style={{ paddingTop: 20 }} />
        <Button
          titleStyle={{ width: 150, fontSize: 14, color: "black" }}
          title="Submit Email Login"
          type="outline"
          onPress={this.onLoginPress}
        />

        <View style={{ paddingTop: 20 }} />
        <Button
          titleStyle={{ width: 150, fontSize: 14, color: "black" }}
          title="Create Email Account"
          type="outline"
          onPress={this.onCreateAccountPress}
        />
        <View style={{ paddingTop: 50 }} />
        <Button
          titleStyle={{ width: 135, fontSize: 14, color: "black" }}
          icon={<Icon name="google" size={20} color="red" />}
          type="outline"
          onPress={this._signIn}
          title="Google Login"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Wrapper: {
    // backgroundColor: "red",
    paddingTop: 30,
    alignItems: "center"
  }
});
