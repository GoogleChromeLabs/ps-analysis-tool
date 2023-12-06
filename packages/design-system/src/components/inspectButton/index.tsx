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
import { InspectActiveIcon, InspectIcon, InspectWhiteIcon } from '../../icons';

interface InspectButtonProps {
  isInspecting: boolean;
  setIsInspecting: React.Dispatch<React.SetStateAction<boolean>>;
  isTabFocused: boolean;
}

const InspectButton = ({
  isInspecting,
  setIsInspecting,
  isTabFocused,
}: InspectButtonProps) => {
  const InactiveInspectIcon = isTabFocused ? InspectWhiteIcon : InspectIcon;

  return (
    <span
      title="Hover over the iframes on the page or select frames below to inspect them."
      onClick={() => {
        setIsInspecting(!isInspecting);
      }}
    >
      {isInspecting ? <InspectActiveIcon /> : <InactiveInspectIcon />}
    </span>
  );
};

export default InspectButton;
