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
    let moodCount = this.state.moods.map((mood) => {
        return {mood: mood,
          count: this.state.journals.filter((journal) => {
          return journal.moods.filter((jmood) => jmood.name === mood.name).length !== 0
        }).length};
      }
    );
    moodCount.sort( this.compareMoods );
    moodCount = moodCount.slice(0, 10);
    const moodDiv = moodCount.map((mood) => (
      <tr key={mood.mood.name}>
        <td>{mood.mood.emoji} {mood.mood.name}</td>
        <td>{mood.count}</td>
      </tr>
    ));
    return (
      <>
      <TopBar title="Your Moodbook Overview" />
      {this.state.userName ? (
        <>
          <div className="u-flex">
          <div className="Overview-subContainer Overview-explore">
              <div className="u-title">Explore your journals</div>
              <Search moods={this.state.moods} journals={this.state.journals} setDate={this.props.setDate}/>
            </div>
            <div className="Overview-subContainer Overview-quickstats">
              <div className="u-title">Quick stats</div>
              <div className="u-flexRow">
              <div className="Overview-stats">
                <div><span className="u-bigText">{this.state.journals.length}</span> total journal entries</div>
                <br/>
                <div><span className="u-bigText">{this.state.journals.reduce((a, b) => {
                  return b.text ? a + b.text.replace(/[^_0-9a-zA-Z]/g, " ").trim().split(/\s+/).length : a
                }, 0)}</span> total words</div>
                <br/>
                <div><span className="u-bigText">{this.state.journals.reduce((a, b) => {
                  return b.text ? a + b.text.length : a
                }, 0)}</span> total characters</div>
                <br/>
                <div><span className="u-bigText">{moodCount.reduce((a, b) => {
                  return a + b.count;
                }, 0)}</span> total moods added</div>
              </div>
              <div className="Overview-stats">
                <div className="u-bigText">Your top 10 moods</div>
                <br/>
                <div>
                <table>
                  <tr>
                    <th>Mood</th>
                    <th>Frequency</th>
                  </tr>
                  {moodDiv}
                </table>
                </div>
              </div>
              </div>
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
