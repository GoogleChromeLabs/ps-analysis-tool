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
 * External dependencies
 */
import React, { act } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TopicsClassifier from '..';

describe('Topics UI Classifier', () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  const fetchMock = jest.fn();
  beforeAll(() => {
    global.fetch = fetchMock;
  });

  afterAll(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  test('Should validate website URLs correctly', async () => {
    const { getByPlaceholderText, getByText } = render(<TopicsClassifier />);

    const inputElement = getByPlaceholderText(/One host per line/i);
    fireEvent.change(inputElement, {
      target: { value: 'google.com\ninvalid_url' },
    });

    const classifyButton = getByText(/Classify/i);
    fireEvent.click(classifyButton);
    const invalidUrlError = await screen.findByText(
      'Host "invalid_url" is invalid.'
    );

    expect(invalidUrlError).toBeDefined();
  });

  test('Should handle invalid URLs gracefully', async () => {
    const { getByPlaceholderText, getByText } = render(<TopicsClassifier />);

    const inputElement = getByPlaceholderText(/One host per line/i);
    fireEvent.change(inputElement, {
      target: { value: 'google.com\ninvalid_url' },
    });

    const classifyButton = getByText(/Classify/i);
    fireEvent.click(classifyButton);

    const invalidUrlError = await screen.findByText(
      'Host "invalid_url" is invalid.'
    );

    expect(invalidUrlError).toBeDefined();
  });

  test('Should classify websites correctly', async () => {
    fetchMock.mockResolvedValueOnce({
      json: () =>
        Promise.resolve([
          {
            domain: 'google.com',
            categories: ['Category1'],
          },
          {
            domain: 'yahoo.com',
            categories: ['Category2'],
          },
        ]),
      ok: true,
    });

    const { getByPlaceholderText, getByText } = await act(() =>
      render(<TopicsClassifier />)
    );

    const inputElement = getByPlaceholderText(/One host per line/i);
    fireEvent.change(inputElement, {
      target: { value: 'google.com\nyahoo.com' },
    });

    const classifyButton = getByText(/Classify/i);
    fireEvent.click(classifyButton);
    const hosts = ['google.com', 'yahoo.com'];

    await Promise.all(
      hosts.map(async (host) => {
        const definedHosts = await screen.findAllByText(host);
        expect(definedHosts[0]).toBeDefined();
      })
    );

    const categories = ['Category1', 'Category2'];
    await Promise.all(
      categories.map(async (category) => {
        const definedCateogry = await screen.findByText(category);
        expect(definedCateogry).toBeDefined();
      })
    );
  });

  test('Should handle classification errors gracefully', async () => {
    fetchMock.mockRejectedValue(new Error('Failed to classify websites'));

    const { getByPlaceholderText, getByText } = render(<TopicsClassifier />);

    const inputElement = getByPlaceholderText(/One host per line/i);
    fireEvent.change(inputElement, { target: { value: 'google.com' } });

    const classifyButton = getByText(/Classify/i);
    fireEvent.click(classifyButton);

    expect(
      await screen.findByText(/Error: Failed to classify websites/i)
    ).toBeDefined();
  });

  test('Should handle network errors gracefully', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));

    const { getByPlaceholderText, getByText } = render(<TopicsClassifier />);

    const inputElement = getByPlaceholderText(/One host per line/i);
    fireEvent.change(inputElement, { target: { value: 'google.com' } });

    const classifyButton = getByText(/Classify/i);
    fireEvent.click(classifyButton);

    expect(
      await screen.findByText(/Error: Failed to classify websites/i)
    ).toBeDefined();
  });
});
