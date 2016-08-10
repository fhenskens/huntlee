import React from 'react';
import { Link } from 'react-router';

var navStyle = {
    backgroundColor: "#BDDA41",
    paddingLeft: "12px"
};

export default class Header extends React.Component {
  render() {
    return (
      <nav style={navStyle}>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo">Huntlee Lot Management</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="/">Home</a></li>
          </ul>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="/materialList">Materials</a></li>
          </ul>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="/labourList">Labour</a></li>
          </ul>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="/lotList">Lots</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}
