import React, { Component } from "react";
import Journal from "./Journal.js";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import Overview from "./Overview.js";
import TopBar from "../TopBar.js";

import { get, post } from "../../utilities";

import 'react-calendar/dist/Calendar.css';

import "../../utilities.css";
import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      userName: null,
    };
  }

  componentDidMount() {
    get("/api/users", {_id: this.props.userId}).then((user) => {
      this.setState({
        userName: user.name,
      });
    });
  }

  render() {
    const title = this.state.userName ? "Welcome to Moodbook, " + this.state.userName + "!" 
    : "Welcome to Moodbook!";
    return (
      <>
      <TopBar title={title}/>
      {this.state.userName ? (
        <>
        <div className="u-flex">
        <div className="Dashboard-subContainer u-inlineblock">
          <Journal userId={this.props.userId}/>
        </div>
        <div className="Dashboard-subContainer u-inlineblock">
          
        </div>
      </div>
      </>
      ) : (
        <div>loading...</div>
      )} 
      </>
    );
  }
}

export default Dashboard;
