import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';


export default class LabourListItem extends Component {
  editLabour()
  {
    browserHistory.push( "/labour/" + this.props.billable._id );
  }

  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">Role: {this.props.billable.name}</span>
        <p className="details">Hourly Rate: $
          {this.props.billableRate.unitCost}
        </p>
        <a href="#!" className="secondary-content" onClick={this.editLabour.bind(this)}>
          <i className="material-icons">modify</i>
        </a>
      </li>
    );
  }
}

LabourListItem.propTypes = {
  billable: PropTypes.object.isRequired,
  billableRate: PropTypes.object.isRequired,
};
