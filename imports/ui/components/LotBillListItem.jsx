import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';


export default class LotBillListItem extends Component {
  editLot()
  {
    browserHistory.push(
      "/lotBill/"
        + this.props.lotBill.type
        + "/"
        + this.props.lotBill.lotId
        + "/"
        + this.props.lotBill._id );
  }

  getDetails()
  {
    var details = "";
    if ( this.props.lotBill.description != null && this.props.lotBill.description != "" )
    {
      details += this.props.lotBill.description + " - ";
    }
    if ( this.props.lotBill.quantity != null && this.props.lotBill.quantity != "" )
    {
      details +=
        this.getQuantityDescription()
          + ": "
          + this.props.lotBill.quantity
          + " - ";
    }
    details += "Cost: $" + this.props.lotBill.total;
    return details;
  }

  getQuantityDescription()
  {
    switch ( this.props.lotBill.type ) {
      case "material" :
        return "Meters";
      case "labour" :
        return "Hours";
    }
  }

  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">{this.props.lotBill.billableName}</span>
        <p className="details">
          {this.getDetails()}
        </p>
        <a href="#!" className="secondary-content" onClick={this.editLot.bind(this)}>
          <i className="material-icons">mode_edit</i>
        </a>
      </li>
    );
  }
}

LotBillListItem.propTypes = {
  lotBill: PropTypes.object.isRequired,
};
