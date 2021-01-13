import React, { Component } from "react";
import Calendar from "react-calendar";
import Journal from "./Journal.js";

import { get, post } from "../../utilities";

import 'react-calendar/dist/Calendar.css';

import "../../utilities.css";
import "../App.css";
import Overview from "./Overview.js";

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
    return (
      <>
        {this.state.userName ? (
          <div>Welcome to Moodbook, {this.state.userName}!</div>
        ) : (
          <div>Welcome to Moodbook, {this.props.userName}!</div>
        )}   
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
      <div>
        <Overview userId={this.props.userId} />
      </div>
      </>
    );
  }
}

export default Dashboard;
