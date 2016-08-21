import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Lots } from '../../api/api.js';
import LotListItem from './LotListItem.jsx';
import LotView from './LotView.jsx';

class LotListView extends Component {
  addLot() {
    browserHistory.push( "/lot/" );
  }

  renderLots() {
    return this.props.lots.map((lot) => (
      <LotListItem key={lot._id} lot={lot}/>
    ));
  }

  render() {
    return (
      <div className={classNames('LotListView')}>
        <h3>View Lots</h3>
        <button onClick={this.addLot.bind( this )}>Add Lot</button>
        <ul className="collection">
          {this.renderLots()}
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
