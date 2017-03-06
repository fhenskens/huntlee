import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { Lots, LotBills } from '../../api/api.js';

Status = {
  overdue: { id: 0, name: "Overdue" },
  listed: { id: 1, name: "Listed" },
  active: { id: 2, name: "Active" },
  completed: { id: 3, name: "Completed" },
}

class BillingReportView extends Component {
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
      <div className={classNames('BillingReportView')}>
        <h3>Billing Report</h3>
        <div className="col s12">
          <div className="row">
            <div className="col s4">
              <label className="active">Completed After</label>
              <input
                id="startDate"
                ref="startDate"
                onChange={this.updateStartDate.bind(this)}
                type="date"
                className="datepicker"/>
            </div>
            <div className="col s4">
              <label className="active">Completed Before</label>
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
              <th>Description</th>
              <th>Type</th>
              <th>Length (m)</th>
              <th>Rate ($/m)</th>
              <th>Amount($)</th>
              <th>Date Completed</th>
              <th>Bill sent</th>
            </tr>
            {this.renderLotBills()}
          </tbody>
        </table>
      </div>
    );
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

  saveLotBill( lotBill, name ) {
    event.preventDefault();
    lotBill[name] = this.getFormValue( lotBill._id + name );
    Meteor.call(
      "lotBill.save",
      lotBill._id,
      lotBill );
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

  renderDate( lotBill, name ) {
    return (
      <input
        ref={lotBill._id + name}
        type="date"
        className="datepicker"
        defaultValue={this.formatDate( lotBill[name] )}
        onChange={this.saveLotBill.bind( this, lotBill, name )}/>
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
        return lot.dateCompleted >= startDate;
      } );
    }
    var endDate = this.state.endDate;
    if ( endDate != "" )
    {
      endDate = new Date( endDate );
      lots = lots.filter( function ( lot ) {
        return lot.dateCompleted <= endDate;
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
        lotBill['lot'] = matchingLot;
      }
      return matchingLot != null;
    } );
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
        <td><a href={"lot/" + lotBill.lot._id}>{lotBill.lot.lotNumber}</a></td>
        <td><a href={"/lotBill/" + lotBill.type + "/" + lotBill.lotId + "/" + lotBill._id}>{lotBill.description}</a></td>
        <td>{lotBill.billableName}</td>
        <td>{lotBill.quantity}</td>
        <td>{lotBill.unitCost}</td>
        <td>{lotBill.total}</td>
        <td>{this.renderDate( lotBill, 'dateCompleted' )}</td>
        <td>{this.renderDate( lotBill, 'dateBilled' )}</td>
      </tr>
    ) );
  }

  renderStatus( lotBill ) {
    var lotStatus =
      Object.values( Status ).find( function ( status ) {
        return status.id == lotBill.lot.status;
      }).name;
    return ( <div>{lotStatus}</div> );
  }
}


BillingReportView.propTypes = {
  lots: PropTypes.array,
  lotBills: PropTypes.array,
}

export default BillingReportViewContainer = createContainer( (params) => {
  Meteor.subscribe( "lots" );
  Meteor.subscribe( "lotBills" );
  return {
    lots: Lots.find().fetch(),
    lotBills: LotBills.find( { dateCompleted: {$ne: null}, dateCompleted: {$ne: ""} } ).fetch(),
  }
}, BillingReportView );
