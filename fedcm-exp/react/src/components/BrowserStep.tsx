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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { scenarios } from '../scenarios';
import { ScenarioKeys } from '../scenariosTypes';

/**
 *
 */
export default function BrowserStep() {
  const [dialog, setDialog] = useState<{
    type: string;
    options?: unknown;
  } | null>(null);
  const [browserContent, setBrowserContent] = useState<React.ReactNode>(null);
  const { currentScenario, currentStep } = useStore(({ state }) => ({
    currentScenario: state.currentScenario,
    currentStep: state.currentStep,
  }));

  const [stepExplanation, setStepExplanation] = useState('');
  const [browserLoading, setBrowserLoading] = useState<{
    message: string;
    silent: boolean;
  } | null>(null);

  const callbacks = useRef({
    showBrowserLoading: (message: string, silent = false) => {
      setBrowserLoading({ message, silent });
    },

    hideBrowserLoading: () => {
      setBrowserLoading(null);
    },

    simulateButtonClick: (selector: string) => {
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
    },

    simulateElementSelection: (selector: string) => {
      const _browserContent = browserContentRef.current!;
      const element = _browserContent.querySelector(selector);
      if (element) {
        element.classList.add('simulated-select', 'selected');

        // Add checkmark animation
        const checkmark = document.createElement('span');
        checkmark.classList.add('select-checkmark');
        checkmark.innerHTML = '✓';
        element.appendChild(checkmark);
      }
    },

    showBrowserDialog: (dialogType: string, options = {}) => {
      setDialog({ type: dialogType, options });
    },

    hideBrowserDialog: () => {
      setDialog(null);
    },

    updateBrowserContent: (content: React.ReactNode) => {
      setBrowserContent(content);
    },
  });

  const resetScenario = useCallback(() => {
    callbacks.current.hideBrowserDialog();
    callbacks.current.hideBrowserLoading();

    switch (currentScenario) {
      case 'registration':
      case 'signin':
        callbacks.current.updateBrowserContent(
          <div className="rp-website">
            <h2>Welcome to ExampleShop</h2>
            <p>Please sign in to continue</p>
            <button id="signin-button" className="fedcm-button">
              Sign in with YourID
            </button>
          </div>
        );
        break;
      case 'reauth':
        callbacks.current.updateBrowserContent(
          <div className="rp-website">
            <h2>ExampleShop</h2>
            <p>Browsing products...</p>
          </div>
        );
        break;
      case 'reauthInteractive':
        callbacks.current.updateBrowserContent(
          <div className="rp-website">
            <h2>ExampleShop</h2>
            <p>Browsing products...</p>
          </div>
        );
        break;
      case 'requestPermissions':
        callbacks.current.updateBrowserContent(
          <div className="rp-website">
            <h2>ExampleShop</h2>
            <p>Welcome back, Alex!</p>
            <button id="special-feature-button" className="fedcm-button">
              Enable Personalized Recommendations
            </button>
          </div>
        );
        break;
      case 'signout':
        callbacks.current.updateBrowserContent(
          <div className="rp-website">
            <h2>ExampleShop</h2>
            <p>Welcome back, Alex!</p>
            <button id="signout-button" className="fedcm-button">
              Sign out
            </button>
          </div>
        );
        break;
      default:
    }
  }, [currentScenario]);

  useEffect(() => {
    if (currentStep === -1) {
      setStepExplanation(
        `Click "Start Flow" to begin the ${scenarios[
          currentScenario
        ].title.toLowerCase()} process.`
      );
      resetScenario();
    } else {
      const stepData = scenarios[currentScenario].steps[currentStep];
      setStepExplanation(stepData?.explanation || '');
    }

    if (
      Object.values(ScenarioKeys).indexOf(currentScenario) ===
        Object.values(ScenarioKeys).length - 1 &&
      currentStep >= scenarios[currentScenario].steps.length
    ) {
      setStepExplanation('End of demo. Click "Restart Demo" to start over.');
    }

    const actionFn = scenarios[currentScenario].steps[currentStep]?.action;
    const action = typeof actionFn === 'function' ? actionFn() : undefined;

    if (action?.browserUpdates) {
      Object.entries(action.browserUpdates).forEach(([key, args]) => {
        if (callbacks.current[key as keyof typeof callbacks.current]) {
          const argArray = (Array.isArray(args) ? args : [args]).map((arg) =>
            typeof arg === 'function' ? arg() : arg
          );

          (
            callbacks.current[key as keyof typeof callbacks.current] as (
              ...args: any[]
            ) => void
          )(...argArray);
        }
      });
    }
  }, [callbacks, currentScenario, currentStep, resetScenario]);

  const browserContentRef = useRef<HTMLDivElement>(null);

  return (
    <div id="browser-step-container">
      <div id="browser-ui">
        <div className="browser-chrome">
          <span>example-shop.com</span>
        </div>
        <div id="browser-content" ref={browserContentRef}>
          {browserLoading ? (
            browserLoading.silent ? (
              <div className="silent-loading">
                <div className="mini-spinner"></div>
                <span>{browserLoading.message}</span>
              </div>
            ) : (
              <div className="browser-loading">
                <div className="spinner"></div>
                <p className="loading-message">{browserLoading.message}</p>
              </div>
            )
          ) : dialog?.type ? (
            <BrowserDialog
              type={dialog.type}
              options={dialog.options}
              hideDialog={() => setDialog(null)}
            />
          ) : (
            <>{browserContent}</>
          )}
        </div>
      </div>
      <div id="step-explanation">{stepExplanation}</div>
    </div>
  );
}

/**
 *
 * @param root0
 * @param root0.type
 * @param root0.options
 * @param root0.hideDialog
 */
function BrowserDialog({
  type,
  options,
  hideDialog,
}: {
  type: string;
  options?: any;
  hideDialog: () => void;
}) {
  if (type === 'idp-chooser') {
    return (
      <div className="browser-dialog idp-chooser">
        <div className="browser-dialog-header">
          <h2>Choose an identity provider</h2>
        </div>
        <div className="browser-dialog-body">
          <div id="yourid-option" className="idp-option">
            <img src="yourid-logo.png" alt="YourID Logo" className="idp-logo" />
            <div className="idp-details">
              <strong>YourID</strong>
              <span>Sign in with your YourID account</span>
            </div>
          </div>
          <div className="idp-option">
            <img
              src="other-idp-logo.png"
              alt="Other IdP Logo"
              className="idp-logo"
            />
            <div className="idp-details">
              <strong>OtherID</strong>
              <span>Sign in with your OtherID account</span>
            </div>
          </div>
          <button id="choose-idp-button" className="fedcm-button">
            Continue
          </button>
          <button className="cancel-button" onClick={hideDialog}>
            Cancel
          </button>
        </div>
      </div>
    );
  } else if (type === 'account-chooser') {
    return (
      <div className="browser-dialog account-chooser">
        <div className="browser-dialog-header">
          <h2>Choose an account</h2>
        </div>
        <div className="browser-dialog-body">
          <div className="account-option">
            <img
              src="user-avatar.png"
              alt="User Avatar"
              className="account-avatar"
            />
            <div className="account-details">
              <strong>alex@yourid.com</strong>
              <span>YourID Account</span>
            </div>
          </div>
          <div className="account-option">
            <img
              src="user-avatar2.png"
              alt="Second User Avatar"
              className="account-avatar"
            />
            <div className="account-details">
              <strong>alex.work@yourid.com</strong>
              <span>YourID Account</span>
            </div>
          </div>
          <button id="choose-account-button" className="fedcm-button">
            Continue
          </button>
          <button className="cancel-button" onClick={hideDialog}>
            Cancel
          </button>
        </div>
      </div>
    );
  } else if (type === 'consent-dialog') {
    const title = options?.title || 'YourID would like to share';
    const content = options?.content || (
      <div>
        <p>example-shop.com is requesting:</p>
        <ul className="permissions-list">
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your profile picture</li>
        </ul>
        <button id="consent-approve-button" className="fedcm-button">
          Allow
        </button>
      </div>
    );
    return (
      <div className="browser-dialog consent-dialog">
        <div className="browser-dialog-header">
          <h2>{title}</h2>
        </div>
        <div className="browser-dialog-body">{content}</div>
      </div>
    );
  } else if (type === 'scenario-choice') {
    const title = options?.title || 'Choose scenario path';
    const content = options?.content || (
      <div>
        <p>Select the reauth scenario outcome:</p>
        <div id="success-path" className="scenario-option">
          <div className="scenario-icon success">✓</div>
          <div className="scenario-details">
            <strong>Success Path</strong>
            <span>Silent reauth allowed and succeeds</span>
          </div>
        </div>
        <div id="failure-path" className="scenario-option">
          <div className="scenario-icon failure">✗</div>
          <div className="scenario-details">
            <strong>Failure Path</strong>
            <span>Silent reauth fails or not allowed</span>
          </div>
        </div>
      </div>
    );
    return (
      <div className="browser-dialog scenario-dialog">
        <div className="browser-dialog-header">
          <h2>{title}</h2>
        </div>
        <div className="browser-dialog-body">{content}</div>
      </div>
    );
  } else if (type === 'passive-fedcm-dialog') {
    return (
      <div className="browser-dialog passive-fedcm-dialog">
        <div className="passive-indicator-badge">Automatically Appeared</div>
        <div className="browser-dialog-header">
          <h2>Continue with</h2>
        </div>
        <div className="browser-dialog-body">
          <div className="account-option">
            <img src="yourid-logo.png" alt="YourID Logo" className="idp-logo" />
            <div className="account-details">
              <strong>alex@yourid.com</strong>
              <span>YourID Account</span>
            </div>
          </div>
          <div className="account-option">
            <img
              src="other-idp-logo.png"
              alt="Other IdP Logo"
              className="idp-logo"
            />
            <div className="account-details">
              <strong>Use a different account</strong>
            </div>
          </div>
          <button id="choose-account-button" className="fedcm-button">
            Continue
          </button>
          <button className="cancel-button" onClick={hideDialog}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return null;
}
