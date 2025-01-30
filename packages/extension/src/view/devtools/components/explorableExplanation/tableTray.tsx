/*
 * Copyright 2024 Google LLC
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
import { DoubleDownArrow, Tabs, useTabs } from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import React, { useState } from 'react';

interface TableTrayProps {
  initialCollapsed?: boolean;
}

const TableTray = ({ initialCollapsed = false }: TableTrayProps) => {
  const { panel } = useTabs(({ state }) => ({ panel: state.panel }));
  const ActiveTabContent = panel.Element;
  const props = panel.props;

  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  return (
    <Resizable
      defaultSize={{
        width: '100%',
        height: '20%',
      }}
      size={
        isCollapsed
          ? {
              width: '100%',
              height: '30px',
            }
          : undefined
      }
      minHeight="30px"
      maxHeight="95%"
      enable={{
        top: !isCollapsed,
      }}
    >
      <div className="w-full h-full flex flex-col">
        <div className="bg-sky-100 dark:bg-sky-900 h-fit flex justify-between items-center">
          <div className="pt-1.5">
            <Tabs showBottomBorder={false} fontSizeClass="text-xs" />
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="pr-2">
            <DoubleDownArrow
              className={isCollapsed ? 'rotate-180' : 'rotate-0'}
            />
          </button>
        </div>
        {!isCollapsed && ActiveTabContent && <ActiveTabContent {...props} />}
      </div>
    </Resizable>
  );
};

export default TableTray;
