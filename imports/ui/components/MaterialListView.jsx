import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Billables, BillableRates } from '../../api/api.js';
import MaterialListItem from './MaterialListItem.jsx';
import MaterialView from './MaterialView.jsx';

class MaterialListView extends Component {

  addMaterial() {
    browserHistory.push( "/material/" );
  }

  getBillableRate( billableId )
  {
    return this.props.billableRates.find(
      function (rate) {
        return rate.billableId == billableId;
      });
  }

  renderMaterials() {
    return this.props.billables.map((billable) => (
      <MaterialListItem
        key={billable._id}
        billable={billable}
        billableRate={this.getBillableRate( billable._id )}/>
    ));
  }

  render() {
    return (
      <div className={classNames('MaterialListView')}>
        <h3>Fencing Material Costs</h3>
        <button onClick={this.addMaterial.bind( this )}>Add Material</button>
        <ul className="collection">
          {this.renderMaterials()}
        </ul>
      </div>
    );
  }
}

MaterialListView.propTypes = {
  billables: PropTypes.array.isRequired,
  billableRates: PropTypes.array,
}

export default MaterialListViewContainer = createContainer( () => {
  Meteor.subscribe( "billables" );
  Meteor.subscribe( "billableRates" );
  return {
    billables: Billables.find({type:'material'}).fetch(),
    billableRates:
      BillableRates.find({
        type:'material',
        active:true
      }).fetch(),
  }
}, MaterialListView );
