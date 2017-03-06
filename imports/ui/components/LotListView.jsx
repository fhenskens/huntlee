import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Lots } from '../../api/api.js';
import LotListItem from './LotListItem.jsx';
import LotView from './LotView.jsx';

Status = {
  overdue: { id: 0, name: "Overdue" },
  listed: { id: 1, name: "Listed" },
  active: { id: 2, name: "Active" },
  completed: { id: 3, name: "Completed" },
}

class LotListView extends Component {
  componentDidMount() {
    this.setState({
      searchText: null,
      status: null,
    });
  }

  addLot() {
    browserHistory.push( "/lot/" );
  }

  updateStatus() {
    this.setState( {
      status: $("#status").val()
    });
  }

  updateSearchText() {
    this.setState( {
      searchText: $("#lotNumber").val()
    });
  }

  renderLots( lots ) {
    return lots.map((lot) => (
      <LotListItem key={lot._id} lot={lot}/>
    ));
  }

  render() {
    if ( this.state == null )
    {
      return null;
    }
    var lots = this.props.lots;
    if ( this.state.status != null && this.state.status != "" )
    {
      lots.forEach( function ( lot ) {
        lot['status'] =
          lot.dateCompleted != ""?
            Status.completed.id :
            lot.dateCommenced != ""?
              Status.active.id :
              new Date( lot.datePlanned ) < new Date()?
               Status.overdue.id :
               Status.listed.id;
      } );
      var status = this.state.status;
      lots = lots.filter( function ( lot ) {
        return lot.status == status;
      } );
    }
    if ( this.state.searchText != null )
    {
      var searchText = this.state.searchText.toLowerCase();
      lots = lots.filter( function ( lot ) {
        return lot.lotNumber.toLowerCase().includes( searchText );
      } );
    }
    return (
      <div className={classNames('LotListView')}>
      <div className="row">
        <h3>View Lots</h3>
          <div className="input-field col s4">
            <select
              id="status"
              ref="billableId"
              className="validate browser-default"
              defaultValue=""
              onChange={this.updateStatus.bind(this)}>
              <option value=""/>
              <option value={Status.overdue.id}>Overdue</option>
              <option value={Status.listed.id}>Listed</option>
              <option value={Status.active.id}>Active</option>
              <option value={Status.completed.id}>Completed</option>
            </select>
            <label className="active" htmlFor="billableId">Status</label>
          </div>
          <div className="col s4">
            <div className="input-field col s6">
              <input ref="lotNumber" id="lotNumber" type="text" onChange={this.updateSearchText.bind(this)} />
              <label className="active" htmlFor="lotNumber">Lot Number</label>
            </div>
          </div>
        </div>
        <a className="waves-effect waves-light btrn" href="#" onClick={this.addLot.bind( this )}>
          <i className="small material-icons">add</i>
        </a>
        <ul className="collection">
          {this.renderLots( lots )}
        </ul>
      </div>
    );
  }
}

LotListView.propTypes = {
  lots: PropTypes.array.isRequired,
}

export default LotListViewContainer = createContainer( () => {
  Meteor.subscribe( "lots" );
  return {
    lots: Lots.find({}).fetch(),
  }
}, LotListView );
