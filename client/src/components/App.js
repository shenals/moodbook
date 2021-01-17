import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Dashboard from "./pages/Dashboard.js";
import Overview from "./pages/Overview.js";
import Manage from "./pages/Manage.js";
import NavBar from "./NavBar.js"
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
        <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
        />
        {this.state.userId ? (
          <Router>
            <Dashboard path="/" userName={this.state.userName} userId={this.state.userId}/>
            <Overview path="/overview" userId={this.state.userId} />
            <Manage path="/manage" userId={this.state.userId} />
          </Router>
        ) : (
          <div className="u-centered">
            <div className="u-title">Welcome to Moodbook!</div>
            <div className="u-center">
              <div>
                <br/>
                Moodbook is a daily personal journal that doubles up
                as a mood tracker.
              </div>
              <br/>             
              <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={this.handleLogin}
              onFailure={(err) => console.log(err)}
            />
            </div>
          </div>
        )}
      </>
    );
  }
}

export default App;
