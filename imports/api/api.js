import './User.js';
import { Mongo } from 'meteor/mongo';

export const Lots = new Mongo.Collection( 'lots', {} );
export const SundryCosts = new Mongo.Collection( 'sundrys', {} );
export const Billables = new Mongo.Collection( 'billables', {} );
export const BillableRates = new Mongo.Collection( 'billableRates', {} );
export const LotBills = new Mongo.Collection( 'lotBills', {} );

Lots.allow({
  'insert': function (userId,doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  }
});

if ( Meteor.isServer) {
  Meteor.publish('lots', function () {
    return Lots.find({});
  });
  Meteor.publish('billables', function () {
    return Billables.find({});
  });
  Meteor.publish('billableRates', function () {
    return BillableRates.find({});
  });
  Meteor.publish('lotBills', function () {
    return LotBills.find({});
  });
}

Meteor.methods({
  "lot.save"( id, lot ) {
    if ( id == null ) {
      lot['createdDate'] = new Date();
      return Lots.insert( lot );
    } else {
      if ( lot.dateCompleted != null )
      {
        var lotBills = LotBills.find( { lotId: id } ).fetch();
        if ( lotBills != null && lotBills.length > 0 )
        lotBills.forEach( (lotBill) => {
          if ( lotBill.dateCompleted == null || lotBill.dateCompleted == "" )
          {
            lotBill.dateCompleted = lot.dateCompleted;
            LotBills.update( { _id: lotBill._id }, lotBill );
          }
        } );
      }
      Lots.update( { _id: id }, lot );
      return id;
    }
  },
  "lot.delete"( id ) {
    LotBills.remove( { lotId: id } );
    Lots.remove( { _id: id } );
  },
  "lotBill.delete"( id ) {
    LotBills.remove( { _id: id } );
  },
  "lotBill.save"( id, lotBill ) {
    if ( id == null ) {
      lotBill['createdDate'] = new Date();
      return LotBills.insert( lotBill );
    } else {
      return LotBills.update( { _id: id }, lotBill );
    }
  },
  "billableRate.save"( billableId, rateId, billableRate ) {
    billableRate.unitCost = billableRate.unitCost.replace( /[^\d\\.]+/, "" );
    if ( billableId == null ) {
      var billable = {
        name: billableRate.name,
        type: billableRate.type,
        createdDate: new Date(),
      };
      billableId = Billables.insert( billable );
    }
    else {
      Billables.update(
        { _id: billableId },
        { $set:
          { name: billableRate.name } } );
    }
    if ( rateId != null ) {
      var oldRate = BillableRates.find( {_id: rateId}).fetch();
      if ( oldRate.rate == billableRate.unitCost ) {
        return;
      }
      oldRate['active'] = false;
      BillableRates.update(
        { _id: rateId },
        { $set:
          { active: false} } );
    }
    delete billableRate.name;
    billableRate['createdDate'] = new Date();
    billableRate['billableId'] = billableId;
    billableRate['active'] = true;
    return BillableRates.insert( billableRate );
  },
});
