import React from 'react';
import classNames from 'classnames';

import LotView from './LotView.jsx'

export default class Lots extends React.Component {
  getLots() {
    return [
      { _id: 1, text: 'This is lot 1' },
      { _id: 2, text: 'This is lot 2' },
      { _id: 3, text: 'This is lot 3' },
    ];
  }

  renderLots() {
    return this.getLots().map((lot) => (
      <LotView key={lot._id} lot={lot} />
    ));
  }

  render() {
    return (
      <div className={classNames('Lots')} >
        <h1>View Lots</h1>
        <ul className="collection">
          {this.renderLots()}
        </ul>
      </div>
    );
  }
}

export default Lots;
