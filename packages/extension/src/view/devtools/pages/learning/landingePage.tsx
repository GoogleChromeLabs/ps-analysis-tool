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
 * External dependencies.
 */
import React, { type FunctionComponent, type SVGProps } from 'react';
import { SIDEBAR_ITEMS_KEYS, FrameContent } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { LEARNING_BOX_ITEMS } from '../constants';

export interface FeaturedItems {
  name: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  sidebarKey: SIDEBAR_ITEMS_KEYS;
  title?: string;
  description: string;
  colorClasses?: {
    heading: string;
  };
}

interface LandingPageProps {
  sidebarKey: SIDEBAR_ITEMS_KEYS;
  icon: React.ReactNode;
  frameColor?: string;
}

const LandingPage = ({ sidebarKey, icon, frameColor }: LandingPageProps) => {
  const page = LEARNING_BOX_ITEMS.find(
    (item) => item.sidebarKey === sidebarKey
  ) as FeaturedItems;
  const { description, title } = page;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[400px] min-w-[400px] h-[450px] lg:w-[800px] lg:min-w-[600px] lg:h-[400px] overflow-hidden flex justify-center items-center p-8">
        <FrameContent color={frameColor}>
          <div className="text-center flex flex-col items-center gap-2 text-raisin-black dark:text-bright-gray">
            <div className="mb-3 lg:mb-5 scale-75 lg:scale-100">{icon}</div>
            {title && (
              <h3 className="font-semibold text-xl lg:text-2xl">{title}</h3>
            )}
            {description && (
              <p className=" p-b-2 m-b-1 text-sm lg:text-base">{description}</p>
            )}
          </div>
        </FrameContent>
      </div>
    </div>
  );
};

export default LandingPage;
