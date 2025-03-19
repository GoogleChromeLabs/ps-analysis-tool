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
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';
/**
 * Internal dependencies
 */
import BounceTracking from '../bounceTracking';
import UserAgentReduction from '../userAgentReduction';
import PrivacyProtection from '../privacyProtection';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';
import { act } from 'react-dom/test-utils';
import { I18n } from '@google-psat/i18n';
import { useSidebar } from '@google-psat/design-system';
import IPProtection from '../ipProtection';
import PrivateStateTokens from '../privateStateTokens';

jest.mock(
  '../../../../../../../design-system/src/components/sidebar/useSidebar',
  () => ({
    useSidebar: jest.fn(),
  })
);
const mockUseSidebar = useSidebar as jest.Mock;
describe('PrivacyProtection Landing Pages', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;

    globalThis.chrome.i18n = null;

    I18n.initMessages({
      trackingProtection: {
        message: 'Tracking Protection',
      },
    });

    mockUseSidebar.mockReturnValue({ extractSelectedItemKeyTitles: () => [] });
  });

  it('should render BounceTracking', async () => {
    act(() => {
      render(<BounceTracking />);
    });
    expect(
      await screen.findByTestId('bounce-tracking-content')
    ).toBeInTheDocument();
  });

  it('should render UserAgentReduction', async () => {
    act(() => {
      render(<UserAgentReduction />);
    });

    expect(
      await screen.findByTestId('user-agent-reduction-content')
    ).toBeInTheDocument();
  });

  it('should render PrivacyProtection', async () => {
    act(() => {
      render(<PrivacyProtection />);
    });
    expect(await screen.findByText('Privacy Protection')).toBeInTheDocument();
  });

  it('should render IPProtection', async () => {
    act(() => {
      render(<IPProtection />);
    });
    expect(
      await screen.findByTestId('ip-protection-content')
    ).toBeInTheDocument();
  });

  it('should render PrivateStateTokens', async () => {
    act(() => {
      render(<PrivateStateTokens />);
    });
    expect(
      await screen.findByTestId('private-state-tokens-content')
    ).toBeInTheDocument();
  });
});
