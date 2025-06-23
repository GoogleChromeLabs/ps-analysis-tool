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
import { WarningColored, Error } from '@google-psat/design-system';
import classNames from 'classnames';
import { useState } from 'react';

type SingleErrorRowProps = {
  type: 'WARNING' | 'ERROR' | 'INFO';
  message: string;
  time: string;
  additionalClasses?: string;
};

const SingleErrorRow = ({
  type,
  message,
  time,
  additionalClasses,
}: SingleErrorRowProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`flex flex-row items-start gap-2 text-raisin-black dark:text-bright-gray mx-[3px] ${additionalClasses}`}
      key={time}
    >
      <p className="flex items-center justify-center">
        {type === 'ERROR' ? <Error /> : <WarningColored />}
      </p>
      <p>{time}:</p>
      <p
        className={classNames({
          truncate: !expanded,
        })}
        onClick={() => setExpanded(!expanded)}
      >
        {message}
      </p>
    </div>
  );
};

export default SingleErrorRow;
