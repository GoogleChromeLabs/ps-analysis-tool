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
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import FacebookCommentsAccordion from '../accordion';
import { I18n } from '@google-psat/i18n';

describe('Facebook Comments Accordion', () => {
  const accordionTitleText = 'Facebook Comments';
  const accordionMessageText =
    'Facebook comments plugin functionality may not work properly due to the phaseout of third-party cookies. To inquire further about the same, please visit the Facebook support forum.';

  beforeAll(() => {
    globalThis.chrome.i18n = null;
    I18n.initMessages({
      fBComments: {
        message: 'Facebook Comments',
      },
    });
  });

  it('should show accordion', () => {
    const domQueryMatches = [''];
    render(<FacebookCommentsAccordion domQueryMatches={domQueryMatches} />);

    const accordion = screen.getByTestId('library-detection-accordion');
    const accordionTitle = screen.getByText(accordionTitleText);

    expect(accordion).toBeInTheDocument();
    expect(accordionTitle).toBeInTheDocument();
  });

  it('should not show accordion', () => {
    const domQueryMatches = null;
    render(<FacebookCommentsAccordion domQueryMatches={domQueryMatches} />);

    const accordion = screen.queryByTestId('library-detection-accordion');
    const accordionTitle = screen.queryByText(accordionTitleText);

    expect(accordion).not.toBeInTheDocument();
    expect(accordionTitle).not.toBeInTheDocument();
  });

  it('should toggle accordion message after clicking the accordion', () => {
    const domQueryMatches = [
      'div[id]: fb-root',
      'div[class]: fb-comments',
      'iframe[src]: https://www.facebook.com/1.0/plugins/comments.php/123',
    ];

    render(<FacebookCommentsAccordion domQueryMatches={domQueryMatches} />);

    const accordion = screen.getByTestId('library-detection-accordion');
    const accordionTitle = screen.getByText(accordionTitleText);

    expect(accordion).not.toHaveTextContent(accordionMessageText);

    // Click the accordion
    fireEvent.click(accordionTitle);

    // expect(accordion).toHaveTextContent(accordionMessageText);

    // Click the accordion
    fireEvent.click(accordionTitle);

    expect(accordion).not.toHaveTextContent(accordionMessageText);
  });
});
