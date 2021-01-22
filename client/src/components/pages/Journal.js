import React, { Component } from "react";
import DatePicker from 'react-date-picker';

import "../../utilities.css";
import "./Journal.css";

import { get, post } from "../../utilities";

class Journal extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    const curTime = new Date();
    this.state = {
      text: "",
      moods: [],
      allMoods: [],
      disableTextArea: false,
      activeStartDate: curTime,
      date: {
        dateObj: curTime,
        day: curTime.getDate(),
        month: curTime.getMonth() + 1,
        year: curTime.getFullYear(),
      },
    };
  }

  handleClickCurMood = (mood) => {
    const body = {
      owner: this.props.userId,
      day: this.state.date.day,
      month: this.state.date.month,
      year: this.state.date.year,
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
      day: this.state.date.day,
      month: this.state.date.month,
      year: this.state.date.year,
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
      day: this.state.date.day,
      month: this.state.date.month,
      year: this.state.date.year,
      text: event.target.value,
      moods: this.state.moods,
    };
    post("/api/journal", body);
  }

  sendPostRequest = () => {
    
  }

  componentDidMount() {
    let body = null;
    if(this.props.date) {
      this.setState({
        date: {
          dateObj: new Date(this.props.date.year, this.props.date.month-1, this.props.date.day),
          day: this.props.date.day,
          month: this.props.date.month,
          year: this.props.date.year,
        },
        activeStartDate: new Date(this.props.date.year, this.props.date.month-1, this.props.date.day),
      });
      this.props.setDate(null);
      body = {
        owner: this.props.userId,
        day: this.props.date.day,
        month: this.props.date.month,
        year: this.props.date.year,
      };
    }
    else{
      body = {
        owner: this.props.userId,
        day: this.state.date.day,
        month: this.state.date.month,
        year: this.state.date.year,
      };
    }
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.date !== this.state.date) {
      this.setState({
        disableTextArea: true,
        text: "fetching journal..."
      });
      const body = {
        owner: this.props.userId,
        day: this.state.date.day,
        month: this.state.date.month,
        year: this.state.date.year,
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
            text: journal[0].text == null ? "" : journal[0].text,
            moods: journal[0].moods, 
          });
        }
        this.setState({
          disableTextArea: false,
        });
      });
    }
  }

  render() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const moodList = this.state.moods.map((mood) => (
      <button key={mood.name} className="Journal-moodButton" onClick={() => this.handleClickCurMood(mood)}> {mood.emoji} {mood.name} </button>
    ));
    const allMoodList = this.state.allMoods.map((mood) => (
      <button key={mood.name} className="Journal-moodButton" onClick={() => this.handleClickAllMoods(mood)} disabled={this.handleDisableMood(mood)}> {mood.emoji} {mood.name} </button>
    ));
    return (
      <>
        <div className="u-flex u-flex-wrap">
        <div className="Journal-subContainer">
          <div>{months[this.state.date.month - 1]} {this.state.date.day}, {this.state.date.year}</div>
          <DatePicker
          activeStartDate={this.state.activeStartDate}
          onActiveStartDateChange={({ activeStartDate, value, view }) => {
            this.setState({
              activeStartDate: activeStartDate,
            })
          }}
          value={this.state.date.dateObj}
          clearIcon={null}
          onChange={(value) => {
            this.setState({
              activeStartDate: value,
              date: {
                dateObj: value,
                day: value.getDate(),
                month: value.getMonth() + 1,
                year: value.getFullYear(),
              }
            })
          }}/>
          <textarea disabled={this.state.disableTextArea} onChange={this.handleOnTextChange} value={this.state.text}/>
        </div>
        <div className="Journal-subContainer">
          <div>
            <div>Moods</div>
            <div>{moodList}</div>
            <div>Add moods</div>
            <div>{allMoodList}</div>
          </div>
        </div>
        </div>
      </>
    );
  }
}

export default Journal;
