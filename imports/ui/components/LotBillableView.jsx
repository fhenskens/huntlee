import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { LotBills, Billables, BillableRates } from '../../api/api.js';

class LotBillableView extends Component {

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
    this.selectBillable();
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
    while ( !this.props.ready ) {
      return (
        <div>Loading...</div>
      );
    }
    switch ( this.props.type ) {
      case "labour":
        return this.renderLabourForm();
      case "material":
        return this.renderMaterialForm();
      case "Other":
        return this.renderOtherForm();
    }
  }

  selectBillable()
  {
    if ( this.billableRate != null )
    {
      $('#unitCost').val( this.billableRate.unitCost );
      return;
    }
    $('#unitCost').val(
      this.props.billableRates.find(
        function (rate) {
          return rate.billableId == $('#billableId').val();
        } ).unitCost );
  }

  renderMaterialForm() {
    if ( this.props.billableRate == null )
    {
      var billableRates = this.props.billableRates;
      var billables = this.props.billables;
      return (
        <div className={classNames('LotMaterialsView')}>
          <h5>Add Fence Run</h5>
          <div className="row">
            <button onClick={this.cancel.bind(this)}>Cancel</button>
          </div>
          <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
            <div className="row">
              <div className="input-field col s6">
                <select
                  id="billableId"
                  ref="billableId"
                  className="validate browser-default"
                  onChange={
                    this.selectBillable.bind(
                      this,
                      billables,
                      billableRates )}>
                  {this.renderBillableOptions()}
                </select>
                <label className="active" htmlFor="billableId">Material</label>
              </div>
              <div className="input-field col s6">
                <input
                  id="unitCost"
                  ref="unitCost"
                  type="text"
                  className="validate"
                  value={
                    this.state == null || this.state.billableRate == null?
                      "0" :
                      this.state.billableRate.unitCost}/>
                <label className="active" htmlFor="builderOwner">Cost per Meter</label>
              </div>
            </div>
            <div className="row">
              <input type="submit" value="Submit"/>
            </div>
          </form>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="input-field col s6">
          <input
            ref="billableRateId"
            type="text"
            className="validate"
            value={this.props.billableRate._id}/>
          <label htmlFor="billableRateId">Material</label>
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

  renderLabourForm() {
  }

  renderOtherForm() {
  }

  renderBillableOptions() {
    return this.props.billables.map( (billable) => (
      <option key={billable._id} value={billable._id}>{billable.name}</option>
    ) );
  }
}

LotBillableView.propTypes = {
  lotId: PropTypes.string.isRequired,
  lotBillable: PropTypes.object,
  billableRate: PropTypes.object,
  type: PropTypes.string.isRequired,
  billables: PropTypes.array,
  billableRates: PropTypes.array,
};

export default LotBillableViewContainer = createContainer( ({params}) => {
  const lotBillsSubscription = Meteor.subscribe( "lotBills" );
  const billablesSubscription = Meteor.subscribe( "billables" );
  const billableRatesSubscription = Meteor.subscribe( "billableRates" );
  return {
    ready:
      lotBillsSubscription.ready() &&
      billablesSubscription.ready() &&
      billableRatesSubscription.ready(),
    lotId: params.lotId,
    type: params.type,
    lotBillable:
      params.lotBillableId == null?
        {} :
        LotBills.find( {_id : params.lotBillableId} ).fetch(),
    billableRate:
      params.lotBillableId == null?
        null :
        BillableRates.find(
          {
            _id:
              LotBills.find( {_id : params.lotBillableId} )
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
}, LotBillableView );
