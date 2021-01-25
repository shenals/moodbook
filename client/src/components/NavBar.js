import React, { Component } from "react";
import { Link, navigate } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import { get } from "../utilities";

import "../utilities.css";
import "./NavBar.css";

// This identifies your application to Google's authentication service
const GOOGLE_CLIENT_ID = "616012024531-v5eduh9f5cm3lata519730qdr1baeegc.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgColor: null,
    };
  }

  componentWillUpdate(){
    if(!this.props.userId && this.state.bgColor){
      this.setState({
        bgColor: null,
      });
    }
    if(this.props.userId){
      get("/api/users", {_id: this.props.userId}).then((user) => {
        this.setState({
          bgColor: user.bgColor,
        });
      });
    }
  }

  render() {
    return (
      <nav className="NavBar-container" style={this.state.bgColor ? {backgroundColor: this.state.bgColor} : {display: "none"}}>
        <Link to="/" className="NavBar-title u-inlineBlock">
          Moodbook
        </Link>
        <div className="NavBar-linkContainer u-inlineBlock">
          {this.props.userId && (
            <>
            <Link to="/" className="NavBar-link">
              Home
            </Link>
            <Link to="/overview" className="NavBar-link">
              Overview
            </Link>
            <Link to="/manage" className="NavBar-link">
              Manage
            </Link>
            </>
          )}
          {this.props.userId && (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          )}
        </div>
      </nav>
    );
  }
}

export default NavBar;
