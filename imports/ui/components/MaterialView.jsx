import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Materials } from '../../api/api.js';

class MaterialView extends Component {

  cancel( event ) {
    event.preventDefault();
    browserHistory.push( '/materialList' );
  }

  componentDidMount() {
    $('.input-field label').each( function() {
      $(this).addClass( "active" );
    } );
  }

  handleSubmit( event ) {
    event.preventDefault();
    var material = {};
    Object.keys( this.refs )
      .forEach( (key) => {
        material[key] =
          ReactDOM.findDOMNode( this.refs[key] )
            .value.trim(); } );
    Meteor.call( "materials.save", this.props.material._id, material );
    browserHistory.push( '/materialList' );
  }

  render() {
    return (
      <div className={classNames('MaterialsView')}>
        <h1>Material Details</h1>
        <div className="row">
          <button onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s6">
              <input ref="materialNumber" type="text" className="validate" defaultValue={this.props.material.materialNumber}/>
              <label htmlFor="materialNumber">Material Number</label>
            </div>
            <div className="input-field col s6">
              <input ref="builderOwner" type="text" className="validate" defaultValue={this.props.material.builderOwner}/>
              <label htmlFor="builderOwner">Builder/Owner</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4">
              <input ref="contact" type="text" className="validate" defaultValue={this.props.material.contact}/>
              <label htmlFor="contact">Contact</label>
            </div>
            <div className="input-field col s4">
              <input ref="phone" type="text" className="validate" defaultValue={this.props.material.phone}/>
              <label htmlFor="phone">Phone</label>
            </div>
            <div className="input-field col s4">
              <input ref="email" type="text" className="validate" defaultValue={this.props.material.email}/>
              <label htmlFor="email">email</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <label htmlFor="comments">Comments</label>
              <input ref="comments" type="text" className="validate" defaultValue={this.props.material.comments}/>
            </div>
          </div>
          <div className="row">
            <div className="col s3">
              <label>Date Received</label>
              <input ref="dateReceived" type="date" className="datepicker" defaultValue={this.props.material.dateReceived}/>
            </div>
            <div className="col s3">
              <label>Date Planned</label>
              <input ref="datePlanned" type="date" className="datepicker" defaultValue={this.props.material.datePlanned}/>
            </div>
            <div className="col s3">
              <label>Date Commenced</label>
              <input ref="dateReceived" type="date" className="datepicker" defaultValue={this.props.material.dateCommenced}/>
            </div>
            <div className="col s3">
              <label>Date Completed</label>
              <input ref="dateReceived" type="date" className="datepicker" defaultValue={this.props.material.dateCompleted}/>
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

MaterialView.propTypes = {
  material: PropTypes.object,
};

export default MaterialViewContainer = createContainer( ({ params }) => {
  Meteor.subscribe( "materials" );
  return {
    material: params.id == null? {} : Materials.findOne({_id:params.id}),
  }
}, MaterialView );
