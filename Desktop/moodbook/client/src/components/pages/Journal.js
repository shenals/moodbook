import React, { Component } from "react";

import "../../utilities.css";

class Journal extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      text: "",
      moods: ["happy", "excited"],
    };
  }

  handleChange = (value, event) => {
    this.setState(
      {text: value},
    );
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    const moodList = this.state.moods.map((mood) => (
      <span>😁 {mood} </span>
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
      </>
    );
  }
}

export default Journal;
