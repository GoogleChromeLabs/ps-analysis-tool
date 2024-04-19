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
import { ArrowRight, Button } from '@ps-analysis-tool/design-system';
import { I18n } from '@ps-analysis-tool/i18n';

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
    <>
      {primaryWellKnownOutput && otherWellKnownOutput && (
        <div
          ref={resultContainer}
          className="mt-6 divide-y divide-american-silver dark:divide-quartz"
        >
          <h4 className="text-lg my-4 font-semibold">
            {I18n.getMessage('rWSJSONHeading')}:
            <br />
            <span className="text-sm font-normal">
              {I18n.getMessage('followInstructions', ['Related Website Set'])}
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
          <div className="flex justify-between items-center py-4">
            <a
              title="https://github.com/GoogleChrome/related-website-sets/pulls"
              href="https://github.com/GoogleChrome/related-website-sets/pulls"
              target="_blank"
              rel="noreferrer"
            >
              <Button text={I18n.getMessage('createPR')} />
            </a>
            <a
              title="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork"
              href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                text={
                  <>
                    {I18n.getMessage('pRGuide')}
                    <span className="w-4 h-4 ml-2 inline-block">
                      <ArrowRight />
                    </span>
                  </>
                }
                variant="secondary"
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default JsonOutput;
