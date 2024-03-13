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

interface DetectionMessageProps {
  libraryName: string;
  provider: string;
  supportURL: string;
}

const DetectionMessage = ({
  libraryName,
  provider,
  supportURL,
}: DetectionMessageProps) => {
  return (
    <p className="dark:text-bright-gray">
      {libraryName} functionality may not work properly due to the phaseout of
      third-party cookies. For more information, please visit the
      {provider + ' '}
      <a
        target="_blank"
        className="text-bright-navy-blue dark:text-jordy-blue"
        href={supportURL}
        rel="noreferrer"
      >
        support forum
      </a>
      .
    </p>
  );
};

export default DetectionMessage;
