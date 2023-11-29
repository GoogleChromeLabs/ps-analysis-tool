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
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import TopicsList from '../topicsList';

let activeTabUrl: string;
const expectedTopicsListOne = [
  'Arts & Entertainment',
  'Autos & Vehicles',
  'Business & Industrial',
];
const expectedTopicsListTwo = [
  'Finance',
  'Games',
  'Hobbies & Leisure',
  'Home & Garden',
];

describe('Topics List', () => {
  beforeAll(() => {
    globalThis.chrome = {
      devtools: {
        inspectedWindow: {
          // @ts-ignore
          eval: jest.fn((code, callback) => {
            // @ts-ignore
            callback(activeTabUrl, false);
          }),
        },
      },
      storage: {
        local: {
          // @ts-ignore
          get: () => {
            return {
              'https://example.com': {
                topics: () => {
                  return expectedTopicsListOne;
                },
              },
              'https://domain.com': {
                topics: () => {
                  return expectedTopicsListTwo;
                },
              },
            };
          },
        },
      },
    };
  });

  it('should render topics correctly', async () => {
    activeTabUrl = 'https://example.com';
    await act(() => render(<TopicsList />));

    expectedTopicsListOne.forEach((topic) => {
      expect(screen.getByText(topic)).toBeInTheDocument();
    });

    activeTabUrl = 'https://domain.com';
    await act(() => render(<TopicsList />));

    expectedTopicsListTwo.forEach((topic) => {
      expect(screen.getByText(topic)).toBeInTheDocument();
    });
  });

  it('should not render topics', async () => {
    activeTabUrl = '';
    await act(() => render(<TopicsList />));

    expect(
      screen.getByText('No topics found on this page.')
    ).toBeInTheDocument();
  });

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
  });
});
