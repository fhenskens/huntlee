import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Billables, BillableRates } from '../../api/api.js';
import LotMaterialListItem from './LotMaterialListItem.jsx';
import LotMaterialView from './LotMaterialView.jsx';

class LotMaterialListView extends Component {

  addLotMaterial() {
    browserHistory.push( "/lotMaterial/" );
  }

  getBillableRate( billableId )
  {
    return this.props.billableRates.find(
      function (rate) {
        return rate.billableId == billableId;
      });
  }

  renderLotMaterials() {
    return this.props.billables.map((billable) => (
      <LotMaterialListItem
        key={billable._id}
        billable={billable}
        billableRate={this.getBillableRate( billable._id )}/>
    ));
  }

  render() {
    return (
      <div className={classNames('LotMaterialListView')}>
        <h1>LotMaterial Rates</h1>
        <button onClick={this.addLotMaterial.bind( this )}>Add LotMaterial</button>
        <ul className="collection">
          {this.renderLotMaterials()}
        </ul>
      </div>
    );
  }
}

LotMaterialListView.propTypes = {
  billables: PropTypes.array.isRequired,
  billableRates: PropTypes.array,
}

export default LotMaterialListViewContainer = createContainer( () => {
  Meteor.subscribe( "lotBills" );
  Meteor.subscribe( "billables" );
  Meteor.subscribe( "billableRates" );
  return {
    lotBills: LotBills.find({lotId: this.props.lotId}).fetch(),
    billables: Billables.find({type:'material'}).fetch(),
    billableRates:
      BillableRates.find({
        type:'material',
        active:true
      }).fetch(),
  }
}, LotMaterialListView );
