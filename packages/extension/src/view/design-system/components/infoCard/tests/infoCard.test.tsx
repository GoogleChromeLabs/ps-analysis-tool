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
import '@testing-library/jest-dom';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import { fireEvent, render, screen } from '@testing-library/react';
import InfoCard from '..';
import { PSInfoKey } from '../../../../../utils/fetchPSInfo';
//@ts-ignore
// eslint-disable-next-line import/no-unresolved
import PSInfo from 'ps-analysis-tool/data/PSInfo.json';

describe('should match the json file data with the component', () => {
  const tests = Object.values(PSInfoKey).map((infoKey) => {
    return {
      input: infoKey,
      output: PSInfo[infoKey],
    };
  });

  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            ...PSInfo,
          }),
        text: () => Promise.resolve({}),
      });
    } as unknown as typeof fetch;
  });

  test.each(tests)(
    'should match component with enum key prop to json data',
    async ({ input, output }) => {
      render(<InfoCard infoKey={input} />);

      const learnMoreButton = await screen.findByText('Learn more');
      fireEvent.click(learnMoreButton);

      const closeButton = await screen.findByText('Close');
      expect(closeButton).toBeInTheDocument();

      if (output.proposal) {
        const proposal = (await screen.findByText('Proposal')).nextSibling;
        expect(proposal).toHaveAttribute('href', output.proposal);
      }

      if (output.publicDiscussion) {
        const publicDiscussion = (await screen.findByText('Public Discussion'))
          .nextSibling;
        expect(publicDiscussion).toHaveAttribute(
          'href',
          output.publicDiscussion
        );
      }

      if (output.videoOverview) {
        const videoOverview = (await screen.findByText('Video Overview'))
          .nextSibling;
        expect(videoOverview).toHaveAttribute('href', output.videoOverview);
      }

      if (output.devDocumentation) {
        const devDocumentation = (await screen.findByText('Dev Documentation'))
          .nextSibling;
        expect(devDocumentation).toHaveAttribute(
          'href',
          output.devDocumentation
        );
      }
    }
  );

  afterAll(() => {
    globalThis.chrome = undefined as unknown as typeof chrome;
    globalThis.fetch = undefined as unknown as typeof fetch;
  });
});
