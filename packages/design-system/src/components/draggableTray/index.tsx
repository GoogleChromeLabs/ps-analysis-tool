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
import { Resizable } from 're-resizable';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

/**
 * Internal dependencies.
 */
import { useTabs } from '../tabs/useTabs';
import { DoubleDownArrow } from '../../icons';
import Tabs from '../tabs';
import { usePersistentTray } from '../resizableTray';

interface DraggableTrayProps {
  initialCollapsed?: boolean;
  trayId?: string;
  defaultHeight?: string;
}

const DraggableTray = forwardRef<
  {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  },
  DraggableTrayProps
>(function DraggableTray(
  {
    initialCollapsed = false,
    trayId,
    defaultHeight = '30%',
  }: DraggableTrayProps,
  ref
) {
  const { panel, activeTab } = useTabs(({ state }) => ({
    panel: state.panel,
    activeTab: state.activeTab,
  }));
  const ActiveTabContent = panel.Element;
  const props = panel.props;

  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const { height, setHeight, onResizeStop } = usePersistentTray(trayId, {
    height: defaultHeight,
  });

  useEffect(() => {
    setIsCollapsed(false);
  }, [activeTab]);

  useEffect(() => {
    if (!isCollapsed) {
      setHeight(defaultHeight);
    }
  }, [defaultHeight, isCollapsed, setHeight]);

  useImperativeHandle(
    ref,
    () => ({
      isCollapsed,
      setIsCollapsed,
    }),
    [isCollapsed]
  );

  return (
    <Resizable
      defaultSize={{
        width: '100%',
        height: defaultHeight,
      }}
      onResizeStop={onResizeStop}
      size={{
        width: '100%',
        height: isCollapsed ? '30px' : height,
      }}
      minHeight="30px"
      maxHeight="95%"
      enable={{
        top: !isCollapsed,
      }}
    >
      <div className="w-full h-full flex flex-col">
        <div className="bg-sky-100 dark:bg-sky-900 h-fit flex justify-between items-center">
          <div className="pt-1.5 w-full">
            <Tabs showBottomBorder={false} fontSizeClass="text-xs" />
          </div>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="px-2">
            <DoubleDownArrow
              className={`text-raisin-black dark:text-bright-gray ${
                isCollapsed ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
        </div>
        <div
          style={{
            height: isCollapsed ? '0px' : 'calc(100% - 30px)',
          }}
        >
          {ActiveTabContent && <ActiveTabContent {...props} />}
        </div>
      </div>
    </Resizable>
  );
});

export default DraggableTray;
