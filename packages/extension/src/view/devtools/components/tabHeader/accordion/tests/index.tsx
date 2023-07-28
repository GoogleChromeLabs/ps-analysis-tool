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
import Accordion from '..';

describe('Accordion', () => {
  it('Should frames listed under accordion', () => {
    render(
      <Accordion
        accordionState={true}
        setAccordionState={() => undefined}
        tabName={'Cookies'}
        index={1}
        selectedIndex={1}
        tabFrames={{
          'https://edition.cnn.com': { frameIds: [1] },
          'https://crxd.net': { frameIds: [2] },
          'https://pubmatic.com': { frameIds: [3] },
        }}
        setSelectedFrame={() => undefined}
        selectedFrame={null}
      />
    );
    const container = screen.getByTestId('cookies-tab-heading-wrapper');

    expect(container).toHaveClass('bg-selected-background-color');
  });

  it('should unselect cookie header and show frame as selected', () => {
    render(
      <Accordion
        accordionState={true}
        setAccordionState={() => undefined}
        tabName={'Cookies'}
        index={1}
        selectedIndex={1}
        tabFrames={{
          'https://edition.cnn.com': { frameIds: [1] },
          'https://crxd.net': { frameIds: [2] },
          'https://pubmatic.com': { frameIds: [3] },
        }}
        setSelectedFrame={() => undefined}
        selectedFrame={'https://edition.cnn.com'}
      />
    );
    const cookieHeaderContainer = screen.getByTestId(
      'cookies-tab-heading-wrapper'
    );
    const cookieFrameContainer = screen.getByTestId('https://edition.cnn.com');

    expect(cookieHeaderContainer).not.toHaveClass(
      'bg-selected-background-color'
    );
    expect(cookieFrameContainer).toHaveClass('bg-selected-background-color');
  });

  it('should not display anything when there are not tabFrames', () => {
    render(
      <Accordion
        accordionState={true}
        setAccordionState={() => undefined}
        tabName={'Cookies'}
        index={1}
        selectedIndex={1}
        tabFrames={{}}
        setSelectedFrame={() => undefined}
        selectedFrame={null}
      />
    );
    const framesContainer = screen.getByTestId('cookie-frames-container');

    expect(framesContainer.childNodes.length).toBe(0);
  });

  it('should not display tabFrames if not opened.', () => {
    render(
      <Accordion
        accordionState={false}
        setAccordionState={() => undefined}
        tabName={'Cookies'}
        index={1}
        selectedIndex={1}
        tabFrames={{
          'https://edition.cnn.com': { frameIds: [1] },
          'https://crxd.net': { frameIds: [2] },
          'https://pubmatic.com': { frameIds: [3] },
        }}
        setSelectedFrame={() => undefined}
        selectedFrame={null}
      />
    );
    const framesContainer = screen.getByTestId('cookie-frames-container');

    expect(framesContainer).toHaveClass('hidden');
  });
  it('should not display tabFrames if not opened.', () => {
    const renderedAccordion = render(
      <Accordion
        accordionState={false}
        setAccordionState={() => undefined}
        tabName={'Cookies'}
        index={1}
        selectedIndex={1}
        tabFrames={{
          'https://edition.cnn.com': { frameIds: [1] },
          'https://crxd.net': { frameIds: [2] },
          'https://pubmatic.com': { frameIds: [3] },
        }}
        setSelectedFrame={() => undefined}
        selectedFrame={'https://edition.cnn.com'}
      />
    );
    const firstFrame = screen.getByTestId('https://edition.cnn.com');
    const secondFrame = screen.getByTestId('https://crxd.net');

    expect(firstFrame).toHaveClass('bg-selected-background-color');
    expect(secondFrame).not.toHaveClass('bg-selected-background-color');

    //click on second frame
    fireEvent.click(secondFrame);
    renderedAccordion.rerender(
      <Accordion
        accordionState={false}
        setAccordionState={() => undefined}
        tabName={'Cookies'}
        index={1}
        selectedIndex={1}
        tabFrames={{
          'https://edition.cnn.com': { frameIds: [1] },
          'https://crxd.net': { frameIds: [2] },
          'https://pubmatic.com': { frameIds: [3] },
        }}
        setSelectedFrame={() => undefined}
        selectedFrame={'https://crxd.net'}
      />
    );

    expect(firstFrame).not.toHaveClass('bg-selected-background-color');
    expect(secondFrame).toHaveClass('bg-selected-background-color');
  });
});
