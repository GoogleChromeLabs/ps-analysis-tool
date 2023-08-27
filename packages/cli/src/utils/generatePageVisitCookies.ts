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
import { Browser, Protocol } from 'puppeteer';

/**
 * Internal dependencies.
 */
import delay from './delay';

const generatePageVisitCookies: (
  url: URL,
  browserContext: Browser,
  stayTime?: number
) => Promise<Protocol.Network.Cookie[]> = async (
  url,
  browserContext,
  stayTime = 10000
) => {
  const page = await browserContext.newPage();

  await page.goto(url.href, {
    timeout: 200000,
  });

  await delay(stayTime);

  const cdpSession = await page.createCDPSession();

  //@see https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-getCookies
  const cookies = (await cdpSession.send('Page.getCookies')).cookies;

  await page.close();
  return cookies;
};

export default generatePageVisitCookies;
