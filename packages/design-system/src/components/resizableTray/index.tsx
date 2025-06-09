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
import { Resizable, type ResizableProps } from 're-resizable';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import { getSessionStorage, updateSessionStorage } from '@google-psat/common';

interface ResizableTrayProps extends ResizableProps {
  trayId?: string; // If not provided, the tray height will not be persisted.
}

const STORAGE_KEY = 'persistent-tray';

export const usePersistentTray = (
  trayId?: string,
  defaultSize?: ResizableProps['defaultSize']
) => {
  const [height, setHeight] = useState<string | undefined>(
    typeof defaultSize?.height === 'number'
      ? `${defaultSize.height}px`
      : defaultSize?.height
  );

  const storageLoaded = useRef(false);
  useEffect(() => {
    const initializeHeight = async () => {
      if (storageLoaded.current || !trayId) {
        return;
      }
      const data = (await getSessionStorage(STORAGE_KEY)) || {};
      if (data[trayId]?.height) {
        setHeight(data[trayId].height);
      }
      storageLoaded.current = true;
    };
    initializeHeight();

    return () => {
      storageLoaded.current = false;
    };
  }, [trayId]);

  useEffect(() => {
    if (storageLoaded.current && trayId) {
      updateSessionStorage({ [trayId]: { height } }, STORAGE_KEY);
    }
  }, [height, trayId]);

  const onResizeStop: ResizableProps['onResizeStop'] = (_, __, divRef) => {
    setHeight(() => `${(divRef as HTMLDivElement).clientHeight}px`);
  };

  return { height, setHeight, onResizeStop };
};

const ResizableTray = (props: ResizableTrayProps) => {
  const { trayId, ...rest } = props;
  const { height, onResizeStop } = usePersistentTray(trayId, rest.defaultSize);

  if (!trayId) {
    return <Resizable {...rest} />;
  }

  return (
    <Resizable
      {...rest}
      onResizeStop={(_, __, divRef, delta) => {
        onResizeStop?.(_, __, divRef, delta);
        rest.onResizeStop?.(_, __, divRef, delta);
      }}
      size={{
        ...rest.size,
        height: height || rest.defaultSize?.height,
      }}
    />
  );
};

export default ResizableTray;
