import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Lots } from '../../api/api.js';
import LotBillableListView from './LotBillableListView.jsx';

class LotView extends Component {

  cancel( event ) {
    event.preventDefault();
    browserHistory.push( '/lotList' );
  }

  componentDidMount() {
    $('.input-field label').each( function() {
      $(this).addClass( "active" );
    } );
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

  renderCosts()
  {
    if ( this.props.lot._id == null )
    {
      return;
    }
    return (
      <div className="work">
        <LotBillableListView type="material" lotId={this.props.lot._id}/>
        <LotBillableListView type="labour" lotId={this.props.lot._id}/>
        <LotBillableListView type="" lotId={this.props.lot._id}/>
      </div>
    );
  }

  handleSubmit( event ) {
    event.preventDefault();
    var lot = {};
    Object.keys( this.refs )
      .forEach( (key) => {
        lot[key] = this.getFormValue( key );
      } );
    Meteor.call(
      "lots.save",
      this.props.lot._id, lot );
    browserHistory.push( '/lotList' );
  }

  render() {
    return (
      <div className={classNames('LotsView')}>
        <h1>Lot Details</h1>
        <div className="row">
          <button onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s6">
              <input ref="lotNumber" type="text" className="validate" defaultValue={this.props.lot.lotNumber}/>
              <label htmlFor="lotNumber">Lot Number</label>
            </div>
            <div className="input-field col s6">
              <input ref="builderOwner" type="text" className="validate" defaultValue={this.props.lot.builderOwner}/>
              <label htmlFor="builderOwner">Builder/Owner</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4">
              <input ref="contact" type="text" className="validate" defaultValue={this.props.lot.contact}/>
              <label htmlFor="contact">Contact</label>
            </div>
            <div className="input-field col s4">
              <input ref="phone" type="text" className="validate" defaultValue={this.props.lot.phone}/>
              <label htmlFor="phone">Phone</label>
            </div>
            <div className="input-field col s4">
              <input ref="email" type="text" className="validate" defaultValue={this.props.lot.email}/>
              <label htmlFor="email">email</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <label htmlFor="comments">Comments</label>
              <input ref="comments" type="text" className="validate" defaultValue={this.props.lot.comments}/>
            </div>
          </div>
          <div className="row">
            <div className="col s3">
              <label>Date Received</label>
              <input
                ref="dateReceived"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.dateReceived )}/>
            </div>
            <div className="col s3">
              <label>Date Planned</label>
              <input
                ref="datePlanned"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.datePlanned )}/>
            </div>
            <div className="col s3">
              <label>Date Commenced</label>
              <input
                ref="dateCommenced"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.dateCommenced )}/>
            </div>
            <div className="col s3">
              <label>Date Completed</label>
              <input
                ref="dateCompleted"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.dateCompleted )}/>
            </div>
          </div>
          <div className="row">
            <input type="submit" value="Save"/>
          </div>
          {this.renderCosts()}
        </form>
      </div>
    );
  }
}

LotView.propTypes = {
  lot: PropTypes.object,
};

export default LotViewContainer = createContainer( ({ params }) => {
  Meteor.subscribe( "lots" );
  return {
    lot: params.id == null? {} : Lots.findOne({_id:params.id}),
  }
}, LotView );
