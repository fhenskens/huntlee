import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Billables, BillableRates } from '../../api/api.js';

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
    material['type'] = 'material';
    Object.keys( this.refs )
      .forEach( (key) => {
        material[key] =
          ReactDOM.findDOMNode( this.refs[key] )
            .value.trim(); } );
    Meteor.call(
      "billableRate.save",
      this.props.material._id,
      this.props.materialRate._id,
      material );
    browserHistory.push( '/materialList' );
  }

  render() {
    return (
      <div className={classNames('MaterialsView')}>
        <h3>Fencing Type Details</h3>
        <div className="row">
          <div className="col s12">
            <a href="#" onClick={ this.cancel.bind(this) }>
              <i className="small material-icons">cancel</i>
            </a>
          </div>
        </div>
        <form id="mainForm" className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s4">
              <input ref="name" type="text" className="validate" defaultValue={this.props.material.name}/>
              <label className="active" htmlFor="materialNumber">Material</label>
            </div>
            <div className="input-field col s4">
              <input ref="unitCost" type="text" className="validate" defaultValue={this.props.materialRate == null? "" : this.props.materialRate.unitCost}/>
              <label className="active" htmlFor="builderOwner">Cost per Meter</label>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <button type="submit" className="btn waves-effect">Save</button>
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
  Meteor.subscribe( "billables" );
  Meteor.subscribe( "billableRates" );
  return {
    material: params.id == null? {} : Billables.findOne({_id:params.id}),
    materialRate: params.id == null?
      {} :
      BillableRates.findOne({
        active:true,
        billableId:params.id })
  }
}, MaterialView );
