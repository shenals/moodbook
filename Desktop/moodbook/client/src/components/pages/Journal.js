import React, { Component } from "react";

import "../../utilities.css";
import "../App.css";

import { get, post } from "../../utilities";

class Journal extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      text: "",
      moods: [],
      allMoods: [],
    };
  }

  handleClickCurMood = (mood) => {
    const body = {
      owner: this.props.userId,
      day: this.props.date.day,
      month: this.props.date.month,
      year: this.props.date.year,
      moods: this.state.moods.filter((value) => value.name !== mood.name),
    };
    post("/api/journal", body);
    this.setState(
      {moods: this.state.moods.filter((value) => value.name !== mood.name)},
    );
  }

  handleClickAllMoods = (mood) => {
    const body = {
      owner: this.props.userId,
      day: this.props.date.day,
      month: this.props.date.month,
      year: this.props.date.year,
      moods: [...this.state.moods, mood],
    };
    post("/api/journal", body);
    this.setState(
      {moods: [...this.state.moods, mood]},
    );
  }

  handleDisableMood = (mood) => {
    const hasMood = this.state.moods.filter((value) => value.name === mood.name);
    return hasMood.length !== 0;
  }

  handleOnTextChange = (event) => {
    this.setState(
      {text: event.target.value},
    );
    const body = {
      owner: this.props.userId,
      day: this.props.date.day,
      month: this.props.date.month,
      year: this.props.date.year,
      text: event.target.value,
      moods: this.state.moods,
    };
    post("/api/journal", body);
  }

  sendPostRequest = () => {
    
  }

  componentDidMount() {
    const body = {
      owner: this.props.userId,
      day: this.props.date.day,
      month: this.props.date.month,
      year: this.props.date.year,
    };
    get("/api/users", {_id: this.props.userId}).then((user) => {
      this.setState({
        allMoods: user.moods,
      });
    });
    get("/api/journal", body).then((journal) => {
      if(journal.length == 0){
        this.setState({
          text: "",
          moods: [], 
        });
      }
      else{
        this.setState({
          text: journal[0].text,
          moods: journal[0].moods, 
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      const body = {
        owner: this.props.userId,
        day: this.props.date.day,
        month: this.props.date.month,
        year: this.props.date.year,
      };
      //alert(JSON.stringify(body));
      get("/api/journal", body).then((journal) => {
        if(journal.length == 0){
          this.setState({
            text: "",
            moods: [], 
          });
        }
        else{
          this.setState({
            text: journal[0].text,
            moods: journal[0].moods, 
          });
        }
      });
    }
  }

  render() {
    const moodList = this.state.moods.map((mood) => (
      <button className="MoodButton" onClick={() => this.handleClickCurMood(mood)}> {mood.emoji} {mood.name} </button>
    ));
    const allMoodList = this.state.allMoods.map((mood) => (
      <button className="MoodButton" onClick={() => this.handleClickAllMoods(mood)} disabled={this.handleDisableMood(mood)}> {mood.emoji} {mood.name} </button>
    ));
    return (
      <>
        <div>Selected date: {this.props.date.year}/{this.props.date.month}/{this.props.date.day}</div>
        <textarea onChange={this.handleOnTextChange} value={this.state.text}/>
        <div>{moodList}</div>
        <br/>
        <div>Moods</div>
        <div>{allMoodList}</div>
      </>
    );
  }
}

export default Journal;
