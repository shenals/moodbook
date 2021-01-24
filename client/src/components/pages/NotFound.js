import React, { Component } from "react";

import { get, post } from "../../utilities";

class NotFound extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="u-centered">
        <h1>404 Not Found</h1>
        <p>The page you requested couldn't be found.</p>
        <a href="/">Go to the home page</a>
      </div>
    );
  }
}

export default NotFound;
