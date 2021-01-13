import React, { Component } from "react";
import Calendar from "react-calendar";
import Journal from "./Journal.js";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import 'react-calendar/dist/Calendar.css';

import "../../utilities.css";
import "../App.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    const curTime = new Date();
    this.state = {
      date: {
        day: curTime.getDate(),
        month: curTime.getMonth() + 1,
        year: curTime.getFullYear(),
      },
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
      <div>Welcome to Moodbook, {this.props.userName}!</div>
      <div className="u-flex">
        <div className="Journal-subContainer">
          <Calendar onClickDay={(value, event) => {
              this.setState({
                date: {
                  day: value.getDate(),
                  month: value.getMonth() + 1,
                  year: value.getFullYear(),
                }
              })
            }}/>
        </div>
        <div className="Journal-subContainer">
          <Journal userId={this.props.userId} date={this.state.date}/>
        </div>
      </div>
      </>
    );
  }
}

export default Dashboard;
