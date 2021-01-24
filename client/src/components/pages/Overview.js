import React, { Component, useState } from "react";
import TopBar from "../TopBar.js";
import Search from "./Search.js";

import { get, post } from "../../utilities";

import 'react-calendar/dist/Calendar.css';

import "../../utilities.css";
import 'rodal/lib/rodal.css';
import "../App.css";
import "./Overview.css";

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
      <div key={mood.mood.name}>
        <span>{mood.mood.emoji} {mood.mood.name} {mood.count}</span>
      </div>
    ));
    return (
      <>
      <TopBar title="Your Moodbook Overview" />
      {this.state.journals.length !== 0 ? (
        <>
          <div className="u-flex">
            <div className="Overview-subContainer">
              <div className="u-title">Quick stats</div>
              <div>Total journal entries: {this.state.journals.length}</div>
              <br/>
              <div>Most common moods:</div>
              <div>{moodDiv}</div>
              <br/>
            </div>
            <div className="Overview-subContainer">
              <div className="u-title">Filter journals</div>
              <Search moods={this.state.moods} journals={this.state.journals} setDate={this.props.setDate}/>
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

export default Overview;
