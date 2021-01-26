import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Rodal from 'rodal';

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
      searchText: "",
      emptyJournal: true,
      deleteRodal: false,
      date: {
        dateObj: curTime,
        day: curTime.getDate(),
        month: curTime.getMonth() + 1,
        year: curTime.getFullYear(),
      },
    };
  }

  openDeleteRodal = () => {
    this.setState({
      deleteRodal: true,
    });
  }

  closeDeleteRodal = () => {
    this.setState({
      deleteRodal: false,
    });
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
      {moods: this.state.moods.filter((value) => value.name !== mood.name), emptyJournal: false},
    );
  }

  handleResetMoods = () => {
    const body = {
      owner: this.props.userId,
      day: this.state.date.day,
      month: this.state.date.month,
      year: this.state.date.year,
      moods: [],
    };
    post("/api/journal", body);
    this.setState(
      {moods: []}
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
    const textarea = document.querySelector('textarea');
    const initialHeight = 40;
    textarea.style.height = `${initialHeight}px`;
    const height = textarea.scrollHeight;
    textarea.style.height = `${height + initialHeight}px`;
    this.setState(
      {text: event.target.value, emptyJournal: false},
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

  handleDeleteJournal = (event) => {
    const textarea = document.querySelector('textarea');
    const initialHeight = 40;
    textarea.style.height = `${initialHeight}px`;
    const height = textarea.scrollHeight;
    textarea.style.height = `${height + initialHeight}px`;
    this.setState(
      {text: "", moods: [], emptyJournal: true},
    );
    const body = {
      owner: this.props.userId,
      day: this.state.date.day,
      month: this.state.date.month,
      year: this.state.date.year,
    };
    post("/api/journal/delete", body);
    this.closeDeleteRodal();
  }

  handleOnSearchChange = (event) => {
    this.setState(
      {searchText: event.target.value},
    );
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
          emptyJournal: true,
        });
      }
      else{
        this.setState({
          text: journal[0].text,
          moods: journal[0].moods,
          emptyJournal: false, 
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const textarea = document.querySelector('textarea');
    const initialHeight = 40;
    textarea.style.height = `${initialHeight}px`;
    const height = textarea.scrollHeight;
    textarea.style.height = `${height + initialHeight}px`;
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
            emptyJournal: true,
          });
        }
        else{
          this.setState({
            text: journal[0].text == null ? "" : journal[0].text,
            moods: journal[0].moods,
            emptyJournal: false,
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
    const allMoodList = this.state.allMoods.filter((mood) => mood.name.includes(this.state.searchText)).map((mood) => (
      <button key={mood.name} className="Journal-moodButton" onClick={() => this.handleClickAllMoods(mood)} disabled={this.handleDisableMood(mood)}> {mood.emoji} {mood.name} </button>
    ));
    return (
      <>
        <div className="u-flex u-flex-wrap">
        <div className="Journal-subContainer">
          <div className="u-inlineBlock">
          <div className="u-rodalTitle">
            {months[this.state.date.month - 1]} {this.state.date.day}, {this.state.date.year}
          </div>
          <span> Select journal date: </span> 
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
          </div>
          <textarea disabled={this.state.disableTextArea} onChange={this.handleOnTextChange} value={this.state.text}/>
          <Rodal height={150} visible={this.state.deleteRodal} onClose={this.closeDeleteRodal}>
            <div className="u-rodalTitle">Delete journal</div>
            <div>Are you sure you want to delete this journal entry? This action cannot be undone.</div>
            <input type="button" disabled={this.state.emptyJournal} className="u-redFlatButton u-margin-top u-margin-bottom" onClick={this.handleDeleteJournal} value="Delete journal" />
          </Rodal>
          <div className="u-smallTitle u-margin-bottom">Quick Actions</div>
          <input type="button" disabled={this.state.moods.length === 0} className="u-blackFlatButton u-margin-bottom u-margin-right" onClick={this.handleResetMoods} value="Reset moods" />
          <input type="button" disabled={this.state.emptyJournal} className="u-redFlatButton u-margin-bottom" onClick={this.openDeleteRodal} value="Delete journal" />
        </div>
        <div className="Journal-subContainer">
          <div>
            <hr className="u-mobile"/>
            <div className="u-smallTitle">Moods</div>
            <div>{moodList}</div>
            {this.state.moods.length === 0 && (<div>No moods added. Add some moods from below! 😁</div>)}
            <hr className="Journal-hr"/>
            <div className="u-smallTitle">All moods</div>
            <FontAwesomeIcon icon={faSearch} />
            <input className="u-searchBar" type="text" placeholder="Search moods" value={this.state.searchText} onChange={this.handleOnSearchChange} />
            <div>{allMoodList}</div>
          </div>
        </div>
        </div>
      </>
    );
  }
}

export default Journal;
