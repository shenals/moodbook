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
      <button onClick={() => this.props.setDate({
          day: this.props.journal.day, 
          month: this.props.journal.month,
          year: this.props.journal.year,
        })} className="Card">
        <div>
          {months[this.props.journal.month - 1]} {this.props.journal.day} <br/> {this.props.journal.year}
        </div>
        <div className="Card-emoji">
          {(this.props.journal.moods.length == 0) && (<div className="Card-emoji-null">"😄"</div>)}
          {this.props.journal.moods.map((mood) => mood.emoji)}
        </div>
      </button>
    );
  }
}

export default Card;
