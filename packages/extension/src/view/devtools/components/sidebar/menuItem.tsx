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
import React, { type ComponentType, type SVGProps } from 'react';

/**
 * Internal dependencies.
 */
import {
  AttributionIcon,
  AttributionIconWhite,
  BounceTrackingIcon,
  BounceTrackingIconWhite,
  FingerPrintingIcon,
  FingerPrintingIconWhite,
  TopicsIcon,
  TopicsIconWhite,
} from '../../../../icons';

interface MenuItemProps {
  handleClick: () => void;
  name: string;
  isActive: boolean;
}

interface Icons {
  [name: string]: {
    default: ComponentType<SVGProps<SVGSVGElement>>;
    selected: ComponentType<SVGProps<SVGSVGElement>>;
  };
}

const MenuItem = ({ handleClick, name, isActive }: MenuItemProps) => {
  const icons: Icons = {
    Topics: {
      default: TopicsIcon,
      selected: TopicsIconWhite,
    },
    Attribution: {
      default: AttributionIcon,
      selected: AttributionIconWhite,
    },
    Fingerprinting: {
      default: FingerPrintingIcon,
      selected: FingerPrintingIconWhite,
    },
    'Bounce Tracking': {
      default: BounceTrackingIcon,
      selected: BounceTrackingIconWhite,
    },
  };

  const Icon = isActive ? icons[name].selected : icons[name].default;

  return (
    <div className="flex w-full items-center pl-6 py-0.5" onClick={handleClick}>
      <div className="h-3">
        <Icon />
      </div>
      <div className="block">
        <span className="pl-2.5">{name}</span>
      </div>
    </div>
  );
};

export default MenuItem;
