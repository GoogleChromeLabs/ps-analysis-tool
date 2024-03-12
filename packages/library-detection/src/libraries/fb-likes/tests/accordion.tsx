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
import FacebookLikesAccordion from '../accordion';

describe('Facebook Likes Accordion', () => {
  const accordionTitleText = 'Facebook Like Button.';
  const accordionMessageText =
    'Facebook like button functionality may not work properly due to the phaseout of third-party cookies. For more information, please visit theFacebook support forum.';

  it('should show accordion', () => {
    const domQueryMatches = [''];
    render(<FacebookLikesAccordion domQueryMatches={domQueryMatches} />);

    const accordion = screen.getByTestId('library-detection-accordion');
    const accordionTitle = screen.getByText(accordionTitleText);

    expect(accordion).toBeInTheDocument();
    expect(accordionTitle).toBeInTheDocument();
  });

  it('should not show accordion', () => {
    const domQueryMatches = null;
    render(<FacebookLikesAccordion domQueryMatches={domQueryMatches} />);

    const accordion = screen.queryByTestId('library-detection-accordion');
    const accordionTitle = screen.queryByText(accordionTitleText);

    expect(accordion).not.toBeInTheDocument();
    expect(accordionTitle).not.toBeInTheDocument();
  });

  it('should toggle accordion message after clicking the accordion', () => {
    const domQueryMatches = [
      'div[id]: fb-root',
      'div[class]: fb-like',
      'iframe[src]: https://www.facebook.com/1.0/plugins/like.php/123',
    ];

    render(<FacebookLikesAccordion domQueryMatches={domQueryMatches} />);

    const accordion = screen.getByTestId('library-detection-accordion');
    const accordionTitle = screen.getByText(accordionTitleText);

    expect(accordion).not.toHaveTextContent(accordionMessageText);

    // Click the accordion
    fireEvent.click(accordionTitle);

    expect(accordion).toHaveTextContent(accordionMessageText);

    // Click the accordion
    fireEvent.click(accordionTitle);

    expect(accordion).not.toHaveTextContent(accordionMessageText);
  });
});
