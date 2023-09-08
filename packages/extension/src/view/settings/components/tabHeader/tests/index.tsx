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
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import TabHeader from '..';
import TABS from '../../../tabs';
describe('TabHeader', () => {
  it('Should render without issue.', async () => {
    act(() =>
      render(
        <TabHeader
          tabs={TABS.map((tab) => tab.display_name)}
          selectedTabIndex={0}
          setSelectedTabIndex={() => undefined}
        />
      )
    );
    expect(await screen.findByText('Settings')).toBeInTheDocument();
  });
  it('Should render without issue.', () => {
    const setSelectedIndexMock = jest.fn();
    act(() =>
      render(
        <TabHeader
          tabs={TABS.map((tab) => tab.display_name)}
          selectedTabIndex={0}
          setSelectedTabIndex={setSelectedIndexMock}
        />
      )
    );
    fireEvent.click(screen.getByText('Settings'));
    expect(setSelectedIndexMock).toHaveBeenCalled();
  });
});
