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
import React, { useState } from 'react';
import {
  MatrixComponentHorizontal,
  Matrix,
  type MatrixComponentProps,
  InfoIcon,
} from '@ps-analysis-tool/design-system';
import {
  filterFramesWithCookies,
  type TabCookies,
  type TabFrames,
  Legend,
} from '@ps-analysis-tool/common';

interface CookiesMatrixProps {
  tabCookies: TabCookies | null;
  componentData: Legend[];
  tabFrames: TabFrames | null;
  title?: string;
  description?: string;
  showHorizontalMatrix?: boolean;
  showInfoIcon?: boolean;
  count?: number | null;
  associatedCookiesCount?: number | null;
  allowExpand?: boolean;
  highlightTitle?: boolean;
  capitalizeTitle?: boolean;
}

interface LegendData {
  [key: string]: {
    description: string;
    countClassName: string;
  };
}

const LEGEND_DATA: LegendData = {
  Functional: {
    description:
      'Cookies necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size, etc.)',
    countClassName: 'text-functional',
  },
  Marketing: {
    description:
      "Cookies used to track visitors across websites, gathering information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
    countClassName: 'text-marketing',
  },
  Analytics: {
    description:
      'Cookies used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site.',
    countClassName: 'text-analytics',
  },
  Uncategorized: {
    description:
      'Cookies that could not be categorized. You may check sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
    countClassName: 'text-uncategorized',
  },
};
const BLOCKED_COOKIE_LEGEND_DATA: LegendData = {
  SecureOnly: {
    description:
      "This cookie was blocked because it had the 'Secure' attribute and the connection was not secure.",
    countClassName: 'text-secureonly',
  },
  DomainMismatch: {
    description:
      "This cookie was blocked because the request URL's domain did not exactly match the cookie's domain, nor was the request URL's domain a subdomain of the cookie's Domain attribute value.",
    countClassName: 'text-domainmismatch',
  },
  NotOnPath: {
    description:
      "This cookie was blocked because its path was not an exact match for, or a superdirectory of, the request URL's path.",
    countClassName: 'text-notonpath',
  },
  SameSiteStrict: {
    description:
      "This cookie was blocked because it had the 'SameSite=Strict' attribute and the request was made from a different site. This includes top-level navigation requests initiated by other sites.",
    countClassName: 'text-samesitestrict',
  },
  SameSiteLax: {
    description:
      "This cookie was blocked because it had the 'SameSite=Lax' attribute and the request was made from a different site and was not initiated by a top-level navigation.",
    countClassName: 'text-samesitelax',
  },
  SameSiteUnspecifiedTreatedAsLax: {
    description:
      "This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to 'SameSite=Lax', and was blocked because the request was made from a different site and was not initiated by a top-level navigation. The cookie had to have been set with 'SameSite=None' to enable cross-site usage.",
    countClassName: 'text-samesiteunspecifiedtreatedaslax',
  },
  SameSiteNoneInsecure: {
    description:
      "This cookie was blocked because it had the 'SameSite=None' attribute but was not marked 'Secure'. Cookies without SameSite restrictions must be marked 'Secure' and sent over a secure connection.",
    countClassName: 'text-samesitenoneinsecure',
  },
  UserPreferences: {
    description: 'This cookie was blocked due to user preferences.',
    countClassName: 'text-userpreferences',
  },
  ThirdPartyPhaseout: {
    description: 'Prepare for phasing out third-party cookies',
    countClassName: 'text-thirdpartyphaseout',
  },
  ThirdPartyBlockedInFirstPartySet: {
    description:
      'The cookie was blocked by third-party cookie blocking between sites in the same First-Party Set.',
    countClassName: 'text-thirdpartyblockedinfirstpartyset',
  },
  UnknownError: {
    description: 'Unknown error',
    countClassName: 'text-unknownerror',
  },
  SchemefulSameSiteStrict: {
    description:
      "This cookie was blocked because it had the 'SameSite=Strict' attribute but the request was cross-site. This includes top-level navigation requests initiated by other sites. This request is considered cross-site because the URL has a different scheme than the current site.",
    countClassName: 'text-schemefulsamesitestrict',
  },
  SchemefulSameSiteLax: {
    description:
      "This cookie was blocked because it had the 'SameSite=Lax' attribute but the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.",
    countClassName: 'text-schemefulsamesitelax',
  },
  SchemefulSameSiteUnspecifiedTreatedAsLax: {
    description:
      "This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to 'SameSite=Lax\"', and was blocked because the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.",
    countClassName: 'text-schemefulsamesiteunspecifiedtreatedaslax',
  },
  SamePartyFromCrossPartyContext: {
    description:
      "This cookie was blocked because it had the 'SameParty' attribute but the request was cross-party. The request was considered cross-party because the domain of the resource's URL and the domains of the resource's enclosing frames/documents are neither owners nor members in the same first-party set.",
    countClassName: 'text-samepartyfromcrosspartycontext',
  },
  NameValuePairExceedsMaxSize: {
    description:
      'This cookie was blocked because it was too large. The combined size of the name and value must be less than or equal to 4,096 characters.',
    countClassName: 'text-namevaluepairexceedsmaxsize',
  },
  ExcludeSameSiteUnspecifiedTreatedAsLax: {
    description: '',
    countClassName: 'text-excludesamesiteunspecifiedtreatedaslax',
  },
  ExcludeSameSiteNoneInsecure: {
    description:
      '\n    <h1>Mark cross-site cookies as Secure to allow them to be sent in cross-site requests</h1>\n    <br />\n    <p>Cookies marked with <code>SameSite=None</code> must also be marked with <code>Secure</code> to get sent in cross-site requests. \n    This behavior protects user data from being sent over an insecure connection.</p>\n    <br />\n    <p>Resolve this issue by updating the attributes of the cookie:</p>\n    <ul>\n        <li>Specify <code>SameSite=None</code> and <code>Secure</code> if the cookie should be sent in cross-site requests. This enables third-party use.</li>\n        <li>Specify <code>SameSite=Strict</code> or <code>SameSite=Lax</code> if the cookie should not be sent in cross-site requests.</li>\n    </ul>\n',
    countClassName: 'text-excludesamesitenoneinsecure',
  },
  ExcludeSameSiteLax: {
    description: 'Something went wrong',
    countClassName: 'text-excludesamesitelax',
  },
  ExcludeSameSiteStrict: {
    description: 'Something went wrong',
    countClassName: 'text-excludesamesitestrict',
  },
  ExcludeInvalidSameParty: {
    description:
      '\n    <h1>Mark SameParty cookies as Secure and do not use SameSite=Strict for SameParty cookies</h1>\n    <br />\n    <p>Cookies marked with <code>SameParty</code> must also be marked with <code>Secure</code>. In addition, cookies marked with <code>SameParty</code> cannot use <code>SameSite=Strict</code>.</p>\n    <br />\n    <p>Resolve this issue by updating the attributes of the cookie:</p>\n    <ul>\n        <li>Remove <code>SameParty</code> if the cookie should only be used by the same site but not the same first-party set</li>\n        <li>Remove <code>SameSite=Strict</code> and specify <code>Secure</code> if the cookie should be available to all sites of the same first-party set</li>\n    </ul>\n',
    countClassName: 'text-excludeinvalidsameparty',
  },
  ExcludeSamePartyCrossPartyContext: {
    description:
      "\n    <h1>Make sure a cookie is using the SameParty attribute correctly</h1>\n    <br />\n    <p>Setting cross-site cookies with the <code>SameParty</code> attribute is only possible if both domains are a part of the same First-Party Set.</p>\n    <br />\n    <p>To allow setting cross-site cookies, try one of the following:</p>\n    <ul>\n        <li>If the domains satisfy the First-Party Set criteria, add them to the same First-Party Set.</li>\n        <li>If the domains don't satisfy the First-Party Set criteria, remove the <code>SameParty</code> attribute and specify <code>SameSite=None</code>.</li>\n    </ul>\n    <br />\n    <p>If you don't have the option to do any of the above, cookies are not intended to be set in cross-site contexts.</p>\n",
    countClassName: 'text-excludesamepartycrosspartycontext',
  },
  ExcludeDomainNonASCII: {
    description:
      '\n    <h1>Ensure cookie <code>Domain</code> attribute values only contain ASCII characters</h1>\n    <br />\n    <p><code>Domain</code> attributes in cookies are restricted to the ASCII character set. Any cookies that contain characters outside of the ASCII range in their <code>Domain</code> attribute will be ignored.</p>\n    <br />\n    <p>To resolve this issue, you need to remove all non-ASCII characters from the <code>Domain</code> attribute of the affected cookies.</p>\n    <br />\n    <p>If your site has an internationalized domain name (IDN), you should use <a href="punycodeReference">punycode</a> representation for the <code>Domain</code> attribute instead.</p>\n',
    countClassName: 'text-excludedomainnonascii',
  },
  ExcludeThirdPartyCookieBlockedInFirstPartySet: {
    description:
      "\n    <h1>Third-party cookie blocked within the same First-Party Set</h1>\n    <br />\n    <p>\n        A cookie embedded by a site in the top-level page's First-Party Set was blocked by third-party cookie blocking.\n    </p>\n",
    countClassName: 'text-excludethirdpartycookieblockedinfirstpartyset',
  },
  ExcludeThirdPartyPhaseout: {
    description:
      '\n    <h1>Cookie is blocked when sent in cross-site context</h1>\n    <br />\n    <p>\n        Cookies marked with <code>SameSite=None; Secure;</code> and not <code>Partitioned</code> are blocked in cross-site requests. This behavior protects user data from cross-site tracking.\n    </p>\n',
    countClassName: 'text-excludethirdpartyphaseout',
  },
};

const CookiesMatrix = ({
  tabCookies,
  componentData,
  tabFrames,
  title = 'Cookies Insights',
  description = '',
  showHorizontalMatrix = true,
  showInfoIcon = true,
  count = null,
  associatedCookiesCount = null,
  allowExpand = true,
  highlightTitle = false,
  capitalizeTitle = false,
}: CookiesMatrixProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dataComponents: MatrixComponentProps[] = componentData.map(
    (component) => {
      const additionalDataComponent =
        LEGEND_DATA[component.label] ||
        BLOCKED_COOKIE_LEGEND_DATA[component.label] ||
        {};
      if (title === 'Cookies Insights') {
        return {
          ...additionalDataComponent,
          ...component,
          title: component.label,
          isExpanded,
          containerClasses: '',
        };
      } else if (title === 'Blocked cookie insights') {
        if (component.count && component.count > 0) {
          return {
            ...additionalDataComponent,
            ...component,
            title: component.label,
            isExpanded,
            containerClasses: '',
          };
        }
      }
      return {};
    }
  );

  const totalFrames = tabFrames ? Object.keys(tabFrames).length : 0;
  const framesWithCookies = filterFramesWithCookies(tabCookies, tabFrames);

  const matrixHorizontalComponents = [
    {
      title: 'Number of Frames',
      description: 'Number of frames found on the page.',
      count: totalFrames,
      expand: isExpanded,
    },
    {
      title: 'Number of Frames with Associated Cookies',
      description: 'Frames that have cookies associated with them.',
      count: associatedCookiesCount
        ? associatedCookiesCount
        : framesWithCookies
        ? Object.keys(framesWithCookies).length
        : 0,
      expand: isExpanded,
    },
  ];

  return (
    <div className="w-full" data-testid="cookies-matrix">
      <div>
        <div className="flex gap-x-5 justify-between border-b border-bright-gray dark:border-quartz">
          <div className="pb-3 flex flex-col gap-1.5">
            <h4
              className={`flex items-center gap-1 flex-1 grow text-xs font-bold text-darkest-gray dark:text-bright-gray ${
                highlightTitle ? 'text-red-500 dark:text-red-500' : ''
              } ${capitalizeTitle ? 'capitalize' : 'uppercase'}`}
            >
              <span>{title}</span>
              {showInfoIcon && (
                <span title="Cookies must be analyzed on a new, clean Chrome profile for an accurate report.">
                  <InfoIcon />
                </span>
              )}
              {count !== null && <span>: {Number(count) || 0}</span>}
            </h4>
            <p className="text-xs text-darkest-gray dark:text-bright-gray">
              {description}
            </p>
          </div>
          {allowExpand && (
            <h4 className="pb-3 flex-1 grow text-xs font-bold text-darkest-gray dark:text-bright-gray text-right">
              <button onClick={() => setIsExpanded((state) => !state)}>
                {isExpanded ? 'Collapse View' : 'Expand View'}
              </button>
            </h4>
          )}
        </div>
        <Matrix dataComponents={dataComponents} />
      </div>
      {showHorizontalMatrix && (
        <div>
          {matrixHorizontalComponents.map(
            (matrixHorizontalComponent, index) => (
              <MatrixComponentHorizontal
                key={index}
                {...matrixHorizontalComponent}
                containerClasses="px-3.5 py-4"
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CookiesMatrix;
