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
import userEvent from '@testing-library/user-event';
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
        index={1}
        isTabFocused={true}
        isAccordionHeaderSelected={true}
        tabId="cookies"
        keyboardNavigator={() => undefined}
        tabName={'Cookies'}
        onAccordionHeaderClick={() => undefined}
        onAccordionOpenerClick={() => undefined}
      />
    );
    const container = screen.getByTestId('cookies-tab-heading-wrapper');

    expect(container).toHaveClass('bg-royal-blue');
  });

  it('should call keyboard navigator function.', () => {
    const keyboardNavigatorMock = jest.fn();
    render(
      <Accordion
        accordionState={true}
        index={1}
        isTabFocused={true}
        isAccordionHeaderSelected={true}
        tabId="cookies"
        keyboardNavigator={keyboardNavigatorMock}
        tabName={'Cookies'}
        onAccordionHeaderClick={() => undefined}
        onAccordionOpenerClick={() => undefined}
      />
    );
    userEvent.tab();
    userEvent.keyboard('{ArrowDown}');
    expect(keyboardNavigatorMock).toHaveBeenCalled();
  });
});
