import React, { Component } from "react";
import Select from 'react-select'
import Card from "./Card.js";

import "../../utilities.css";

class Search extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      selected: [],
    };
  }

  componentDidMount() {

  }

  handleChange = (selectedOption) => {
    this.setState({ 
      selected: selectedOption ? selectedOption.map(mood => mood.value) : [],
    });
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
    filteredJournals.sort((a, b) => a.year * 10000 + a.month * 100 + a.day - (b.year * 10000 + b.month * 100 + b.day));
    let filteredJournalsDiv = filteredJournals.map((journal) => {
      return <Card setDate={this.props.setDate} journal={journal}/>
    });
    return (
      <>
        <Select placeholder="Search by mood(s)" options={options} isMulti isClearable={true} onChange={this.handleChange}/>
        <div className="u-italic u-margin-top">{filteredJournalsDiv.length} journal entries found.</div>
        <div>{filteredJournalsDiv}</div> 
      </>
    );
  }
}

export default Search;
