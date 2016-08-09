import './User.js';
import { Mongo } from 'meteor/mongo';

export const Lots = new Mongo.Collection( 'lots', {} );

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
}

Meteor.methods({
  "lots.save"( id, lot ) {
    lot.createdDate = new Date();
    if ( id == null ) {
      Lots.insert( lot );
    } else {
      Lots.update( { _id : id }, lot );
    }
  },
});
