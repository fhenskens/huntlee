import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { LotBills, Billables, BillableRates } from '../../api/api.js';

class LotMaterialView extends Component {

  cancel( event ) {
    event.preventDefault();
    browserHistory.push(
      '/lot/'
        + this.props.lotBillable.lotId );
  }

  componentDidMount() {
    $('.input-field label').each( function() {
      $(this).addClass( "active" );
    } );
  }

  billableRateLabel() {
    switch ( this.props.type ) {
      case "labour":
        return "Labour";
      case "material":
        return "Fence Run";
      case "other":
        return "Other Cost";
    }
  }

  renderBillableRate() {
    if ( this.billableRate == null )
    {
    } else {
      return (
        <div className="row">
          <div className="input-field col s6">
            <input
              ref="billableRateId"
              type="text"
              className="validate"
              value={this.props.billableRate.id}/>
            <label htmlFor="billableRateId">{this.billableRateLabel()}</label>
          </div>
          <div className="input-field col s6">
            <input
              ref="unitCost"
              type="text"
              className="validate"
              value={
                this.props.billableRate.unitCost}/>
            <label htmlFor="builderOwner">Cost per Meter</label>
          </div>
        </div>
      );
    }
  }

  handleSubmit( event ) {
    event.preventDefault();
    var lotBillable = {};
    lotBillable['type'] = 'lotBillable';
    Object.keys( this.refs )
      .forEach( (key) => {
        lotBillable[key] =
          ReactDOM.findDOMNode( this.refs[key] )
            .value.trim(); } );
    Meteor.call(
      "lotBill.save",
      this.props.lotBillable._id,
      this.props.lotBillableRate._id,
      lotBillable );
    browserHistory.push( '/lotBillableList' );
  }

  render() {
    return (
      <div className={classNames('LotMaterialsView')}>
        <h1>
          {
            this.props.type
          }
        </h1>
        <div className="row">
          <button
            onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          {renderBillableRate()}
          <div className="row">
            <input type="submit" value="Submit"/>
          </div>
        </form>
      </div>
    );
  }
}

LotMaterialView.propTypes = {
  lotId: PropTypes.string,
  lotBillable: PropTypes.object,
  billableRate: PropTypes.object,
  type: PropTypes.string,
  billables: PropTypes.array,
  billableRates: PropTypes.array,
};

export default LotMaterialViewContainer = createContainer( ({params}) => {
  Meteor.subscribe( "billables" );
  Meteor.subscribe( "billableRates" );
  return {
    lotId: params.lotId,
    lotBillable:
      params.lotMaterialId == null?
        {} :
        LotBills.find( {_id : params.id} ).fetch(),
    billableRate:
      params.lotMaterialId == null?
        {} :
        BillableRates.find(
          {
            _id:
              LotBills.find( {_id : params.id} )
                .fetch().billableRateId,
          } ).fetch(),
    billables:
      Billables.find( {type: params.type} ).fetch(),
    billableRates:
      BillableRates.find(
      {
        active:true,
        type: params.type,
      }).fetch(),
  }
}, LotMaterialView );
