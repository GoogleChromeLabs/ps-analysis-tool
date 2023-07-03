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

/**
 * Internal dependencies.
 */
import { PSInfoKey } from '../types';
import PSInfo from '../PSInfo.json';
import { fireEvent, render, screen } from '@testing-library/react';
import InfoCard from '..';

const tests = Object.values(PSInfoKey).map((infoType) => {
  return {
    input: infoType,
    output: PSInfo[infoType],
  };
});

describe('should match the json file data with the component', () => {
  test.each(tests)(
    'should match component with enum key prop to json data',
    ({ input, output }) => {
      render(<InfoCard infoType={input} />);

      const name = screen.getByText(output.name);
      expect(name).toBeInTheDocument();

      const learnMoreButton = screen.getByText('Learn more');
      fireEvent.click(learnMoreButton);

      const closeButton = screen.getByText('Close');
      expect(closeButton).toBeInTheDocument();

      if (output.proposal) {
        const proposal = screen.getByText('Proposal').nextSibling;
        expect(proposal).toHaveAttribute('href', output.proposal);
      }

      if (output.publicDiscussion) {
        const publicDiscussion =
          screen.getByText('Public Discussion').nextSibling;
        expect(publicDiscussion).toHaveAttribute(
          'href',
          output.publicDiscussion
        );
      }

      if (output.videoOverview) {
        const videoOverview = screen.getByText('Video Overview').nextSibling;
        expect(videoOverview).toHaveAttribute('href', output.videoOverview);
      }

      if (output.devDocumentation) {
        const devDocumentation =
          screen.getByText('Dev Documentation').nextSibling;
        expect(devDocumentation).toHaveAttribute(
          'href',
          output.devDocumentation
        );
      }
    }
  );
});
