import React, { Component, PropTypes } from 'react';


export default class LotView extends Component {
  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">Lot {this.props.lot._id}</span>
        <p>{this.props.lot.text}<br/>
           Second Line
        </p>
        <a href="#!" className="secondary-content">
          <i className="material-icons">grade</i>
        </a>
      </li>
    );
  }
}

LotView.propTypes = {
  lot: PropTypes.object.isRequired,
};
