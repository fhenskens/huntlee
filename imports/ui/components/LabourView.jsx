import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Labours } from '../../api/api.js';

class LabourView extends Component {

  cancel( event ) {
    event.preventDefault();
    browserHistory.push( '/labourList' );
  }

  componentDidMount() {
    $('.input-field label').each( function() {
      $(this).addClass( "active" );
    } );
  }

  handleSubmit( event ) {
    event.preventDefault();
    var labour = {};
    Object.keys( this.refs )
      .forEach( (key) => {
        labour[key] =
          ReactDOM.findDOMNode( this.refs[key] )
            .value.trim(); } );
    Meteor.call( "labours.save", this.props.labour._id, labour );
    browserHistory.push( '/labourList' );
  }

  render() {
    return (
      <div className={classNames('LaboursView')}>
        <h1>Labour Details</h1>
        <div className="row">
          <button onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s6">
              <input ref="labourNumber" type="text" className="validate" defaultValue={this.props.labour.labourNumber}/>
              <label htmlFor="labourNumber">Labour Number</label>
            </div>
            <div className="input-field col s6">
              <input ref="builderOwner" type="text" className="validate" defaultValue={this.props.labour.builderOwner}/>
              <label htmlFor="builderOwner">Builder/Owner</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4">
              <input ref="contact" type="text" className="validate" defaultValue={this.props.labour.contact}/>
              <label htmlFor="contact">Contact</label>
            </div>
            <div className="input-field col s4">
              <input ref="phone" type="text" className="validate" defaultValue={this.props.labour.phone}/>
              <label htmlFor="phone">Phone</label>
            </div>
            <div className="input-field col s4">
              <input ref="email" type="text" className="validate" defaultValue={this.props.labour.email}/>
              <label htmlFor="email">email</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <label htmlFor="comments">Comments</label>
              <input ref="comments" type="text" className="validate" defaultValue={this.props.labour.comments}/>
            </div>
          </div>
          <div className="row">
            <div className="col s3">
              <label>Date Received</label>
              <input ref="dateReceived" type="date" className="datepicker" defaultValue={this.props.labour.dateReceived}/>
            </div>
            <div className="col s3">
              <label>Date Planned</label>
              <input ref="datePlanned" type="date" className="datepicker" defaultValue={this.props.labour.datePlanned}/>
            </div>
            <div className="col s3">
              <label>Date Commenced</label>
              <input ref="dateReceived" type="date" className="datepicker" defaultValue={this.props.labour.dateCommenced}/>
            </div>
            <div className="col s3">
              <label>Date Completed</label>
              <input ref="dateReceived" type="date" className="datepicker" defaultValue={this.props.labour.dateCompleted}/>
            </div>
            <div className="row">
              <input type="submit" value="Submit"/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

LabourView.propTypes = {
  labour: PropTypes.object,
};

export default LabourViewContainer = createContainer( ({ params }) => {
  Meteor.subscribe( "labours" );
  return {
    labour: params.id == null? {} : Labours.findOne({_id:params.id}),
  }
}, LabourView );
