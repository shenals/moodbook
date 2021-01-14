import React, { Component } from "react";
import TopBar from "../TopBar.js";

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

  compareMoods = (mood1, mood2) => {
    if ( mood1.count < mood2.count ){
      return 1;
    }
    if ( mood1.count > mood2.count ){
      return -1;
    }
    return 0;
  }

  render() {
    const moodCount = this.state.moods.map((mood) => {
        return {mood: mood,
          count: this.state.journals.filter((journal) => {
          return journal.moods.filter((jmood) => jmood.name === mood.name).length !== 0
        }).length};
      }
    );
    moodCount.sort( this.compareMoods );
    const moodDiv = moodCount.map((mood) => (
      <div>
        <span>{mood.mood.emoji} {mood.mood.name} {mood.count}</span>
      </div>
    ));
    return (
      <>
      <TopBar title="Your Moodbook Overview" />
      {this.state.journals.length !== 0 ? (
        <>
          <br/>
          <div>Total journal entries: {this.state.journals.length}</div>
          <br/>
          <div>Most common moods:</div>
          <div>{moodDiv}</div>
        </>
      ) : (
        <div>loading...</div>
      )}
      </>
    );
  }
}

export default Overview;
