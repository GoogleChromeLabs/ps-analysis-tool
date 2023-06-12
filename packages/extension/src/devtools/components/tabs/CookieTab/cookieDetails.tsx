/**
 * External dependencies.
 */
import React from 'react';
import { Cookie as ParsedCookie } from 'simple-cookie';

interface ICookieDetails {
  data: ParsedCookie;
}

const CookieDetails = ({ data }: ICookieDetails) => (
  <div className="flex flex-col p-4 items-center">
    <h1 className="w-2/3 font-bold text-xl mb-2">{data.name}</h1>
    <div className=" w-2/3 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Domain</h1>
        <p className="text-sm truncate">{data.domain}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Path</h1>
        <p className="text-sm truncate">{data.path}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Samesite</h1>
        <p className="text-sm truncate">{data.samesite}</p>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg mr-2">Value</h1>
        <p className=" text-sm truncate">{data.value}</p>
      </div>
    </div>
  </div>
);
export default CookieDetails;
