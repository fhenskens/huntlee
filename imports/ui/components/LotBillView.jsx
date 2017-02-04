import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { LotBills, Billables, BillableRates } from '../../api/api.js';

class LotBillView extends Component {

  cancel( event ) {
    event.preventDefault();
    browserHistory.push(
      '/lot/'
        + this.props.lotId );
  }

  componentDidMount() {
    $('.input-field label').each( function() {
      $(this).addClass( "active" );
    } );
  }

  componentDidUpdate() {
    this.updateBillableRate();
  }

  handleSubmit( event ) {
    event.preventDefault();
    var lotBill = {};
    lotBill['type'] = this.props.type;
    lotBill['lotId'] = this.props.lotId;
    var billableId = $("#billableId").val();
    var unitCost =
      this.props.lotBill._id == null?
        $("#unitCost").text() :
        this.props.lotBill.unitCost;
    var quantity = $("#quantity").val();
    var total = unitCost * quantity;
    if ( billableId == null )
    {
      lotBill['billableId'] = this.props.lotBill.billableId;
      lotBill['billableRateId'] = this.props.lotBill._id;
      lotBill['billableName'] = this.props.lotBill.billableName;
    }
    else
    {
      lotBill['billableRateId'] =
        this.props.billableRates.find( function ( rate ) {
          return rate.billableId == billableId;
        } )._id;
      lotBill['billableName'] =
        this.props.billables.find( function( billable ) {
          return billable._id == billableId;
        } ).name;
    }
    lotBill['unitCost'] = unitCost;
    lotBill['total'] = quantity * unitCost;
    Object.keys( this.refs )
      .forEach( (key) => {
        lotBill[key] = this.getFormValue( key );
      } );
    Meteor.call(
      "lotBill.save",
      this.props.lotBill._id,
      lotBill );
    browserHistory.push( '/lot/' + this.props.lotId );
  }

  getFormValue( key )
  {
    var value =
      ReactDOM.findDOMNode( this.refs[key] )
        .value.trim();
    if ( key.startsWith( "date" ) && value != "" )
    {
      value = new Date( value );
    }
    return value;
  }

  render() {
    if ( !this.props.ready ) {
      return (
        <div>Loading...</div>
      );
    }
    switch ( this.props.type ) {
      case "labour":
        return this.renderLabourForm();
      case "material":
        return this.renderMaterialForm();
      case "other":
        return this.renderOtherCostsForm();
    }
  }

  formatDate( d ) {
    if ( d == null || typeof d === "string" )
    {
      return d;
    }
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  updateBillableRate()
  {
    var billableId = $("#billableId").val();
    var unitCostEl = $("#unitCost");
    var rate;
    if ( this.props.lotBill._id == null &&
        billableId == null ||
        unitCostEl == null ) {
      rate = "0";
    }
    else if ( this.props.lotBill._id != null )
    {
      rate = this.props.lotBill.unitCost;
    }
    else
    {
      rate =
        this.props.billableRates.find(
          function( rate )
          {
            return rate.billableId == billableId;
          } ).unitCost;
    }
    unitCostEl.text( rate );
    this.updateTotal();
  }

  updateTotal()
  {
    var unitCost =
      this.props.lotBill._id == null?
        $("#unitCost").text() :
        this.props.lotBill.unitCost;
    var quantity = $("#quantity").val();
    $("#total").text( "$" + unitCost * quantity );
  }

  renderMaterialForm() {
    if ( this.props.lotBill._id == null )
    {
      var billableRates = this.props.billableRates;
      var billables = this.props.billables;
      return (
        <div className={classNames('LotBillView')}>
          <h3>Fence Run</h3>
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
                  defaultValue={this.props.lotBill._id}
                  onChange={this.updateBillableRate.bind(this)}>
                  {this.renderBillableOptions()}
                </select>
                <label className="active" htmlFor="billableId">Material</label>
              </div>
              <div className="input-field col s2">
                <p id="unitCost"/>
                <label className="active" htmlFor="builderOwner">Cost per Meter</label>
              </div>
              <div className="input-field col s2">
                <input
                  id="quantity"
                  ref="quantity"
                  type="text"
                  className="validate"
                  defaultValue={this.props.lotBill.quantity}
                  onChange={this.updateTotal.bind(this)}/>
                <label className="active" htmlFor="builderOwner">Length (meters)</label>
              </div>
              <div className="input-field col s2">
                <p id="total"/>
                <label className="active" htmlFor="builderOwner">Total</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input ref="description" type="text" className="validate" defaultValue={this.props.lotBill.description}/>
                <label className="active" htmlFor="builderOwner">Description</label>
              </div>
            </div>
            <div className="row">
              <div className="col s3">
                <label className="active">Date Completed</label>
                <input
                  ref="dateCompleted"
                  type="date"
                  className="datepicker"
                  defaultValue={this.formatDate( this.props.lotBill.dateCompleted )}/>
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
      <div className={classNames('LotBillView')}>
        <h3>Fence Run</h3>
        <div className="row">
          <button onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s6">
              <p>{this.props.lotBill.billableName}</p>
              <label className="active" htmlFor="billableId">Material</label>
            </div>
            <div className="input-field col s2">
              <p>{this.props.lotBill.unitCost}</p>
              <label className="active" htmlFor="builderOwner">Cost per Meter</label>
            </div>
            <div className="input-field col s2">
              <input
                id="quantity"
                ref="quantity"
                type="text"
                className="validate"
                defaultValue={this.props.lotBill.quantity}
                onChange={this.updateTotal.bind(this)}/>
              <label className="active" htmlFor="builderOwner">Length (meters)</label>
            </div>
            <div className="input-field col s2">
              <p id="total"/>
              <label className="active" htmlFor="builderOwner">Total</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input ref="description" type="text" className="validate" defaultValue={this.props.lotBill.description}/>
              <label className="active" htmlFor="builderOwner">Description</label>
            </div>
          </div>
          <div className="row">
            <div className="col s3">
              <label className="active">Date Completed</label>
              <input
                ref="datePainted"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lotBill.dateCompleted )}/>
            </div>
          </div>
          <div className="row">
            <input type="submit" value="Submit"/>
          </div>
        </form>
      </div>
    );
  }

  renderLabourForm() {
    if ( this.props.lotBill._id == null )
    {
      var billableRates = this.props.billableRates;
      var billables = this.props.billables;
      return (
        <div className={classNames('LotBillView')}>
          <h3>Labour Cost</h3>
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
                  defaultValue={this.props.lotBill._id}
                  onChange={this.updateBillableRate.bind(this)}>
                  {this.renderBillableOptions()}
                </select>
                <label className="active" htmlFor="billableId">Role</label>
              </div>
              <div className="input-field col s2">
                <p id="unitCost"/>
                <label className="active" htmlFor="builderOwner">Hourly Rate</label>
              </div>
              <div className="input-field col s2">
                <input
                  id="quantity"
                  ref="quantity"
                  type="text"
                  className="validate"
                  defaultValue={this.props.lotBill.quantity}
                  onChange={this.updateTotal.bind(this)}/>
                <label className="active" htmlFor="builderOwner">Hours</label>
              </div>
              <div className="input-field col s2">
                <p id="total"/>
                <label className="active" htmlFor="builderOwner">Total</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s9">
                <input ref="description" type="text" className="validate" defaultValue={this.props.lotBill.description}/>
                <label className="active" htmlFor="builderOwner">Description</label>
              </div>
              <div className="col s3">
                <label className="active">Date Completed</label>
                <input
                  ref="datePainted"
                  type="date"
                  className="datepicker"
                  defaultValue={this.formatDate( this.props.lotBill.dateCompleted )}/>
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
      <div className={classNames('LotBillView')}>
        <h3>Labour Costs</h3>
        <div className="row">
          <button onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s6">
              <p>{this.props.lotBill.billableName}</p>
              <label className="active" htmlFor="billableId">Role</label>
            </div>
            <div className="input-field col s2">
              <p>{this.props.lotBill.unitCost}</p>
              <label className="active" htmlFor="builderOwner">Hourly Rate</label>
            </div>
            <div className="input-field col s2">
              <input
                id="quantity"
                ref="quantity"
                type="text"
                className="validate"
                defaultValue={this.props.lotBill.quantity}
                onChange={this.updateTotal.bind(this)}/>
              <label className="active" htmlFor="builderOwner">Hours</label>
            </div>
            <div className="input-field col s2">
              <p id="total"/>
              <label className="active" htmlFor="builderOwner">Total</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s9">
              <input ref="description" type="text" className="validate" defaultValue={this.props.lotBill.description}/>
              <label className="active" htmlFor="builderOwner">Description</label>
            </div>
            <div className="col s3">
              <label className="active">Date Completed</label>
              <input
                ref="datePainted"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lotBill.dateCompleted )}/>
            </div>
          </div>
          <div className="row">
            <input type="submit" value="Submit"/>
          </div>
        </form>
      </div>
    );
  }

  renderBillableOptions() {
    return this.props.billables.map( (billable) => (
      <option key={billable._id} value={billable._id}>{billable.name}</option>
    ) );
  }

  renderOtherCostsForm()
  {
    return (
      <div className={classNames('LotBillView')}>
        <h3>Other Costs</h3>
        <div className="row">
          <button onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s10">
              <input ref="description" type="text" className="validate" defaultValue={this.props.lotBill.description}/>
              <label className="active" htmlFor="builderOwner">Description</label>
            </div>
            <div className="input-field col s2">
              <input
                id="total"
                ref="total"
                type="text"
                className="validate"
                defaultValue={this.props.lotBill.total}
                onChange={this.updateTotal.bind(this)}/>
              <label className="active" htmlFor="builderOwner">Cost</label>
            </div>
          </div>
          <div className="row">
            <div className="col s3">
              <label className="active">Date Completed</label>
              <input
                ref="dateCompleted"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lotBill.dateCompleted )}/>
            </div>
          </div>
          <div className="row">
            <input type="submit" value="Submit"/>
          </div>
        </form>
      </div>
    );
  }
}

LotBillView.propTypes = {
  lotId: PropTypes.string.isRequired,
  lotBill: PropTypes.object,
  type: PropTypes.string.isRequired,
  billables: PropTypes.array,
  billableRates: PropTypes.array,
};

export default LotBillViewContainer = createContainer( ({params}) => {
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
    lotBill:
      params.lotBillId == null?
        {} :
        LotBills.findOne( {_id : params.lotBillId} ),
    billables:
      Billables.find( {type: params.type} ).fetch(),
    billableRates:
      BillableRates.find(
      {
        active:true,
        type: params.type,
      }).fetch(),
  }
}, LotBillView );
