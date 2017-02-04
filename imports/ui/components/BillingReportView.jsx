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
              <th>Bill sent</th>
            </tr>
            {this.renderLotBills()}
          </tbody>
        </table>
      </div>
    );
  }

  renderBilled( lotBill ) {
    var isBilled = lotBill.dateBilled != null && lotBill.dateBilled != "";
    var name = lotBill._id + "_dateBilled";
    return (
      <td>
        <input type="checkbox"
               name={name}
               id={name}
               readOnly={true}
               checked={isBilled}
               onClick={this.toggleDateBilled.bind( this, lotBill )} />
        <label htmlFor={name}>{this.formatDate( lotBill.dateBilled )}</label>
      </td>
    );
  }

  toggleDateBilled( lotBill ) {
    if ( lotBill.dateBilled == null || lotBill.dateBilled == "" )
    {
      lotBill["dateBilled"] = new Date();
    }
    else
    {
      lotBill["dateBilled"] = null;
    }
    Meteor.call(
      "lotBill.save",
      lotBill._id,
      lotBill );
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
        <td>{lotBill.lot.lotNumber}</td>
        <td>{lotBill.description}</td>
        <td>{lotBill.billableName}</td>
        <td>{lotBill.quantity}</td>
        <td>{lotBill.unitCost}</td>
        <td>{lotBill.total}</td>
        {this.renderBilled( lotBill )}
      </tr>
    ) );
  }

  pad(n) {return n < 10 ? "0"+n : n;}
  formatDate( dateObj ) {
    if ( dateObj == null || dateObj == "" )
    {
      return "";
    }
    var formattedDate =
      this.pad(dateObj.getDate())
        + "/"
        + this.pad(dateObj.getMonth()+1)
        + "/"
        + dateObj.getFullYear();
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
