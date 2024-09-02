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
import { PrivacySandboxColoredIcon } from '@google-psat/design-system';

const PrivacySandbox = () => (
  <div data-testid="privacy-sandbox-content" className="h-full w-full">
    <div className="p-5">
      <header className="flex">
        <PrivacySandboxColoredIcon width="30" height="30" className="mr-1.5" />
        <h1 className="text-xl">Privacy Sandbox</h1>
      </header>
      <section className="flex justify-center pt-5">
        <div className="max-w-screen-md text-center">
          <PrivacySandboxColoredIcon
            width="112"
            height="112"
            className="inline-block mb-5"
          />
          <h2 className="text-6xl mb-5 font-semibold">
            Protecting your privacy online
          </h2>
          <p className="text-lg">
            The Privacy Sandbox initiative aims to create technologies that both
            protect people&apos;s privacy online and give companies and
            developers tools to build thriving digital businesses. The Privacy
            Sandbox reduces cross-site and cross-app tracking while helping to
            keep online content and services free for all.
          </p>
          <div className="flex gap-1">
            <button className="bg-cultured-grey py-2 px-4 rounded border border-dark-grey text-xl">
              Learn About Privacy Sandbox
            </button>
            <button className="bg-cultured-grey py-2 px-4 rounded border border-dark-grey text-xl">
              Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default PrivacySandbox;
