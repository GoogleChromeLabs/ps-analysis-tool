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
export const requestHeaders = [
  {
    name: 'sec-ch-ua',
    value: '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  },
  {
    name: 'sec-ch-ua-mobile',
    value: '?0',
  },
  {
    name: 'sec-ch-ua-platform',
    value: '"macOS"',
  },
  {
    name: 'Upgrade-Insecure-Requests',
    value: '1',
  },
  {
    name: 'User-Agent',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
  {
    name: 'Accept',
    value:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  },
  {
    name: 'Sec-Fetch-Site',
    value: 'same-origin',
  },
  {
    name: 'Sec-Fetch-Mode',
    value: 'navigate',
  },
  {
    name: 'Sec-Fetch-User',
    value: '?1',
  },
  {
    name: 'Sec-Fetch-Dest',
    value: 'document',
  },
  {
    name: 'Accept-Encoding',
    value: 'gzip, deflate, br, zstd',
  },
  {
    name: 'Accept-Language',
    value: 'en-GB,en-US;q=0.9,en;q=0.8',
  },
  {
    name: 'Cookie',
    value:
      'ckns_policy=111; ckns_explicit=0; dnsDisplayed=undefined; ccpaApplies=true; signedLspa=undefined; _sp_su=false; ckpf_ppid=7d0bd88ecf324db19821be161cb5ad91; blaize_session=ea3cb167-b847-4104-99ba-f431c90ebca2; blaize_tracking_id=f65e2382-2d6f-481d-9af5-739fe68d366e; optimizelyEndUserId=oeu1713868228553r0.5596691584936613; _cb=Dc8zQZBgqC4hDMk73y; _chartbeat2=.1713868228779.1713868228779.1.Ck0GLA0g2mgD8fTrDDOOWkrDBd6gQ.1; _cb_svref=external; pa_privacy=%22optin%22; _pcid=%7B%22browserId%22%3A%22lvc8w5f71rc6q8yv%22%2C%22_t%22%3A%22mb0ntmrb%7Clvc8w5fb%22%7D; _pctx=%7Bu%7DN4IgrgzgpgThIC4B2YA2qA05owMoBcBDfSREQpAeyRCwgEt8oBJAE0RXSwH18yBbAEYAGJPn4xBAH1QA3AMYAOAO4BWAGaCQAXyA; ccpaUUID=d39f1884-d63e-482c-b930-1e985086ccba; __gads=ID=6108e835b29f8b3c:T=1713868229:RT=1713868229:S=ALNI_MZ0vaDLqS7ojil37yQ4YD5rcMXQFg; __gpi=UID=00000df700db65bb:T=1713868229:RT=1713868229:S=ALNI_MbjgojPDkG9qvDDeEZeT_nnC3J2hw; __eoi=ID=347bbb3c9dcf685a:T=1713868229:RT=1713868229:S=AA-AfjY0xW3okcSSZeF3n4hYuF3h; DM_SitId1778=1; DM_SitId1778SecId13934=1; permutive-id=660c0cbe-527d-420e-81f8-d8a6d753712c; ecos.dt=1713868244876',
  },
];

export const responseHeaders = [
  {
    name: 'content-type',
    value: 'application/javascript',
  },
  {
    name: 'content-length',
    value: '0',
  },
  {
    name: 'date',
    value: 'Thu, 25 Apr 2024 12:38:09 GMT',
  },
  {
    name: 'server',
    value: 'Kestrel',
  },
  {
    name: 'access-control-allow-credentials',
    value: 'true',
  },
  {
    name: 'access-control-allow-headers',
    value: 'Content-Type, Authorization, Accept, X-Requested-With',
  },
  {
    name: 'access-control-allow-methods',
    value: 'POST, GET, PUT, DELETE, OPTIONS',
  },
  {
    name: 'access-control-allow-origin',
    value: 'https://www.bbc.com',
  },
  {
    name: 'cache-control',
    value: 'no-cache',
  },
  {
    name: 'p3p',
    value:
      'policyref="https://uk-script.dotmetrics.net/w3c/p3p.xml", CP="NOI DSP LAW CURa ADMa DEVa PSAa HISa OUR IND STA"',
  },
  {
    name: 'x-cache',
    value: 'Miss from cloudfront',
  },
  {
    name: 'via',
    value: '1.1 b20b2466b25d82e16d99dbc5c99cfe3e.cloudfront.net (CloudFront)',
  },
  {
    name: 'x-amz-cf-pop',
    value: 'BOM54-P1',
  },
  {
    name: 'x-amz-cf-id',
    value: 'dydln3ts4sE6lhqGnXt4HeOEnt2WBnpplUQhSmanGxzvBZgrfUSY0w==',
  },
  {
    name: 'set-cookie',
    value:
      'DotMetrics.DeviceKey=DeviceID=; expires=Fri, 25 Apr 2025 12:38:09 GMT; domain=.dotmetrics.net; path=/; SameSite=None; secure',
  },
  {
    name: 'set-cookie',
    value:
      'DotMetrics.UniqueUserIdentityCookie=UserID=cf92e7f8-16f4-4caf-acb6-f4fcd61639c4&Created=04/25/2024 12:38:09&UserMode=0&guid=e7c1f426-58e5-415e-b233-5730639dab5a&ver=1; expires=Fri, 25 Apr 2025 12:38:09 GMT; domain=.dotmetrics.net; path=/; SameSite=None; secure',
  },
];
