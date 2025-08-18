/*
 * Copyright 2025 Google LLC
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
 * Internal dependencies.
 */
import { ScenarioKeys, type Scenarios } from './scenariosTypes';

export const scenarios: Scenarios = {
  [ScenarioKeys.REGISTRATION]: {
    title: 'First-time Sign-In (Registration)',
    description:
      'A new user visits ExampleShop and chooses to sign in using an identity provider (IdP). The flow guides them through picking an IdP, authenticating, and completing account registration with pre-filled details from their IdP account.',
    steps: [
      {
        explanation: "User clicks 'Sign in' button",
        action: () => ({
          addMessage: ['user-entity', 'rp-entity', "Clicks 'Sign in'"],
          browserUpdates: {
            simulateButtonClick: ['#signin-button'],
          },
        }),
      },
      {
        explanation:
          'RP calls FedCM API (requests browser to show IdP picker dialog)',
        action: () => ({
          addMessage: [
            'rp-entity',
            'browser-entity',
            'Calls FedCM API (show IdP picker)',
          ],
        }),
      },
      {
        explanation:
          'Browser shows IdP picker dialog to user (triggered by RP)',
        action: () => ({
          addMessage: [
            'browser-entity',
            'user-entity',
            'Shows IdP picker dialog',
          ],
          browserUpdates: {
            showBrowserDialog: ['idp-chooser'],
          },
        }),
      },
      {
        explanation: 'User selects an IdP in browser dialog',
        action: () => ({
          addMessage: ['user-entity', 'browser-entity', 'Selects IdP'],
          browserUpdates: {
            simulateElementSelection: ['#idp1-option'],
          },
        }),
      },
      {
        explanation: 'Browser requests well-known and config from IdP',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config',
          ],
        }),
      },
      {
        explanation: 'IdP returns well-known and config file to browser',
        action: () => ({
          addMessage: [
            'idp-entity',
            'browser-entity',
            'Returns well-known and config file',
          ],
        }),
      },
      {
        explanation: 'Browser requests available accounts from IdP',
        action: () => ({
          addMessage: ['browser-entity', 'idp-entity', 'GET /accounts'],
        }),
      },
      {
        explanation: 'IdP returns user accounts to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns account(s)'],
        }),
      },
      {
        explanation: 'Browser requests client metadata from IdP',
        action: () => ({
          addMessage: ['browser-entity', 'idp-entity', 'GET /client-metadata'],
        }),
      },
      {
        explanation: 'IdP returns client metadata to browser',
        action: () => ({
          addMessage: [
            'idp-entity',
            'browser-entity',
            'Returns client metadata',
          ],
        }),
      },
      {
        explanation:
          'Browser shows account picker (with privacy policy and terms) to user',
        action: () => ({
          addMessage: ['browser-entity', 'user-entity', 'Shows account picker'],
          browserUpdates: {
            hideBrowserLoading: [],
            showBrowserDialog: ['account-chooser'],
          },
        }),
      },
      {
        explanation: 'User selects an account in browser dialog',
        action: () => ({
          addMessage: ['user-entity', 'browser-entity', 'Selects account'],
          browserUpdates: {
            simulateElementSelection: ['.account-option:first-child'],
          },
        }),
      },
      {
        explanation:
          'After the user picks an account, the browser sends a sign-in request to the IdP',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)',
          ],
          browserUpdates: {
            hideBrowserDialog: [],
            showBrowserLoading: ['Authenticating...'],
          },
        }),
      },
      {
        explanation: 'IdP returns authentication token to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns token'],
        }),
      },
      {
        explanation: 'Browser delivers token to RP (FedCM callback)',
        action: () => ({
          addMessage: ['browser-entity', 'rp-entity', 'Delivers token'],
          browserUpdates: {
            hideBrowserLoading: [],
          },
        }),
      },
      {
        explanation: 'RP checks for existing user account',
        action: () => ({
          addMessage: [
            'rp-entity',
            'rp-entity',
            'Checks for existing account',
            true,
          ],
          browserUpdates: {
            showBrowserLoading: ['Checking account status...'],
          },
        }),
      },
      {
        explanation: 'RP shows registration form to user (no match)',
        action: () => ({
          addMessage: ['rp-entity', 'user-entity', 'Shows registration form'],
          browserUpdates: {
            hideBrowserLoading: [],
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">
                    Complete Registration
                  </h2>
                  <p className="mb-4">
                    We&apos;ve pre-filled some information from your IdP1
                    account
                  </p>
                  <form id="registration-form" className="space-y-4">
                    <div className="form-group text-left">
                      <label className="block mb-1 font-bold">Name</label>
                      <input
                        type="text"
                        value="Alex Chen"
                        disabled
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                    <div className="form-group text-left">
                      <label className="block mb-1 font-bold">Email</label>
                      <input
                        type="email"
                        value="alex@idp1.com"
                        disabled
                        className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                    <div className="form-group text-left">
                      <label className="block mb-1 font-bold">
                        Username (required)
                      </label>
                      <input
                        type="text"
                        placeholder="Choose a username"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <button
                      type="button"
                      className="fedcm-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition mt-2"
                    >
                      Complete Registration
                    </button>
                  </form>
                </div>
              ),
            ],
          },
        }),
      },
      {
        explanation: 'User submits registration form to RP',
        action: () => ({
          addMessage: ['user-entity', 'rp-entity', 'Submits registration form'],
          browserUpdates: {
            simulateButtonClick: ['.fedcm-button'],
            showBrowserLoading: ['Creating account...'],
          },
        }),
      },
      {
        explanation: 'RP creates user account',
        action: () => ({
          addMessage: ['rp-entity', 'rp-entity', 'Creates user account', true],
        }),
      },
      {
        explanation: 'RP signs user in',
        action: () => ({
          addMessage: ['rp-entity', 'user-entity', 'Signs user in'],
          browserUpdates: {
            hideBrowserLoading: [],
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">Welcome, Alex!</h2>
                  <p className="mb-2">
                    You&apos;re now signed in to ExampleShop.
                  </p>
                  <p className="text-green-700 font-semibold">
                    ✅ Registration complete
                  </p>
                </div>
              ),
            ],
          },
        }),
      },
    ],
  },
  [ScenarioKeys.SIGNIN]: {
    title: 'Passive Mode Sign-In',
    description:
      'A returning user visits ExampleShop. The browser automatically detects available IdPs and prompts the user to sign in, streamlining the login process without requiring a sign-in button click.',
    steps: [
      {
        explanation: 'User navigates to the website',
        action: () => ({
          addMessage: ['user-entity', 'rp-entity', 'User navigates to website'],
          browserUpdates: {
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">
                    Welcome to ExampleShop
                  </h2>
                  <p className="mb-2">
                    Loading your personalized experience...
                  </p>
                  <div className="passive-indicator bg-gray-100 rounded px-3 py-1 text-xs text-gray-600 inline-block mt-2">
                    FedCM detecting accounts...
                  </div>
                </div>
              ),
            ],
          },
        }),
      },
      {
        explanation: 'Browser auto-loads available IdPs',
        action: () => ({
          addMessage: [
            'browser-entity',
            'rp-entity',
            'Automatic IdP discovery',
          ],
          browserUpdates: {
            showBrowserLoading: ['Discovering identity providers...', true],
          },
        }),
      },
      {
        explanation: 'Browser requests well-known and config from IdP',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config',
          ],
        }),
      },
      {
        explanation: 'IdP returns well-known and config file to browser',
        action: () => ({
          addMessage: [
            'idp-entity',
            'browser-entity',
            'Returns well-known and config file',
          ],
        }),
      },
      {
        explanation: 'Browser requests available accounts from IdP',
        action: () => ({
          addMessage: ['browser-entity', 'idp-entity', 'GET /accounts'],
        }),
      },
      {
        explanation: 'IdP returns user accounts to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns account(s)'],
        }),
      },
      {
        explanation: 'Browser shows previously used accounts to user',
        action: () => ({
          addMessage: ['browser-entity', 'user-entity', 'Shows account picker'],
          browserUpdates: {
            hideBrowserLoading: [],
            showBrowserDialog: ['passive-fedcm-dialog'],
          },
        }),
      },
      {
        explanation: 'User selects an account',
        action: () => ({
          addMessage: ['user-entity', 'browser-entity', 'Selects account'],
          browserUpdates: {
            simulateElementSelection: ['.account-option:first-child'],
          },
        }),
      },
      {
        explanation:
          'After the user picks an account, the browser sends a sign-in request to the IdP',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)',
          ],
          browserUpdates: {
            hideBrowserDialog: [],
            showBrowserLoading: ['Authenticating...'],
          },
        }),
      },
      {
        explanation: 'IdP returns authentication token to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns token'],
        }),
      },
      {
        explanation: 'Browser delivers token to RP',
        action: () => ({
          addMessage: ['browser-entity', 'rp-entity', 'Delivers token'],
          browserUpdates: {
            hideBrowserLoading: [],
          },
        }),
      },
      {
        explanation: 'RP finds matching user and logs in',
        action: () => ({
          addMessage: ['rp-entity', 'rp-entity', 'Finds matching user', true],
          browserUpdates: {
            showBrowserLoading: ['Signing in...'],
          },
        }),
      },
      {
        explanation: 'Sign-in complete',
        action: () => ({
          addMessage: ['rp-entity', 'user-entity', 'Signs user in'],
          browserUpdates: {
            hideBrowserLoading: [],
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">
                    Welcome back, Alex!
                  </h2>
                  <p className="mb-2">
                    You&apos;re now signed in to ExampleShop.
                  </p>
                  <p className="text-green-700 font-semibold">
                    ✅ Sign-in complete via passive mode
                  </p>
                </div>
              ),
            ],
          },
        }),
      },
    ],
  },
  [ScenarioKeys.REAUTH]: {
    title: 'Silent ReAuth',
    description:
      "When a user's session is about to expire, the browser refreshes their authentication in the background using FedCM, keeping them signed in without any interruption or visible prompts.",
    steps: [
      {
        explanation: 'Browser detects session expiration approaching',
        action: () => ({
          addMessage: [
            'browser-entity',
            'rp-entity',
            'Session expiration approaching',
          ],
          browserUpdates: {
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
                  <p className="mb-2">Browsing products...</p>
                  <div className="silent-indicator bg-gray-100 rounded px-3 py-1 text-xs text-gray-600 inline-block mt-2">
                    Session refreshing in background
                  </div>
                </div>
              ),
            ],
          },
        }),
      },
      {
        explanation: 'RP requests silent reauth via FedCM API',
        action: () => ({
          addMessage: [
            'rp-entity',
            'browser-entity',
            'Calls FedCM API (silent reauth)',
          ],
          browserUpdates: {
            showBrowserLoading: ['Refreshing session...', true],
          },
        }),
      },
      {
        explanation: 'Browser checks silent mediation eligibility (internal)',
        action: () => ({
          addMessage: [
            'browser-entity',
            'browser-entity',
            'Checks silent mediation eligibility',
            true,
          ],
        }),
      },
      {
        explanation:
          'Browser fetches IdP config (/.well-known/fedcm.json and config)',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config',
          ],
        }),
      },
      {
        explanation: 'IdP returns well-known and config file to browser',
        action: () => ({
          addMessage: [
            'idp-entity',
            'browser-entity',
            'Returns well-known and config file',
          ],
        }),
      },
      {
        explanation: 'Browser fetches available accounts from IdP',
        action: () => ({
          addMessage: ['browser-entity', 'idp-entity', 'GET /accounts'],
        }),
      },
      {
        explanation: 'IdP returns user accounts to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns account(s)'],
        }),
      },
      {
        explanation:
          'Browser selects signed-in account automatically and send token creation request',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)',
          ],
        }),
      },
      {
        explanation: 'IdP returns fresh authentication token to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns updated token'],
        }),
      },
      {
        explanation: 'Browser delivers token to RP (updates session)',
        action: () => ({
          addMessage: ['browser-entity', 'rp-entity', 'Delivers token'],
        }),
      },
      {
        explanation: 'Session successfully refreshed',
        action: () => ({
          browserUpdates: {
            hideBrowserLoading: [],
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
                  <p className="mb-2">Browsing products...</p>
                  <div className="alert success bg-green-50 border-l-4 border-green-400 text-green-800 p-3 rounded mt-2">
                    Session refreshed successfully
                  </div>
                </div>
              ),
            ],
          },
        }),
      },
    ],
  },
  [ScenarioKeys.REAUTH_INTERACTIVE]: {
    title: 'Interactive ReAuth',
    description:
      'If silent reauthentication fails, the user is prompted to sign in again interactively. The flow shows how the browser and RP handle session expiration and guide the user through restoring access.',
    steps: [
      {
        explanation: 'Browser detects session has expired',
        action: () => ({
          addMessage: ['browser-entity', 'rp-entity', 'Session expired'],
          browserUpdates: {
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
                  <p className="mb-2">Browsing products...</p>
                  <div className="silent-indicator bg-gray-100 rounded px-3 py-1 text-xs text-gray-600 inline-block mt-2">
                    Checking session status...
                  </div>
                </div>
              ),
            ],
          },
        }),
      },
      {
        explanation: 'RP requests silent reauth via FedCM API',
        action: () => ({
          addMessage: [
            'rp-entity',
            'browser-entity',
            'Calls FedCM API (silent reauth)',
          ],
          browserUpdates: {
            showBrowserLoading: ['Refreshing session...', true],
          },
        }),
      },
      {
        explanation: 'Browser checks silent mediation eligibility (internal)',
        action: () => ({
          addMessage: [
            'browser-entity',
            'browser-entity',
            'Checks silent mediation eligibility',
            true,
          ],
        }),
      },
      {
        explanation: 'Silent reauth denied or fails',
        action: () => ({
          addMessage: [
            'browser-entity',
            'browser-entity',
            'Silent reauth denied/failed',
            true,
          ],
        }),
      },
      {
        explanation: 'Browser reports session is invalid',
        action: () => ({
          addMessage: [
            'browser-entity',
            'rp-entity',
            'Session invalid/expired',
          ],
        }),
      },
      {
        explanation:
          'Website shows session expired message and prompts sign-in',
        action: () => ({
          addMessage: ['rp-entity', 'user-entity', 'Shows login screen'],
          browserUpdates: {
            hideBrowserLoading: [],
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">
                    Session Expired
                  </h2>
                  <p className="mb-2">Please sign in again to continue</p>
                  <button
                    id="signin-button"
                    className="fedcm-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition mt-2"
                  >
                    Sign in with IdP1
                  </button>
                </div>
              ),
            ],
          },
        }),
      },
      {
        explanation: 'User clicks sign-in button',
        action: () => ({
          addMessage: [
            'user-entity',
            'browser-entity',
            'Clicks sign in button',
          ],
          browserUpdates: {
            simulateButtonClick: ['#signin-button'],
            showBrowserLoading: ['Connecting to Idp1...'],
          },
        }),
      },
      {
        explanation:
          'Browser requests IdP config (/.well-known/fedcm.json and config)',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config',
          ],
        }),
      },
      {
        explanation: 'IdP returns well-known and config file to browser',
        action: () => ({
          addMessage: [
            'idp-entity',
            'browser-entity',
            'Returns well-known and config file',
          ],
        }),
      },
      {
        explanation: 'Browser requests available accounts from IdP',
        action: () => ({
          addMessage: ['browser-entity', 'idp-entity', 'GET /accounts'],
        }),
      },
      {
        explanation: 'IdP returns user accounts to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns account(s)'],
        }),
      },
      {
        explanation: 'Browser shows account dialog box to user',
        action: () => ({
          addMessage: ['browser-entity', 'user-entity', 'Shows account picker'],
          browserUpdates: {
            hideBrowserLoading: [],
            showBrowserDialog: ['account-chooser'],
          },
        }),
      },
      {
        explanation: 'User selects account',
        action: () => ({
          addMessage: ['user-entity', 'browser-entity', 'Selects account'],
          browserUpdates: {
            simulateElementSelection: ['.account-option:first-child'],
          },
        }),
      },
      {
        explanation:
          'After the user picks an account, the browser sends a sign-in request to the IdP',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)',
          ],
          browserUpdates: {
            hideBrowserDialog: [],
            showBrowserLoading: ['Authenticating...'],
          },
        }),
      },
      {
        explanation: 'IdP returns authentication token to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns token'],
        }),
      },
      {
        explanation: 'Browser delivers token to RP (restores session)',
        action: () => ({
          addMessage: ['browser-entity', 'rp-entity', 'Delivers token'],
          browserUpdates: {
            hideBrowserLoading: [],
          },
        }),
      },
      {
        explanation: 'Website verifies token and restores session',
        action: () => ({
          addMessage: ['rp-entity', 'user-entity', 'Restores user session'],
          browserUpdates: {
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">
                    Welcome back, Alex!
                  </h2>
                  <p className="mb-2">Your session has been restored.</p>
                  <p className="text-green-700 font-semibold">
                    ✅ Sign-in complete
                  </p>
                </div>
              ),
            ],
          },
        }),
      },
    ],
  },
  [ScenarioKeys.REQUEST_PERMISSIONS]: {
    title: 'Request Permissions (Consent Dialog)',
    description:
      'The user needs to grant additional permissions for the website to access more information.',
    steps: [
      {
        explanation:
          'User clicks to enable personalized recommendations (requests new permissions)',
        action: () => ({
          browserUpdates: {
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
                  <p className="mb-2">Welcome back, Alex!</p>
                  <button
                    id="special-feature-button"
                    className="fedcm-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition mt-2"
                  >
                    Enable Personalized Recommendations
                  </button>
                </div>
              ),
            ],
            simulateButtonClick: ['#special-feature-button'],
          },
          addMessage: [
            'user-entity',
            'rp-entity',
            'Clicks to request new permissions',
          ],
        }),
      },
      {
        explanation:
          'RP initiates permission request with new scopes to browser',
        action: () => ({
          browserUpdates: {
            showBrowserLoading: ['Requesting additional permissions...'],
          },
          addMessage: [
            'rp-entity',
            'browser-entity',
            'Request additional permissions (new scopes)',
          ],
        }),
      },
      {
        explanation: 'Browser requests fedcm well-known config from IdP',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config',
          ],
        }),
      },
      {
        explanation: 'IdP returns well-known and config file to browser',
        action: () => ({
          addMessage: [
            'idp-entity',
            'browser-entity',
            'Returns well-known and config file',
          ],
        }),
      },
      {
        explanation:
          'Browser auto-selects signed-in account (no user action needed)',
        action: () => ({
          addMessage: ['browser-entity', 'idp-entity', 'GET /accounts'],
        }),
      },
      {
        explanation: 'IdP returns user accounts to browser',
        action: () => ({
          addMessage: ['idp-entity', 'browser-entity', 'Returns account(s)'],
        }),
      },
      {
        explanation:
          'Browser shows consent dialog to user (requesting new permissions)',
        action: () => ({
          browserUpdates: {
            hideBrowserLoading: [],
            showBrowserDialog: ['consent-dialog'],
          },
          addMessage: [
            'browser-entity',
            'user-entity',
            'Shows permissions dialog',
          ],
        }),
      },
      {
        explanation: 'User approves new permissions (consent)',
        action: () => ({
          browserUpdates: {
            simulateButtonClick: ['#consent-approve-button'],
          },
          addMessage: [
            'user-entity',
            'browser-entity',
            'Approves new permissions',
          ],
        }),
      },
      {
        explanation:
          'Browser sends request for token creation with new scopes to IdP',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion with new scopes)',
          ],
        }),
      },
      {
        explanation: 'IdP updates permissions and returns token to browser',
        action: () => ({
          browserUpdates: {
            hideBrowserDialog: [],
            showBrowserLoading: ['Updating permissions...'],
          },
          addMessage: [
            'idp-entity',
            'browser-entity',
            'Returns token with new permissions',
          ],
        }),
      },
      {
        explanation: 'Browser sends updated token to RP',
        action: () => ({
          addMessage: ['browser-entity', 'rp-entity', 'Sends updated token'],
        }),
      },
      {
        explanation: 'Personalized recommendations enabled',
        action: () => ({
          browserUpdates: {
            hideBrowserLoading: [],
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
                  <p className="mb-2">Welcome back, Alex!</p>
                  <div className="feature-enabled bg-blue-50 border-l-4 border-blue-400 p-3 rounded mt-2">
                    <h3 className="font-semibold text-blue-800">
                      Personalized Recommendations Enabled
                    </h3>
                    <p className="text-blue-700 font-medium">
                      ✅ New permissions granted
                    </p>
                  </div>
                </div>
              ),
            ],
          },
        }),
      },
    ],
  },
  [ScenarioKeys.SIGNOUT]: {
    title: 'Sign Out',
    description:
      "The user signs out of ExampleShop, ending their session and optionally revoking the site's access with their IdP. The flow demonstrates how sign-out is handled across browser, RP, and IdP.",
    steps: [
      {
        explanation: "User clicks 'Sign out'",
        action: () => ({
          browserUpdates: {
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
                  <p className="mb-2">Welcome back, Alex!</p>
                  <button
                    id="signout-button"
                    className="fedcm-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition mt-2"
                  >
                    Sign out
                  </button>
                </div>
              ),
            ],
            simulateButtonClick: ['#signout-button'],
          },
          addMessage: ['user-entity', 'browser-entity', "Clicks 'Sign out'"],
        }),
      },
      {
        explanation: 'Browser clears session',
        action: () => ({
          browserUpdates: {
            showBrowserLoading: ['Signing out...'],
          },
          addMessage: [
            'browser-entity',
            'browser-entity',
            'Clears session',
            true,
          ],
        }),
      },
      {
        explanation: 'Browser sends sign out request to RP',
        action: () => ({
          addMessage: ['browser-entity', 'rp-entity', 'Sign out request'],
        }),
      },
      {
        explanation: 'Optional: Browser notifies IdP to revoke RP-IdP relation',
        action: () => ({
          addMessage: [
            'browser-entity',
            'idp-entity',
            'Revoke RP-IdP relation (optional)',
          ],
        }),
      },
      {
        explanation: 'Sign-out complete',
        action: () => ({
          browserUpdates: {
            hideBrowserLoading: [],
            updateBrowserContent: [
              () => (
                <div className="rp-website text-center p-5">
                  <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
                  <p className="mb-2">You have been signed out.</p>
                  <button className="fedcm-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition mt-2">
                    Sign in with IdP1
                  </button>
                </div>
              ),
            ],
          },
        }),
      },
    ],
  },
};
