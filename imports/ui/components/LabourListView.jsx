import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Billables, BillableRates } from '../../api/api.js';
import LabourListItem from './LabourListItem.jsx';
import LabourView from './LabourView.jsx';

class LabourListView extends Component {

  addLabour() {
    browserHistory.push( "/labour/" );
  }

  getBillableRate( billableId )
  {
    return this.props.billableRates.find(
      function (rate) {
        return rate.billableId == billableId;
      });
  }

  renderLabours() {
    return this.props.billables.map((billable) => (
      <LabourListItem
        key={billable._id}
        billable={billable}
        billableRate={this.getBillableRate( billable._id )}/>
    ));
  }

  render() {
    return (
      <div className={classNames('LabourListView')}>
        <h3>Labour Rates</h3>
        <button onClick={this.addLabour.bind( this )}>Add Labour</button>
        <ul className="collection">
          {this.renderLabours()}
        </ul>
      </div>
    );
  }
}

LabourListView.propTypes = {
  billables: PropTypes.array.isRequired,
  billableRates: PropTypes.array,
}

export default LabourListViewContainer = createContainer( () => {
  Meteor.subscribe( "billables" );
  Meteor.subscribe( "billableRates" );
  return {
    billables: Billables.find({type:'labour'}).fetch(),
    billableRates:
      BillableRates.find({
        type:'labour',
        active:true
      }).fetch(),
  }
}, LabourListView );
