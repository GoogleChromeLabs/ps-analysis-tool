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
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import PrivateAdvertising from '../privateAdvertising';
import {
  latestNewsXML,
  latestNewsLinks,
} from '../../../test-data/landingPageData';

describe('Private Advertising', () => {
  beforeAll(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(latestNewsXML),
    } as unknown as Response);
  });

  it('should show Private Advertising content', async () => {
    await act(() => render(PrivateAdvertising()));

    const privateAdvertisingContent = screen.getByTestId(
      'private-advertising-content'
    );
    const iframe = privateAdvertisingContent.querySelector('iframe');

    expect(privateAdvertisingContent).toBeInTheDocument();
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      'src',
      'https://privacysandbox.info/en/privacy-sandbox/measure-digital-ads'
    );
    expect(iframe).toHaveClass('w-full md:w-[70%] md:m-auto rounded-xl');
  });

  it('Private Advertising accordion should work', async () => {
    await act(() => render(PrivateAdvertising()));

    const privateAdvertisingContent = screen.getByTestId(
      'private-advertising-content'
    );
    const buttonElement = privateAdvertisingContent?.querySelector(
      'button.flex.gap-2.text-2xl.font-bold.items-baseline.dark\\:text-bright-gray.cursor-pointer'
    );
    const privateAdvertisingIframeContainer =
      privateAdvertisingContent?.querySelector(
        'div.h-\\[78vh\\].w-full.flex.flex-col.gap-6.divide-y.divide-american-silver.dark\\:divide-quartz.px-4.py-6'
      );

    expect(buttonElement?.textContent).toBe('Private Advertising');
    expect(privateAdvertisingIframeContainer).toBeInTheDocument();
    expect(privateAdvertisingIframeContainer).not.toHaveClass('hidden');

    if (buttonElement) {
      fireEvent.click(buttonElement);

      // After button is clicked.
      expect(privateAdvertisingIframeContainer).toHaveClass('hidden');
    }
  });

  it('should show Quick Links content', async () => {
    await act(() => render(PrivateAdvertising()));

    const quickLinks = screen.getByText('Quick Links');
    const reportBugLink = screen.getByText('Report a bug');
    const reportBreakageLink = screen.getByText('Report a breakage');
    const discussionsLink = screen.getByText('Join the discussions');

    expect(quickLinks).toHaveClass(
      'text-xs font-bold uppercase text-darkest-gray dark:text-bright-gray'
    );

    // Report a bug.
    expect(reportBugLink).toHaveClass(
      'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
    );
    expect(reportBugLink).toHaveAttribute('rel', 'noreferrer');
    expect(reportBugLink).toHaveAttribute(
      'href',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=bug_report.md&title='
    );
    expect(reportBugLink).toHaveAttribute(
      'title',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=bug_report.md&title='
    );

    // Report a breakage.
    expect(reportBreakageLink).toHaveClass(
      'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
    );
    expect(reportBreakageLink).toHaveAttribute('rel', 'noreferrer');
    expect(reportBreakageLink).toHaveAttribute(
      'href',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=third-party-cookie-breakage-report.md&title='
    );
    expect(reportBreakageLink).toHaveAttribute(
      'title',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/issues/new?assignees=&labels=&projects=&template=third-party-cookie-breakage-report.md&title='
    );

    // Join the discussions.
    expect(discussionsLink).toHaveClass(
      'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
    );
    expect(discussionsLink).toHaveAttribute('rel', 'noreferrer');
    expect(discussionsLink).toHaveAttribute(
      'href',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions'
    );
    expect(discussionsLink).toHaveAttribute(
      'title',
      'https://github.com/GoogleChromeLabs/ps-analysis-tool/discussions'
    );
  });

  it('should show Latest News content', async () => {
    await act(() => render(PrivateAdvertising()));

    const latestNews = screen.getByText('Latest News');
    const latestNews1 = screen.getByText(
      'Digiday survey: Why publishers are ready to end the high cost of third-party cookies and data leakage'
    );
    const latestNews2 = screen.getByText(
      'Privacy Sandbox for the Web reaches general availability'
    );
    const latestNews3 = screen.getByText(
      'How Privacy Sandbox raises the bar for ads privacy'
    );
    const latestNews4 = screen.getByText(
      'The next stages of Privacy Sandbox: General availability and supporting scaled testing'
    );
    const latestNews5 = screen.getByText(
      'Protected Audience API: Our new name for FLEDGE'
    );
    const latestNews6 = screen.getByText(
      'AdExchanger study: Cookies’ low match rates cost Ad Tech millions'
    );
    const latestNews7 = screen.getByText(
      'Working Together to Build a More Private Internet'
    );
    const latestNews8 = screen.getByText(
      'Maximize ad relevance without third-party cookies'
    );

    const lastestNewsArray = [
      latestNews1,
      latestNews2,
      latestNews3,
      latestNews4,
      latestNews5,
      latestNews6,
      latestNews7,
      latestNews8,
    ];

    expect(latestNews).toHaveClass(
      'text-xs font-bold uppercase text-darkest-gray dark:text-bright-gray'
    );

    lastestNewsArray.forEach((element) => {
      expect(element).toHaveAttribute('rel', 'noreferrer');
      expect(element).toHaveAttribute(
        'href',
        latestNewsLinks[element.textContent ?? '']
      );
      expect(element).toHaveClass(
        'text-sm text-analytics font-medium leading-6 dark:text-medium-persian-blue'
      );
    });
  });

  it('should show Latest News view more button', async () => {
    await act(() => render(PrivateAdvertising()));

    const privateAdvertisingContent = screen.getByTestId(
      'private-advertising-content'
    );
    const viewMoreBtn = privateAdvertisingContent.querySelector(
      'a.leading-6.text-sm.text-analytics.dark\\:text-medium-persian-blue.font-semibold.px-3.border.border-american-silver.dark\\:border-quartz.rounded.inline-flex.gap-2.items-center'
    );
    const viewMoreBtnInnerText = viewMoreBtn?.textContent?.trim();

    expect(viewMoreBtnInnerText).toBe('View More');
    expect(viewMoreBtn).toHaveAttribute('rel', 'noreferrer');
    expect(viewMoreBtn).toHaveAttribute(
      'href',
      'https://privacysandbox.com/news/'
    );
  });

  afterAll(() => {
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
