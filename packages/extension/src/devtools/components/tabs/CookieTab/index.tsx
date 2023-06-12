/**
 * External dependencies.
 */
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import { useCookieStore } from '../../../../app/cookieStore';
import CookieList from './cookieList';
import CookieDetails from './cookieDetails';

export const CookieTab = () => {
  const cookies = useCookieStore(({ state }) => state.cookies);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedKey && Object.keys(cookies).length !== 0) {
      setSelectedKey(Object.keys(cookies)[0]);
    }
  }, [cookies, selectedKey]);
  const selectedCookie = selectedKey ? cookies[selectedKey] : null;
  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="flex-1 overflow-y-scroll ">
        <CookieList
          cookies={cookies}
          selectedKey={selectedKey}
          onClickItem={setSelectedKey}
        />
      </div>
      <div className="flex-1 overflow-y-scroll border-t-gray-300 border-t-2 lg:border-t-0">
        {selectedCookie && <CookieDetails data={selectedCookie.parsedData} />}
      </div>
    </div>
  );
};
