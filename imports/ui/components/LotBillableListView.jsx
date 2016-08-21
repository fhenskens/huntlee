import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { LotBills } from '../../api/api.js';
import LotBillableListItem from './LotBillableListItem.jsx';
import LotBillableView from './LotBillableView.jsx';

class LotBillableListView extends Component {

  addLotBillable() {
    browserHistory.push(
      "/lotBillable/"
        + this.props.type
        + "/"
        + this.props.lotId );
  }

  getBillableRate( billableId )
  {
    return this.props.billableRates.find(
      function (rate) {
        return rate.billableId == billableId;
      });
  }

  renderLotBillables() {
    return this.props.lotBills.map((lotBill) => (
      <LotBillableListItem
        lotBillId={lotBill._id}
        type="this.props.type"/>
    ));
  }

  render() {
    return (
      <div className={classNames('LotBillableListView')}>
        <h5>
          {
            this.props.type == ""?
              "Sundry Costs" :
              this.props.type == "material" ?
                "Fence Runs" :
                "Labour Costs"
          }
        </h5>
        <button onClick={this.addLotBillable.bind( this )}>Add</button>
        <ul className="collection">
          {this.renderLotBillables()}
        </ul>
      </div>
    );
  }
}

LotBillableListView.propTypes = {
  lotId: PropTypes.string.isRequired,
  lotBills: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
}

export default LotBillableListViewContainer = createContainer( (params) => {
  Meteor.subscribe( "lotBills" );
  return {
    lotId: params.lotId,
    lotBills:
      LotBills.find(
        {
          lotId: params.lotId,
        }).fetch(),
    type: params.type,
  }
}, LotBillableListView );
