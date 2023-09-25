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
import classNames from 'classnames';

interface AccordionChildrenProps {
  accordionMenuItemName: string;
  defaultIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  isTabFocused: boolean;
  isAccordionChildSelected: boolean;
  selectedIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  titleForMenuItem: string;
  onAccordionChildClick: () => void;
}

const AccordionChildren: React.FC<AccordionChildrenProps> = ({
  accordionMenuItemName,
  defaultIcon,
  isTabFocused,
  isAccordionChildSelected,
  selectedIcon,
  titleForMenuItem,
  onAccordionChildClick,
}) => {
  const DefaultIcon = defaultIcon;
  const SelectedIcon = selectedIcon;
  return (
    <div
      tabIndex={0}
      data-testid={accordionMenuItemName}
      onClick={onAccordionChildClick}
      role="treeitem"
      className={classNames(
        'pl-9 py-0.5 h-5 flex items-center cursor-default outline-0 dark:text-bright-gray',
        isAccordionChildSelected &&
          (isTabFocused
            ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
            : 'bg-gainsboro dark:bg-outer-space')
      )}
    >
      <div className="h-4 flex items-center">
        {isAccordionChildSelected && isTabFocused ? (
          <SelectedIcon />
        ) : (
          <DefaultIcon />
        )}
      </div>
      <p className="pl-1.5 whitespace-nowrap" title={titleForMenuItem}>
        {accordionMenuItemName}
      </p>
    </div>
  );
};

export default AccordionChildren;
