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
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import { BrowserStep } from '../components';
import { scenarios } from '../store/scenarios';
import { ScenarioKeys } from '../store/scenariosTypes';

describe('BrowserStep', () => {
  it('should render correctly for key steps', () => {
    const setStepExplanation = jest.fn();

    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.REGISTRATION}
        currentStep={0}
        setStepExplanation={setStepExplanation}
      />
    );

    expect(screen.getByText('Please sign in to continue')).toBeInTheDocument();

    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.SIGNIN}
        currentStep={0}
        setStepExplanation={setStepExplanation}
      />
    );

    expect(screen.getByText('Sign in with YourID')).toBeInTheDocument();

    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.REAUTH}
        currentStep={10}
        setStepExplanation={setStepExplanation}
      />
    );

    expect(
      screen.getByText('Session refreshed successfully')
    ).toBeInTheDocument();

    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.REAUTH_INTERACTIVE}
        currentStep={5}
        setStepExplanation={setStepExplanation}
      />
    );

    expect(screen.getByText('Session Expired')).toBeInTheDocument();

    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.REQUEST_PERMISSIONS}
        currentStep={0}
        setStepExplanation={setStepExplanation}
      />
    );

    expect(
      screen.getByText('Enable Personalized Recommendations')
    ).toBeInTheDocument();

    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.SIGNOUT}
        currentStep={0}
        setStepExplanation={setStepExplanation}
      />
    );

    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('calls setStepExplanation for each step', () => {
    const setStepExplanation = jest.fn();
    Object.values(ScenarioKeys).forEach((scenarioKey) => {
      const steps = scenarios[scenarioKey]?.steps || [];
      steps.forEach((step, idx) => {
        render(
          <BrowserStep
            currentScenarioKey={scenarioKey}
            currentStep={idx}
            setStepExplanation={setStepExplanation}
          />
        );
        expect(setStepExplanation).toHaveBeenCalledWith(step.explanation || '');
      });
    });
  });

  it('handles invalid step index gracefully', () => {
    const setStepExplanation = jest.fn();
    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.REGISTRATION}
        currentStep={-1}
        setStepExplanation={setStepExplanation}
      />
    );
    // Should not throw, may show empty or fallback UI
    expect(setStepExplanation).toHaveBeenCalledWith(
      'Click "Start Flow" to begin the first-time sign-in (registration) process.'
    );
  });

  it('renders browser dialogs and loading states', () => {
    const setStepExplanation = jest.fn();
    // Find steps with browserUpdates.showBrowserDialog or showBrowserLoading
    Object.values(ScenarioKeys).forEach((scenarioKey) => {
      const steps = scenarios[scenarioKey]?.steps || [];
      steps.forEach((step, idx) => {
        const action = typeof step.action === 'function' ? step.action() : {};
        if (action.browserUpdates?.showBrowserDialog) {
          render(
            <BrowserStep
              currentScenarioKey={scenarioKey}
              currentStep={idx}
              setStepExplanation={setStepExplanation}
            />
          );
          // Dialog header should be present
          expect(
            screen.getByText('Choose an identity provider')
          ).toBeInTheDocument();
        }
      });
    });
  });

  it('renders browser content for updateBrowserContent', () => {
    const setStepExplanation = jest.fn();
    Object.values(ScenarioKeys).forEach((scenarioKey) => {
      const steps = scenarios[scenarioKey]?.steps || [];
      steps.forEach((step, idx) => {
        const action = typeof step.action === 'function' ? step.action() : {};
        if (action.browserUpdates?.updateBrowserContent) {
          render(
            <BrowserStep
              currentScenarioKey={scenarioKey}
              currentStep={idx}
              setStepExplanation={setStepExplanation}
            />
          );

          expect(
            screen.getAllByText('Welcome to ExampleShop')[0]
          ).toBeInTheDocument();
        }
      });
    });
  });

  it('renders consent dialog and approval button for permissions', () => {
    const setStepExplanation = jest.fn();
    // Find consent-dialog steps
    const steps = scenarios[ScenarioKeys.REQUEST_PERMISSIONS]?.steps || [];
    steps.forEach((step, idx) => {
      const action = typeof step.action === 'function' ? step.action() : {};
      if (
        action.browserUpdates?.showBrowserDialog?.includes('consent-dialog')
      ) {
        render(
          <BrowserStep
            currentScenarioKey={ScenarioKeys.REQUEST_PERMISSIONS}
            currentStep={idx}
            setStepExplanation={setStepExplanation}
          />
        );
        expect(screen.getByText(/allow/i)).toBeInTheDocument();
      }
    });
  });

  it('renders sign out button and completion message', () => {
    const setStepExplanation = jest.fn();
    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.SIGNOUT}
        currentStep={0}
        setStepExplanation={setStepExplanation}
      />
    );
    expect(screen.getByText('Sign out')).toBeInTheDocument();
    // Last step: completion message
    const lastStep = scenarios[ScenarioKeys.SIGNOUT].steps.length - 1;
    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.SIGNOUT}
        currentStep={lastStep}
        setStepExplanation={setStepExplanation}
      />
    );
    expect(screen.getByText('You have been signed out.')).toBeInTheDocument();
  });

  it('renders personalized recommendations message', () => {
    const setStepExplanation = jest.fn();
    const lastStep =
      scenarios[ScenarioKeys.REQUEST_PERMISSIONS].steps.length - 1;
    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.REQUEST_PERMISSIONS}
        currentStep={lastStep}
        setStepExplanation={setStepExplanation}
      />
    );
    expect(
      screen.getByText('Personalized Recommendations Enabled')
    ).toBeInTheDocument();
  });

  it('renders welcome/completion messages for registration/signin', () => {
    const setStepExplanation = jest.fn();
    // Registration completion
    const lastStepReg = scenarios[ScenarioKeys.REGISTRATION].steps.length - 1;
    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.REGISTRATION}
        currentStep={lastStepReg}
        setStepExplanation={setStepExplanation}
      />
    );
    expect(screen.getByText(/welcome, alex/i)).toBeInTheDocument();
    // Signin completion
    const lastStepSignIn = scenarios[ScenarioKeys.SIGNIN].steps.length - 1;
    render(
      <BrowserStep
        currentScenarioKey={ScenarioKeys.SIGNIN}
        currentStep={lastStepSignIn}
        setStepExplanation={setStepExplanation}
      />
    );
    expect(screen.getByText(/welcome back, alex/i)).toBeInTheDocument();
  });
});
