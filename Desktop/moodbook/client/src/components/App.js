import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Calendar from "react-calendar";

import 'react-calendar/dist/Calendar.css';

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import Journal from "./pages/Journal.js";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    const curTime = new Date();
    this.state = {
      userId: undefined,
      date: curTime.getDate(),
      month: curTime.getMonth() + 1,
      year: curTime.getFullYear(),
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
      this.setState({ userId: user._id });
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
      <div className="u-flex">
        <div className="Journal-subContainer">
          <Calendar onClickDay={(value, event) => {
              this.setState({
                date: value.getDate(),
                month: value.getMonth() + 1,
                year: value.getFullYear(),
              })
            }}/>
          <div>Selected date: {this.state.year}/{this.state.month}/{this.state.date}</div>
        </div>
        <div className="Journal-subContainer">
          <Journal />
        </div>
      </div>
      </>
    );
  }
}

export default App;
