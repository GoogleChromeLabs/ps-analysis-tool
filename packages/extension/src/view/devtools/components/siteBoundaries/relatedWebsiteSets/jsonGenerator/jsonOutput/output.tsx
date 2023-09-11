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
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

/**
 * Internal dependencies.
 */
import type {
  OtherWellKnownOutputType,
  PrimaryWellKnownOutputType,
} from '../types';

interface OutputProps {
  data: PrimaryWellKnownOutputType | OtherWellKnownOutputType | null;
}

const Output = ({ data }: OutputProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <pre className="bg-anti-flash-white dark:bg-davys-grey p-2 rounded-md">
      <CopyToClipboard
        text={JSON.stringify(data, null, 2)}
        onCopy={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <button className="float-right">{copied ? 'Copied!' : 'Copy'}</button>
      </CopyToClipboard>
      <code data-testid="rws-output">
        {data && JSON.stringify(data, null, 2)}
      </code>
    </pre>
  );
};

export default Output;
