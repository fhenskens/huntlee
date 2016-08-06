import './User.js';
import { Mongo } from 'meteor/mongo';

export const Lots = new Mongo.Collection( 'lots' );
