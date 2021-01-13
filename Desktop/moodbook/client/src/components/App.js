import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Dashboard from "./pages/Dashboard.js";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import 'react-calendar/dist/Calendar.css';

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

const GOOGLE_CLIENT_ID = "616012024531-v5eduh9f5cm3lata519730qdr1baeegc.apps.googleusercontent.com";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      userName: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id, userName: user.name });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        {this.state.userId ? (
          <>
          <GoogleLogout
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.handleLogout}
            onFailure={(err) => console.log(err)}
          />
          <Dashboard userName = {this.state.userName} userId={this.state.userId}/>
          </>
        ) : (
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login"
            onSuccess={this.handleLogin}
            onFailure={(err) => console.log(err)}
          />
        )}
      </>
    );
  }
}

export default App;
