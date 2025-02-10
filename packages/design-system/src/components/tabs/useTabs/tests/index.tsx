/*
 * Copyright 2024 Google LLC
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
 * External dependencies
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

/*
 * Internal dependencies
 */
import { TabsProvider } from '../provider';
import { useTabs } from '../useTabs';

const customRender = (options?: any) => {
  return render(
    <TabsProvider {...options}>
      <TestingComponent />
    </TabsProvider>
  );
};

const TestingComponent = () => {
  const { activeTab, setActiveTab, titles, highlightTab, isTabHighlighted } =
    useTabs(({ state, actions }) => ({
      activeTab: state.activeTab,
      setActiveTab: actions.setActiveTab,
      titles: state.titles,
      highlightTab: actions.highlightTab,
      isTabHighlighted: actions.isTabHighlighted,
    }));

  return (
    <div>
      <button onClick={() => setActiveTab(0)}>select title1</button>
      <button onClick={() => setActiveTab(1)}>select title2</button>
      <button onClick={() => highlightTab(0, 1)}>highlight tab 1</button>
      <button onClick={() => highlightTab(0, true, true)}>
        increment tab 1
      </button>
      <button onClick={() => highlightTab(1, 99)}>highlight tab 2</button>
      <button onClick={() => highlightTab(1)}>highlight 2 without count</button>

      {titles.map((title, index) => {
        const isHighlighted = isTabHighlighted(index);
        const isNumber = typeof isHighlighted === 'number';
        const count = isNumber
          ? isHighlighted > 9
            ? '9+'
            : isHighlighted
          : isHighlighted
          ? 'placeholder' + index
          : 'empty' + index;

        return (
          <>
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={activeTab === index ? 'border-b-2' : ''}
            >
              {title}
            </button>
            <p>{count}</p>
          </>
        );
      })}
    </div>
  );
};

describe('useTabs', () => {
  it('should render tabs context provider, with tabs navigation and highlight functionality', () => {
    const items = [
      { title: 'title1', content: 'content1' },
      { title: 'title2', content: 'content2' },
    ];

    customRender({ items });

    const title1 = screen.getByText('title1');
    const title2 = screen.getByText('title2');

    expect(title1).toBeInTheDocument();
    expect(title2).toBeInTheDocument();

    // Click on the second tab
    fireEvent.click(screen.getByText('select title2'));
    expect(title2).toHaveClass('border-b-2');

    // Highlight the first tab with a count of 1
    fireEvent.click(screen.getByText('highlight tab 1'));
    expect(screen.getByText('1')).toBeInTheDocument();

    // Increment the count of the first tab
    fireEvent.click(screen.getByText('increment tab 1'));
    expect(screen.getByText('2')).toBeInTheDocument();

    // select the first tab and count should be empty
    fireEvent.click(screen.getByText('select title1'));
    expect(screen.getByText('title1')).toHaveClass('border-b-2');
    expect(screen.getByText('empty0')).toBeInTheDocument();

    // Highlight the second tab with a count of 99, which should be 9+
    fireEvent.click(screen.getByText('highlight tab 2'));
    expect(screen.getByText('9+')).toBeInTheDocument();

    // Highlight the second tab without a count
    fireEvent.click(screen.getByText('highlight 2 without count'));
    expect(screen.getByText('placeholder1')).toBeInTheDocument();
  });
});
