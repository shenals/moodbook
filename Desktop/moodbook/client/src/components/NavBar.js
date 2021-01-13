import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

// This identifies your application to Google's authentication service
const GOOGLE_CLIENT_ID = "616012024531-v5eduh9f5cm3lata519730qdr1baeegc.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav>
        <div>Moodbook</div>
        <div>
          <Link to="/">
            Home
          </Link>
          <br/>
          {this.props.userId && (
            <Link to="/overview">
              Overview
            </Link>
          )}
          <br/>
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
            />
          )}
        </div>
      </nav>
    );
  }
}

export default NavBar;
