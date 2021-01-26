import React, { Component } from "react";
import Select from 'react-select'
import Card from "./Card.js";
import DatePicker from 'react-date-picker';
import ReactPaginate from 'react-paginate';
import Rodal from 'rodal';

import "../../utilities.css";
import "./pagination.css";
import "./Search.css";

class Search extends Component {
  constructor(props) {
    super(props);
    const curTime = new Date();
    // Initialize Default State
    this.state = {
      selected: [],
      monthFilter: false,
      activeStartDate: curTime,
      dateView: "year",
      selectedPage: 0,
      journalsPerPage: 25,
      clickedJournal: null,
      preview: false,
      date: {
        dateObj: curTime,
        day: curTime.getDate(),
        month: curTime.getMonth() + 1,
        year: curTime.getFullYear(),
      },
    };
  } 

  componentDidMount() {

  }

  openPreview = () => {
    this.setState({
      preview: true,
    });
  }

  closePreview = () => {
    this.setState({
      preview: false,
    });
  }

  cardClick = (journal) => {
    this.setState({ 
      clickedJournal: journal,
    });
    this.openPreview();
  }

  handleChange = (selectedOption) => {
    this.setState({ 
      selected: selectedOption ? selectedOption.map(mood => mood.value) : [],
    });
  }

  handleFilterChange = (event) => {
    this.setState({
      monthFilter: event.target.checked,
    });
  }

  handleDateViewChange = (event) => {
    this.setState({dateView: event.target.value});
  }

  handleCountChange = (event) => {
    this.setState({journalsPerPage: event.target.value, selectedPage: 0});
  }

  handlePageClick = (data) => {
    this.setState({
      selectedPage: data.selected,
    });
  };

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
    const moodList = this.state.clickedJournal ? 
    this.state.clickedJournal.moods.map((mood) => (
      <button key={mood.name} className="Search-moodButton" onClick={() => {}}> {mood.emoji} {mood.name} </button>
    )) : null;
    const options = this.props.moods.map((mood) => {
      return {value: mood.name, label: mood.emoji + " " + mood.name};
    });
    let filteredJournals = this.props.journals;
    for(let i = 0; i < this.state.selected.length; i++){
      filteredJournals = filteredJournals.filter((journal) => {
        return journal.moods.filter((mood) => mood.name === this.state.selected[i]).length !== 0
      });
    };
    if(this.state.monthFilter && this.state.dateView === "year"){
      filteredJournals = filteredJournals.filter((journal) => {
        return journal.month === this.state.date.month && journal.year == this.state.date.year;
      });
    }
    if(this.state.monthFilter && this.state.dateView === "decade"){
      filteredJournals = filteredJournals.filter((journal) => {
        return journal.year == this.state.date.year;
      });
    }
    filteredJournals.sort((a, b) => a.year * 10000 + a.month * 100 + a.day - (b.year * 10000 + b.month * 100 + b.day));
    let paginatedJournals = filteredJournals.slice(this.state.selectedPage * this.state.journalsPerPage, (this.state.selectedPage + 1) * this.state.journalsPerPage);
    let filteredJournalsDiv = paginatedJournals.map((journal) => {
      return <Card cardClick={this.cardClick} journal={journal}/>
    });
    return (
      <>
        <Select placeholder="Filter by mood(s)" options={options} isMulti isClearable={true} onChange={this.handleChange}/>
        <div className="u-margin-top">
        <span>
        <input
            name="monthFilter"
            type="checkbox"
            checked={this.state.monthFilter}
            onChange={this.handleFilterChange} />
        </span>
        <span>Filter by 
          <span>
            <select value={this.state.value} onChange={this.handleDateViewChange}>
              <option value="year">month</option>
              <option value="decade">year</option>
            </select>
          </span> 
        </span>
        <DatePicker
          activeStartDate={this.state.activeStartDate}
          onActiveStartDateChange={({ activeStartDate, value, view }) => {
            this.setState({
              activeStartDate: activeStartDate,
            })
          }}
          value={this.state.date.dateObj}
          maxDetail={this.state.dateView}
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
        <div className="u-italic u-margin-top u-margin-bottom">
          {filteredJournals.length} journal {filteredJournals.length === 1 ? "entry" : "entries"} found.
          {this.state.selectedPage * this.state.journalsPerPage + 1 === Math.min(filteredJournals.length, (this.state.selectedPage + 1) * this.state.journalsPerPage) ? 
          filteredJournals.length !== 0 && (<span> Showing entry {this.state.selectedPage * this.state.journalsPerPage + 1}.</span>)
           : 
          filteredJournals.length !== 0 && (<span> Showing entries {this.state.selectedPage * this.state.journalsPerPage + 1} - {Math.min(filteredJournals.length, (this.state.selectedPage + 1) * this.state.journalsPerPage)}.</span>)
          }
        </div>
        <div>
          <span>
            Results per page: 
          </span>
          <select value={this.state.journalsPerPage} onChange={this.handleCountChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        {filteredJournals.length > this.state.journalsPerPage &&
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(filteredJournals.length / this.state.journalsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />}
        <div>{filteredJournalsDiv}</div>
        <Rodal customStyles={{ height: 'auto', bottom: 'auto', top: '50%', transform: 'translateY(-50%)' }}
           visible={this.state.preview} onClose={this.closePreview}>
          <div className="u-rodalTitle">Journal Preview</div>
          {this.state.clickedJournal && 
          (<div className="u-smallTitle">
            {months[this.state.clickedJournal.month - 1]} {this.state.clickedJournal.day}, {this.state.clickedJournal.year}
          </div>)
          }
          <hr/>
          <div className="u-whitespace">{this.state.clickedJournal && this.state.clickedJournal.text}</div>
          <div>{moodList}</div>
          <input type="button" className="u-blackFlatButton u-margin-top u-margin-bottom" onClick={() => this.props.setDate({
            day: this.state.clickedJournal.day, 
            month: this.state.clickedJournal.month,
            year: this.state.clickedJournal.year,
          })} value="Open journal entry" />
        </Rodal> 
      </>
    );
  }
}

export default Search;
