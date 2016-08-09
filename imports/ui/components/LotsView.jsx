import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Lots } from '../../api/api.js';
import LotListItem from './LotListItem.jsx';
import LotView from './LotView.jsx';

class LotsView extends Component {
  addLot() {
    browserHistory.push( "/lot/" );
  }

  renderLots() {
    return this.props.lots.map((lot) => (
      <LotListItem key={lot.id} lot={lot}/>
    ));
  }

  render() {
    return (
      <div className={classNames('LotsView')}>
        <h1>View Lots</h1>
        <button onClick={this.addLot.bind( this )}>Add Lot</button>
        <ul className="collection">
          {this.renderLots()}
        </ul>
      </div>
    );
  }
}

LotsView.propTypes = {
  lots: PropTypes.array.isRequired,
  lot: PropTypes.array,
}

export default LotsViewContainer = createContainer( () => {
  Meteor.subscribe( "lots" );
  return {
    lots: Lots.find({}).fetch(),
    lot: null,
  }
}, LotsView );
