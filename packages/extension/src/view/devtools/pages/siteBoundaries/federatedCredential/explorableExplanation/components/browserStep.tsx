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
 * External dependencies.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import { scenarios } from '../store/scenarios';
import { ScenarioKeys } from '../store/scenariosTypes';

interface BrowserStepProps {
  currentStep: number;
  currentScenarioKey: ScenarioKeys;
  setStepExplanation: (explanation: string) => void;
}

const BrowserStep = ({
  currentScenarioKey,
  currentStep,
  setStepExplanation,
}: BrowserStepProps) => {
  const [dialog, setDialog] = useState<{
    type: string;
    options?: unknown;
  } | null>(null);
  const [browserContent, setBrowserContent] = useState<React.ReactNode>(null);

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
        element.classList.add(
          'scale-95',
          'bg-blue-800',
          'shadow-[0_0_0_3px_rgba(26,115,232,0.3)]',
          'animate-pulse'
        );

        setTimeout(() => {
          element.classList.remove(
            'scale-95',
            'bg-blue-800',
            'shadow-[0_0_0_3px_rgba(26,115,232,0.3)]',
            'animate-pulse'
          );
        }, 1000);
      }
    },

    simulateElementSelection: (selector: string) => {
      const _browserContent = browserContentRef.current!;
      const element = _browserContent.querySelector(selector);
      if (element) {
        element.classList.add(
          'bg-[#e8f0fe]',
          'border-2',
          '!border-[#1a73e8]',
          'animate-pulse'
        );
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

    switch (currentScenarioKey) {
      case 'registration':
      case 'signin':
        callbacks.current.updateBrowserContent(
          <div className="rp-website text-center p-5">
            <h2 className="text-xl font-semibold mb-2">
              Welcome to ExampleShop
            </h2>
            <p className="mb-2">Please sign in to continue</p>
            <button
              id="signin-button"
              className="fedcm-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition mt-2"
            >
              Sign in with YourID
            </button>
          </div>
        );
        break;
      case 'reauth':
        callbacks.current.updateBrowserContent(
          <div className="rp-website text-center p-5">
            <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
            <p className="mb-2">Browsing products...</p>
          </div>
        );
        break;
      case 'reauthInteractive':
        callbacks.current.updateBrowserContent(
          <div className="rp-website text-center p-5">
            <h2 className="text-xl font-semibold mb-2">ExampleShop</h2>
            <p className="mb-2">Browsing products...</p>
          </div>
        );
        break;
      case 'requestPermissions':
        callbacks.current.updateBrowserContent(
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
        );
        break;
      case 'signout':
        callbacks.current.updateBrowserContent(
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
        );
        break;
      default:
    }
  }, [currentScenarioKey]);

  useEffect(() => {
    if (currentStep === -1) {
      setStepExplanation(
        `Click "Start Flow" to begin the ${scenarios[
          currentScenarioKey
        ].title.toLowerCase()} process.`
      );
      resetScenario();
    } else {
      const stepData = scenarios[currentScenarioKey].steps[currentStep];
      setStepExplanation(stepData?.explanation || '');
    }

    if (
      Object.values(ScenarioKeys).indexOf(currentScenarioKey) ===
        Object.values(ScenarioKeys).length - 1 &&
      currentStep >= scenarios[currentScenarioKey].steps.length
    ) {
      setStepExplanation('End of demo. Click "Restart Demo" to start over.');
    }

    const actionFn = scenarios[currentScenarioKey].steps[currentStep]?.action;
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
  }, [
    callbacks,
    currentScenarioKey,
    currentStep,
    resetScenario,
    setStepExplanation,
  ]);

  const browserContentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="browser-step-container"
      className="flex flex-col gap-[18px] flex-1 min-w-[370px]"
    >
      <div
        id="browser-ui"
        className="border border-[#ccc] rounded-[8px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.1)] bg-white min-h-[250px] flex-grow-0.4 relative flex flex-col"
      >
        <div className="browser-chrome bg-[#f2f2f2] p-[10px] border-b border-[#ddd] flex items-center">
          <span className="bg-white px-[10px] py-[5px] rounded-[4px] text-[14px] text-[#333] flex-1 max-w-[80%]">
            example-shop.com
          </span>
        </div>
        <div
          id="browser-content"
          ref={browserContentRef}
          className="p-[20px] min-h-[200px] relative flex-1"
        >
          {browserLoading ? (
            browserLoading.silent ? (
              <div className="silent-loading flex items-center bg-white/90 rounded-[4px] p-[6px_10px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[12px] text-[#555] max-w-[180px] z-10 absolute top-[10px] right-[10px]">
                <div className="mini-spinner w-[12px] h-[12px] mr-[8px] border-2 border-[#1a73e8]/20 border-t-[#1a73e8] rounded-full animate-spin"></div>
                <span>{browserLoading.message}</span>
              </div>
            ) : (
              <div className="browser-loading flex flex-col justify-center items-center h-full min-h-[200px] p-[20px] text-center">
                <div className="spinner w-[40px] h-[40px] mb-[15px] border-4 border-[#1a73e8]/20 border-t-[#1a73e8] rounded-full animate-spin"></div>
                <p className="loading-message text-[16px] text-[#666] mt-[10px] animate-pulse">
                  {browserLoading.message}
                </p>
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
    </div>
  );
};

const BrowserDialog = ({
  type,
  options,
  hideDialog,
}: {
  type: string;
  options?: any;
  hideDialog: () => void;
}) => {
  if (type === 'idp-chooser') {
    return (
      <div className="browser-dialog idp-chooser rounded-lg shadow-lg border border-gray-200 bg-white max-w-[350px] w-[90%] mx-auto my-5 animate-fadeIn">
        <div className="browser-dialog-header px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Choose an identity provider
          </h2>
        </div>
        <div className="browser-dialog-body p-4 flex flex-col gap-2">
          <div
            id="yourid-option"
            className="idp-option flex items-center p-2 mb-2 border border-gray-100 rounded cursor-default relative transition-all"
          >
            <img
              src="../assets/images/fedcm/your-id-logo.png"
              alt="YourID Logo"
              className="idp-logo w-10 h-10 mr-4 object-contain"
            />
            <div className="idp-details flex flex-col">
              <strong>YourID</strong>
              <span className="text-xs text-gray-500">
                Sign in with your YourID account
              </span>
            </div>
          </div>
          <div className="idp-option flex items-center p-2 mb-2 border border-gray-100 rounded cursor-default relative transition-all">
            <img
              src="../assets/images/fedcm/other-idp-logo.png"
              alt="Other IdP Logo"
              className="idp-logo w-10 h-10 mr-4 object-contain"
            />
            <div className="idp-details flex flex-col">
              <strong>OtherID</strong>
              <span className="text-xs text-gray-500">
                Sign in with your OtherID account
              </span>
            </div>
          </div>
          <button
            id="choose-idp-button"
            className="fedcm-button mt-2 w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Continue
          </button>
          <button
            className="cancel-button mt-2 w-full py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            onClick={hideDialog}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else if (type === 'account-chooser') {
    return (
      <div className="browser-dialog account-chooser rounded-lg shadow-lg border border-gray-200 bg-white max-w-[350px] w-[90%] mx-auto my-5 animate-fadeIn">
        <div className="browser-dialog-header px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Choose an account
          </h2>
        </div>
        <div className="browser-dialog-body p-4 flex flex-col gap-2">
          <div className="account-option flex items-center p-2 mb-2 border border-gray-100 rounded cursor-default relative transition-all">
            <img
              src="../assets/images/fedcm/user-avatar.png"
              alt="User Avatar"
              className="account-avatar w-10 h-10 rounded-full mr-4 object-cover"
            />
            <div className="account-details flex flex-col">
              <strong>alex@yourid.com</strong>
              <span className="text-xs text-gray-500">YourID Account</span>
            </div>
          </div>
          <div className="account-option flex items-center p-2 mb-2 border border-gray-100 rounded cursor-default relative transition-all">
            <img
              src="../assets/images/fedcm/user-avatar2.png"
              alt="Second User Avatar"
              className="account-avatar w-10 h-10 rounded-full mr-4 object-cover"
            />
            <div className="account-details flex flex-col">
              <strong>alex.work@yourid.com</strong>
              <span className="text-xs text-gray-500">YourID Account</span>
            </div>
          </div>
          <button
            id="choose-account-button"
            className="fedcm-button mt-2 w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Continue
          </button>
          <button
            className="cancel-button mt-2 w-full py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            onClick={hideDialog}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else if (type === 'consent-dialog') {
    const title = options?.title || 'YourID would like to share';
    const content = options?.content || (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-700">example-shop.com is requesting:</p>
        <ul className="permissions-list list-disc pl-5 my-2 text-gray-600 text-sm">
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your profile picture</li>
        </ul>
        <button
          id="consent-approve-button"
          className="fedcm-button mt-2 w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Allow
        </button>
      </div>
    );
    return (
      <div className="browser-dialog consent-dialog rounded-lg shadow-lg border border-gray-200 bg-white max-w-[350px] w-[90%] mx-auto my-5 animate-fadeIn">
        <div className="browser-dialog-header px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="browser-dialog-body p-4">{content}</div>
      </div>
    );
  } else if (type === 'scenario-choice') {
    const title = options?.title || 'Choose scenario path';
    const content = options?.content || (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-700">
          Select the reauth scenario outcome:
        </p>
        <div
          id="success-path"
          className="scenario-option flex items-center p-3 mb-3 border border-gray-100 rounded-lg cursor-pointer transition-all"
        >
          <div className="scenario-icon success flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold mr-3">
            ✓
          </div>
          <div className="scenario-details flex flex-col">
            <strong>Success Path</strong>
            <span className="text-xs text-gray-500">
              Silent reauth allowed and succeeds
            </span>
          </div>
        </div>
        <div
          id="failure-path"
          className="scenario-option flex items-center p-3 mb-3 border border-gray-100 rounded-lg cursor-pointer transition-all"
        >
          <div className="scenario-icon failure flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold mr-3">
            ✗
          </div>
          <div className="scenario-details flex flex-col">
            <strong>Failure Path</strong>
            <span className="text-xs text-gray-500">
              Silent reauth fails or not allowed
            </span>
          </div>
        </div>
      </div>
    );
    return (
      <div className="browser-dialog scenario-dialog rounded-lg shadow-lg border border-gray-200 bg-white max-w-[450px] w-[90%] mx-auto my-5 animate-fadeIn">
        <div className="browser-dialog-header px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="browser-dialog-body p-4">{content}</div>
      </div>
    );
  } else if (type === 'passive-fedcm-dialog') {
    return (
      <div className="browser-dialog passive-fedcm-dialog rounded-lg shadow-lg border-2 border-blue-500 bg-white max-w-[350px] w-[90%] mx-auto my-5 animate-fadeIn relative">
        <div className="passive-indicator-badge absolute -top-3 right-3 bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-bold z-10">
          Automatically Appeared
        </div>
        <div className="browser-dialog-header px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">Continue with</h2>
        </div>
        <div className="browser-dialog-body p-4 flex flex-col gap-2">
          <div className="account-option flex items-center p-2 mb-2 border border-gray-100 rounded cursor-default relative transition-all">
            <img
              src="../assets/images/fedcm/your-id-logo.png"
              alt="YourID Logo"
              className="idp-logo w-10 h-10 mr-4 object-contain"
            />
            <div className="account-details flex flex-col">
              <strong>alex@yourid.com</strong>
              <span className="text-xs text-gray-500">YourID Account</span>
            </div>
          </div>
          <div className="account-option flex items-center p-2 mb-2 border border-gray-100 rounded cursor-default relative transition-all">
            <img
              src="../assets/images/fedcm/other-idp-logo.png"
              alt="Other IdP Logo"
              className="idp-logo w-10 h-10 mr-4 object-contain"
            />
            <div className="account-details flex flex-col">
              <strong>Use a different account</strong>
            </div>
          </div>
          <button
            id="choose-account-button"
            className="fedcm-button mt-2 w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Continue
          </button>
          <button
            className="cancel-button mt-2 w-full py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            onClick={hideDialog}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return null;
};

export default BrowserStep;
