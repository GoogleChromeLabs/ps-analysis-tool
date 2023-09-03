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

/**
 * Internal dependencies.
 */
// eslint-disable-next-line import/no-relative-packages
import UnderContruction from '../../../../../../../third_party/icons/under-construction.svg';

interface UnderContstructionBannerProps {
  text: string;
}
const UnderContstructionBanner = ({ text }: UnderContstructionBannerProps) => {
  return (
    <div className="bg-tertiary dark:hsl-dark p-4 mb-5 mt-10 mx-3 rounded-md leading-5 max-w-2xl flex">
      <UnderContruction className="mr-2" />
      <p className="text-raisin-black dark:text-warning-orange">{text}</p>
    </div>
  );
};

export default UnderContstructionBanner;
