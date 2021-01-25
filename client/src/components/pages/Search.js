import React, { Component } from "react";
import Select from 'react-select'
import Card from "./Card.js";
import DatePicker from 'react-date-picker';

import "../../utilities.css";

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

  render() {
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
    let filteredJournalsDiv = filteredJournals.map((journal) => {
      return <Card setDate={this.props.setDate} journal={journal}/>
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
        <div className="u-italic u-margin-top">{filteredJournalsDiv.length} journal {filteredJournalsDiv.length === 1 ? "entry" : "entries"} found.</div>
        <div>{filteredJournalsDiv}</div> 
      </>
    );
  }
}

export default Search;
