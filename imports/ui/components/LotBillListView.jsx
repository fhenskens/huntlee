import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { LotBills, Billables } from '../../api/api.js';
import LotBillListItem from './LotBillListItem.jsx';
import LotBillView from './LotBillView.jsx';

class LotBillListView extends Component {

  addLotBill() {
    browserHistory.push(
      "/lotBill/"
        + this.props.type
        + "/"
        + this.props.lotId );
  }

  renderLotBills() {
    return this.props.lotBills.map((lotBill) => (
      <LotBillListItem
        key={lotBill._id}
        lotBill={lotBill}/>
    ));
  }

  render() {
    if ( !this.props.ready )
    {
      return ( <div>Loading...</div> );
    }
    return (
      <div className={classNames('LotBillListView')}>
        <h5>
          {
            this.props.type == "other"?
              "Material Costs" :
              this.props.type == "material" ?
                "Fence Runs" :
                "Labour Costs"
          }
        </h5>
        <a className="waves-effect waves-light btrn" href="#" onClick={this.addLotBill.bind( this )}>
          <i className="small material-icons">add</i>
        </a>
        <ul className="collection">
          {this.renderLotBills()}
        </ul>
      </div>
    );
  }
}

LotBillListView.propTypes = {
  lotId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default LotBillListViewContainer = createContainer( (params) => {
  const lotBillSubscription = Meteor.subscribe( "lotBills" );
  const billablesSubscription = Meteor.subscribe( "billables" );
  const billableRatesSubscription = Meteor.subscribe( "billableRates" );
  return {
    ready:
      lotBillSubscription.ready() &&
      billablesSubscription.ready() &&
      billableRatesSubscription.ready(),
    lotId: params.lotId,
    lotBills:
      LotBills.find(
        {
          lotId: params.lotId,
          type: params.type,
        }).fetch(),
    type: params.type,
  }
}, LotBillListView );
