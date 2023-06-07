/**
 * External dependencies.
 */
import React from 'react';

/**
 * Internal dependencies.
 */
import './app.css';
import { TabSelctor } from './components';

const App: React.FC = () => {
  return (
    <div className='w-full h-screen'>
        <TabSelctor/>
    </div>
  );
};

export default App;
