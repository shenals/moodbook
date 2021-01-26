import React, { Component } from "react";

import "./Card.css";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      <button onClick={() => this.props.cardClick(this.props.journal)} className="Card">
        <div>
          {months[this.props.journal.month - 1]} {this.props.journal.day} <br/> {this.props.journal.year}
        </div>
        <div className="Card-emoji">
          {(this.props.journal.moods.length == 0) && (<div className="Card-emoji-null">"😄"</div>)}
          {this.props.journal.moods.slice(0, 3).map((mood) => mood.emoji)}
          {this.props.journal.moods.length === 4 && `${this.props.journal.moods[3].emoji}`}
          {this.props.journal.moods.length > 4 && `+${this.props.journal.moods.length - 3}`}
        </div>
      </button>
    );
  }
}

export default Card;
