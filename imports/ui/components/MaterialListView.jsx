import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Materials } from '../../api/api.js';
import MaterialListItem from './MaterialListItem.jsx';
import MaterialView from './MaterialView.jsx';

class MaterialListView extends Component {
  addMaterial() {
    browserHistory.push( "/material/" );
  }

  renderMaterials() {
    return this.props.materials.map((material) => (
      <MaterialListItem key={material._id} material={material}/>
    ));
  }

  render() {
    return (
      <div className={classNames('MaterialListView')}>
        <h1>Material Costs</h1>
        <button onClick={this.addMaterial.bind( this )}>Add Material</button>
        <ul className="collection">
          {this.renderMaterials()}
        </ul>
      </div>
    );
  }
}

MaterialListView.propTypes = {
  materials: PropTypes.array.isRequired,
  material: PropTypes.array,
}

export default MaterialListViewContainer = createContainer( () => {
  Meteor.subscribe( "materials" );
  return {
    materials: Materials.find({}).fetch(),
    material: null,
  }
}, MaterialListView );
