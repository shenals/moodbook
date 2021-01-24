import React, { Component } from "react";
import { Router, navigate } from "@reach/router";
import moodbook from "./moodbook.png";
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
      date: null,
      month: null,
      year: null,
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
  setDate = (date) => {
    this.setState({
      date: date,
    });
    navigate("/");
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
    navigate("/");
  };

  render() {
    const Home = () => (
      <div className="u-centered">
            <div className="u-title">Welcome to Moodbook!</div>
            <div className="u-center">
              <div className="u-relative">
                <img className="App-book" src={moodbook}/>
                <div className="App-book">
                  <div className="App-bookEmoji App-bookEmoji1">😄</div>
                  <div className="App-bookEmoji App-bookEmoji2">😞</div>
                  <div className="App-bookEmoji App-bookEmoji3">🏖️</div>
                  <div className="App-bookEmoji App-bookEmoji4">😵</div>
                  <div className="App-bookEmoji App-bookEmoji5">🎂</div>
                  <div className="App-bookEmoji App-bookEmoji6">🥱</div>
                  <div className="App-bookEmoji App-bookEmoji7">️‍🔥</div>
                  <div className="App-bookEmoji App-bookEmoji8">✨</div>
                  <div className="App-bookEmoji App-bookEmoji9">🥰</div>
                  <div className="App-bookEmoji App-bookEmoji10">🤩</div>
                  <div className="App-bookEmoji App-bookEmoji11">🥺</div>
                  <div className="App-bookEmoji App-bookEmoji12">🍔</div>
                  <div className="App-bookEmoji App-bookEmoji13">💕</div>
                  <div className="App-bookEmoji App-bookEmoji14">🎊</div>
                  <div className="App-bookEmoji App-bookEmoji15">😭</div>
                </div>
              </div>
              <div>
                <br/>
                Moodbook is a daily personal journal<br/>
                that doubles up as a mood tracker.
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
    );
    return (
      <>
        <NavBar
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          userId={this.state.userId}
        />
        {this.state.userId ? (
          <Router>
            <Dashboard path="/" userName={this.state.userName} userId={this.state.userId} date={this.state.date} setDate={this.setDate}/>    
            <Overview path="/overview" userId={this.state.userId} setDate={this.setDate}/>
            <Manage path="/manage" userId={this.state.userId} />
            <NotFound default />
          </Router>
        ) : (
          <Router>
            <Home path="/" />
            <NotFound default />
          </Router>
        )}
      </>
    );
  }
}

export default App;
