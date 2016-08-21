import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Billables, BillableRates } from '../../api/api.js';

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
    labour['type'] = 'labour';
    Object.keys( this.refs )
      .forEach( (key) => {
        labour[key] =
          ReactDOM.findDOMNode( this.refs[key] )
            .value.trim(); } );
    Meteor.call(
      "billableRate.save",
      this.props.labour._id,
      this.props.labourRate._id,
      labour );
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
              <input ref="name" type="text" className="validate" defaultValue={this.props.labour.name}/>
              <label className="active" htmlFor="labourNumber">Labour Role</label>
            </div>
            <div className="input-field col s6">
              <input ref="unitCost" type="text" className="validate" defaultValue={this.props.labourRate == null? "" : this.props.labourRate.unitCost}/>
              <label className="active" htmlFor="builderOwner">Hourly Rate</label>
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

LabourView.propTypes = {
  labour: PropTypes.object,
};

export default LabourViewContainer = createContainer( ({ params }) => {
  Meteor.subscribe( "billables" );
  Meteor.subscribe( "billableRates" );
  return {
    labour: params.id == null? {} : Billables.findOne({_id:params.id}),
    labourRate: params.id == null?
      {} :
      BillableRates.findOne({
        active:true,
        billableId:params.id })
  }
}, LabourView );
