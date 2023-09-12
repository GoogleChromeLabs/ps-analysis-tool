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
import React, { useCallback, useEffect, useRef } from 'react';

/**
 * Internal dependencies.
 */
import type {
  OtherWellKnownOutputType,
  PrimaryWellKnownOutputType,
} from '../types';
import PrimaryDomainOutput from './primaryDomainOutput';
import OtherDomainOutput from './otherDomainOutput';
import PullRequestOutput from './pullRequestOutput';

interface JsonOutputProps {
  primaryWellKnownOutput: PrimaryWellKnownOutputType | null;
  otherWellKnownOutput: OtherWellKnownOutputType | null;
}

const JsonOutput = ({
  primaryWellKnownOutput,
  otherWellKnownOutput,
}: JsonOutputProps) => {
  const resultContainer = useRef(null);

  const scrollToResult = useCallback(() => {
    const resultContainerElement = resultContainer.current;

    if (resultContainerElement) {
      (resultContainerElement as HTMLElement).scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [resultContainer]);

  useEffect(() => {
    scrollToResult();
  }, [primaryWellKnownOutput, otherWellKnownOutput, scrollToResult]);

  return (
    <div ref={resultContainer}>
      {primaryWellKnownOutput && otherWellKnownOutput && (
        <div className="mt-6 divide-y divide-american-silver">
          <h4 className="text-lg my-4 font-semibold">
            Here are your JSON resources:
            <br />
            <span className="text-xs font-normal">
              Please follow the steps below to submit your Related Website Set
              to the canonical list.
            </span>
          </h4>
          <PrimaryDomainOutput
            primaryWellKnownOutput={primaryWellKnownOutput}
          />
          <OtherDomainOutput
            primaryWellKnownOutput={primaryWellKnownOutput}
            otherWellKnownOutput={otherWellKnownOutput}
          />
          <PullRequestOutput primaryWellKnownOutput={primaryWellKnownOutput} />
        </div>
      )}
    </div>
  );
};

export default JsonOutput;
