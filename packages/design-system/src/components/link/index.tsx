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
import React, { useCallback } from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  stopPropogation?: boolean;
  children: React.ReactElement | string;
}

const Link = ({
  href,
  children,
  stopPropogation = false,
  ...rest
}: LinkProps) => {
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      if (stopPropogation) {
        event.stopPropagation();
      }

      chrome.tabs.update({ url: href });
    },
    [href]
  );

  return (
    <a
      onClick={onClick}
      href={href}
      className="text-bright-navy-blue"
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
