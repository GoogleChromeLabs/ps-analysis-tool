/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import React, { useEffect, useRef, useState } from 'react';
import { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import DomainIcon from '../../../../../../../icons/domain.svg';
import { type CookieAnalytics } from '../../../../../../utils/fetchCookieDictionary';
import { checkIBCCompliance } from '../../../../../../worker/checkIBCCompliance';
import { getCookie } from '../../../../../../utils/getCookie';

interface CookieDetailsProps {
  data: ParsedCookie;
  analytics: CookieAnalytics | null;
  url: string;
}

const CookieDetails = ({ data, analytics, url }: CookieDetailsProps) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);

  const [shouldShowMoreDescriptionButton, setShouldShowMoreDescriptionButton] =
    useState<boolean>(false);
  const [shouldShowMoreValueButton, setShouldShowMoreValueButton] =
    useState<boolean>(false);
  const [showMoreDescription, setShowMoreDescription] =
    useState<boolean>(false);
  const [showMoreValue, setShowMoreValue] = useState<boolean>(false);

  const [chromeCookieStoreHasCookie, setChromeCookieStoreHasCookie] = useState<
    boolean | null
  >(null);
  const [isCookieIBCCompliant, setisCookieIBCCompliant] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    setChromeCookieStoreHasCookie(null);
    setisCookieIBCCompliant(null);

    (async () => {
      const _chromeCookieStoreHasCookie = Boolean(
        await getCookie(data.name, url)
      );
      setChromeCookieStoreHasCookie(_chromeCookieStoreHasCookie);

      setisCookieIBCCompliant(
        checkIBCCompliance(
          data.samesite,
          data.secure,
          _chromeCookieStoreHasCookie
        )
      );
    })();
  }, [data.name, data.samesite, data.secure, url]);

  useEffect(() => {
    setShowMoreDescription(false);
    if (descriptionRef.current) {
      const isDescriptionTruncated =
        descriptionRef.current.clientHeight <
        descriptionRef.current.scrollHeight;

      setShouldShowMoreDescriptionButton(isDescriptionTruncated);
    }
  }, [analytics?.description]);

  useEffect(() => {
    setShowMoreValue(false);
    if (valueRef.current) {
      const isValueTruncated =
        valueRef.current.clientHeight < valueRef.current.scrollHeight;

      setShouldShowMoreValueButton(isValueTruncated);
    }
  }, [data.value]);

  const openGDPRPortal = () => {
    if (analytics?.gdprUrl) {
      chrome.tabs.create({ url: analytics?.gdprUrl });
    }
  };

  return (
    <div
      className="mt-5 rounded-xl shadow-md border leading-6 w-9/12 lg:w-8/12 mx-auto max-w-[600px] overflow-hidden"
      data-testid="cookie-card"
    >
      <div className="mb-2 py-3 px-8 flex flex-col bg-[#F1F1F1] border-b border-[#CACACA]">
        <h1 className="font-bold text-xl truncate mb-3">{data.name}</h1>
        <div className="inline-block">
          <p
            ref={descriptionRef}
            className={`text-xs ${
              showMoreDescription ? '' : 'line-clamp-2'
            } text-secondary`}
          >
            {analytics?.description || 'No description available.'}
          </p>
          {shouldShowMoreDescriptionButton && (
            <button
              className="text-md font-bold text-[#007185]"
              onClick={() => {
                setShowMoreDescription(!showMoreDescription);
              }}
            >
              {showMoreDescription ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col p-8 pt-2 pb-4 divide-y divide-[#F1F1F1]">
        <div className="flex items-center py-2">
          <h1 className="w-1/4 font-semibold text-s text-[#808080]">Domain</h1>
          <p className="w-3/4 flex gap-1 text-xs text-tertiary truncate">
            <DomainIcon />
            {data.domain}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Path</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">{data.path}</p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Samesite</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">
            {data.samesite}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Platform</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">
            {analytics?.platform}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Retention period</h1>
          <p className="w-3/4 text-xs text-tertiary  truncate">
            {analytics?.retention}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">
            <abbr title="IBC (Incrementally Better Cookies): A proposed standard aiming to enhance cookie security and privacy. Key changes include treating cookies as 'SameSite=Lax' by default and requiring explicit 'SameSite=None; Secure' declaration for cross-site delivery. If any of conditions are met, the cookie should be set and treated as IBC compliant.">
              IBC Compliant
            </abbr>
          </h1>
          {isCookieIBCCompliant === null ? (
            <>Loading...</>
          ) : (
            <>
              <p className="w-3/4 text-xs text-tertiary  truncate">
                {isCookieIBCCompliant ? (
                  <span className="text-green-500">Yes</span>
                ) : (
                  <span className="text-red-500">
                    <abbr title="Cookies might be blocked due to user preferences or browser/extension's settings">
                      No
                    </abbr>
                  </span>
                )}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">
            <abbr title="Whether the cookie has been set by the website">
              Cookie Set
            </abbr>
          </h1>
          {chromeCookieStoreHasCookie === null ? (
            <>Loading...</>
          ) : (
            <p className="w-3/4 text-xs text-tertiary  truncate">
              {chromeCookieStoreHasCookie ? (
                <span className="text-green-500">Yes</span>
              ) : (
                <span className="text-red-500">No</span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">GDPR Portal</h1>
          <p
            className="w-3/4 text-xs text-tertiary truncate hover:underline cursor-pointer"
            onClick={openGDPRPortal}
          >
            {analytics?.gdprUrl}
          </p>
        </div>
        <div className="flex items-center py-2 text-[#808080]">
          <h1 className="w-1/4 font-semibold text-s">Value</h1>
          <div className="w-3/4 inline-block">
            <p
              ref={valueRef}
              className={`text-xs break-words ${
                showMoreValue ? '' : 'line-clamp-1'
              } text-secondary`}
            >
              {data.value}
            </p>
            {shouldShowMoreValueButton && (
              <button
                className="text-md font-bold text-[#007185]"
                onClick={() => {
                  setShowMoreValue(!showMoreValue);
                }}
              >
                {showMoreValue ? 'Less' : 'More'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CookieDetails;
