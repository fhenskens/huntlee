import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { Lots } from '../../api/api.js';

Status = {
  overdue: { id: 0, name: "Overdue" },
  listed: { id: 1, name: "Listed" },
  active: { id: 2, name: "Active" },
  completed: { id: 3, name: "Completed" },
}

class StatusReportView extends Component {
  componentDidMount() {
    this.setState({
      startDate: "",
      endDate: "",
      status: "",
    });
  }

  updateStatus() {
    this.setState( {
      status: $("#status").val()
    });
  }

  updateStartDate() {
    this.setState( {
      startDate: $("#startDate").val()
    });
  }

  updateEndDate() {
    this.setState( {
      endDate: $("#endDate").val()
    });
  }

  render() {
    return (
      <div className={classNames('StatusReportView')}>
        <h3>Status Report</h3>
        <div className="col s12">
          <div className="row">
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
              <label className="active">Planned After</label>
              <input
                id="startDate"
                ref="startDate"
                onChange={this.updateStartDate.bind(this)}
                type="date"
                className="datepicker"/>
            </div>
            <div className="col s4">
              <label className="active">Planned Before</label>
              <input
                id="endDate"
                ref="endDate"
                onChange={this.updateEndDate.bind(this)}
                type="date"
                className="datepicker"/>
            </div>
          </div>
        </div>
        <table className="collection">
          <tbody>
            <tr>
              <th>Lot No.</th>
              <th>Status</th>
              <th>Date Received</th>
              <th>Date Planned</th>
              <th>Date Commenced</th>
              <th>Date Completed</th>
            </tr>
            {this.renderLots()}
          </tbody>
        </table>
      </div>
    );
  }

  renderLots() {
    var lots = this.props.lots;
    if ( this.state == null )
    {
      return;
    }
    var status = this.state.status;
    var startDate = this.state.startDate;
    if ( startDate != "" )
    {
      startDate = new Date( startDate );
      lots = lots.filter( function ( lot ) {
        return lot.datePlanned >= startDate;
      } );
    }
    var endDate = this.state.endDate;
    if ( endDate != "" )
    {
      endDate = new Date( endDate );
      lots = lots.filter( function ( lot ) {
        return lot.datePlanned <= endDate;
      } );
    }
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
    if ( status != "" )
    {
      lots = lots.filter( function ( lot ) {
         return lot.status == status;
      } );
    }
    lots = lots.sort( function( left, right ) {
      if ( left.status != right.status )
      {
        return left.status - right.status;
      }
      var a = left.lotNumber;
      var b = right.lotNumber;
      return (a<b?-1:(a>b?1:0));
    } );
    return lots.map( (lot) => (
      <tr key={lot._id}>
        <td><a href={"lot/" + lot._id}>{lot.lotNumber}</a></td>
        {this.renderStatus( lot )}
        <td>{this.renderDate( lot, 'dateReceived' )}</td>
        <td>{this.renderDate( lot, 'datePlanned' )}</td>
        <td>{this.renderDate( lot, 'dateCommenced' )}</td>
        <td>{this.renderDate( lot, 'dateCompleted' )}</td>
      </tr>
    ) );
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

  saveLot( lot, name ) {
    event.preventDefault();
    lot[name] = this.getFormValue( lot._id + name );
    Meteor.call(
      "lot.save",
      lot._id,
      lot );
  }

  pad(n) {return n < 10 ? "0"+n : n;}
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

  renderStatus( lot ) {
    var lotStatus =
      Object.values( Status ).find( function ( status ) {
        return status.id == lot.status;
      }).name;
    return ( <td>{lotStatus}</td> );
  }

  renderDate( lot, name ) {
    return (
      <input
        ref={lot._id + name}
        type="date"
        className="datepicker"
        defaultValue={this.formatDate( lot[name] )}
        onChange={this.saveLot.bind( this, lot, name )}/>
    );
  }
}

StatusReportView.propTypes = {
  lots: PropTypes.array,
}

export default StatusReportViewContainer = createContainer( (params) => {
  Meteor.subscribe( "lots" );
  return {
    lots: Lots.find().fetch(),
  }
}, StatusReportView );
