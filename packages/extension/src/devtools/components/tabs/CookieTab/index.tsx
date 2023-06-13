/**
 * External dependencies.
 */
import React from 'react';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../../app/cookieStore';
import CookieList from './cookieList';

export const CookieTab = () => {
  const cookies = useCookieStore(({ state }) => state.cookies);
  return (
    <div className="w-full h-full flex flex-col ">
      <div className="flex-1 overflow-y-scroll ">
        <CookieList cookies={cookies} />
      </div>
    </div>
  );
};
