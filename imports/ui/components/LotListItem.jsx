import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';


export default class LotListItem extends Component {
  editLot()
  {
    browserHistory.push( "/lot/" + this.props.lot._id );
  }

  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">Lot {this.props.lot.lotNumber}</span>
        <p className="details">
          Status: {
            this.props.lot.dateCompleted != ""?
              "completed" :
              this.props.lot.dateCommenced != ""?
                "active" :
                new Date( this.props.lot.datePlanned ) < new Date()?
                 "overdue" :
                 "listed"
            }
        </p>
        <a href="#!" className="secondary-content" onClick={this.editLot.bind(this)}>
          <i className="material-icons">mode_edit</i>
        </a>
      </li>
    );
  }
}

LotListItem.propTypes = {
  lot: PropTypes.object.isRequired,
};
