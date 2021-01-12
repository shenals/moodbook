import React, { Component } from "react";

import "../../utilities.css";

class Journal extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      text: "",
      moods: ["happy", "excited"],
      allMoods: ["happy", "sad", "excited", "hosed"],
    };
  }

  handleClickCurMood = (mood) => {
    this.setState(
      {moods: this.state.moods.filter((value) => value !== mood)},
    );
  }

  handleClickAllMoods = (mood) => {
    this.setState(
      {moods: [...this.state.moods, mood]},
    );
  }

  handleDisableMood = (mood) => {
    const hasMood = this.state.moods.filter((value) => value === mood);
    return hasMood.length !== 0;
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    const moodList = this.state.moods.map((mood) => (
      <button onClick={() => this.handleClickCurMood(mood)}> {mood} </button>
    ));
    const allMoodList = this.state.allMoods.map((mood) => (
      <button onClick={() => this.handleClickAllMoods(mood)} disabled={this.handleDisableMood(mood)}> {mood} </button>
    ));
    return (
      <>
        <textarea onChange={(event) => {
            this.setState(
              {text: event.target.value},
            )
          }}
        />
        <div>{this.state.text}</div>
        <div>{moodList}</div>
        <br/>
        <div>Moods</div>
        <div>{allMoodList}</div>
      </>
    );
  }
}

export default Journal;
