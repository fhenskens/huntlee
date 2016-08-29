import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Lots, LotBills } from '../../api/api.js';

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
      <div className={classNames('LabourListView')}>
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
              <th>Run</th>
              <th>Type</th>
              <th>Length (m)</th>
              <th>Rate ($/m)</th>
              <th>Status</th>
              <th>Date Received</th>
              <th>Date Planned</th>
            </tr>
            {this.renderLotBills()}
          </tbody>
        </table>
      </div>
    );
  }

  renderLotBills() {
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
    var lotBills = this.props.lotBills.filter( function (lotBill) {
      var matchingLot = lots.find( function (lot) {
        return lot._id == lotBill.lotId;
      } );
      if ( matchingLot != null )
      {
        matchingLot['willBeShown'] = true;
        lotBill['lot'] = matchingLot;
      }
      return matchingLot != null;
    } );
    lots.filter( function( lot ) {
      return lot.willBeShown == null;
    } ).forEach( function( lot ) {
      var lotBill = {
        _id: lot._id,
        lot: lot,
      }
      lotBills.push( lotBill );
    } )
    lotBills = lotBills.sort( function( left, right ) {
      if ( left.lot.status != right.lot.status )
      {
        return left.lot.status - right.lot.status;
      }
      var a = left.lot.lotNumber;
      var b = right.lot.lotNumber;
      return (a<b?-1:(a>b?1:0));
    } );
    return lotBills.map( (lotBill) => (
      <tr key={lotBill._id}>
        <td>{lotBill.lot.lotNumber}</td>
        <td>{lotBill.description}</td>
        <td>{lotBill.billableName}</td>
        <td>{lotBill.quantity}</td>
        <td>{lotBill.unitCost}</td>
        <td>
          {this.renderStatus( lotBill )}
          {this.renderDateConstructed( lotBill )}
          {this.renderDatePainted( lotBill )}
        </td>
        <td>{this.formatDate( lotBill.lot.dateReceived )}</td>
        <td>{this.formatDate( lotBill.lot.datePlanned )}</td>
      </tr>
    ) );
  }

  pad(n) {return n < 10 ? "0"+n : n;}
  formatDate( dateobj ) {
    var formattedDate =
      this.pad(dateobj.getDate())
        + "/"
        + this.pad(dateobj.getMonth()+1)
        + "/"
        + dateobj.getFullYear();
    return formattedDate;
  }

  renderStatus( lotBill ) {
    var lotStatus =
      Object.values( Status ).find( function ( status ) {
        return status.id == lotBill.lot.status;
      }).name;
    return ( <div>{lotStatus}</div> );
  }

  renderDateConstructed( lotBill ) {
    if ( lotBill.dateConstructed == null ||
         lotBill.dateConstructed == "" ) {
      return;
    }
    return (
      <div>
        Construct Billed {
          this.formatDate( lotBill.dateConstructed )
        }
      </div>
    );
  }
  renderDatePainted( lotBill ) {
    if ( lotBill.datePainted == null ||
         lotBill.datePainted == "" ) {
      return;
    }
    return (
      <div>
        Paint Billed {
          this.formatDate( lotBill.datePainted )
        }
      </div>
    );
  }
}


StatusReportView.propTypes = {
  lots: PropTypes.array,
  lotBills: PropTypes.array,
}

export default StatusReportViewContainer = createContainer( (params) => {
  Meteor.subscribe( "lots" );
  Meteor.subscribe( "lotBills" );
  return {
    lots: Lots.find().fetch(),
    lotBills: LotBills.find({type: 'material'}).fetch(),
  }
}, StatusReportView );
