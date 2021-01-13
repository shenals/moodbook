import React, { Component } from "react";

import { get, post } from "../../utilities";

import 'react-calendar/dist/Calendar.css';

import "../../utilities.css";
import "../App.css";

class Overview extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    const curTime = new Date();
    this.state = {
      userName: null,
      moods: [],
      journals: [],
    };
  }

  componentDidMount() {
    get("/api/users", {_id: this.props.userId}).then((user) => {
      this.setState({
        userName: user.name,
        moods: user.moods,
      });
    });
    get("/api/journal", {owner: this.props.userId}).then((journals) => {
      this.setState({
        journals: journals,
      });
    });
  }

  render() {
    return (
      <>
        <div>Total journal entries: {this.state.journals.length}</div>
      </>
    );
  }
}

export default Overview;
