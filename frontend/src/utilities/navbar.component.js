import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Navbar</h2>
        </div>
        <div>
          <a href="/">Home</a>
          <a href="/client">Client</a>
          <a href="/dashboard">Dashboard</a>
        </div>
      </div>
    );
  }
}

export default Navbar;
