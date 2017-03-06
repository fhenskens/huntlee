import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';


export default class MaterialListItem extends Component {
  editMaterial()
  {
    browserHistory.push( "/material/" + this.props.billable._id );
  }

  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">Material: {this.props.billable.name}</span>
        <p className="details">Cost per meter: $
          {this.props.billableRate.unitCost}
        </p>
        <a href="#!" className="secondary-content" onClick={this.editMaterial.bind(this)}>
          <i className="material-icons">mode_edit</i>
        </a>
      </li>
    );
  }
}

MaterialListItem.propTypes = {
  billable: PropTypes.object.isRequired,
  billableRate: PropTypes.object.isRequired,
};
