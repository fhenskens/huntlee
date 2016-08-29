import React from 'react';
import classNames from 'classnames';
import { browserHistory } from 'react-router';

function Home() {
  browserHistory.push( "/lotList" );
  return (
    <div className={classNames('Home')} >
      <h1>Welcome to Lot Management</h1>
      <p>Here would be a good place to put some information</p>
    </div>
  );
}

export default Home;
