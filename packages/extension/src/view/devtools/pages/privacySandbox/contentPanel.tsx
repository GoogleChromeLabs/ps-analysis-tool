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
import React from 'react';
import { PrivacySandboxColoredIcon } from '@google-psat/design-system';
import { Resizable } from 're-resizable';

const ContentPanel = () => {
  return (
    <div
      data-testid="privacy-sandbox-content"
      className="text-raisin-black dark:text-bright-gray min-h-[70vh] flex items-center justify-center"
    >
      <Resizable
        defaultSize={{
          height: 500,
        }}
        enable={{
          bottom: true,
        }}
        minHeight={350}
        className="flex items-center h-full w-full justify-center py-10"
      >
        <section className="flex justify-center">
          <div className="max-w-(--breakpoint-md) text-center">
            <PrivacySandboxColoredIcon
              width="120"
              height="120"
              className="inline-block mb-5"
            />
            <h2 className="text-5xl mb-5 font-semibold">
              Protecting your privacy online
            </h2>
            <p className="text-base">
              The Privacy Sandbox initiative aims to create technologies that
              both protect people&apos;s privacy online and give companies and
              developers tools to build thriving digital businesses. The Privacy
              Sandbox reduces cross-site and cross-app tracking while helping to
              keep online content and services free for all.
            </p>
          </div>
        </section>
      </Resizable>
    </div>
  );
};

export default ContentPanel;
