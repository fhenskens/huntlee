import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Lots } from '../../api/api.js';
import LotBillListView from './LotBillListView.jsx';

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
        <LotBillListView type="material" lotId={this.props.lot._id}/>
        <LotBillListView type="labour" lotId={this.props.lot._id}/>
        <LotBillListView type="other" lotId={this.props.lot._id}/>
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
      "lot.save",
      this.props.lot._id,
      lot,
      function( error, lotId ) {
        browserHistory.push( '/lot/' + lotId );
        Materialize.toast( "Lot Saved.", 3000 );
      } );
  }

  render() {
    if ( !this.props.ready ) {
      return ( <div>Loading...</div> );
    }
    return (
      <div className={classNames('LotsView')}>
        <h3>Lot Details</h3>
        <div className="row">
          <div className="col s11">
            <a href="#" onClick={ this.cancel.bind(this) }>
              <i className="small material-icons">cancel</i>
            </a>
          </div>
          <div className="col s1">
            <a href="#" onClick={ this.delete.bind( this ) }>
              <i className="small material-icons">delete</i>
            </a>
          </div>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s6">
              <input ref="lotNumber" type="text" className="validate" defaultValue={this.props.lot.lotNumber}/>
              <label className="active" htmlFor="lotNumber">Lot Number</label>
            </div>
            <div className="input-field col s6">
              <input ref="builderOwner" type="text" className="validate" defaultValue={this.props.lot.builderOwner}/>
              <label className="active" htmlFor="builderOwner">Builder/Owner</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4">
              <input ref="contact" type="text" className="validate" defaultValue={this.props.lot.contact}/>
              <label className="active" htmlFor="contact">Contact</label>
            </div>
            <div className="input-field col s4">
              <input ref="phone" type="text" className="validate" defaultValue={this.props.lot.phone}/>
              <label className="active" htmlFor="phone">Phone</label>
            </div>
            <div className="input-field col s4">
              <input ref="email" type="text" className="validate" defaultValue={this.props.lot.email}/>
              <label className="active" htmlFor="email">email</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <label className="active" htmlFor="comments">Comments</label>
              <input ref="comments" type="text" className="validate" defaultValue={this.props.lot.comments}/>
            </div>
          </div>
          <div className="row">
            <div className="col s3">
              <label className="active">Date Received</label>
              <input
                ref="dateReceived"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.dateReceived )}/>
            </div>
            <div className="col s3">
              <label className="active">Date Planned</label>
              <input
                ref="datePlanned"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.datePlanned )}/>
            </div>
            <div className="col s3">
              <label className="active">Date Commenced</label>
              <input
                ref="dateCommenced"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.dateCommenced )}/>
            </div>
            <div className="col s3">
              <label className="active">Date Completed</label>
              <input
                ref="dateCompleted"
                type="date"
                className="datepicker"
                defaultValue={this.formatDate( this.props.lot.dateCompleted )}/>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <button type="submit" className="btn waves-effect">Save</button>
            </div>
          </div>
          {this.renderCosts()}
        </form>
      </div>
    );
  }

  delete() {
    event.preventDefault();
    if ( !confirm( "Are you sure you want to delete this lot?" ) ) {
      return;
    }
    var lot = this.props.lot;
    Meteor.call(
      "lot.delete",
      lot._id,
      function( error, lotId ) {
        browserHistory.push( '/lotList' );
        Materialize.toast( "Lot Deleted.", 3000 );
      } );
  }
}

LotView.propTypes = {
  lot: PropTypes.object,
};

export default LotViewContainer = createContainer( ({ params }) => {
  const lotSubscription = Meteor.subscribe( "lots" );
  return {
    ready: lotSubscription.ready(),
    lot: params.id == null? {} : Lots.findOne({_id:params.id}),
  }
}, LotView );
