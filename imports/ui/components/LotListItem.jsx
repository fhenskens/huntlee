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
        <p>{this.props.lot.text}<br/>
          Status: {
            this.props.dateCompleted != null?
              "completed" :
              this.props.dateCommenced != null?
                "active" :
                new Date( this.props.datePlanned ) > new Date()?
                 "ovderdue" :
                 "listed"
            }
        </p>
        <a href="#!" className="secondary-content" onClick={this.editLot.bind(this)}>
          <i className="material-icons">modify</i>
        </a>
      </li>
    );
  }
}

LotListItem.propTypes = {
  lot: PropTypes.object.isRequired,
};
