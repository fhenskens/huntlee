import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';


export default class MaterialListItem extends Component {
  editMaterial()
  {
    browserHistory.push( "/Material/" + this.props.Material._id );
  }

  render() {
    return (
      <li className="collection-item avatar">
        <span className="title">Material {this.props.Material.MaterialNumber}</span>
        <p className="details">
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
        <a href="#!" className="secondary-content" onClick={this.editMaterial.bind(this)}>
          <i className="material-icons">modify</i>
        </a>
      </li>
    );
  }
}

MaterialListItem.propTypes = {
  Material: PropTypes.object.isRequired,
};
