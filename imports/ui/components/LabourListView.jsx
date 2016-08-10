import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Labours } from '../../api/api.js';
import LabourListItem from './LabourListItem.jsx';
import LabourView from './LabourView.jsx';

class LabourListView extends Component {
  addLabour() {
    browserHistory.push( "/labour/" );
  }

  renderLabours() {
    return this.props.labours.map((labour) => (
      <LabourListItem key={labour._id} labour={labour}/>
    ));
  }

  render() {
    return (
      <div className={classNames('LabourListView')}>
        <h1>Labour Rates</h1>
        <button onClick={this.addLabour.bind( this )}>Add Labour</button>
        <ul className="collection">
          {this.renderLabours()}
        </ul>
      </div>
    );
  }
}

LabourListView.propTypes = {
  labours: PropTypes.array.isRequired,
  labour: PropTypes.array,
}

export default LabourListViewContainer = createContainer( () => {
  Meteor.subscribe( "labours" );
  return {
    labours: Labours.find({}).fetch(),
    labour: null,
  }
}, LabourListView );
