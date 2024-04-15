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
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies.
 */
import App from '../app';
import { Provider as ExternalStoreProvider } from '../stateProviders/cookie';

const meta: Meta<typeof App> = {
  title: 'Extension/Popup/Page',
  component: App,
  tags: ['autodocs'],
};

export default meta;

const dummyData = {
  '2141247110': {
    cookies: {
      '1P_JAR': {
        analytics: {
          category: 'Marketing',
        },
        isFirstParty: false,
        parsedCookie: {
          domain: '.google.com',
        },
        url: 'https://www.google.com/recaptcha/api2/aframe',
      },
      APC: {
        analytics: {
          category: '',
        },
        isFirstParty: false,
        parsedCookie: {
          domain: 'doubleclick.net',
        },
        url: 'https://googleads.g.doubleclick.net/pagead/interaction/?ai=&sigh=BpnfxIaauQU&cid=CAQSTgBpAlJWJhG957iiPQM-u9Qi61mWPR6eFTTarfv0pqg0yxpObU1_f5mCWO4La9fQkQf2SlgLdpmUB0N0XlWgQmSnfEk9qN-Hfek6Nz3Jgg&label=window_focus&gqid&qqid=COK0kMOX24ADFZKjZgIdQBMBDQ&fg=1',
      },
      AWSALB: {
        analytics: {
          category: 'Functional',
        },
        isFirstParty: false,
        parsedCookie: {
          domain: '.dotmetrics.net',
        },
        url: 'https://uk-script.dotmetrics.net/BeaconEvent.dotmetrics?1691982913096',
      },
      AWSALBCORS: {
        analytics: {
          category: 'Functional',
        },
        isFirstParty: false,
        parsedCookie: {
          domain: 'uk-script.dotmetrics.net',
        },
        url: 'https://uk-script.dotmetrics.net/BeaconEvent.dotmetrics?1691982913096',
      },
      AWSALBTG: {
        analytics: {
          category: 'Functional',
        },
        isFirstParty: false,
        parsedCookie: {
          domain: '.the-ozone-project.com',
        },
        url: 'https://elb.the-ozone-project.com/cookie_sync',
      },
      AWSALBTGCORS: {
        analytics: {
          category: 'Functional',
        },
        isFirstParty: false,
        parsedCookie: {
          domain: 'elb.the-ozone-project.com',
        },
        url: 'https://elb.the-ozone-project.com/cookie_sync',
      },
    },
  },
};

const withExternalStoreProvider = () => {
  // @todo Try to use sinon-chrome to mock the chrome API.
  window.chrome = {
    /* eslint-disable @typescript-eslint/no-empty-function */
    storage: {
      local: {
        // @ts-ignore
        onChanged: {
          addListener: () => {},
          removeListener: () => {},
        },
        // @ts-ignore
        get() {
          return dummyData;
        },
      },
    },
    tabs: {
      // @ts-ignore
      onUpdated: {
        addListener: () => {},
        removeListener: () => {},
      },
      // @ts-ignore
      query() {
        return [
          {
            id: '2141247110',
            url: 'www.bbc.com',
          },
        ];
      },
    },
    /* eslint-enable @typescript-eslint/no-empty-function */
  };

  return (
    <ExternalStoreProvider>
      <App />
    </ExternalStoreProvider>
  );
};

export const Primary: StoryObj<typeof meta> = {
  args: {},
  render: withExternalStoreProvider,
};
