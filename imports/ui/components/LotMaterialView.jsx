import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';
import { Meteor } from 'meteor/meteor';
import { Billables, BillableRates } from '../../api/api.js';

class LotMaterialView extends Component {

  cancel( event ) {
    event.preventDefault();
    browserHistory.push( '/lot/' + this.props.lotMaterial.lotId );
  }

  componentDidMount() {
    $('.input-field label').each( function() {
      $(this).addClass( "active" );
    } );
  }

  handleSubmit( event ) {
    event.preventDefault();
    var lotMaterial = {};
    lotMaterial['type'] = 'lotMaterial';
    Object.keys( this.refs )
      .forEach( (key) => {
        lotMaterial[key] =
          ReactDOM.findDOMNode( this.refs[key] )
            .value.trim(); } );
    Meteor.call(
      "billableRate.save",
      this.props.lotMaterial._id,
      this.props.lotMaterialRate._id,
      lotMaterial );
    browserHistory.push( '/lotMaterialList' );
  }

  render() {
    return (
      <div className={classNames('LotMaterialsView')}>
        <h1>Fencing LotMaterial Details</h1>
        <div className="row">
          <button onClick={this.cancel.bind(this)}>Cancel</button>
        </div>
        <form className="col s12" onSubmit={this.handleSubmit.bind(this)}>
          <div className="row">
            <div className="input-field col s6">
              <input ref="name" type="text" className="validate" defaultValue={this.props.lotMaterial.name}/>
              <label htmlFor="lotMaterialNumber">LotMaterial</label>
            </div>
            <div className="input-field col s6">
              <input ref="unitCost" type="text" className="validate" defaultValue={this.props.lotMaterialRate == null? "" : this.props.lotMaterialRate.unitCost}/>
              <label htmlFor="builderOwner">Cost per Meter</label>
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

LotMaterialView.propTypes = {
  lotMaterial: PropTypes.object,
};

export default LotMaterialViewContainer = createContainer( ({ params }) => {
  Meteor.subscribe( "billables" );
  Meteor.subscribe( "billableRates" );
  return {
    lotMaterial: params.id == null? {} : Billables.findOne({_id:params.id}),
    lotMaterialRate: params.id == null?
      {} :
      BillableRates.findOne({
        active:true,
        billableId:params.id })
  }
}, LotMaterialView );
