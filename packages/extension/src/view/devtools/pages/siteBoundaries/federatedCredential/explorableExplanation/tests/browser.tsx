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
import { ScenarioKeys } from '../store/scenariosTypes';

describe('BrowserStep', () => {
  it('should render correctly', () => {
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
});
