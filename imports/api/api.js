import './User.js';
import { Mongo } from 'meteor/mongo';

export const Lots = new Mongo.Collection( 'lots', {} );
export const Labours = new Mongo.Collection( 'labours', {} );
export const Materials = new Mongo.Collection( 'materials', {} );
export const Sundrys = new Mongo.Collection( 'sundrys', {} );

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
  Meteor.publish('labours', function () {
    return Labours.find({});
  });
  Meteor.publish('materials', function () {
    return Materials.find({});
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
  "labours.save"( id, labour ) {
    labour.createdDate = new Date();
    if ( id == null ) {
      Labours.insert( labour );
    } else {
      Labours.update( { _id : id }, labour );
    }
  },
  "materials.save"( id, material ) {
    material.createdDate = new Date();
    if ( id == null ) {
      Materials.insert( material );
    } else {
      Materials.update( { _id : id }, material );
    }
  },
});
