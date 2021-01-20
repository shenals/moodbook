import React, { Component, useState } from "react";
import TopBar from "../TopBar.js";
import Rodal from 'rodal';
import Picker from 'emoji-picker-react';

import { get, post } from "../../utilities";

import 'react-calendar/dist/Calendar.css';

import "../../utilities.css";
import 'rodal/lib/rodal.css';
import "../App.css";
import "./Overview.css";

class Search extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    const curTime = new Date();
    this.state = {
      userName: null,
      moods: [],
      journals: [],
    };
  }

  componentDidMount() {

  }

  render() {
    let Categories = new Set();
    for(let i = 0; i < this.props.moods.length; i++){
      Categories.add(this.props.moods[i].category);
    }
    return (
      <>
        {Categories}
      </>
    );
  }
}

export default Search;
