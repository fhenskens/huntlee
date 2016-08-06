import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import classNames from 'classnames';

import { Lots } from '../../api/api.js';
import LotListItem from './LotListItem.jsx';

class LotsView extends Component {

  renderLots() {
    return this.props.lots.map((lot) => (
      <LotListItem key={lot._id} lot={lot} />
    ));
  }

  render() {
    return (
      <div className={classNames('LotsView')} >
        <h1>View Lots</h1>
        <ul className="collection">
          {this.renderLots()}
        </ul>
      </div>
    );
  }
}

LotsView.propTypes = {
  lots: PropTypes.array.isRequired,
}

export default createContainer( () => {
  return {
    lots: Lots.find({}).fetch(),
  }
}, LotsView );
