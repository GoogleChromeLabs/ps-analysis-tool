/**
 * Internal dependencies.
 */
import { CookieAnalytics, CookieAnalyticsRaw, CookieDatabase } from './types';
/**
 * Fetch dictionary from local data folder.
 *
 * @returns {Promise<CookieData>}
 */
export async function fetchDictionary(): Promise<CookieDatabase> {
  const url = chrome.runtime.getURL('data/open-cookie-database.json');

  const response = await fetch(url);
  return await response.json();
}

export function getJsonAttributeIgnoreCase(
  json: CookieAnalyticsRaw,
  attrName: keyof CookieAnalyticsRaw
) {
  return json[attrName]
    ? json[attrName]
    : json[attrName.toLowerCase() as keyof CookieAnalyticsRaw];
}

export function jsonToCookieAnalytics(cookieAnalyticsJson: CookieAnalyticsRaw) {
  const cookieAnalytics: CookieAnalytics = {
    id: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'ID'),
    platform: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Platform'),
    category: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Category'),
    subCategory: undefined,
    functionality: undefined,
    description: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'Description'),
    dataController: getJsonAttributeIgnoreCase(
      cookieAnalyticsJson,
      'DataController'
    ),
    GDPRPortal: getJsonAttributeIgnoreCase(cookieAnalyticsJson, 'GDPR'),
    retentionPeriod: getJsonAttributeIgnoreCase(
      cookieAnalyticsJson,
      'Retention'
    ),
    usage: undefined,
    popularity: undefined,
    comment: undefined,
  };
  return cookieAnalytics;
}

export const isFirstParty = (toplevel: string, cookieDomain: string) => {
  let domainName = cookieDomain;

  if (domainName.charAt(0) === '.') {
    domainName = domainName.substring(1);
  }

  return toplevel.includes(domainName);
};

// Get the current tab that is active in the browser.
export const getCurrentTabId = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0].id;
};
