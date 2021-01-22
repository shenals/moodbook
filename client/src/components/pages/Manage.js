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

class Manage extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    const curTime = new Date();
    this.state = {
      userName: null,
      moods: [],
      createRodal: false,
      editRodal: false,
      name: "",
      category: "",
      selectedMood: null,
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
  }

  componentDidUpdate() {

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

  openEditRodal = () => {
    this.setState({
      editRodal: true,
      selectedEmoji: null,
    });
  }

  closeEditRodal = () => {
    this.setState({
      editRodal: false,
    });
    document.getElementById("editForm").reset();
  }

  handleCreateSubmit = () => {
    const newMood = {
      name: this.state.name,
      emoji: this.state.selectedEmoji,
      category: this.state.category,
    };
    this.setState({
      createRodal: false,
      moods: [...this.state.moods, newMood],
    });
    const body = {
      _id: this.props.userId,
      moods: [...this.state.moods, newMood],
    };
    post("/api/users", body);
  }

  handleEditSubmit = () => {
    let newMoods = this.state.moods;
    const newMood = {
      name: this.state.name,
      emoji: this.state.selectedEmoji,
      category: this.state.category,
    };
    newMoods[newMoods.map(mood => mood.name).indexOf(this.state.selectedMood.name)] = newMood;
    this.setState({
      editRodal: false,
      moods: newMoods,
    });
    const body = {
      _id: this.props.userId,
      prevName: this.state.selectedMood.name,
      name: this.state.name,
      emoji: this.state.selectedEmoji,
      category: this.state.category,
    };
    //alert(JSON.stringify(body));
    post("/api/moods/edit", body);
    post("/api/users", {_id: this.props.userId, moods: newMoods});
  }

  handleDeleteSubmit = () => {
    const newMoods = this.state.moods.filter((mood) => mood.name !== this.state.selectedMood.name);
    this.setState({
      editRodal: false,
      moods: newMoods,
    });
    const body = {
      _id: this.props.userId,
      moodName: this.state.selectedMood.name,
    };
    post("/api/moods/delete", body);
    post("/api/users", {_id: this.props.userId, moods: newMoods});
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
    this.setState({
      editRodal: true,
      selectedMood: mood,
      name: mood.name,
      category: mood.category,
      selectedEmoji: mood.emoji,
    });
  }

  render() {
    const moodList = this.state.moods.map((mood) => (
      <button key={mood.name} className="Overview-moodButton" onClick={() => this.handleClickMood(mood)}> {mood.emoji} {mood.name} </button>
    ));
    return (
      <>
      <TopBar title="Manage your Moodbook" />
      {this.state.moods.length !== 0 ? (
        <>
          <div>Manage moods</div>
          <div>{moodList}</div>
        </>
      ) : (
        <div>loading...</div>
      )}
      <button className="Overview-moodButton" onClick={this.openCreateRodal}>+ new mood</button> 
      <Rodal height={480} visible={this.state.createRodal} onClose={this.closeCreateRodal}>
        <div>Create new mood</div>
        <form id="createForm">
          <label>
            Name:
            <input onChange={this.handleOnNameChange} type="text"/>
          </label>
          <br/>
          <br/>
          <label>
            Emoji: {this.state.selectedEmoji ? this.state.selectedEmoji : "No Emoji Selected"}
            <Picker onEmojiClick={this.onEmojiClick} />
          </label>
          <br/>
          <input disabled={!this.state.selectedEmoji} type="button" onClick={this.handleCreateSubmit} value="Create mood" />
        </form>
      </Rodal>
      <Rodal height={480} visible={this.state.editRodal} onClose={this.closeEditRodal}>
        <div>Edit mood</div>
        <form id="editForm">
          <label>
            Name:
            <input value={this.state.name} onChange={this.handleOnNameChange} type="text"/>
          </label>
          <br/>
          <br/>
          <label>
            Emoji: {this.state.selectedEmoji ? this.state.selectedEmoji : "No Emoji Selected"}
            <Picker onEmojiClick={this.onEmojiClick} />
          </label>
          <br/>
          <input type="button" onClick={this.handleEditSubmit} value="Save mood" />
          <input type="button" onClick={this.handleDeleteSubmit} value="Delete mood" />
        </form>
      </Rodal>
      </>
    );
  }
}

export default Manage;
