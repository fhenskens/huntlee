import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';


export default class LotMaterialListItem extends Component {
  editLot()
  {
    browserHistory.push( "/lotMaterial/" + this.props.lotMaterial._id );
  }

  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">Lot {this.props.lotMaterial.lotMaterialNumber}</span>
        <p className="details">
          Status: {
            this.props.lotMaterial.dateCompleted != ""?
              "completed" :
              this.props.lotMaterial.dateCommenced != ""?
                "active" :
                new Date( this.props.lotMaterial.datePlanned ) < new Date()?
                 "overdue" :
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

LotMaterialListItem.propTypes = {
  lotMaterial: PropTypes.object.isRequired,
};
