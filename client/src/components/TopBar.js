import React, { Component } from "react";

import "../utilities.css";
import "./TopBar.css";

// This identifies your application to Google's authentication service
const GOOGLE_CLIENT_ID = "616012024531-v5eduh9f5cm3lata519730qdr1baeegc.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class TopBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="TopBar-container">
        <div className="TopBar-title">
          {this.props.title}
        </div> 
      </div>
    );
  }
}

export default TopBar;
