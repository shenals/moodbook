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
import "./Manage.css";

class Manage extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    const curTime = new Date();
    this.state = {
      userName: null,
      user: null,
      moods: [],
      journals: [],
      nameText: "",
      savingText: "",
      createRodal: false,
      editRodal: false,
      bgColor: null,
      name: "",
      searchText: "",
      selectedMood: null,
      selectedEmoji: null,
      deleteAccountRodal: false,
      deleteJournalsRodal: false,
    };
  }

  componentDidMount() {
    get("/api/users", {_id: this.props.userId}).then((user) => {
      this.setState({
        user: user,
        userName: user.name,
        nameText: user.name,
        moods: user.moods,
        bgColor: user.bgColor,
      });
    });
    get("/api/journal", {owner: this.props.userId}).then((journals) => {
      this.setState({
        journals: journals,
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

  openDeleteJournalsRodal = () => {
    this.setState({
      deleteJournalsRodal: true,
    });
  }

  openDeleteAccountRodal = () => {
    this.setState({
      deleteAccountRodal: true,
    });
  }

  closeDeleteJournalsRodal = () => {
    this.setState({
      deleteJournalsRodal: false,
    });
  }

  closeDeleteAccountRodal = () => {
    this.setState({
      deleteAccountRodal: false,
    });
  }

  closeCreateRodal = () => {
    this.setState({
      createRodal: false,
      name: "",
      selectedEmoji: null,
    });
    const nameField = document.getElementById("createFormName");
    nameField.value = nameField.defaultValue;
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
    const nameField = document.getElementById("editFormName");
    nameField.value = nameField.defaultValue;
  }

  handleDeleteJournals = () => {
    const body = {
      owner: this.props.userId,
    };
    post("/api/journal/delete", body);
    this.closeDeleteJournalsRodal();
  }

  handleDeleteAccount = () => {
    this.handleDeleteJournals();
    const body = {
      _id: this.props.userId,
    };
    post("/api/users/delete", body);
    this.closeDeleteAccountRodal();
    this.props.handleLogout();
  }

  handleCreateSubmit = () => {
    const newMood = {
      name: this.state.name,
      emoji: this.state.selectedEmoji,
    };
    this.setState({
      createRodal: false,
      moods: [...this.state.moods, newMood],
      name: "",
      selectedEmoji: null,
    });
    const body = {
      _id: this.props.userId,
      moods: [...this.state.moods, newMood],
    };
    const nameField = document.getElementById("createFormName");
    nameField.value = nameField.defaultValue;
    post("/api/users", body);
  }

  handleEditSubmit = () => {
    let newMoods = this.state.moods;
    const newMood = {
      name: this.state.name,
      emoji: this.state.selectedEmoji,
    };
    newMoods[newMoods.map(mood => mood.name).indexOf(this.state.selectedMood.name)] = newMood;
    this.setState({
      editRodal: false,
      moods: newMoods,
      name: "",
      selectedEmoji: null,
    });
    const body = {
      _id: this.props.userId,
      prevName: this.state.selectedMood.name,
      name: this.state.name,
      emoji: this.state.selectedEmoji,
    };
    //alert(JSON.stringify(body));
    const nameField = document.getElementById("editFormName");
    nameField.value = nameField.defaultValue;
    post("/api/moods/edit", body);
    post("/api/users", {_id: this.props.userId, moods: newMoods});
  }

  handleDeleteSubmit = () => {
    const newMoods = this.state.moods.filter((mood) => mood.name !== this.state.selectedMood.name);
    this.setState({
      editRodal: false,
      moods: newMoods,
      name: "",
      selectedEmoji: null,
    });
    const body = {
      _id: this.props.userId,
      moodName: this.state.selectedMood.name,
    };
    const nameField = document.getElementById("editFormName");
    nameField.value = nameField.defaultValue;
    post("/api/moods/delete", body);
    post("/api/users", {_id: this.props.userId, moods: newMoods});
  }

  handleSaveSettings = () => {
    this.setState({
      userName: this.state.nameText,
      savingText: "saving..."
    });
    const body = {
      _id: this.props.userId,
      name: this.state.nameText,
      bgColor: this.state.bgColor,
    };
    post("/api/users", body).then(
      this.setState({
        savingText: "saved!"
      }),
    );
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

  handleNameTextChange = (event) => {
    this.setState(
      {nameText: event.target.value},
    );
  }

  handleClickMood = (mood) => {
    this.setState({
      editRodal: true,
      selectedMood: mood,
      name: mood.name,
      selectedEmoji: mood.emoji,
    });
  }

  handleOnSearchChange = (event) => {
    this.setState(
      {searchText: event.target.value},
    );
  }

  handleColorDropdownChange = (event) => {
    this.setState(
      {bgColor: event.target.value},
    );
  }

  downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify({user: this.state.user, journals: this.state.journals})]);
    element.href = URL.createObjectURL(file);
    element.download = "moodbook_export.json";
    document.body.appendChild(element);
    element.click();
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
          <div className="Manage-subContainer">
              <div className="u-title">Manage moods</div>
              <FontAwesomeIcon icon={faSearch} />
              <input className="u-searchBar" type="text" placeholder="Search moods" value={this.state.searchText} onChange={this.handleOnSearchChange} />
              <div>{moodList}</div>
              <button className="Overview-moodButton" onClick={this.openCreateRodal}>+ new mood</button>
            </div>
            <div className="Manage-subContainer">
              <div className="u-title">Manage Account</div>
              <div className="u-smallTitle">Account Settings</div>
              <div>
                <span>Name: </span>
                <input className="u-formText" value={this.state.nameText} onChange={this.handleNameTextChange} type="text"/>
              </div>
              <div className="u-margin-bottom">
                <span>Color: </span>
                <span className="u-margin-left">
                <select value={this.state.bgColor} onChange={this.handleColorDropdownChange}>
                  <option value="black">
                    black
                  </option>
                  <option value="blue">blue</option>
                </select>
                </span>
              </div>
              <div className="u-margin-bottom">
                <button className="u-blackFlatButton" onClick={this.handleSaveSettings}>Save settings</button>
                <span className="u-italic"> {this.state.savingText}</span>
              </div>
              <div className="u-smallTitle">Export Data</div>
              <div className="u-margin-bottom">Use the below control to export your journals, moods (including custom moods) and user settings in JSON format.</div>
              <div className="u-margin-bottom">
                <button className="u-blackFlatButton" onClick={this.downloadTxtFile}>Export account data</button>
              </div>
              <div className="u-smallTitle u-redText">⚠️ Danger Zone</div>
              <div className="u-margin-bottom">Use the following controls to delete your account data. These cannot be reversed, so be careful!</div>
              <div className="u-margin-bottom">
                <button className="u-redFlatButton" onClick={this.openDeleteJournalsRodal}>Delete all journals</button>
              </div>
              <div className="u-margin-bottom">
                <button className="u-redFlatButton" onClick={this.openDeleteAccountRodal}>Delete account</button>
              </div>
              <Rodal height={115} visible={this.state.deleteJournalsRodal} onClose={this.closeDeleteJournalsRodal}>
                <div className="u-rodalTitle">Delete all journals</div>
                <div>Are you sure you want to delete all journals? This action cannot be undone.</div>
                <input type="button" className="u-redFlatButton u-margin-top u-margin-bottom" onClick={this.handleDeleteJournals} value="Delete all journals" />
              </Rodal>
              <Rodal height={135} visible={this.state.deleteAccountRodal} onClose={this.closeDeleteAccountRodal}>
                <div className="u-rodalTitle">Delete your account</div>
                <div>Are you sure you want to delete your user account? This action cannot be undone. You will be logged out of your account.</div>
                <input type="button"  className="u-redFlatButton u-margin-top u-margin-bottom" onClick={this.handleDeleteAccount} value="Delete account" />
              </Rodal>
            </div>
          </div>
        </>
      ) : (
        <div>loading...</div>
      )} 
      <Rodal height={485} visible={this.state.createRodal} onClose={this.closeCreateRodal}>
        <div className="u-rodalTitle">Create new mood</div>
        <form id="createForm">
          <label>
            Name:
            <input id="createFormName" className="u-formText" onChange={this.handleOnNameChange} type="text"/>
          </label>
          <br/>
          <label>
            Emoji: {this.state.selectedEmoji ? this.state.selectedEmoji : "No Emoji Selected"}
            <Picker preload onEmojiClick={this.onEmojiClick} />
          </label>
          <br/>
          <input disabled={!this.state.selectedEmoji || !this.state.name || this.state.moods.some((mood) => {
              return mood.name === this.state.name}
            )} className="u-blackFlatButton" type="button" onClick={this.handleCreateSubmit} value="Create mood" />
          {this.state.moods.some((mood) => mood.name === this.state.name) &&
          <div className="u-red">A mood with the name "{this.state.name}" already exists.</div>}
          {!this.state.selectedEmoji && !this.state.name && <div className="u-red">Please select a name and an emoji for the new mood.</div>}
          {this.state.selectedEmoji && !this.state.name && <div className="u-red">Please select a name for the new mood.</div>}
          {!this.state.selectedEmoji && this.state.name && <div className="u-red">Please select an emoji for the new mood.</div>}
        </form>
      </Rodal>
      <Rodal height={485} visible={this.state.editRodal} onClose={this.closeEditRodal}>
        <div className="u-rodalTitle">Edit mood</div>
        <form id="editForm">
          <label>
            Name:
            <input id="editFormName" className="u-formText" value={this.state.name} onChange={this.handleOnNameChange} type="text"/>
          </label>
          <br/>
          <label>
            Emoji: {this.state.selectedEmoji ? this.state.selectedEmoji : "No Emoji Selected"}
            <Picker preload onEmojiClick={this.onEmojiClick} />
          </label>
          <br/>
          <input type="button" disabled={!this.state.name} className="u-blackFlatButton u-margin-right" onClick={this.handleEditSubmit} value="Save mood" />
          <input type="button" className="u-redFlatButton" onClick={this.handleDeleteSubmit} value="Delete mood" />
          {this.state.moods.some((mood) => mood && mood.name === this.state.name && mood.name !== this.state.selectedMood.name) &&
          <div className="u-red">A mood with the name "{this.state.name}" already exists.</div>}
          {!this.state.name && <div className="u-red">The name field cannot be empty.</div>}
        </form>
      </Rodal>
      </>
    );
  }
}

export default Manage;
