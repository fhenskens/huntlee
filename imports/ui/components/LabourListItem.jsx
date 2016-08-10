import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';


export default class LabourListItem extends Component {
  editLabour()
  {
    browserHistory.push( "/labour/" + this.props.labour._id );
  }

  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">Labour {this.props.labour.labourNumber}</span>
        <p>
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
        <a href="#!" className="secondary-content" onClick={this.editLabour.bind(this)}>
          <i className="material-icons">modify</i>
        </a>
      </li>
    );
  }
}

LabourListItem.propTypes = {
  labour: PropTypes.object.isRequired,
};
