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

export type CookiesLandingSection = {
  name: string;
  link: string;
  panel: {
    Element: ((props: any) => React.JSX.Element) | React.NamedExoticComponent;
    props?: Record<string, unknown>;
  };
};

interface CookiesLandingProps {
  children?: React.ReactNode;
}

const CookiesLanding = ({ children }: CookiesLandingProps) => {
  return (
    <div
      className="h-full w-full flex flex-col min-w-[40rem]"
      data-testid="cookies-landing"
    >
      {children}
    </div>
  );
};

export default CookiesLanding;
