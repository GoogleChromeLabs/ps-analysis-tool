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

// Scenario definitions with their steps
const scenarios = {
  registration: {
    title: 'First-time Sign-In (Registration)',
    description:
      "The user visits a website for the first time and needs to create an account. They'll use their identity provider (IdP) account to register.",
    steps: [
      {
        explanation: "User clicks 'Sign in' button",
        action: () => {
          simulateButtonClick('#signin-button');
          addMessage('user-entity', 'rp-entity', "Clicks 'Sign in'");
        },
      },
      {
        explanation:
          'RP calls FedCM API (requests browser to show IdP picker dialog)',
        action: () => {
          addMessage(
            'rp-entity',
            'browser-entity',
            'Calls FedCM API (show IdP picker)'
          );
        },
      },
      {
        explanation:
          'Browser shows IdP picker dialog to user (triggered by RP)',
        action: () => {
          showBrowserDialog('idp-chooser');
          addMessage(
            'browser-entity',
            'user-entity',
            'Shows IdP picker dialog'
          );
        },
      },
      {
        explanation: 'User selects an IdP in browser dialog',
        action: () => {
          simulateElementSelection('#idp1-option');
          addMessage('user-entity', 'browser-entity', 'Selects IdP');
        },
      },
      {
        explanation: 'Browser requests well-known and config from IDP',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config'
          );
        },
      },
      {
        explanation: 'IDP returns config and well-known file to browser',
        action: () => {
          addMessage(
            'idp-entity',
            'browser-entity',
            'Returns config and well-known file'
          );
        },
      },
      {
        explanation: 'Browser requests available accounts from IDP',
        action: () => {
          addMessage('browser-entity', 'idp-entity', 'GET /accounts');
        },
      },
      {
        explanation: 'IDP returns user accounts to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns account(s)');
        },
      },
      {
        explanation: 'Browser requests client metadata from IDP',
        action: () => {
          addMessage('browser-entity', 'idp-entity', 'GET /client-metadata');
        },
      },
      {
        explanation: 'IDP returns client metadata to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns client metadata');
        },
      },
      {
        explanation:
          'Browser shows account picker (with privacy policy and terms) to user',
        action: () => {
          hideBrowserLoading();
          showBrowserDialog('account-chooser');
          addMessage('browser-entity', 'user-entity', 'Shows account picker');
        },
      },
      {
        explanation: 'User selects an account in browser dialog',
        action: () => {
          simulateElementSelection('.account-option:first-child');
          addMessage('user-entity', 'browser-entity', 'Selects account');
        },
      },
      // In FedCM, after user selects an account and consents, the browser proceeds to request a token from the IdP and delivers it to the RP. The RP only receives a callback after the whole flow is complete.
      {
        explanation:
          'After the user picks an account, the browser sends a sign-in request to the identity provider (IDP)',
        action: () => {
          hideBrowserDialog();
          showBrowserLoading('Authenticating...');
          addMessage(
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)'
          );
        },
      },
      {
        explanation: 'IDP returns authentication token to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns token');
        },
      },
      {
        explanation: 'Browser delivers token to RP (FedCM callback)',
        action: () => {
          hideBrowserLoading();
          addMessage('browser-entity', 'rp-entity', 'Delivers token');
        },
      },
      {
        explanation: 'RP checks for existing user account',
        action: () => {
          showBrowserLoading('Checking account status...');
          addMessage(
            'rp-entity',
            'rp-entity',
            'Checks for existing account',
            true
          );
        },
      },
      {
        explanation: 'RP shows registration form to user (no match)',
        action: () => {
          hideBrowserLoading();
          updateBrowserContent(`
            <div class="rp-website">
                <h2>Complete Registration</h2>
                <p>We've pre-filled some information from your IdP1 account</p>
                <form id="registration-form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" value="Alex Chen" disabled>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="alex@idp1.com" disabled>
                    </div>
                    <div class="form-group">
                        <label>Username (required)</label>
                        <input type="text" placeholder="Choose a username">
                    </div>
                    <button type="button" class="fedcm-button">Complete Registration</button>
                </form>
            </div>
          `);
          addMessage('rp-entity', 'user-entity', 'Shows registration form');
        },
      },
      {
        explanation: 'User submits registration form to RP',
        action: () => {
          simulateButtonClick('.fedcm-button');
          showBrowserLoading('Creating account...');
          addMessage('user-entity', 'rp-entity', 'Submits registration form');
        },
      },
      {
        explanation: 'RP creates user account',
        action: () => {
          addMessage('rp-entity', 'rp-entity', 'Creates user account', true);
        },
      },
      {
        explanation: 'RP signs user in',
        action: () => {
          hideBrowserLoading();
          updateBrowserContent(`
            <div class="rp-website">
                <h2>Welcome, Alex!</h2>
                <p>You're now signed in to ExampleShop.</p>
                <p>✅ Registration complete</p>
            </div>
          `);
          addMessage('rp-entity', 'user-entity', 'Signs user in');
        },
      },
    ],
  },
  signin: {
    title: 'Passive Mode Sign-In',
    description:
      'The user returns to the website and the FedCM dialog appears automatically without requiring a button click.',
    steps: [
      {
        explanation: 'User navigates to the website',
        action: () => {
          updateBrowserContent(`
            <div class="rp-website">
              <h2>Welcome to ExampleShop</h2>
              <p>Loading your personalized experience...</p>
              <div class="passive-indicator">FedCM detecting accounts...</div>
            </div>
          `);
          // Add arrow to sequence diagram for user navigation
          addMessage('user-entity', 'rp-entity', 'User navigates to website');
        },
      },
      {
        explanation: 'Browser auto-loads available IdPs',
        action: () => {
          showBrowserLoading('Discovering identity providers...', true);
          addMessage('browser-entity', 'rp-entity', 'Automatic IdP discovery');
        },
      },
      {
        explanation: 'Browser requests well-known and config from IDP',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config'
          );
        },
      },
      {
        explanation: 'IDP returns well-known and config to browser',
        action: () => {
          addMessage(
            'idp-entity',
            'browser-entity',
            'Returns config and well-known file'
          );
        },
      },
      {
        explanation: 'Browser requests available accounts from IDP',
        action: () => {
          addMessage('browser-entity', 'idp-entity', 'GET /accounts');
        },
      },
      {
        explanation: 'IDP returns user accounts to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns account(s)');
        },
      },
      {
        explanation: 'Browser shows previously used accounts to user',
        action: () => {
          hideBrowserLoading();
          showBrowserDialog('passive-fedcm-dialog');
          addMessage('browser-entity', 'user-entity', 'Shows account picker');
        },
      },
      {
        explanation: 'User selects an account',
        action: () => {
          simulateElementSelection('.account-option:first-child');
          addMessage('user-entity', 'browser-entity', 'Selects account');
        },
      },
      {
        explanation:
          'After the user picks an account, the browser sends a sign-in request to the identity provider (IDP)',
        action: () => {
          hideBrowserDialog();
          showBrowserLoading('Authenticating...');
          addMessage(
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)'
          );
        },
      },
      {
        explanation: 'IDP returns authentication token to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns token');
        },
      },
      {
        explanation: 'Browser delivers token to RP',
        action: () => {
          hideBrowserLoading();
          addMessage('browser-entity', 'rp-entity', 'Delivers token');
        },
      },
      {
        explanation: 'RP finds matching user and logs in',
        action: () => {
          showBrowserLoading('Signing in...');
          addMessage('rp-entity', 'rp-entity', 'Finds matching user', true);
        },
      },
      {
        explanation: 'Sign-in complete',
        action: () => {
          hideBrowserLoading();
          updateBrowserContent(`
            <div class="rp-website">
              <h2>Welcome back, Alex!</h2>
              <p>You're now signed in to ExampleShop.</p>
              <p>✅ Sign-in complete via passive mode</p>
            </div>
          `);
          addMessage('rp-entity', 'user-entity', 'Signs user in');
        },
      },
    ],
  },
  reauth: {
    title: 'Silent ReAuth',
    description:
      "The user's session expires and is seamlessly refreshed in the background without interrupting the user experience.",
    steps: [
      {
        explanation: 'Browser detects session expiration approaching',
        action: () => {
          updateBrowserContent(`
            <div class="rp-website">
              <h2>ExampleShop</h2>
              <p>Browsing products...</p>
              <div class="silent-indicator">Session refreshing in background</div>
            </div>
          `);
          // Add arrow to sequence diagram for session expiration
          addMessage(
            'browser-entity',
            'rp-entity',
            'Session expiration approaching'
          );
        },
      },
      {
        explanation: 'RP requests silent reauth via FedCM API',
        action: () => {
          showBrowserLoading('Refreshing session...', true);
          addMessage(
            'rp-entity',
            'browser-entity',
            'Calls FedCM API (silent reauth)'
          );
        },
      },
      {
        explanation: 'Browser checks silent mediation eligibility (internal)',
        action: () => {
          addMessage(
            'browser-entity',
            'browser-entity',
            'Checks silent mediation eligibility',
            true
          );
        },
      },
      {
        explanation:
          'Browser fetches IdP config (/.well-known/fedcm.json and config)',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config'
          );
        },
      },
      {
        explanation: 'IDP returns config and well-known file to browser',
        action: () => {
          addMessage(
            'idp-entity',
            'browser-entity',
            'Returns config and well-known file'
          );
        },
      },
      {
        explanation: 'Browser fetches available accounts from IDP',
        action: () => {
          addMessage('browser-entity', 'idp-entity', 'GET /accounts');
        },
      },
      {
        explanation: 'IDP returns user accounts to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns account(s)');
        },
      },
      {
        explanation:
          'Browser selects signed-in account automatically and send token creation request',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)'
          );
        },
      },
      {
        explanation: 'IDP returns fresh authentication token to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns updated token');
        },
      },
      {
        explanation: 'Browser delivers token to RP (updates session)',
        action: () => {
          addMessage('browser-entity', 'rp-entity', 'Delivers token');
        },
      },
      {
        explanation: 'Session successfully refreshed',
        action: () => {
          hideBrowserLoading();
          updateBrowserContent(`
            <div class="rp-website">
              <h2>ExampleShop</h2>
              <p>Browsing products...</p>
              <div class="alert success">Session refreshed successfully</div>
            </div>
          `);
        },
      },
    ],
  },
  reauthInteractive: {
    title: 'Interactive ReAuth',
    description:
      'When silent reauthentication fails, the user must complete an interactive sign-in to continue using the website.',
    steps: [
      {
        explanation: 'Browser detects session has expired',
        action: () => {
          updateBrowserContent(`
            <div class="rp-website">
              <h2>ExampleShop</h2>
              <p>Browsing products...</p>
              <div class="silent-indicator">Checking session status...</div>
            </div>
          `);
          // Add arrow to sequence diagram for session expiration
          addMessage('browser-entity', 'rp-entity', 'Session expired');
        },
      },
      {
        explanation: 'RP requests silent reauth via FedCM API',
        action: () => {
          showBrowserLoading('Refreshing session...', true);
          addMessage(
            'rp-entity',
            'browser-entity',
            'Calls FedCM API (silent reauth)'
          );
        },
      },
      {
        explanation: 'Browser checks silent mediation eligibility (internal)',
        action: () => {
          addMessage(
            'browser-entity',
            'browser-entity',
            'Checks silent mediation eligibility',
            true
          );
        },
      },
      {
        explanation: 'Silent reauth denied or fails',
        action: () => {
          addMessage(
            'browser-entity',
            'browser-entity',
            'Silent reauth denied/failed',
            true
          );
        },
      },
      {
        explanation: 'Browser reports session is invalid',
        action: () => {
          addMessage('browser-entity', 'rp-entity', 'Session invalid/expired');
        },
      },
      {
        explanation:
          'Website shows session expired message and prompts sign-in',
        action: () => {
          hideBrowserLoading();
          updateBrowserContent(`
            <div class="rp-website">
              <h2>Session Expired</h2>
              <p>Please sign in again to continue</p>
              <button id="signin-button" class="fedcm-button">Sign in with IdP1</button>
            </div>
          `);
          // Add arrow to sequence diagram for login screen shown
          addMessage('rp-entity', 'user-entity', 'Shows login screen');
        },
      },
      {
        explanation: 'User clicks sign-in button',
        action: () => {
          simulateButtonClick('#signin-button');
          showBrowserLoading('Connecting to Idp1...');
          addMessage('user-entity', 'browser-entity', 'Clicks sign in button');
        },
      },
      {
        explanation:
          'Browser requests IdP config (/.well-known/fedcm.json and config)',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config'
          );
        },
      },
      {
        explanation: 'IDP returns config and well-known file to browser',
        action: () => {
          addMessage(
            'idp-entity',
            'browser-entity',
            'Returns config and well-known file'
          );
        },
      },
      {
        explanation: 'Browser requests available accounts from IDP',
        action: () => {
          addMessage('browser-entity', 'idp-entity', 'GET /accounts');
        },
      },
      {
        explanation: 'IDP returns user accounts to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns account(s)');
        },
      },
      {
        explanation: 'Browser shows account dialog box to user',
        action: () => {
          hideBrowserLoading();
          showBrowserDialog('account-chooser');
          addMessage('browser-entity', 'user-entity', 'Shows account picker');
        },
      },
      {
        explanation: 'User selects account',
        action: () => {
          simulateElementSelection('.account-option:first-child');
          addMessage('user-entity', 'browser-entity', 'Selects account');
        },
      },
      {
        explanation:
          'After the user picks an account, the browser sends a sign-in request to the identity provider (IDP)',
        action: () => {
          hideBrowserDialog();
          showBrowserLoading('Authenticating...');
          addMessage(
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion)'
          );
        },
      },
      {
        explanation: 'IDP returns authentication token to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns token');
        },
      },
      {
        explanation: 'Browser delivers token to RP (restores session)',
        action: () => {
          hideBrowserLoading();
          addMessage('browser-entity', 'rp-entity', 'Delivers token');
        },
      },
      {
        explanation: 'Website verifies token and restores session',
        action: () => {
          updateBrowserContent(`
            <div class="rp-website">
              <h2>Welcome back, Alex!</h2>
              <p>Your session has been restored.</p>
              <p>✅ Sign-in complete</p>
            </div>
          `);
          addMessage('rp-entity', 'user-entity', 'Restores user session');
        },
      },
    ],
  },
  requestPermissions: {
    title: 'Request Permissions (Consent Dialog)',
    description:
      'The user needs to grant additional permissions for the website to access more information.',
    steps: [
      {
        explanation:
          'User clicks to enable personalized recommendations (requests new permissions)',
        action: () => {
          updateBrowserContent(`
            <div class="rp-website">
                <h2>ExampleShop</h2>
                <p>Welcome back, Alex!</p>
                <button id="special-feature-button" class="fedcm-button">Enable Personalized Recommendations</button>
            </div>
          `);
          simulateButtonClick('#special-feature-button');
          addMessage(
            'user-entity',
            'rp-entity',
            'Clicks to request new permissions'
          );
        },
      },
      {
        explanation:
          'RP initiates permission request with new scopes to browser',
        action: () => {
          showBrowserLoading('Requesting additional permissions...');
          addMessage(
            'rp-entity',
            'browser-entity',
            'Request additional permissions (new scopes)'
          );
        },
      },
      {
        explanation: 'Browser requests fedcm well-known config from IdP',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'GET /.well-known/fedcm.json and config'
          );
        },
      },
      {
        explanation: 'IDP returns config and well-known file to browser',
        action: () => {
          addMessage(
            'idp-entity',
            'browser-entity',
            'Returns config and well-known file'
          );
        },
      },
      {
        explanation:
          'Browser auto-selects signed-in account (no user action needed)',
        action: () => {
          addMessage('browser-entity', 'idp-entity', 'GET /accounts');
        },
      },
      {
        explanation: 'IDP returns user accounts to browser',
        action: () => {
          addMessage('idp-entity', 'browser-entity', 'Returns account(s)');
        },
      },
      {
        explanation:
          'Browser shows consent dialog to user (requesting new permissions)',
        action: () => {
          hideBrowserLoading();
          showBrowserDialog('consent-dialog');
          // Add arrow to sequence diagram for permissions dialog shown
          addMessage(
            'browser-entity',
            'user-entity',
            'Shows permissions dialog'
          );
        },
      },
      {
        explanation: 'User approves new permissions (consent)',
        action: () => {
          simulateButtonClick('#consent-approve-button');
          addMessage(
            'user-entity',
            'browser-entity',
            'Approves new permissions'
          );
        },
      },
      {
        explanation:
          'Browser sends request for token creation with new scopes to IDP',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'POST request for token creation (/assertion) (with new scopes)'
          );
        },
      },
      {
        explanation: 'IDP updates permissions and returns token to browser',
        action: () => {
          hideBrowserDialog();
          showBrowserLoading('Updating permissions...');
          addMessage(
            'idp-entity',
            'browser-entity',
            'Returns token with new permissions'
          );
        },
      },
      {
        explanation: 'Browser sends updated token to RP',
        action: () => {
          addMessage('browser-entity', 'rp-entity', 'Sends updated token');
        },
      },
      {
        explanation: 'Personalized recommendations enabled',
        action: () => {
          hideBrowserLoading();
          updateBrowserContent(`
            <div class="rp-website">
                <h2>ExampleShop</h2>
                <p>Welcome back, Alex!</p>
                <div class="feature-enabled">
                    <h3>Personalized Recommendations Enabled</h3>
                    <p>✅ New permissions granted</p>
                </div>
            </div>
          `);
        },
      },
    ],
  },
  signout: {
    title: 'Sign Out',
    description: 'The user signs out from the website.',
    steps: [
      {
        explanation: "User clicks 'Sign out'",
        action: () => {
          updateBrowserContent(`
            <div class="rp-website">
                <h2>ExampleShop</h2>
                <p>Welcome back, Alex!</p>
                <button id="signout-button" class="fedcm-button">Sign out</button>
            </div>
          `);
          simulateButtonClick('#signout-button');
          addMessage('user-entity', 'browser-entity', "Clicks 'Sign out'");
        },
      },
      {
        explanation: 'Browser clears session',
        action: () => {
          showBrowserLoading('Signing out...');
          addMessage(
            'browser-entity',
            'browser-entity',
            'Clears session',
            true
          );
        },
      },
      {
        explanation: 'Browser sends sign out request to RP',
        action: () => {
          addMessage('browser-entity', 'rp-entity', 'Sign out request');
        },
      },
      {
        explanation: 'Optional: Browser notifies IdP to revoke RP-IDP relation',
        action: () => {
          addMessage(
            'browser-entity',
            'idp-entity',
            'Revoke RP-IDP relation (optional)'
          );
        },
      },
      {
        explanation: 'Sign-out complete',
        action: () => {
          hideBrowserLoading();
          updateBrowserContent(`
            <div class="rp-website">
                <h2>ExampleShop</h2>
                <p>You have been signed out.</p>
                <button class="fedcm-button">Sign in with IdP1</button>
            </div>
          `);
        },
      },
    ],
  },
};

// State management
let currentScenario = 'registration';
let currentStep = -1;
let messageCount = 0;
let interactiveMode = true;

// UI manipulation functions
/**
 *
 * @param html
 */
function updateBrowserContent(html) {
  document.getElementById('browser-content').innerHTML = html;
}

// Browser loading indicator
/**
 *
 * @param message
 * @param silent
 */
function showBrowserLoading(message, silent = false) {
  const browserContent = document.getElementById('browser-content');

  // Save original content if not already saved
  if (!browserContent.hasAttribute('data-original-content')) {
    browserContent.setAttribute(
      'data-original-content',
      browserContent.innerHTML
    );
  }

  // Create and add loading indicator
  if (!silent) {
    // Visible loading indicator for standard operations
    const loadingHTML = `
            <div class="browser-loading">
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            </div>
        `;
    browserContent.innerHTML = loadingHTML;
  } else {
    // Silent loading for background operations (like reauth)
    // Just add a small indicator without disrupting content
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'silent-loading';
    loadingIndicator.innerHTML = `
            <div class="mini-spinner"></div>
            <span>${message}</span>
        `;

    // Make sure we don't add multiple indicators
    const existingIndicator = document.querySelector('.silent-loading');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    browserContent.appendChild(loadingIndicator);
  }
}

/**
 *
 */
function hideBrowserLoading() {
  const browserContent = document.getElementById('browser-content');

  // Remove any silent loading indicator
  const silentIndicator = document.querySelector('.silent-loading');
  if (silentIndicator) {
    silentIndicator.remove();
  }

  // If we're showing a full loading screen, restore original content
  if (
    browserContent.querySelector('.browser-loading') &&
    browserContent.hasAttribute('data-original-content')
  ) {
    browserContent.innerHTML = browserContent.getAttribute(
      'data-original-content'
    );
    browserContent.removeAttribute('data-original-content');
  }
}

// Button click simulation with better animation
/**
 *
 * @param selector
 */
function simulateButtonClick(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.classList.add('simulated-click');

    // Add a ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('click-ripple');
    element.appendChild(ripple);

    // Set ripple position
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.height / 2 - size / 2}px`;

    // Remove ripple after animation completes
    setTimeout(() => {
      element.classList.remove('simulated-click');
      if (ripple.parentNode === element) {
        element.removeChild(ripple);
      }
    }, 1000);
  }
}

// Simulate element selection with visual feedback
/**
 *
 * @param selector
 */
function simulateElementSelection(selector) {
  const browserContent = document.getElementById('browser-content');
  const element = browserContent.querySelector(selector);
  if (element) {
    element.classList.add('simulated-select', 'selected');

    // Add checkmark animation
    const checkmark = document.createElement('span');
    checkmark.classList.add('select-checkmark');
    checkmark.innerHTML = '✓';
    element.appendChild(checkmark);

    // Maintain selection - no automatic removal
  }
}

// Show browser dialog for IdP or account choosing
/**
 *
 * @param dialogType
 * @param options
 */
function showBrowserDialog(dialogType, options = {}) {
  const browserContent = document.getElementById('browser-content');

  // Save the current content to restore later if needed
  if (!browserContent.hasAttribute('data-original-content')) {
    browserContent.setAttribute(
      'data-original-content',
      browserContent.innerHTML
    );
  }

  let dialogHTML = '';

  if (dialogType === 'idp-chooser') {
    // New dialog for IdP picker
    dialogHTML = `
        <div class="browser-dialog idp-chooser">
            <div class="browser-dialog-header">
                <h2>Choose an identity provider</h2>
            </div>
            <div class="browser-dialog-body">
                <div id="idp1-option" class="idp-option">
                    <img src="yourid-logo.png" alt="IdP1 Logo" class="idp-logo">
                    <div class="idp-details">
                        <strong>IdP1</strong>
                        <span>Sign in with your IdP1 account</span>
                    </div>
                </div>
                <div id="idp2-option" class="idp-option">
                    <img src="other-idp-logo.png" alt="IdP2 Logo" class="idp-logo">
                    <div class="idp-details">
                        <strong>IdP2</strong>
                        <span>Sign in with your IdP2 account</span>
                    </div>
                </div>
                <button id="choose-idp-button" class="fedcm-button">Continue</button>
                <button class="cancel-button">Cancel</button>
            </div>
        </div>
    `;
  } else if (dialogType === 'account-chooser') {
    dialogHTML = `
        <div class="browser-dialog account-chooser">
            <div class="browser-dialog-header">
                <h2>Choose an account</h2>
            </div>
            <div class="browser-dialog-body">
                <div class="account-option">
                    <img src="user-avatar.png" alt="User Avatar" class="account-avatar">
                    <div class="account-details">
                        <strong>alex@idp1.com</strong>
                        <span>IdP1 Account</span>
                    </div>
                </div>
                <div class="account-option">
                    <img src="user-avatar2.png" alt="Second User Avatar" class="account-avatar">
                    <div class="account-details">
                        <strong>alex.work@idp1.com</strong>
                        <span>IdP1 Account</span>
                    </div>
                </div>
                <button id="choose-account-button" class="fedcm-button">Continue</button>
                <button class="cancel-button">Cancel</button>
            </div>
            <div class="privacy-policy-note">
              <a href="#" target="_blank">Privacy Policy</a> • <a href="#" target="_blank">Terms of Service</a>
              <div class="privacy-disclaimer">By continuing, you agree to the identity provider's privacy policy and terms.</div>
            </div>
        </div>
    `;
  } else if (dialogType === 'consent-dialog') {
    const title = 'IdP1 would like to share';
    const content = `
      <p>example-shop.com is requesting additional access:</p>
      <ul class="permissions-list">
          <li>Your shopping preferences</li>
          <li>Your purchase history</li>
      </ul>
      <button id="consent-approve-button" class="fedcm-button">Allow</button>
      <button class="cancel-button">Cancel</button>`;

    dialogHTML = `
        <div class="browser-dialog consent-dialog">
            <div class="browser-dialog-header">
                <h2>${title}</h2>
            </div>
            <div class="browser-dialog-body">
                ${content}
            </div>
        </div>
    `;
  } else if (dialogType === 'scenario-choice') {
    // Add scenario choice dialog for reauth choice
    const title = options.title || 'Choose scenario path';
    const content =
      options.content ||
      `
            <p>Select the reauth scenario outcome:</p>
            <div id="success-path" class="scenario-option">
                <div class="scenario-icon success">✓</div>
                <div class="scenario-details">
                    <strong>Success Path</strong>
                    <span>Silent reauth allowed and succeeds</span>
                </div>
            </div>
            <div id="failure-path" class="scenario-option">
                <div class="scenario-icon failure">✗</div>
                <div class="scenario-details">
                    <strong>Failure Path</strong>
                    <span>Silent reauth fails or not allowed</span>
                </div>
            </div>
        `;

    dialogHTML = `
            <div class="browser-dialog scenario-dialog">
                <div class="browser-dialog-header">
                    <h2>${title}</h2>
                </div>
                <div class="browser-dialog-body">
                    ${content}
                </div>
            </div>
        `;

    // Set up listeners for scenario choices after dialog is shown
    setTimeout(() => {
      const successPath = document.getElementById('success-path');
      const failurePath = document.getElementById('failure-path');

      if (successPath && failurePath) {
        successPath.addEventListener('click', () => {
          simulateElementSelection('#success-path');
          window.reAuthPath = 'success';
          setTimeout(() => {
            simulateButtonClick('#choose-account-button');
            hideBrowserDialog();
          }, 800);
        });

        failurePath.addEventListener('click', () => {
          simulateElementSelection('#failure-path');
          window.reAuthPath = 'failure';
          setTimeout(() => {
            simulateButtonClick('#choose-account-button');
            hideBrowserDialog();
          }, 800);
        });
      }
    }, 100);
  } // Add this to your showBrowserDialog function
  // to support the new passive mode dialog type
  else if (dialogType === 'passive-fedcm-dialog') {
    dialogHTML = `
        <div class="browser-dialog passive-fedcm-dialog">
            <div class="passive-indicator-badge">Automatically Appeared</div>
            <div class="browser-dialog-header">
                <h2>Continue with</h2>
            </div>
            <div class="browser-dialog-body">
                <div class="account-option">
                    <img src="yourid-logo.png" alt="IdP1 Logo" class="idp-logo">
                    <div class="account-details">
                        <strong>alex@idp1.com</strong>
                        <span>IdP1 Account</span>
                    </div>
                </div>
                <div class="account-option">
                    <img src="other-idp-logo.png" alt="IdP2 Logo" class="idp-logo">
                    <div class="account-details">
                        <strong>Use a different account</strong>
                    </div>
                </div>
                <button id="choose-account-button" class="fedcm-button">Continue</button>
                <button class="cancel-button">Cancel</button>
            </div>
        </div>
    `;
  }

  browserContent.innerHTML = dialogHTML;
}

/**
 *
 */
function hideBrowserDialog() {
  const browserContent = document.getElementById('browser-content');
  if (browserContent.hasAttribute('data-original-content')) {
    browserContent.innerHTML = browserContent.getAttribute(
      'data-original-content'
    );
    browserContent.removeAttribute('data-original-content');
  }
}

/**
 *
 */
function clearMessages() {
  document.getElementById('message-container').innerHTML = '';
  messageCount = 0;
}

// Updated to support self-messages (like RP checking its own database)
/**
 *
 * @param fromEntity
 * @param toEntity
 * @param text
 * @param selfMessage
 */
function addMessage(fromEntity, toEntity, text, selfMessage = false) {
  const container = document.getElementById('message-container');
  const fromRect = document.getElementById(fromEntity).getBoundingClientRect();
  const toRect = document.getElementById(toEntity).getBoundingClientRect();

  const containerRect = container.getBoundingClientRect();

  const fromX =
    fromEntity === 'user-entity'
      ? fromRect.left + fromRect.width / 2
      : fromEntity === 'browser-entity'
      ? fromRect.left + fromRect.width / 2
      : fromEntity === 'rp-entity'
      ? fromRect.left + fromRect.width / 2
      : fromRect.left + fromRect.width / 2;

  const toX =
    toEntity === 'user-entity'
      ? toRect.left + toRect.width / 2
      : toEntity === 'browser-entity'
      ? toRect.left + toRect.width / 2
      : toEntity === 'rp-entity'
      ? toRect.left + toRect.width / 2
      : toRect.left + toRect.width / 2;

  const isReversed = fromX > toX;

  // For self-messages (entity to itself), create a loop
  let leftPosition, width;
  // Updated addMessage function for properly oriented self-messages

  // In your addMessage function, replace the self-message creation with this:
  if (selfMessage) {
    // Center the self-message on the entity
    leftPosition = fromX - containerRect.left - 40;
    width = 80;

    const messageElement = document.createElement('div');
    messageElement.className = 'message self-message';
    messageElement.style.left = `${leftPosition}px`;
    messageElement.style.width = `${width}px`;

    // Adjust vertical spacing
    const containerHeight = containerRect.height;
    const spacing = Math.min(40, Math.max(30, containerHeight / 12));
    messageElement.style.top = `${50 + messageCount * spacing}px`;

    // Create a properly oriented rectangular loop for self-message
    messageElement.innerHTML = `
        <div class="self-message-loop">
            <div class="loop-segment loop-segment-1"></div>
            <div class="loop-segment loop-segment-2"></div>
            <div class="loop-segment loop-segment-3">
                <div class="loop-arrow"></div>
            </div>
            <div class="message-label">${text}</div>
        </div>
    `;

    container.appendChild(messageElement);
    messageCount++;
  } else {
    // Normal message between entities
    leftPosition = isReversed ? toX : fromX;
    width = Math.abs(toX - fromX);

    const messageElement = document.createElement('div');
    messageElement.className = 'message' + (isReversed ? ' reverse' : '');
    messageElement.style.left = `${leftPosition - containerRect.left}px`;
    messageElement.style.width = `${width}px`;

    // Adjust vertical spacing
    const containerHeight = containerRect.height;
    const spacing = Math.min(40, Math.max(30, containerHeight / 12));
    messageElement.style.top = `${50 + messageCount * spacing}px`;

    messageElement.innerHTML = `
            <div class="message-line">
                <div class="message-arrow"></div>
            </div>
            <div class="message-label">${text}</div>
        `;

    container.appendChild(messageElement);
  }

  messageCount++;

  // Auto-scroll message container to bottom when new arrows/messages are added
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
}

/**
 *
 */
function updateTimeline() {
  // Clear all special statuses
  document.querySelectorAll('.timeline-node').forEach((node) => {
    node.classList.remove('active', 'completed');
  });

  // Mark current node as active
  let currentNode;
  switch (currentScenario) {
    case 'registration':
      currentNode = 'registration-node';
      break;
    case 'signin':
      currentNode = 'signin-node';
      break;
    case 'reauth':
      currentNode = 'reauth-node';
      break;
    case 'reauthInteractive':
      currentNode = 'reauth-interactive-node';
      break;
    case 'requestPermissions':
      currentNode = 'permissions-node';
      break;
    case 'signout':
      currentNode = 'signout-node';
      break;
    default:
      '';
  }

  document.getElementById(currentNode).classList.add('active');

  // Mark completed nodes
  const scenarioOrder = [
    'registration',
    'signin',
    'reauth',
    'reauthInteractive',
    'requestPermissions',
    'signout',
  ];
  const currentIndex = scenarioOrder.indexOf(currentScenario);

  for (let i = 0; i < currentIndex; i++) {
    const nodeId =
      scenarioOrder[i] === 'registration'
        ? 'registration-node'
        : scenarioOrder[i] === 'signin'
        ? 'signin-node'
        : scenarioOrder[i] === 'reauth'
        ? 'reauth-node'
        : scenarioOrder[i] === 'reauthInteractive'
        ? 'reauth-interactive-node'
        : scenarioOrder[i] === 'requestPermissions'
        ? 'permissions-node'
        : 'signout-node';
    document.getElementById(nodeId).classList.add('completed');
  }
}

/**
 *
 */
function updateScenarioInfo() {
  const scenario = scenarios[currentScenario];
  document.getElementById('scenario-title').textContent = scenario.title;
  document.getElementById('scenario-description').textContent =
    scenario.description;
}

/**
 *
 */
function nextStep() {
  const scenario = scenarios[currentScenario];

  // If we're starting a new scenario, reset
  if (currentStep === -1) {
    clearMessages();
    document.getElementById('next-step').innerHTML =
      'Next Step <i class="fas fa-arrow-right"></i>';
  }

  // Move to next step
  currentStep++;

  // If we've reached the end of the scenario
  if (currentStep >= scenario.steps.length) {
    const nextStepButton = document.getElementById('next-step');
    nextStepButton.disabled = true;
    nextStepButton.classList.add('disabled');
    document.getElementById('step-explanation').textContent =
      'You have completed this scenario! Select another scenario from the timeline above to continue.';
    return;
  }

  // Display current step
  const step = scenario.steps[currentStep];
  document.getElementById('step-explanation').textContent = step.explanation;

  // Execute step action
  if (step.action) {
    const shouldNotAdvanceAutomatically = step.action();
    if (shouldNotAdvanceAutomatically) {
      // Don't add event listeners for auto-advancement if the step handles it
    }
  }
}

// Enhanced resetScenario function to properly reset all state
/**
 *
 */
function resetScenario() {
  window.autoAdvanceInterval && clearInterval(window.autoAdvanceInterval);
  window.autoAdvanceInterval = null;
  document.getElementById('browser-content').style.minHeight = '250px';

  // Reset step counter
  currentStep = -1;

  // Clear all messages in the sequence diagram
  clearMessages();

  // Reset any browser dialogs
  hideBrowserDialog();

  // Hide any loading indicators
  hideBrowserLoading();

  // Set appropriate initial content based on the current scenario
  switch (currentScenario) {
    case 'registration':
    case 'signin':
      updateBrowserContent(`
                <div class="rp-website">
                    <h2>Welcome to ExampleShop</h2>
                    <p>Please sign in to continue</p>
                    <button id="signin-button" class="fedcm-button">Sign in</button>
                </div>
            `);
      break;
    case 'reauth':
      updateBrowserContent(`
                <div class="rp-website">
                    <h2>ExampleShop</h2>
                    <p>Browsing products...</p>
                </div>
            `);
      break;
    case 'reauthInteractive':
      updateBrowserContent(`
                <div class="rp-website">
                    <h2>ExampleShop</h2>
                    <p>Browsing products...</p>
                </div>
            `);
      break;
    case 'requestPermissions':
      updateBrowserContent(`
                <div class="rp-website">
                    <h2>ExampleShop</h2>
                    <p>Welcome back, Alex!</p>
                    <button id="special-feature-button" class="fedcm-button">Enable Personalized Recommendations</button>
                </div>
            `);
      break;
    case 'signout':
      updateBrowserContent(`
                <div class="rp-website">
                    <h2>ExampleShop</h2>
                    <p>Welcome back, Alex!</p>
                    <button id="signout-button" class="fedcm-button">Sign out</button>
                </div>
            `);
      break;
    default:
      '';
  }

  // Reset UI controls
  const nextStepButton = document.getElementById('next-step');
  nextStepButton.innerHTML = 'Start Flow <i class="fas fa-play"></i>';
  nextStepButton.disabled = false;
  nextStepButton.classList.remove('disabled');
  document.getElementById(
    'step-explanation'
  ).textContent = `Click "Start Flow" to begin the ${scenarios[
    currentScenario
  ].title.toLowerCase()} process.`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Interactive mode logic
  const interactiveCheckbox = document.getElementById('interactive-mode');
  const nextStepButton = document.getElementById('next-step');

  /**
   *
   * @param isInteractive
   */
  function setInteractiveMode(isInteractive) {
    interactiveMode = isInteractive;

    if (interactiveMode) {
      // Stop auto-advancing if running
      if (window.autoAdvanceInterval) {
        clearInterval(window.autoAdvanceInterval);
        window.autoAdvanceInterval = null;
      }
      nextStepButton.disabled = false;
      nextStepButton.classList.remove('disabled');
    } else {
      nextStepButton.disabled = true;
      nextStepButton.classList.add('disabled');
      // Start auto-advancing
      if (window.autoAdvanceInterval) {
        clearInterval(window.autoAdvanceInterval);
      }
      window.autoAdvanceInterval = setInterval(() => {
        const scenario = scenarios[currentScenario];
        if (currentStep < scenario.steps.length - 1) {
          nextStep();
        } else {
          clearInterval(window.autoAdvanceInterval);
          window.autoAdvanceInterval = null;
          setInteractiveMode(true); // Re-enable interactive mode at end
          interactiveCheckbox.checked = true;
        }
      }, 1200);
    }
  }

  interactiveCheckbox.addEventListener('change', (e) => {
    setInteractiveMode(e.target.checked);
    // If toggling to interactive, stop auto-advance immediately
    if (e.target.checked && window.autoAdvanceInterval) {
      clearInterval(window.autoAdvanceInterval);
      window.autoAdvanceInterval = null;
    }
  });

  nextStepButton.addEventListener('click', () => {
    if (interactiveMode) {
      nextStep();
    }
  });

  document.getElementById('reset-scenario').addEventListener('click', () => {
    resetScenario();
    setInteractiveMode(interactiveCheckbox.checked);
  });

  // Initialize scenario
  updateScenarioInfo();
  updateTimeline();
  document.getElementById(
    'step-explanation'
  ).textContent = `Click "Start Flow" to begin the ${scenarios[
    currentScenario
  ].title.toLowerCase()} process.`;

  // Adjust container heights dynamically based on viewport
  /**
   *
   */
  function adjustContainerHeights() {
    const visualizationContainer = document.getElementById(
      'visualization-container'
    );
    const browserUI = document.getElementById('browser-ui');
    const sequenceDiagram = document.getElementById('sequence-diagram');

    // Calculate available height for main visualization area
    const viewportHeight = window.innerHeight;
    // Reserve space for header, timeline, explanation panel, etc.
    const reservedHeight = 150; // Adjust as needed for your layout
    const availableHeight = Math.max(viewportHeight - reservedHeight, 300);

    visualizationContainer.style.height = availableHeight + 'px';
    visualizationContainer.style.minHeight = availableHeight + 'px';

    // Split available space between browser and diagram
    const halfHeight = Math.floor(availableHeight / 2);
    browserUI.style.height = halfHeight + 'px';
    browserUI.style.minHeight = halfHeight + 'px';
    browserUI.style.maxHeight = halfHeight + 'px';
    sequenceDiagram.style.height = halfHeight + 110 + 'px';
    sequenceDiagram.style.minHeight = halfHeight + 'px';
    sequenceDiagram.style.maxHeight = halfHeight + 110 + 'px';
  }

  // Run on load and resize
  adjustContainerHeights();
  window.addEventListener('resize', adjustContainerHeights);

  // Handle timeline node clicks
  document.querySelectorAll('.timeline-node').forEach((node) => {
    node.addEventListener('click', function () {
      const nodeId = this.id;

      // Store previous scenario to handle proper timeline updates
      const previousScenario = currentScenario;

      // Update current scenario based on clicked node
      if (nodeId === 'registration-node') {
        currentScenario = 'registration';
      } else if (nodeId === 'signin-node') {
        currentScenario = 'signin';
      } else if (nodeId === 'reauth-node') {
        currentScenario = 'reauth';
      } else if (nodeId === 'reauth-interactive-node') {
        currentScenario = 'reauthInteractive';
      } else if (nodeId === 'permissions-node') {
        currentScenario = 'requestPermissions';
      } else if (nodeId === 'signout-node') {
        currentScenario = 'signout';
      }

      // Reset the step counter
      currentStep = -1;

      // Update UI for the new scenario
      updateScenarioInfo();

      // Special handling for timeline to prevent previous scenarios from showing as completed
      // when navigating backward
      const scenarioOrder = [
        'registration',
        'signin',
        'reauth',
        'reauthInteractive',
        'requestPermissions',
        'signout',
      ];
      const prevIndex = scenarioOrder.indexOf(previousScenario);
      const currentIndex = scenarioOrder.indexOf(currentScenario);

      if (currentIndex < prevIndex) {
        // We're going backward, so clear "completed" state from all nodes
        document.querySelectorAll('.timeline-node').forEach((n) => {
          n.classList.remove('completed');
        });
      }

      updateTimeline();
      resetScenario();
    });
  });

  // Initialize scenario
  updateScenarioInfo();
  updateTimeline();
  document.getElementById(
    'step-explanation'
  ).textContent = `Click "Start Flow" to begin the ${scenarios[
    currentScenario
  ].title.toLowerCase()} process.`;

  // Run on load and resize
  adjustContainerHeights();
  window.addEventListener('resize', adjustContainerHeights);
});
