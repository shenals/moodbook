import React, { Component } from "react";
import Calendar from "react-calendar";
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
    const curTime = new Date();
    this.state = {
      userName: null,
      date: {
        day: curTime.getDate(),
        month: curTime.getMonth() + 1,
        year: curTime.getFullYear(),
      },
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
        <div className="u-flex u-flex-alignCenter u-flex-justifyCenter">
        <div className="Dashboard-subContainer u-inlineblock">
          <Journal userId={this.props.userId} date={this.state.date}/>
        </div>
        <div className="Dashboard-subContainer u-inlineblock">
          <Calendar className="Dashboard-calendar" onClickDay={(value, event) => {
              this.setState({
                date: {
                  day: value.getDate(),
                  month: value.getMonth() + 1,
                  year: value.getFullYear(),
                }
              })
            }}/>
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
