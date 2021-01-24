import React, { Component, useState } from "react";
import TopBar from "../TopBar.js";
import Rodal from 'rodal';
import Picker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

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
      searchText: "",
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
      name: "",
      selectedEmoji: null,
    });
    document.getElementById("createForm").reset();
  }

  openEditRodal = () => {
    this.setState({
      editRodal: true,
    });
  }

  closeEditRodal = () => {
    this.setState({
      editRodal: false,
      name: "",
      selectedEmoji: null,
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

  handleOnSearchChange = (event) => {
    this.setState(
      {searchText: event.target.value},
    );
  }

  render() {
    const moodList = this.state.moods.filter((mood) => mood.name.includes(this.state.searchText)).map((mood) => (
      <button key={mood.name} className="Overview-moodButton" onClick={() => this.handleClickMood(mood)}> {mood.emoji} {mood.name} </button>
    ));
    return (
      <>
      <TopBar title="Manage your Moodbook" />
      {this.state.moods.length !== 0 ? (
        <>
          <div className="u-flex">
            <div className="Overview-subContainer">
              <div className="u-title">Account Settings</div>
            </div>
            <div className="Overview-subContainer">
              <div className="u-title">Manage moods</div>
              <FontAwesomeIcon icon={faSearch} />
              <input className="u-searchBar" type="text" placeholder="Search moods" value={this.state.searchText} onChange={this.handleOnSearchChange} />
              <div>{moodList}</div>
              <button className="Overview-moodButton" onClick={this.openCreateRodal}>+ new mood</button>
            </div>
          </div>
        </>
      ) : (
        <div>loading...</div>
      )} 
      <Rodal height={480} visible={this.state.createRodal} onClose={this.closeCreateRodal}>
        <div className="u-rodalTitle">Create new mood</div>
        <form id="createForm">
          <label>
            Name:
            <input className="u-formText" onChange={this.handleOnNameChange} type="text"/>
          </label>
          <br/>
          <label>
            Emoji: {this.state.selectedEmoji ? this.state.selectedEmoji : "No Emoji Selected"}
            <Picker preload onEmojiClick={this.onEmojiClick} />
          </label>
          <br/>
          <input disabled={!this.state.selectedEmoji || this.state.moods.some((mood) => {
              return mood.name === this.state.name}
            )} type="button" onClick={this.handleCreateSubmit} value="Create mood" />
          {this.state.moods.some((mood) => mood.name === this.state.name) &&
          <div className="u-red">A mood with the name "{this.state.name}" already exists.</div>}
        </form>
      </Rodal>
      <Rodal height={480} visible={this.state.editRodal} onClose={this.closeEditRodal}>
        <div className="u-rodalTitle">Edit mood</div>
        <form id="editForm">
          <label>
            Name:
            <input className="u-formText" value={this.state.name} onChange={this.handleOnNameChange} type="text"/>
          </label>
          <br/>
          <label>
            Emoji: {this.state.selectedEmoji ? this.state.selectedEmoji : "No Emoji Selected"}
            <Picker preload onEmojiClick={this.onEmojiClick} />
          </label>
          <br/>
          <input type="button" onClick={this.handleEditSubmit} value="Save mood" />
          <input type="button" onClick={this.handleDeleteSubmit} value="Delete mood" />
          {this.state.moods.some((mood) => mood.name === this.state.name && mood.name !== this.state.selectedMood.name) &&
          <div className="u-red">A mood with the name "{this.state.name}" already exists.</div>}
        </form>
      </Rodal>
      </>
    );
  }
}

export default Manage;
