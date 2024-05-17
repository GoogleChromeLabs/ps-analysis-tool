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
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import AccordionHeading from './accordionHeading';
import AccordionContent from './accordionContent';

interface AccordionProps {
  children: React.ReactNode;
  title: string;
  isLoading?: boolean;
  featuresText?: string;
}

const Accordion = ({
  children,
  title,
  isLoading = false,
  featuresText = '',
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const parentClass = classNames(
    {
      relative: true,
    },
    'hover:opacity-90 hover:bg-[#f5f5f5] hover:dark:bg-[#1d1d1d]'
  );

  return (
    <div className={parentClass} data-testid="library-detection-accordion">
      <AccordionHeading
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        loading={isLoading}
        title={title}
        featuresText={featuresText}
      />
      <AccordionContent isOpen={isOpen}>{children}</AccordionContent>
    </div>
  );
};

export default Accordion;
