import React, { Component, useState } from "react";
import TopBar from "../TopBar.js";
import Rodal from 'rodal';
import Picker from 'emoji-picker-react';

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
      createRodal: false,
      name: "",
      category: "",
      selectedEmoji: null,
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

  componentDidUpdate() {
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

  openCreateRodal = () => {
    this.setState({
      createRodal: true,
    });
  }

  closeCreateRodal = () => {
    this.setState({
      createRodal: false,
    });
    document.getElementById("createForm").reset();
  }

  handleCreateSubmit = () => {
    this.setState({
      createRodal: false,
    });
    const newMood = {
      name: this.state.name,
      emoji: this.state.selectedEmoji,
      category: this.state.category,
    };
    const body = {
      _id: this.props.userId,
      moods: [...this.state.moods, newMood],
    };
    post("/api/users", body);
  }

  handleDeleteSubmit = () => {
    this.setState({
      createRodal: false,
      moods: this.state.moods.filter((mood) => mood.name !== "funny"),
    });
    const body = {
      _id: this.props.userId,
      moodName: "funny",
    };
    post("/api/moods", body);
    post("/api/users", {_id: this.props.userId, moods: this.state.moods.filter((mood) => mood.name !== "funny")});
  }

  onEmojiClick = (event, emojiObject) => {
    this.setState({
      selectedEmoji: emojiObject.emoji,
    });
  }

  handleOnNameChange = (event) => {
    this.setState(
      {name: event.target.value},
    );
  }

  handleOnCategoryChange = (event) => {
    this.setState(
      {category: event.target.value},
    );
  }

  handleClickMood = (mood) => {

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
    const moodList = this.state.moods.map((mood) => (
      <button className="Overview-moodButton" onClick={() => this.handleClickMood(mood)}> {mood.emoji} {mood.name} </button>
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
          <br/>
          <div>Manage moods</div>
          <div>{moodList}</div>
        </>
      ) : (
        <div>loading...</div>
      )}
      <button onClick={this.openCreateRodal}>Create new mood</button> 
      <Rodal height={480} visible={this.state.createRodal} onClose={this.closeCreateRodal}>
        <div>Create new mood</div>
        <form id="createForm">
          <label>
            Name:
            <input onChange={this.handleOnNameChange} type="text"/>
          </label>
          <br/>
          <label>
            Category:
            <input onChange={this.handleOnCategoryChange} type="text"/>
          </label>
          <br/>
          <label>
            Emoji: {this.state.selectedEmoji}
            <Picker onEmojiClick={this.onEmojiClick} />
          </label>
          <br/>
          <input type="button" onClick={this.handleDeleteSubmit} value="Submit" />
        </form>
      </Rodal>
      </>
    );
  }
}

export default Overview;
