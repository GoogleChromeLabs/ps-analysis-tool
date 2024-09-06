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

export default {
  json: [
    {
      pageUrl: 'https://domain-aaa.com/spotify\r',
      technologyData: [],
      cookieData: {
        'https://open.spotify.com': {
          frameCookies: {
            '_cc_cccrwdcntrl.net/': {
              parsedCookie: {
                domain: '.crwdcntrl.net',
                name: '_cc_cc',
                path: '/',
                samesite: 'none',
                httponly: false,
                priority: 'Medium',
                value:
                  '"ACZ4nGNQMDewNDA1N080NjA0SzVINbQwSzExMbcwNLMwNDQzNjBnAIK0Wb7zGRAAACRYCVA%3D"',
                partitionKey: '',
                expires: '2025-04-15T11:27:27.639Z',
                httpOnly: false,
                sameParty: false,
                sameSite: 'None',
                secure: true,
                session: false,
                size: 82,
                sourcePort: 443,
                sourceScheme: 'Secure',
              },
              warningReasons: [],
              blockedReasons: ['ThirdPartyPhaseout'],
              networkEvents: {
                requestEvents: [],
                responseEvents: [],
              },
              headerType: 'http',
              isFirstParty: false,
              url: '',
              frameIdList: ['6C93EFD2145CB7798F6C74BC08576FAE'],
              analytics: {
                platform: 'Lotame',
                category: 'Marketing',
                name: '_cc_cc',
                domain: 'crwdcntrl.net',
                description: 'OCD__cc_cc_description',
                retention: 'OCD_retention_session',
                dataController: 'Lotame',
                gdprUrl:
                  'https://www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/',
                wildcard: '0',
              },
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
              isBlocked: true,
            },
            '_cc_audcrwdcntrl.net/': {
              parsedCookie: {
                domain: '.crwdcntrl.net',
                name: '_cc_aud',
                path: '/',
                samesite: 'none',
                httponly: false,
                priority: 'Medium',
                value: '"ABR4nGNgYGBIm%2BU7nwEOABfpAe0%3D"',
                partitionKey: '',
                expires: '2025-04-15T11:27:27.639Z',
                httpOnly: false,
                sameParty: false,
                sameSite: 'None',
                secure: true,
                session: false,
                size: 41,
                sourcePort: 443,
                sourceScheme: 'Secure',
              },
              warningReasons: [],
              blockedReasons: ['ThirdPartyPhaseout'],
              networkEvents: {
                requestEvents: [],
                responseEvents: [],
              },
              headerType: 'http',
              isFirstParty: false,
              url: '',
              frameIdList: ['6C93EFD2145CB7798F6C74BC08576FAE'],
              analytics: {
                platform: 'Lotame',
                category: 'Marketing',
                name: '_cc_aud',
                domain: 'crwdcntrl.net',
                description: 'OCD__cc_aud_description',
                retention: 'OCD_retention_269_days',
                dataController: 'Lotame',
                gdprUrl:
                  'https://www.lotame.com/about-lotame/privacy/lotames-products-services-privacy-policy/',
                wildcard: '0',
              },
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
              isBlocked: true,
            },
            'plsGeoObjspectator.org/': {
              isBlocked: false,
              parsedCookie: {
                domain: 'spectator.org',
                expires: '2024-08-03T07:24:10.000Z',
                httpOnly: false,
                name: 'plsGeoObj',
                path: '/',
                priority: 'Medium',
                sameParty: false,
                sameSite: 'Lax',
                secure: false,
                session: false,
                size: 117,
                sourcePort: 443,
                sourceScheme: 'Secure',
                value:
                  '{"ip":"59.88.27.175","country":"IN","region":"MH","city":"Pune","zip":"411004","location":"18.6161,73.7286"}',
                httponly: false,
                samesite: 'lax',
                partitionKey: '',
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [],
              },
              blockedReasons: [],
              analytics: {
                platform: 'Unknown',
                category: 'Uncategorized',
                name: '',
                domain: '',
                description: '',
                retention: '',
                dataController: '',
                gdprUrl: '',
                wildcard: '',
              },
              url: '',
              headerType: 'http',
              isFirstParty: true,
              frameIdList: ['6C93EFD2145CB7798F6C74BC08576FAE'],
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
              warningReasons: [],
            },
            'sp_t:.spotify.com:/': {
              parsedCookie: {
                name: 'sp_t',
                domain: '.spotify.com',
                path: '/',
                value: '0c78871fd735b5a3dfc15aaec9dcb15a',
                sameSite: 'none',
                expires: '2025-07-17T06:49:20.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: 'C7C00DC4DDB781A931237B3329A49482',
                    url: 'https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=generator',
                    blocked: true,
                    timeStamp: 1721198960825,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=generator',
              headerType: 'response',
              analytics: {
                platform: 'Spotify',
                category: 'Functional',
                gdprUrl: 'https://www.spotify.com/us/privacy/',
                description: 'OCD_sp_t_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'sp_landing:.spotify.com:/': {
              parsedCookie: {
                name: 'sp_landing',
                domain: '.spotify.com',
                path: '/',
                value:
                  'https%3A%2F%2Fdomain-aaa.com%2F%3Fsp_cid%3D0c78871fd735b5a3dfc15aaec9dcb15a%26device%3Ddesktop',
                sameSite: 'none',
                expires: '2024-07-18T06:49:20.000Z',
                httpOnly: true,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: 'C7C00DC4DDB781A931237B3329A49482',
                    url: 'https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=generator',
                    blocked: true,
                    timeStamp: 1721198960825,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=generator',
              headerType: 'response',
              analytics: {
                platform: 'Spotify',
                category: 'Functional',
                gdprUrl: 'https://www.spotify.com/us/privacy/',
                description: 'OCD_sp_landing_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
          },
        },
        'https://domain-aaa.com': {
          frameCookies: {},
        },
      },
      libraryMatches: {
        gsiV2: {
          signatureMatches: 0,
          matches: [],
          moduleMatch: 0,
        },
        gis: {
          signatureMatches: 0,
          matches: [],
        },
        'fb-comments': {
          domQuerymatches: [],
        },
        'fb-likes': {
          domQuerymatches: [],
        },
        'disqus-comments': {
          domQuerymatches: [],
        },
        'jetpack-comments': {
          domQuerymatches: [],
        },
        'jetpack-likes': {
          domQuerymatches: [],
        },
      },
    },
    {
      pageUrl: 'https://www.math-only-math.com/\r',
      technologyData: [],
      cookieData: {
        'https://td.doubleclick.net': {
          frameCookies: {
            'test_cookie:.doubleclick.net:/': {
              parsedCookie: {
                name: 'test_cookie',
                domain: '.doubleclick.net',
                path: '/',
                value: 'CheckForPermission',
                sameSite: 'none',
                expires: '2024-07-17T07:04:22.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: 'D199827D4ECD997C4CD687F79792AF66',
                    url: 'https://td.doubleclick.net/td/ga/rul?tid=G-TW190F6BW0&gacid=1130158387.1721198963&gtm=45je47f0v9119034086za200&dma=0&gcd=13l3l3l3l1&npa=0&pscdl=&aip=1&fledge=1&frm=0&z=252780953',
                    blocked: true,
                    timeStamp: 1721198962866,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://td.doubleclick.net/td/ga/rul?tid=G-TW190F6BW0&gacid=1130158387.1721198963&gtm=45je47f0v9119034086za200&dma=0&gcd=13l3l3l3l1&npa=0&pscdl=&aip=1&fledge=1&frm=0&z=252780953',
              headerType: 'response',
              analytics: {
                platform: 'DoubleClick/Google Marketing',
                category: 'Functional',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD_test_cookie_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
          },
        },
        'https://googleads.g.doubleclick.net': {
          frameCookies: {
            'test_cookie:.doubleclick.net:/': {
              parsedCookie: {
                name: 'test_cookie',
                domain: '.doubleclick.net',
                path: '/',
                value: 'CheckForPermission',
                sameSite: 'none',
                expires: '2024-07-17T07:04:23.000Z',
                httpOnly: true,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '964ADBC537ED8678A5248CC6DB09BD19',
                    url: 'https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-0879909900509056&output=html&h=280&slotname=6352883888&adk=971446166&adf=2441729864&pi=t.ma~as.6352883888&w=580&abgtt=3&fwrn=4&fwrnh=100&lmt=1721198963&rafmt=1&format=580x280&url=https%3A%2F%2Fwww.math-only-math.com%2F&fwr=0&fwrattr=true&rpe=1&resp_fmts=3&wgl=1&uach=WyIiLCIiLCIiLCIiLCIiLG51bGwsMCxudWxsLCIiLG51bGwsMF0.&dt=1721198962742&bpp=4&bdt=1311&idt=1022&shv=r20240715&mjsv=m202407100101&ptt=9&saldr=aa&abxe=1&cookie_enabled=1&eoidce=1&prev_fmts=0x0&nras=1&correlator=2253216212258&frm=20&pv=1&ga_vid=1130158387.1721198963&ga_sid=1721198964&ga_hid=209187621&ga_fc=1&u_tz=330&u_his=2&u_h=956&u_w=1470&u_ah=956&u_aw=1470&u_cd=30&u_sd=1&dmc=8&adx=430&ady=725&biw=1440&bih=790&scr_x=0&scr_y=0&eid=44759876%2C44759927%2C44759837%2C95334529%2C95334830%2C95337868%2C31084184%2C95336521%2C95337366%2C31078663%2C31078665%2C31078668%2C31078670&oid=2&pvsid=3911824152893694&tmod=1952326318&uas=0&nvt=1&fc=1920&brdim=22%2C59%2C22%2C59%2C1470%2C0%2C1200%2C875%2C1440%2C790&vis=2&rsz=o%7C%7CeEr%7C&abl=CS&pfx=0&fu=128&bc=31&bz=0.83&td=1&tdf=0&psd=W251bGwsbnVsbCxudWxsLDFd&nt=1&ifi=2&uci=a!2&fsb=1&dtd=1034',
                    blocked: true,
                    timeStamp: 1721198964422,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-0879909900509056&output=html&h=280&slotname=6352883888&adk=971446166&adf=2441729864&pi=t.ma~as.6352883888&w=580&abgtt=3&fwrn=4&fwrnh=100&lmt=1721198963&rafmt=1&format=580x280&url=https%3A%2F%2Fwww.math-only-math.com%2F&fwr=0&fwrattr=true&rpe=1&resp_fmts=3&wgl=1&uach=WyIiLCIiLCIiLCIiLCIiLG51bGwsMCxudWxsLCIiLG51bGwsMF0.&dt=1721198962742&bpp=4&bdt=1311&idt=1022&shv=r20240715&mjsv=m202407100101&ptt=9&saldr=aa&abxe=1&cookie_enabled=1&eoidce=1&prev_fmts=0x0&nras=1&correlator=2253216212258&frm=20&pv=1&ga_vid=1130158387.1721198963&ga_sid=1721198964&ga_hid=209187621&ga_fc=1&u_tz=330&u_his=2&u_h=956&u_w=1470&u_ah=956&u_aw=1470&u_cd=30&u_sd=1&dmc=8&adx=430&ady=725&biw=1440&bih=790&scr_x=0&scr_y=0&eid=44759876%2C44759927%2C44759837%2C95334529%2C95334830%2C95337868%2C31084184%2C95336521%2C95337366%2C31078663%2C31078665%2C31078668%2C31078670&oid=2&pvsid=3911824152893694&tmod=1952326318&uas=0&nvt=1&fc=1920&brdim=22%2C59%2C22%2C59%2C1470%2C0%2C1200%2C875%2C1440%2C790&vis=2&rsz=o%7C%7CeEr%7C&abl=CS&pfx=0&fu=128&bc=31&bz=0.83&td=1&tdf=0&psd=W251bGwsbnVsbCxudWxsLDFd&nt=1&ifi=2&uci=a!2&fsb=1&dtd=1034',
              headerType: 'response',
              analytics: {
                platform: 'DoubleClick/Google Marketing',
                category: 'Functional',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD_test_cookie_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
          },
        },
        'https://www.math-only-math.com': {
          frameCookies: {
            'gdprcookieconsent:.www.math-only-math.com:/': {
              parsedCookie: {
                name: 'gdprcookieconsent',
                domain: '.www.math-only-math.com',
                path: '/',
                value: '',
                sameSite: 'Lax',
                expires: 1755758962.260181,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.48',
                    url: 'https://www.math-only-math.com/sd/image-files/xfooter-background.jpg.pagespeed.ic.0y9xJCnjvr.webp',
                    blocked: false,
                    timeStamp: 1721198962888,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.46',
                    url: 'https://www.math-only-math.com/ssjs/ldr.js',
                    blocked: false,
                    timeStamp: 1721198962870,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'UserSetting',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Unknown',
                category: 'Uncategorized',
                gdprUrl: '',
                description: '',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '_ga_TW190F6BW0:.math-only-math.com:/': {
              parsedCookie: {
                name: '_ga_TW190F6BW0',
                domain: '.math-only-math.com',
                path: '/',
                value: 'GS1.1.1721198962.1.0.1721198965.57.0.0',
                sameSite: 'Lax',
                expires: 1755758965.742606,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.48',
                    url: 'https://www.math-only-math.com/sd/image-files/xfooter-background.jpg.pagespeed.ic.0y9xJCnjvr.webp',
                    blocked: false,
                    timeStamp: 1721198962888,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.46',
                    url: 'https://www.math-only-math.com/ssjs/ldr.js',
                    blocked: false,
                    timeStamp: 1721198962870,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'TPCDMetadata',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__ga___description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '_ga:.math-only-math.com:/': {
              parsedCookie: {
                name: '_ga',
                domain: '.math-only-math.com',
                path: '/',
                value: 'GA1.2.1130158387.1721198963',
                sameSite: 'Lax',
                expires: 1755758962.87817,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.48',
                    url: 'https://www.math-only-math.com/sd/image-files/xfooter-background.jpg.pagespeed.ic.0y9xJCnjvr.webp',
                    blocked: false,
                    timeStamp: 1721198962888,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.46',
                    url: 'https://www.math-only-math.com/ssjs/ldr.js',
                    blocked: false,
                    timeStamp: 1721198962870,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__ga_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '_gid:.math-only-math.com:/': {
              parsedCookie: {
                name: '_gid',
                domain: '.math-only-math.com',
                path: '/',
                value: 'GA1.2.708024844.1721198963',
                sameSite: 'Lax',
                expires: 1721285362,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.48',
                    url: 'https://www.math-only-math.com/sd/image-files/xfooter-background.jpg.pagespeed.ic.0y9xJCnjvr.webp',
                    blocked: false,
                    timeStamp: 1721198962888,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__gid_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '_gat_gtag_UA_26494151_1:.math-only-math.com:/': {
              parsedCookie: {
                name: '_gat_gtag_UA_26494151_1',
                domain: '.math-only-math.com',
                path: '/',
                value: '1',
                sameSite: 'Lax',
                expires: 1721199022,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.48',
                    url: 'https://www.math-only-math.com/sd/image-files/xfooter-background.jpg.pagespeed.ic.0y9xJCnjvr.webp',
                    blocked: false,
                    timeStamp: 1721198962888,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__gat__description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '__gads:.math-only-math.com:/': {
              parsedCookie: {
                name: '__gads',
                domain: '.math-only-math.com',
                path: '/',
                value:
                  'ID=33bd70adb27d10a3:T=1721198963:RT=1721198963:S=ALNI_MYaW9tpQeb9yhZicedUqPa0_vemlA',
                sameSite: 'None',
                expires: 1754894963,
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'DoubleClick/Google Marketing',
                category: 'Marketing',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD___gads_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '__gpi:.math-only-math.com:/': {
              parsedCookie: {
                name: '__gpi',
                domain: '.math-only-math.com',
                path: '/',
                value:
                  'UID=00000e96d9cd3b4c:T=1721198963:RT=1721198963:S=ALNI_Mayp_H0QdpWQ3yerFIUDI_k8ESabQ',
                sameSite: 'None',
                expires: 1754894963,
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google AdSense',
                category: 'Marketing',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD___gpi_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '__eoi:.math-only-math.com:/': {
              parsedCookie: {
                name: '__eoi',
                domain: '.math-only-math.com',
                path: '/',
                value:
                  'ID=3519c0aa822d8ce8:T=1721198963:RT=1721198963:S=AA-AfjbWKU5YEU2P3MAGnZ51cau7',
                sameSite: 'None',
                expires: 1736750963,
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google AdSense',
                category: 'Functional',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD___eoi_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            '__gsas:.math-only-math.com:/': {
              parsedCookie: {
                name: '__gsas',
                domain: '.math-only-math.com',
                path: '/',
                value:
                  'ID=915b2a4f52b0c187:T=1721198965:RT=1721198965:S=ALNI_Maco02YO9xrZy2YkV3Kx-V3yPQJ-w',
                sameSite: 'Lax',
                expires: 1754894965,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google AdSense',
                category: 'Marketing',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD___gsas_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'FCNEC:.math-only-math.com:/': {
              parsedCookie: {
                name: 'FCNEC',
                domain: '.math-only-math.com',
                path: '/',
                value:
                  '%5B%5B%22AKsRol_sFtACn-ujHi9pjDBtMde3H05_BICM7vTUOcfgcC25-H9sHXWqS0hkQrGa-G1lxPNraPYW8GkJt3efU8FY6heHpOL7buOZ0rddULrJv2kOM0tcWTjsp4kh6kw6aj0fTW4-KX6Ad5A7Sn4m-2l_jYIe9Ho55A%3D%3D%22%5D%5D',
                sameSite: 'Lax',
                expires: 1752734966,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32684.80',
                    url: 'https://www.math-only-math.com/favicon.ico',
                    blocked: false,
                    timeStamp: 1721198968136,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: false,
              blockedReasons: [],
              exemptionReason: 'None',
              url: 'https://www.math-only-math.com/favicon.ico',
              headerType: 'request',
              analytics: {
                platform: 'Google',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD_FCNEC_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
          },
        },
        'https://www.facebook.com': {
          frameCookies: {},
        },
        'https://www.google.com': {
          frameCookies: {},
        },
      },
      libraryMatches: {
        gsiV2: {
          signatureMatches: 0,
          matches: [],
          moduleMatch: 0,
        },
        gis: {
          signatureMatches: 1,
          matches: [],
        },
        'fb-comments': {
          domQuerymatches: [
            'div[id]: fb-root',
            'div[class]: fb-comments',
            'iframe[src]: https://www.facebook.com/v4.0/plugins/comments.php?app_id=142708165892719&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df0297de333564e3e9%26domain%3Dwww.math-only-math.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fwww.math-only-math.com%252Ffdc55cde71d7897be%26relation%3Dparent.parent&container_width=580&height=100&href=http%3A%2F%2Fwww.math-only-math.com%2F&locale=en_US&numposts=10&sdk=joey&version=v4.0&width=550',
          ],
        },
        'fb-likes': {
          domQuerymatches: [
            'div[id]: fb-root',
            'div[class]: fb-like',
            'iframe[src]: https://www.facebook.com/v4.0/plugins/like.php?app_id=142708165892719&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfadce164a79d8bcb8%26domain%3Dwww.math-only-math.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fwww.math-only-math.com%252Ffdc55cde71d7897be%26relation%3Dparent.parent&container_width=160&font=verdana&href=http%3A%2F%2Fwww.math-only-math.com%2F&layout=box_count&locale=en_US&sdk=joey&send=false&show_faces=true&width=450',
          ],
        },
        'disqus-comments': {
          domQuerymatches: [],
        },
        'jetpack-comments': {
          domQuerymatches: [],
        },
        'jetpack-likes': {
          domQuerymatches: [],
        },
      },
    },
    {
      pageUrl: 'https://jetpack.com/support/comments/\r',
      technologyData: [],
      cookieData: {
        'https://jetpack.com': {
          frameCookies: {
            'li_sugr:.linkedin.com:/': {
              parsedCookie: {
                name: 'li_sugr',
                domain: '.linkedin.com',
                path: '/',
                value: 'f0e9b139-5928-49d9-acc0-895177993f17',
                sameSite: 'None',
                expires: '2024-10-15T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.119',
                    url: 'https://px.ads.linkedin.com/collect?v=2&fmt=js&pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961287,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.117',
                    url: 'https://px.ads.linkedin.com/collect/?pid=4537722&fmt=gif&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961271,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://px.ads.linkedin.com/collect?v=2&fmt=js&pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&cookiesTest=true',
              headerType: 'response',
              analytics: {
                platform: 'LinkedIn',
                category: 'Marketing',
                gdprUrl: 'https://www.linkedin.com/legal/privacy-policy',
                description: 'OCD_li_sugr_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'bcookie:.linkedin.com:/': {
              parsedCookie: {
                name: 'bcookie',
                domain: '.linkedin.com',
                path: '/',
                value: '"v=2&4aafe217-b6b1-4a3f-88b6-d5db0f0f0c12"',
                sameSite: 'None',
                expires: '2025-07-17T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.129',
                    url: 'https://px.ads.linkedin.com/wa/',
                    blocked: true,
                    timeStamp: 1721198961545,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.119',
                    url: 'https://px.ads.linkedin.com/collect?v=2&fmt=js&pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961584,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.119',
                    url: 'https://px.ads.linkedin.com/collect?v=2&fmt=js&pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961287,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.118',
                    url: 'https://px.ads.linkedin.com/attribution_trigger?pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F',
                    blocked: false,
                    timeStamp: 1721198961286,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.117',
                    url: 'https://px.ads.linkedin.com/collect/?pid=4537722&fmt=gif&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961525,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.117',
                    url: 'https://px.ads.linkedin.com/collect/?pid=4537722&fmt=gif&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961271,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://px.ads.linkedin.com/wa/',
              headerType: 'response',
              analytics: {
                platform: 'LinkedIn',
                category: 'Marketing',
                gdprUrl: 'https://www.linkedin.com/legal/privacy-policy',
                description: 'OCD_bcookie_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_SOME_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'lidc:.linkedin.com:/': {
              parsedCookie: {
                name: 'lidc',
                domain: '.linkedin.com',
                path: '/',
                value:
                  '"b=OGST09:s=O:r=O:a=O:p=O:g=2875:u=1:x=1:i=1721198961:t=1721285361:v=2:sig=AQFxaQVRWc3rVaDC2zjBgSn51lb6-F8w"',
                sameSite: 'None',
                expires: '2024-07-18T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.129',
                    url: 'https://px.ads.linkedin.com/wa/',
                    blocked: true,
                    timeStamp: 1721198961545,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.119',
                    url: 'https://px.ads.linkedin.com/collect?v=2&fmt=js&pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961584,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.119',
                    url: 'https://px.ads.linkedin.com/collect?v=2&fmt=js&pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961287,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.118',
                    url: 'https://px.ads.linkedin.com/attribution_trigger?pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F',
                    blocked: false,
                    timeStamp: 1721198961286,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.117',
                    url: 'https://px.ads.linkedin.com/collect/?pid=4537722&fmt=gif&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961525,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.117',
                    url: 'https://px.ads.linkedin.com/collect/?pid=4537722&fmt=gif&cookiesTest=true',
                    blocked: true,
                    timeStamp: 1721198961271,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://px.ads.linkedin.com/wa/',
              headerType: 'response',
              analytics: {
                platform: 'LinkedIn',
                category: 'Marketing',
                gdprUrl: 'https://www.linkedin.com/legal/privacy-policy',
                description: 'OCD_lidc_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_SOME_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'ar_debug:.px.ads.linkedin.com:/': {
              parsedCookie: {
                name: 'ar_debug',
                domain: '.px.ads.linkedin.com',
                path: '/',
                value: '1',
                sameSite: 'None',
                expires: '2024-08-16T17:18:27.000Z',
                httpOnly: true,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.118',
                    url: 'https://px.ads.linkedin.com/attribution_trigger?pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F',
                    blocked: false,
                    timeStamp: 1721198961286,
                  },
                ],
              },
              isBlocked: false,
              blockedReasons: [],
              url: 'https://px.ads.linkedin.com/attribution_trigger?pid=4537722&time=1721198960990&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F',
              headerType: 'response',
              analytics: {
                platform: 'DoubleClick/Google Marketing',
                category: 'Marketing',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD_ar_debug_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'MUID:.bing.com:/': {
              parsedCookie: {
                name: 'MUID',
                domain: '.bing.com',
                path: '/',
                value: '172CABF7E2006E0421FBBF48E3066F25',
                sameSite: 'None',
                expires: '2025-08-11T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.121',
                    url: 'https://bat.bing.com/action/0?ti=4074038&Ver=2&mid=2189d867-1448-7f9a-20b5-868978017e5e&pi=918639831&lg=en-US&sw=1470&sh=956&sc=30&tl=Jetpack%20Comments&p=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&r=&lt=1166&evt=pageLoad&msclkid=N&rn=623392',
                    blocked: true,
                    timeStamp: 1721198961309,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://bat.bing.com/action/0?ti=4074038&Ver=2&mid=2189d867-1448-7f9a-20b5-868978017e5e&pi=918639831&lg=en-US&sw=1470&sh=956&sc=30&tl=Jetpack%20Comments&p=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&r=&lt=1166&evt=pageLoad&msclkid=N&rn=623392',
              headerType: 'response',
              analytics: {
                platform: 'Bing / Microsoft',
                category: 'Marketing',
                gdprUrl: 'https://account.microsoft.com/privacy',
                description: 'OCD_MUID_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'MR:.bat.bing.com:/': {
              parsedCookie: {
                name: 'MR',
                domain: '.bat.bing.com',
                path: '/',
                value: '0',
                sameSite: 'None',
                expires: '2024-07-24T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.121',
                    url: 'https://bat.bing.com/action/0?ti=4074038&Ver=2&mid=2189d867-1448-7f9a-20b5-868978017e5e&pi=918639831&lg=en-US&sw=1470&sh=956&sc=30&tl=Jetpack%20Comments&p=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&r=&lt=1166&evt=pageLoad&msclkid=N&rn=623392',
                    blocked: true,
                    timeStamp: 1721198961309,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://bat.bing.com/action/0?ti=4074038&Ver=2&mid=2189d867-1448-7f9a-20b5-868978017e5e&pi=918639831&lg=en-US&sw=1470&sh=956&sc=30&tl=Jetpack%20Comments&p=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&r=&lt=1166&evt=pageLoad&msclkid=N&rn=623392',
              headerType: 'response',
              analytics: {
                platform: 'Bing / Microsoft',
                category: 'Marketing',
                gdprUrl: 'https://account.microsoft.com/privacy',
                description: 'OCD_MR_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'test_cookie:.doubleclick.net:/': {
              parsedCookie: {
                name: 'test_cookie',
                domain: '.doubleclick.net',
                path: '/',
                value: 'CheckForPermission',
                sameSite: 'none',
                expires: '2024-07-17T07:04:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.133',
                    url: 'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/946162814/?random=1721198961496&cv=11&fst=1721198961496&bg=ffffff&guid=ON&async=1&gtm=45be47f0v892112308za200&gcd=13t3t3t3t5&dma=0&tag_exp=0&u_w=1470&u_h=956&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&hn=www.googleadservices.com&frm=0&tiba=Jetpack%20Comments&npa=0&auid=811960792.1721198961&uaa=&uab=&uafvl=&uamb=0&uam=&uap=&uapv=&uaw=0&fledge=1&data=event%3Dgtag.config&rfmt=3&fmt=4',
                    blocked: true,
                    timeStamp: 1721198961671,
                  },
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.127',
                    url: 'https://googleads.g.doubleclick.net/pagead/landing?gcs=G111&gcd=13t3t3t3t5&tag_exp=0&rnd=1981123854.1721198961&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&dma=0&npa=0&gtm=45He47f0n81MWWK6WMv859117293za200&auid=811960792.1721198961',
                    blocked: true,
                    timeStamp: 1721198961671,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://googleads.g.doubleclick.net/pagead/viewthroughconversion/946162814/?random=1721198961496&cv=11&fst=1721198961496&bg=ffffff&guid=ON&async=1&gtm=45be47f0v892112308za200&gcd=13t3t3t3t5&dma=0&tag_exp=0&u_w=1470&u_h=956&url=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&hn=www.googleadservices.com&frm=0&tiba=Jetpack%20Comments&npa=0&auid=811960792.1721198961&uaa=&uab=&uafvl=&uamb=0&uam=&uap=&uapv=&uaw=0&fledge=1&data=event%3Dgtag.config&rfmt=3&fmt=4',
              headerType: 'response',
              analytics: {
                platform: 'DoubleClick/Google Marketing',
                category: 'Functional',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD_test_cookie_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'guest_id_marketing:.twitter.com:/': {
              parsedCookie: {
                name: 'guest_id_marketing',
                domain: '.twitter.com',
                path: '/',
                value: 'v1%3A172119896164970069',
                sameSite: 'None',
                expires: '2026-07-17T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.123',
                    url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
                    blocked: true,
                    timeStamp: 1721198961723,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
              headerType: 'response',
              analytics: {
                platform: 'X',
                category: 'Marketing',
                gdprUrl: 'https://twitter.com/en/privacy',
                description: 'OCD_guest_id_marketing_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'guest_id_ads:.twitter.com:/': {
              parsedCookie: {
                name: 'guest_id_ads',
                domain: '.twitter.com',
                path: '/',
                value: 'v1%3A172119896164970069',
                sameSite: 'None',
                expires: '2026-07-17T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.123',
                    url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
                    blocked: true,
                    timeStamp: 1721198961723,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
              headerType: 'response',
              analytics: {
                platform: 'X',
                category: 'Marketing',
                gdprUrl: 'https://twitter.com/en/privacy',
                description: 'OCD_guest_id_ads_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'personalization_id:.twitter.com:/': {
              parsedCookie: {
                name: 'personalization_id',
                domain: '.twitter.com',
                path: '/',
                value: '"v1_7P1th2ve6fO2FO6KC7/pqw=="',
                sameSite: 'None',
                expires: '2026-07-17T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.123',
                    url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
                    blocked: true,
                    timeStamp: 1721198961723,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
              headerType: 'response',
              analytics: {
                platform: 'X',
                category: 'Marketing',
                gdprUrl:
                  'https://help.twitter.com/nl/safety-and-security#ads-and-data-privacy',
                description: 'OCD_personalization_id_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'guest_id:.twitter.com:/': {
              parsedCookie: {
                name: 'guest_id',
                domain: '.twitter.com',
                path: '/',
                value: 'v1%3A172119896164970069',
                sameSite: 'None',
                expires: '2026-07-17T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.123',
                    url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
                    blocked: true,
                    timeStamp: 1721198961723,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://analytics.twitter.com/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
              headerType: 'response',
              analytics: {
                platform: 'X',
                category: 'Marketing',
                gdprUrl:
                  'https://help.twitter.com/nl/safety-and-security#ads-and-data-privacy',
                description: 'OCD_guest_id_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'muc_ads:.t.co:/': {
              parsedCookie: {
                name: 'muc_ads',
                domain: '.t.co',
                path: '/',
                value: 'e376b4b0-b5df-400e-8c9b-8d6801ac8247',
                sameSite: 'None',
                expires: '2026-07-17T06:49:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.122',
                    url: 'https://t.co/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
                    blocked: true,
                    timeStamp: 1721198961844,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://t.co/1/i/adsct?bci=4&eci=3&event=%7B%7D&event_id=52479beb-3687-4d18-9c7a-921c10889d4b&integration=advertiser&p_id=Twitter&p_user_id=0&pl_id=89810d15-cfee-4b83-9839-ac69208a4eb1&tw_document_href=https%3A%2F%2Fjetpack.com%2Fsupport%2Fcomments%2F&tw_iframe_status=0&txn_id=odlje&type=javascript&version=2.3.30',
              headerType: 'response',
              analytics: {
                platform: 'X',
                category: 'Marketing',
                gdprUrl: 'https://twitter.com/en/privacy',
                description: 'OCD_muc_ads_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'ar_debug:.www.google-analytics.com:/': {
              parsedCookie: {
                name: 'ar_debug',
                domain: '.www.google-analytics.com',
                path: '/',
                value: '1',
                sameSite: 'none',
                expires: '2024-10-15T06:49:22.000Z',
                httpOnly: true,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: '32686.136',
                    url: 'https://www.google-analytics.com/privacy-sandbox/register-conversion?_c=1&cid=1031042230.1721198961&dbk=7394743658508256078&dma=0&en=clicked_on__start_for_free___free_plan_&gcs=G111&gtm=45je47f0v883586308za200&npa=0&tid=G-K8CRH0LL00&dl=https%3A%2F%2Fjetpack.com%3F',
                    blocked: true,
                    timeStamp: 1721198962232,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://www.google-analytics.com/privacy-sandbox/register-conversion?_c=1&cid=1031042230.1721198961&dbk=7394743658508256078&dma=0&en=clicked_on__start_for_free___free_plan_&gcs=G111&gtm=45je47f0v883586308za200&npa=0&tid=G-K8CRH0LL00&dl=https%3A%2F%2Fjetpack.com%3F',
              headerType: 'response',
              analytics: {
                platform: 'DoubleClick/Google Marketing',
                category: 'Marketing',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD_ar_debug_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
            'tk_ai:.jetpack.com:/': {
              parsedCookie: {
                name: 'tk_ai',
                domain: '.jetpack.com',
                path: '/',
                value: 'ejTHFGyT%2B6hzV4JAQLrnrDA2',
                sameSite: 'Lax',
                expires: 1755758960.35047,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.109',
                    url: 'https://jetpack.com/wp-admin/admin-ajax.php',
                    blocked: false,
                    timeStamp: 1721198960929,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.108',
                    url: 'https://jetpack.com/wp-content/uploads/2022/06/cropped-jp-favicon-new-3.png?w=32',
                    blocked: false,
                    timeStamp: 1721198960890,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.97',
                    url: '',
                    blocked: false,
                    timeStamp: 1721198960473,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'TPCDDeprecationTrial',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'WooCommerce / Jetpack',
                category: 'Functional',
                gdprUrl: 'https://automattic.com/privacy/',
                description: 'OCD_tk_ai_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_SOME_EVENTS',
              },
            },
            'tk_qs:.jetpack.com:/': {
              parsedCookie: {
                name: 'tk_qs',
                domain: '.jetpack.com',
                path: '/',
                value: '',
                sameSite: 'Lax',
                expires: 1721200760,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.109',
                    url: 'https://jetpack.com/wp-admin/admin-ajax.php',
                    blocked: false,
                    timeStamp: 1721198960929,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.108',
                    url: 'https://jetpack.com/wp-content/uploads/2022/06/cropped-jp-favicon-new-3.png?w=32',
                    blocked: false,
                    timeStamp: 1721198960890,
                  },
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.97',
                    url: '',
                    blocked: false,
                    timeStamp: 1721198960473,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'WordPress',
                category: 'Analytics',
                gdprUrl: 'https://wordpress.org/about/privacy/',
                description: 'OCD_tk_qs_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_SOME_EVENTS',
              },
            },
            'country_code:.jetpack.com:/': {
              parsedCookie: {
                name: 'country_code',
                domain: '.jetpack.com',
                path: '/',
                value: 'IN',
                sameSite: 'Lax',
                expires: 1721220560.929204,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Unknown',
                category: 'Uncategorized',
                gdprUrl: '',
                description: '',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
            'region:.jetpack.com:/': {
              parsedCookie: {
                name: 'region',
                domain: '.jetpack.com',
                path: '/',
                value: 'Punjab',
                sameSite: 'Lax',
                expires: 1721220560.92935,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Unknown',
                category: 'Uncategorized',
                gdprUrl: '',
                description: '',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
            '_gcl_au:.jetpack.com:/': {
              parsedCookie: {
                name: '_gcl_au',
                domain: '.jetpack.com',
                path: '/',
                value: '1.1.811960792.1721198961',
                sameSite: 'Lax',
                expires: 1728974961,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Google',
                category: 'Marketing',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__gcl_au_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
            '_fbp:.jetpack.com:/': {
              parsedCookie: {
                name: '_fbp',
                domain: '.jetpack.com',
                path: '/',
                value: 'fb.1.1721198961333.740114592473536986',
                sameSite: 'Lax',
                expires: 1728974961,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Facebook',
                category: 'Marketing',
                gdprUrl: 'https://www.facebook.com/about/privacy/',
                description: 'OCD__fbp_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
            '_gid:.jetpack.com:/': {
              parsedCookie: {
                name: '_gid',
                domain: '.jetpack.com',
                path: '/',
                value: 'GA1.2.1116612751.1721198961',
                sameSite: 'Lax',
                expires: 1721285361,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__gid_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
            '_gat_gtag_UA_52447_43:.jetpack.com:/': {
              parsedCookie: {
                name: '_gat_gtag_UA_52447_43',
                domain: '.jetpack.com',
                path: '/',
                value: '1',
                sameSite: 'Lax',
                expires: 1721199021,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__gat__description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
            '_ga:.jetpack.com:/': {
              parsedCookie: {
                name: '_ga',
                domain: '.jetpack.com',
                path: '/',
                value: 'GA1.1.1031042230.1721198961',
                sameSite: 'Lax',
                expires: 1755758961.579638,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__ga_description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
            '_ga_K8CRH0LL00:.jetpack.com:/': {
              parsedCookie: {
                name: '_ga_K8CRH0LL00',
                domain: '.jetpack.com',
                path: '/',
                value: 'GS1.1.1721198961.1.0.1721198976.45.0.0',
                sameSite: 'Lax',
                expires: 1755758976.312268,
                httpOnly: false,
                secure: false,
              },
              networkEvents: {
                requestEvents: [
                  {
                    type: 'CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO',
                    requestId: '32686.101',
                    url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
                    blocked: true,
                    timeStamp: 1721198976497,
                  },
                ],
                responseEvents: [],
              },
              isBlocked: true,
              blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'],
              exemptionReason: 'None',
              url: 'https://jetpack.com/wp-content/uploads/2013/11/screen-shot-2015-02-20-at-12-19-40.png?w=350&h=200&crop=1',
              headerType: 'request',
              analytics: {
                platform: 'Google Analytics',
                category: 'Analytics',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD__ga___description',
              },
              isFirstParty: true,
              blockingStatus: {
                inboundBlock: 'NOT_BLOCKED',
                outboundBlock: 'BLOCKED_IN_ALL_EVENTS',
              },
            },
          },
        },
        'https://td.doubleclick.net': {
          frameCookies: {
            'test_cookie:.doubleclick.net:/': {
              parsedCookie: {
                name: 'test_cookie',
                domain: '.doubleclick.net',
                path: '/',
                value: 'CheckForPermission',
                sameSite: 'none',
                expires: '2024-07-17T07:04:21.000Z',
                httpOnly: false,
                secure: true,
              },
              networkEvents: {
                requestEvents: [],
                responseEvents: [
                  {
                    type: 'CDP_RESPONSE_RECEIVED_EXTRA_INFO',
                    requestId: 'D74462BA340BC2BAF744A1FF76F89FF4',
                    url: 'https://td.doubleclick.net/td/ga/rul?tid=G-K8CRH0LL00&gacid=1031042230.1721198961&gtm=45je47f0v883586308za200&dma=0&gcs=G111&gcd=13t3t3t3t5&npa=0&pscdl=&aip=1&fledge=1&frm=0&z=1928169415',
                    blocked: true,
                    timeStamp: 1721198961834,
                  },
                ],
              },
              isBlocked: true,
              blockedReasons: ['ThirdPartyPhaseout'],
              url: 'https://td.doubleclick.net/td/ga/rul?tid=G-K8CRH0LL00&gacid=1031042230.1721198961&gtm=45je47f0v883586308za200&dma=0&gcs=G111&gcd=13t3t3t3t5&npa=0&pscdl=&aip=1&fledge=1&frm=0&z=1928169415',
              headerType: 'response',
              analytics: {
                platform: 'DoubleClick/Google Marketing',
                category: 'Functional',
                gdprUrl: 'https://policies.google.com/privacy',
                description: 'OCD_test_cookie_description',
              },
              isFirstParty: false,
              blockingStatus: {
                inboundBlock: 'BLOCKED_IN_ALL_EVENTS',
                outboundBlock: 'NOT_BLOCKED',
              },
            },
          },
        },
        'https://r-login.wordpress.com': {
          frameCookies: {},
        },
      },
      libraryMatches: {
        gsiV2: {
          signatureMatches: 0,
          matches: [],
          moduleMatch: 0,
        },
        gis: {
          signatureMatches: 0,
          matches: [],
        },
        'fb-comments': {
          domQuerymatches: [],
        },
        'fb-likes': {
          domQuerymatches: [],
        },
        'disqus-comments': {
          domQuerymatches: [],
        },
        'jetpack-comments': {
          domQuerymatches: [],
        },
        'jetpack-likes': {
          domQuerymatches: [],
        },
      },
    },
  ],
  type: 'sitemap',
  selectedSite: 'psat-csv-test',
  translations: {
    analyzing: {
      message: 'Analyzing $type$ in urls $one$ - $two$',
      placeholders: {
        type: {
          content: '$1',
          example: 'cookies',
        },
        one: {
          content: '$2',
          example: '5',
        },
        two: {
          content: '$3',
          example: '10',
        },
      },
    },
    doneAnalyzing: {
      message: 'Done analyzing $type$ in urls $one$ - $two$',
      placeholders: {
        type: {
          content: '$1',
          example: 'cookies',
        },
        one: {
          content: '$2',
          example: '5',
        },
        two: {
          content: '$3',
          example: '10',
        },
      },
    },
    errorParsingSitemap: {
      message: 'Error: error parsing sitemap',
    },
    parsingSitemap: {
      message: 'Parsing sitemap',
    },
    doneParsingSitemap: {
      message: 'Done parsing sitemap',
    },
    parsingCSV: {
      message: 'Parsing CSV file',
    },
    cSVHasNoUrls: {
      message: 'Provided CSV file has no urls',
    },
    notValidUrl: {
      message: '$url$ is not a valid url',
      placeholders: {
        url: {
          content: '$1',
          example: 'http://www.example.com',
        },
      },
    },
    doneParsingCSV: {
      message: 'Done parsing CSV file',
    },
    parsingXML: {
      message: 'Parsing XML file',
    },
    xMLSchemaNotSupported: {
      message:
        'Sorry, XML Schema for Sitemap index files is not supported by the tool',
    },
    noUrlsInXMLUrlset: {
      message: 'Provided XML files has no urls in its urlset',
    },
    noUrlsInXML: {
      message: 'Provided XML files has no urls',
    },
    doneParsingXML: {
      message: 'Done parsing XML file',
    },
    errorParsingCSV: {
      message: 'Error: error parsing CSV file',
    },
    cliInvalidPort: {
      message: 'Invalid port argument. Please provide a port >=0 and <=65536',
    },
    cliProvideCLIArguments: {
      message:
        'Please provide one and only one of the following\n a) URL of a site (-u or --url)\n b) URL of a sitemap (-s or --sitemap-url)\n c) Path to a CSV file (-c or --csv-path)\n d) Path to an XML file (-p or --sitemap-path)',
    },
    noFileFound: {
      message: 'No file at $path$',
      placeholders: {
        path: {
          content: '$1',
          example: '/path/to/file',
        },
      },
    },
    notValidNumber: {
      message: '$number$ is not a valid numberic value',
      placeholders: {
        number: {
          content: '$1',
          example: '5',
        },
      },
    },
    cliUrlInvalid: {
      message: 'Provided URL $url$ is not valid',
      placeholders: {
        url: {
          content: '$1',
          example: 'http://www.example.com',
        },
      },
    },
    dirNotExists: {
      message: '$outDir$ does not exist, creating now.',
      placeholders: {
        outDir: {
          content: '$1',
          example: '/path/to/directory',
        },
      },
    },
    toTest3PCookies: {
      message: 'CLI to test a URL for 3p cookies',
    },
    urlOfSite: {
      message: 'URL of a site',
    },
    urlOfSitemap: {
      message: 'URL of a sitemap',
    },
    pathToCSV: {
      message: 'Path to a CSV file with a set of URLs.',
    },
    pathToSitemap: {
      message: 'Path to a sitemap saved in the file system',
    },
    portForServer: {
      message: 'A port for the CLI dashboard server.',
    },
    urlLimit: {
      message: 'No of URLs to analyze',
    },
    nonHeadless: {
      message: 'Flag for running puppeteer in non-headless mode',
    },
    noPrompts: {
      message: 'Flags for skipping all prompts. Default options will be used',
    },
    noTechnology: {
      message: 'Flags for skipping technology analysis.',
    },
    outDir: {
      message: 'Directory path where the analysis data will be stored',
    },
    acceptBanner: {
      message: 'This will accept the GDPR banner if present.',
    },
    reportServedAt: {
      message: 'Report: $url$',
      placeholders: {
        url: {
          content: '$1',
          example: 'http://localhost:3000',
        },
      },
    },
    errorInPort: {
      message:
        'Error: Report server port $port$ already in use. You might be already running CLI',
      placeholders: {
        port: {
          content: '$1',
          example: '3000',
        },
      },
    },
    urlCountPrompt: {
      message:
        'Provided $type$ has $urlsLength$ pages. Please enter the number of pages you want to analyze (Default $urlsLength$):',
      placeholders: {
        type: {
          content: '$1',
          example: 'sitemap',
        },
        urlsLength: {
          content: '$2',
          example: '5',
        },
      },
    },
    analyzingUrls: {
      message: 'Analysing $numberOfUrls$ urls.',
      placeholders: {
        numberOfUrls: {
          content: '$1',
          example: '5',
        },
      },
    },
    analyzingAllUrls: {
      message: 'Analysing all $urlsLength$ urls.',
      placeholders: {
        urlsLength: {
          content: '$1',
          example: '5',
        },
      },
    },
    analyzingCookies: {
      message: 'Analysing cookies on first site visit',
    },
    doneAnalyzingCookies: {
      message: 'Done analyzing cookies.',
    },
    analyzingTechnologies: {
      message: 'Analyzing technologies',
    },
    doneAnalyzingTechonlogies: {
      message: 'Done analyzing technologies',
    },
    unknown: {
      message: 'Unknown',
    },
    uncategorized: {
      message: 'Uncategorized',
    },
    lax: {
      message: 'Lax',
    },
    session: {
      message: 'Session',
    },
    sitemapReport: {
      message: 'Sitemap report',
    },
    cookieIssues: {
      message: 'Cookie Issues',
    },
    cookies: {
      message: 'Cookies',
    },
    technologies: {
      message: 'Technologies',
    },
    blockedCookies: {
      message: 'Blocked Cookies',
    },
    blockedReasons: {
      message: 'Blocked Reasons',
    },
    blockedReasonsNote: {
      message:
        'Cookies that have been blocked by the browser. (The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason).',
    },
    selectAll: {
      message: 'All',
    },
    noCookies: {
      message: 'No cookies found on this page',
    },
    tryReloading: {
      message: 'Please try reloading the page',
    },
    downloadReport: {
      message: 'Download Report',
    },
    name: {
      message: 'Name',
    },
    description: {
      message: 'Description',
    },
    confidence: {
      message: 'Confidence',
    },
    website: {
      message: 'Website',
    },
    category: {
      message: 'Category',
    },
    technologyDetails: {
      message: 'Technology Details',
    },
    selectRowToPreview: {
      message: 'Select row to preview its value',
    },
    noDescription: {
      message: 'No description available',
    },
    scope: {
      message: 'Scope',
    },
    domain: {
      message: 'Domain',
    },
    partitionKey: {
      message: 'Partition Key',
    },
    sameSite: {
      message: 'SameSite',
    },
    platform: {
      message: 'Platform',
    },
    httpOnly: {
      message: 'HttpOnly',
    },
    secure: {
      message: 'Secure',
    },
    value: {
      message: 'Value',
    },
    path: {
      message: 'Path',
    },
    expires: {
      message: 'Expires / Max-Age',
    },
    firstParty: {
      message: 'First Party',
    },
    thirdParty: {
      message: 'Third Party',
    },
    true: {
      message: 'True',
    },
    false: {
      message: 'False',
    },
    retentionPeriod: {
      message: 'Retention Period',
    },
    shortTerm: {
      message: 'Short Term (<24h)',
    },
    mediumTerm: {
      message: 'Medium Term (24h - 1 week)',
    },
    longTerm: {
      message: 'Long Term (1 week - 1 month)',
    },
    extentedTerm: {
      message: 'Extended Term (>1 month)',
    },
    noPathProvided: {
      message: 'No path provided',
    },
    none: {
      message: 'None',
    },
    strict: {
      message: 'Strict',
    },
    unknownFrames: {
      message: 'Unknown Frames',
    },
    issues: {
      message: 'Issues',
    },
    gdpr: {
      message: 'GDPR Portal',
    },
    categories: {
      message: 'Categories',
    },
    body_SecureOnly: {
      message:
        "This cookie was blocked because it had the 'Secure' attribute and the connection was not secure.",
    },
    body_NotOnPath: {
      message:
        "This cookie was blocked because its path was not an exact match for, or a superdirectory of, the request URL's path.",
    },
    body_DomainMismatch: {
      message:
        "This cookie was blocked because the request URL's domain did not exactly match the cookie's domain, nor was the request URL's domain a subdomain of the cookie's Domain attribute value.",
    },
    body_SameSiteStrict: {
      message:
        "This cookie was blocked because it had the 'SameSite=Strict' attribute and the request was made from a different site. This includes top-level navigation requests initiated by other sites.",
    },
    body_SameSiteLax: {
      message:
        "This cookie was blocked because it had the 'SameSite=Lax' attribute and the request was made from a different site and was not initiated by a top-level navigation.",
    },
    body_SameSiteUnspecifiedTreatedAsLax: {
      message:
        "This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to 'SameSite=Lax', and was blocked because the request was made from a different site and was not initiated by a top-level navigation. The cookie had to have been set with 'SameSite=None' to enable cross-site usage.",
    },
    body_SameSiteNoneInsecure: {
      message:
        "This cookie was blocked because it had the 'SameSite=None' attribute but was not marked 'Secure'. Cookies without SameSite restrictions must be marked 'Secure' and sent over a secure connection.",
    },
    body_UserPreferences: {
      message: 'This cookie was blocked due to user preferences.',
    },
    body_ThirdPartyPhaseout: {
      message: 'Prepare for phasing out third-party cookies.',
    },
    body_ThirdPartyBlockedInFirstPartySet: {
      message:
        'The cookie was blocked by third-party cookie blocking between sites in the same First-Party Set.',
    },
    body_UnknownError: {
      message: 'Unknown error.',
    },
    body_SchemefulSameSiteStrict: {
      message:
        "This cookie was blocked because it had the 'SameSite=Strict' attribute but the request was cross-site. This includes top-level navigation requests initiated by other sites. This request is considered cross-site because the URL has a different scheme than the current site.",
    },
    body_SchemefulSameSiteLax: {
      message:
        "This cookie was blocked because it had the 'SameSite=Lax' attribute but the request was cross-site and was not initiated by a top-level navigation. This request is considered cross-site because the URL has a different scheme than the current site.",
    },
    body_SchemefulSameSiteUnspecifiedTreatedAsLax: {
      message:
        "This cookie didn't specify a 'SameSite' attribute when it was stored, was defaulted to 'SameSite=Lax', and was blocked because the request was cross-site and was not initiated by a top-level navigation. The cookie had to have been set with 'SameSite=None' to enable cross-site usage. This request is considered cross-site because the URL has a different scheme than the current site.",
    },
    body_SamePartyFromCrossPartyContext: {
      message:
        "This cookie was blocked because it had the 'SameParty' attribute but the request was cross-party. The request was considered cross-party because the domain of the resource's URL and the domains of the resource's enclosing frames/documents are neither owners nor members in the same first-party set.",
    },
    body_NameValuePairExceedsMaxSize: {
      message:
        'This cookie was blocked because it was too large. The combined size of the name and value must be less than or equal to 4,096 characters.',
    },
    body_InvalidDomain: {
      message:
        "This attempt to set a cookie via 'Set-Cookie' header was blocked because its Domain value was invalid with regards to the current host url.",
    },
    header_sameSiteExcludeNavigationContextDowngradeSecure: {
      message:
        'Migrate entirely to HTTPS to have cookies sent on same-site requests',
    },
    body_1_sameSiteExcludeNavigationContextDowngradeSecure: {
      message:
        "A cookie was not sent to a secure origin from an insecure context on a navigation. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_sameSiteExcludeNavigationContextDowngradeSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_sameSiteExcludeNavigationContextDowngradeInsecure: {
      message:
        'Migrate entirely to HTTPS to have cookies sent on same-site requests',
    },
    body_1_sameSiteExcludeNavigationContextDowngradeInsecure: {
      message:
        "A cookie was not sent to an insecure origin from a secure context on a navigation. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_sameSiteExcludeNavigationContextDowngradeInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_sameSiteExcludeContextDowngradeSetCookieSecure: {
      message:
        'Migrate entirely to HTTPS to allow cookies to be set by same-site subresources',
    },
    body_1_sameSiteExcludeContextDowngradeSetCookieSecure: {
      message:
        "A cookie was not set by an insecure origin in a secure context. Because this cookie would have been set across schemes on the same site, it was blocked. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_sameSiteExcludeContextDowngradeSetCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_sameSiteExcludeContextDowngradeSetCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to allow cookies to be set by same-site subresources',
    },
    body_1_sameSiteExcludeContextDowngradeSetCookieInsecure: {
      message:
        "A cookie was not set by a secure origin in an insecure context. Because this cookie would have been set across schemes on the same site, it was blocked. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_sameSiteExcludeContextDowngradeSetCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_sameSiteExcludeContextDowngradeReadCookieSecure: {
      message:
        'Migrate entirely to HTTPS to have cookies sent to same-site subresources',
    },
    body_1_sameSiteExcludeContextDowngradeReadCookieSecure: {
      message:
        "A cookie was not sent to a secure origin from an insecure context. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_sameSiteExcludeContextDowngradeReadCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_sameSiteExcludeContextDowngradeReadCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to have cookies sent to same-site subresources',
    },
    body_1_sameSiteExcludeContextDowngradeReadCookieInsecure: {
      message:
        "A cookie was not sent to an insecure origin from a secure context. Because this cookie would have been sent across schemes on the same site, it was not sent. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_sameSiteExcludeContextDowngradeReadCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    body_ExcludeSameSiteUnspecifiedTreatedAsLax: {
      message:
        "This 'Set-Cookie' header didn't specify a 'SameSite' attribute and was defaulted to 'SameSite=Lax' and was blocked because it came from a cross-site response which was not the response to a top-level navigation. The 'Set-Cookie' had to have been set with 'SameSite=None' to enable cross-site usage.",
    },
    header_cookieCrossSiteRedirectDowngrade: {
      message: 'Cookie is blocked due to a cross-site redirect chain',
    },
    body_1_cookieCrossSiteRedirectDowngrade: {
      message:
        "The cookie was blocked because the URL redirect chain was not fully same-site, meaning the final request was treated as a cross-site request. Like other cross-site requests, this blocks cookies with 'SameSite=Lax' or 'SameSite=Strict'.",
    },
    body_2_cookieCrossSiteRedirectDowngrade: {
      message:
        'For example: If site A redirects to site B which then redirects back to site A, the final request to site A will be a cross-site request.',
    },
    header_ExcludeSameSiteNoneInsecureSetCookie: {
      message:
        'Mark cross-site cookies as Secure to allow setting them in cross-site contexts',
    },
    body_ExcludeSameSiteNoneInsecureSetCookie: {
      message:
        "Cookies marked with 'SameSite=None' must also be marked with 'Secure' to allow setting them in a cross-site context. This behavior protects user data from being sent over an insecure connection.",
    },
    header_ExcludeSameSiteNoneInsecureReadCookie: {
      message:
        'Mark cross-site cookies as Secure to allow them to be sent in cross-site requests',
    },
    body_ExcludeSameSiteNoneInsecureReadCookie: {
      message:
        "Cookies marked with 'SameSite=None' must also be marked with 'Secure' to get sent in cross-site requests. This behavior protects user data from being sent over an insecure connection.",
    },
    header_ExcludeInvalidSameParty: {
      message:
        'Mark SameParty cookies as Secure and do not use SameSite=Strict for SameParty cookies',
    },
    body_ExcludeInvalidSameParty: {
      message:
        "Cookies marked with 'SameParty' must also be marked with 'Secure'. In addition, cookies marked with 'SameParty' cannot use 'SameSite=Strict'.",
    },
    header_ExcludeSamePartyCrossPartyContext: {
      message: 'Make sure a cookie is using the SameParty attribute correctly',
    },
    body_ExcludeSamePartyCrossPartyContext: {
      message:
        "Setting cross-site cookies with the 'SameParty' attribute is only possible if both domains are a part of the same First-Party Set.",
    },
    header_ExcludeDomainNonASCII: {
      message:
        "Ensure cookie 'Domain' attribute values only contain ASCII characters",
    },
    body_1_ExcludeDomainNonASCII: {
      message:
        "'Domain' attributes in cookies are restricted to the ASCII character set. Any cookies that contain characters outside of the ASCII range in their 'Domain' attribute will be ignored.",
    },
    body_2_ExcludeDomainNonASCII: {
      message:
        "To resolve this issue, you need to remove all non-ASCII characters from the 'Domain' attribute of the affected cookies.",
    },
    body_3_ExcludeDomainNonASCII: {
      message:
        "If your site has an internationalized domain name (IDN), you should use punycode representation for the 'Domain' attribute instead.",
    },
    header_ExcludeThirdPartyCookieBlockedInFirstPartySet: {
      message: 'Third-party cookie blocked within the same First-Party Set',
    },
    body_ExcludeThirdPartyCookieBlockedInFirstPartySet: {
      message:
        "A cookie embedded by a site in the top-level page's First-Party Set was blocked by third-party cookie blocking.",
    },
    header_ExcludeThirdPartyPhaseoutReadCookie: {
      message: 'Cookie is blocked when sent in cross-site context',
    },
    body_ExcludeThirdPartyPhaseoutReadCookie: {
      message:
        "Cookies marked with 'SameSite=None; Secure;' and not 'Partitioned' are blocked in cross-site requests. This behavior protects user data from cross-site tracking.",
    },
    header_ExcludeThirdPartyPhaseoutSetCookie: {
      message: 'Cookie is blocked when set in cross-site context',
    },
    body_ExcludeThirdPartyPhaseoutSetCookie: {
      message:
        "Cookies marked with 'SameSite=None; Secure' and not 'Partitioned' are blocked in cross-site contexts. This behavior protects user data from cross-site tracking.",
    },
    header_WarnSameSiteUnspecifiedCrossSiteContextReadCookie: {
      message:
        'Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute',
    },
    body_WarnSameSiteUnspecifiedCrossSiteContextReadCookie: {
      message:
        "Because a cookie's 'SameSite' attribute was not set or is invalid, it defaults to 'SameSite=Lax', which will prevent the cookie from being sent in a cross-site request in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.",
    },
    header_WarnSameSiteUnspecifiedCrossSiteContextSetCookie: {
      message:
        'Indicate whether a cookie is intended to be set in cross-site context by specifying its SameSite attribute',
    },
    body_WarnSameSiteUnspecifiedCrossSiteContextSetCookie: {
      message:
        "Because a cookie's 'SameSite' attribute was not set or is invalid, it defaults to 'SameSite=Lax', which will prevent the cookie from being set in a cross-site context in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.",
    },
    header_WarnSameSiteNoneInsecureReadCookie: {
      message:
        'Mark cross-site cookies as Secure to allow them to be sent in cross-site requests',
    },
    body_WarnSameSiteNoneInsecureReadCookie: {
      message:
        "In a future version of the browser, cookies marked with 'SameSite=None' must also be marked with 'Secure' to get sent in cross-site requests. This behavior protects user data from being sent over an insecure connection.",
    },
    header_WarnSameSiteNoneInsecureSetCookie: {
      message:
        'Mark cross-site cookies as Secure to allow setting them in cross-site contexts',
    },
    body_WarnSameSiteNoneInsecureSetCookie: {
      message:
        "In a future version of the browser, cookies marked with 'SameSite=None' must also be marked with 'Secure' to allow setting them in a cross-site context. This behavior protects user data from being sent over an insecure connection.",
    },
    header_WarnSameSiteUnspecifiedLaxAllowUnsafeReadCookie: {
      message:
        'Indicate whether to send a cookie in a cross-site request by specifying its SameSite attribute',
    },
    body_WarnSameSiteUnspecifiedLaxAllowUnsafeReadCookie: {
      message:
        "Because a cookie's 'SameSite' attribute was not set or is invalid, it defaults to 'SameSite=Lax', which will prevent the cookie from being sent in a cross-site request in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.",
    },
    header_WarnSameSiteUnspecifiedLaxAllowUnsafeSetCookie: {
      message:
        'Indicate whether a cookie is intended to be set in cross-site context by specifying its SameSite attribute',
    },
    body_WarnSameSiteUnspecifiedLaxAllowUnsafeSetCookie: {
      message:
        "Because a cookie's 'SameSite' attribute was not set or is invalid, it defaults to 'SameSite=Lax', which will prevents the cookie from being set in a cross-site context in a future version of the browser. This behavior protects user data from accidentally leaking to third parties and cross-site request forgery.",
    },
    header_WarnSameSiteStrictLaxDowngradeStrictSecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent on same-site requests',
    },
    body_1_WarnSameSiteStrictLaxDowngradeStrictSecure: {
      message:
        "A cookie is being sent to a secure origin from an insecure context on a navigation. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictLaxDowngradeStrictSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictLaxDowngradeStrictInsecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent on same-site requests',
    },
    body_1_WarnSameSiteStrictLaxDowngradeStrictInsecure: {
      message:
        "A cookie is being sent to an insecure origin from a secure context on a navigation. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictLaxDowngradeStrictInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeStrictReadCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeStrictReadCookieSecure: {
      message:
        "A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeStrictReadCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeStrictReadCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeStrictReadCookieInsecure: {
      message:
        "A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeStrictReadCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeStrictSetCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeStrictSetCookieSecure: {
      message:
        "A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeStrictSetCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeStrictSetCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeStrictSetCookieInsecure: {
      message:
        "A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeStrictSetCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeLaxReadCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeLaxReadCookieSecure: {
      message:
        "A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeLaxReadCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeLaxReadCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeLaxReadCookieInsecure: {
      message:
        "A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeLaxReadCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeLaxSetCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeLaxSetCookieSecure: {
      message:
        "A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeLaxSetCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteStrictCrossDowngradeLaxSetCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources',
    },
    body_1_WarnSameSiteStrictCrossDowngradeLaxSetCookieInsecure: {
      message:
        "A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteStrictCrossDowngradeLaxSetCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeStrictReadCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteLaxCrossDowngradeStrictReadCookieSecure: {
      message:
        "A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeStrictReadCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeStrictReadCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteLaxCrossDowngradeStrictReadCookieInsecure: {
      message:
        "A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeStrictReadCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeStrictSetCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources',
    },
    body_1_WarnSameSiteLaxCrossDowngradeStrictSetCookieSecure: {
      message:
        "A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeStrictSetCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeStrictSetCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresource',
    },
    body_1_WarnSameSiteLaxCrossDowngradeStrictSetCookieInsecure: {
      message:
        "A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeStrictSetCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeLaxReadCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteLaxCrossDowngradeLaxReadCookieSecure: {
      message:
        "A cookie is being sent to a secure origin from an insecure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeLaxReadCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeLaxReadCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue having cookies sent to same-site subresources',
    },
    body_1_WarnSameSiteLaxCrossDowngradeLaxReadCookieInsecure: {
      message:
        "A cookie is being sent to an insecure origin from a secure context. Because this cookie is being sent across schemes on the same site, it will not be sent in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeLaxReadCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeLaxSetCookieSecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources',
    },
    body_1_WarnSameSiteLaxCrossDowngradeLaxSetCookieSecure: {
      message:
        "A cookie is being set by a secure origin in an insecure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeLaxSetCookieSecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnSameSiteLaxCrossDowngradeLaxSetCookieInsecure: {
      message:
        'Migrate entirely to HTTPS to continue allowing cookies to be set by same-site subresources',
    },
    body_1_WarnSameSiteLaxCrossDowngradeLaxSetCookieInsecure: {
      message:
        "A cookie is being set by an insecure origin in a secure context. Because this cookie is being set across schemes on the same site, it will be blocked in a future version of Chrome. This behavior enhances the 'SameSite' attribute's protection of user data from request forgery by network attackers.",
    },
    body_2_WarnSameSiteLaxCrossDowngradeLaxSetCookieInsecure: {
      message:
        "Resolve this issue by migrating your site (as defined by the eTLD+1) entirely to HTTPS. It is also recommended to mark the cookie with the 'Secure' attribute if that is not already the case.",
    },
    header_WarnAttributeValueExceedsMaxSize: {
      message: "Ensure cookie attribute values don't exceed 1024 characters",
    },
    body_1_WarnAttributeValueExceedsMaxSize: {
      message:
        'Cookie attribute values exceeding 1024 characters in size will result in the attribute being ignored. This could lead to unexpected behavior since the cookie will be processed as if the offending attribute / attribute value pair were not present.',
    },
    body_2_WarnAttributeValueExceedsMaxSize: {
      message:
        "Resolve this issue by ensuring that cookie attribute values don't exceed 1024 characters.",
    },
    header_WarnDomainNonASCII: {
      message:
        "Ensure cookie 'Domain' attribute values only contain ASCII characters",
    },
    body_1_WarnDomainNonASCII: {
      message:
        "'Domain' attributes in cookies are restricted to the ASCII character set. Any cookies that contain characters outside of the ASCII range in their 'Domain' attribute will be ignored in the future.",
    },
    body_2_WarnDomainNonASCII: {
      message:
        "To resolve this issue, you need to remove all non-ASCII characters from the 'Domain' attribute of the affected cookies.",
    },
    body_3_WarnDomainNonASCII: {
      message:
        "If your site has an internationalized domain name (IDN), you should use punycode representation for the 'Domain' attribute instead.",
    },
    header_WarnThirdPartyPhaseoutReadCookie: {
      message:
        'Cookie sent in cross-site context will be blocked in future Chrome versions',
    },
    body_WarnThirdPartyPhaseoutReadCookie: {
      message:
        "In a future version of the browser, cookies marked with 'SameSite=None; Secure' and not 'Partitioned' will be blocked in cross-site requests. This behavior protects user data from cross-site tracking.",
    },
    header_WarnThirdPartyPhaseoutSetCookie: {
      message:
        'Cookie set in cross-site context will be blocked in future Chrome versions',
    },
    body_WarnThirdPartyPhaseoutSetCookie: {
      message:
        "In a future version of the browser, cookies marked with 'SameSite=None; Secure' and not 'Partitioned' will be blocked in cross-site context. This behavior protects user data from cross-site tracking.",
    },
    header_WarnCrossSiteRedirectDowngradeChangesInclusion: {
      message: 'Cookie is blocked due to a cross-site redirect chain',
    },
    body_1_WarnCrossSiteRedirectDowngradeChangesInclusion: {
      message:
        "The cookie was blocked because the URL redirect chain was not fully same-site, meaning the final request was treated as a cross-site request. Like other cross-site requests, this blocks cookies with 'SameSite=Lax' or 'SameSite=Strict'.",
    },
    body_2_WarnCrossSiteRedirectDowngradeChangesInclusion: {
      message:
        'For example: If site A redirects to site B which then redirects back to site A, the final request to site A will be a cross-site request.',
    },
    exemptionReasonUserSetting: {
      message: 'This cookie is allowed by user preference.',
    },
    exemptionReasonTPCDMetadata: {
      message:
        'This cookie is allowed by a third-party cookie deprecation trial grace period.',
    },
    exemptionReasonTPCDDeprecationTrial: {
      message:
        'This cookie is allowed by third-party cookie phaseout deprecation trial.',
    },
    exemptionReasonTPCDHeuristics: {
      message:
        'This cookie is allowed by third-party cookie phaseout heuristics.',
    },
    exemptionReasonEnterprisePolicy: {
      message: 'This cookie is allowed by Chrome Enterprise policy.',
    },
    exemptionReasonStorageAccessAPI: {
      message: 'This cookie is allowed by the Storage Access API.',
    },
    exemptionTopLevelAccessAPI: {
      message: 'This cookie is allowed by the top-level Storage Access API.',
    },
    exemptionReasonCorsOptIn: {
      message: 'This cookie is allowed by CORS opt-in',
    },
    yes: {
      message: 'Yes',
    },
    no: {
      message: 'No',
    },
    totalCookies: {
      message: 'Total Cookies',
    },
    totalFirstPartyCookies: {
      message: 'Total First Party Cookies',
    },
    totalThirdPartyCookies: {
      message: 'Total Third Party Cookies',
    },
    analyticsCookies: {
      message: 'Analytics Cookies',
    },
    functionalCookies: {
      message: 'Functional Cookies',
    },
    marketingCookies: {
      message: 'Marketing Cookies',
    },
    uncategorizedCookies: {
      message: 'Uncategorized Cookies',
    },
    cookiesWithIssues: {
      message: 'Cookies with Issues',
    },
    analyticsCookiesWithIssues: {
      message: 'Analytics Cookies with Issues',
    },
    functionalCookiesWithIssues: {
      message: 'Functional Cookies with Issues',
    },
    marketingCookiesWithIssues: {
      message: 'Marketing Cookies with Issues',
    },
    uncategorizedCookiesWithIssues: {
      message: 'Uncategorized Cookies with Issues',
    },
    noNews: {
      message: 'No News',
    },
    thirdPartyCookies: {
      message: '3rd Party Cookies',
    },
    newChromeProfile: {
      message:
        'Cookies must be analyzed on a new, clean Chrome profile for an accurate report',
    },
    allowListed: {
      message: 'Allow Listed',
    },
    allowListedNote: {
      message:
        'The cookie domain was added to the allow-list for this session, however the browser may still block these cookies for various reasons, such as invalid attributes. You can check the allowed domains under $path$.',
      placeholders: {
        path: {
          content: '$1',
          example: 'chrome://settings/content/siteData',
        },
      },
    },
    blockedReason: {
      message: 'Blocked Reason',
    },
    blockedInAtLeastOne: {
      message: 'This cookie was blocked in at least one of the $type$.',
      placeholders: {
        type: {
          content: '$1',
          example: 'requests',
        },
      },
    },
    blockedInAll: {
      message: 'This cookie was blocked in all $type$',
      placeholders: {
        type: {
          content: '$1',
          example: 'requests',
        },
      },
    },
    blockedInAllRequestResponse: {
      message: 'This cookie was blocked in all of the requests and responses.',
    },
    blockedInSomeRequestResponse: {
      message: 'This cookie was blocked in some of the requests and responses.',
    },
    blockedinSomeAndAll: {
      message:
        'This cookie was blocked in all $type1$ and at least one of the $type2$.',
      placeholders: {
        type1: {
          content: '$1',
          example: 'requests',
        },
        type2: {
          content: '$2',
          example: 'responses',
        },
      },
    },
    warnings: {
      message: 'Warnings',
    },
    cookieValue: {
      message: 'Cookie Value',
    },
    uRLDecoded: {
      message: 'Show URL-decoded',
    },
    selectCookie: {
      message: 'Select cookies to preview its value',
    },
    numberOfFrames: {
      message: 'Number of Frames',
    },
    numberOfFramesNote: {
      message: "'Number of unique frames found across the page(s).'",
    },
    numberOfFramesWithAssociatedCookies: {
      message: 'Number of Frames with Associated Cookies',
    },
    numberOfFramesWithAssociatedCookiesNote: {
      message:
        'Unique frames across the page(s) that have cookies associated with them.',
    },
    extensionUpdated: {
      message: 'Looks like extension has been updated since devtool was open.',
    },
    refreshPanel: {
      message: 'Refresh Panel',
    },
    wentWrong: {
      message: 'Something went wrong!',
    },
    openInNewTab: {
      message: 'Please try opening this page in a new tab.',
    },
    hoverOverIframes: {
      message:
        'Hover over the iframes on the page or select frames below to inspect them.',
    },
    proposal: {
      message: 'Proposal',
    },
    proposalNote: {
      message: 'Public explanation for the proposed solution (Chrome)',
    },
    publicDiscussion: {
      message: 'Public Discussion',
    },
    publicDiscussionNote: {
      message: 'Public questions and feedback about the proposal',
    },
    videoOverview: {
      message: 'Video Overview',
    },
    videoOverviewNote: {
      message: 'Short summary video',
    },
    devDocumentation: {
      message: 'Dev Documentation',
    },
    devDocumentationNote: {
      message: 'Developer documentation',
    },
    learnMore: {
      message: 'Learn more about PSAT',
    },
    joinDiscussions: {
      message: 'Join the discussions',
    },
    reportBug: {
      message: 'Report a bug',
    },
    reportBreakage: {
      message: 'Report a breakage',
    },
    requestMigrationTime: {
      message: 'Request Additional Migration Time',
    },
    quickLinks: {
      message: 'Quick Links',
    },
    latestNews: {
      message: 'Latest News',
    },
    viewMore: {
      message: 'View More',
    },
    collapseView: {
      message: 'Collapse View',
    },
    expandView: {
      message: 'Expand View',
    },
    search: {
      message: 'Search',
    },
    clearSearch: {
      message: 'Clear Search',
    },
    toggleAll: {
      message: 'Toggle All',
    },
    clearAll: {
      message: 'Clear All',
    },
    collapseAll: {
      message: 'Collapse All',
    },
    expandAll: {
      message: 'Expand All',
    },
    showLess: {
      message: 'Show Less',
    },
    showMore: {
      message: 'Show More',
    },
    count: {
      message: 'Count',
    },
    reload: {
      message: 'Reload',
    },
    firstPartyCookies: {
      message: '1st Party Cookies',
    },
    functional: {
      message: 'Functional',
    },
    marketing: {
      message: 'Marketing',
    },
    analytics: {
      message: 'Analytics',
    },
    frames: {
      message: 'Frames',
    },
    totalFrames: {
      message: 'Total Frames',
    },
    framesWithCookies: {
      message: 'Frames with Cookies',
    },
    framesWithBlockedCookies: {
      message: 'Frames with Blocked Cookies',
    },
    framesWithUnblockedCookies: {
      message: 'Frames with Unblocked Cookies',
    },
    fencedFrames: {
      message: 'Fenced Frames',
    },
    exemptionReason: {
      message: 'Exemption Reason',
    },
    waitForLD: {
      message: 'Wait for library detection',
    },
    openFilterOptions: {
      message: 'Open Filter Options',
    },
    header_ExcludeSameSiteNoneInsecure: {
      message:
        'Mark cross-site cookies as Secure to allow them to be sent in cross-site requests',
    },
    body_ExcludeSameSiteNoneInsecure: {
      message:
        "Cookies marked with 'SameSite=None' must also be marked with 'Secure' to get sent in cross-site requests. This behavior protects user data from being sent over an insecure connection.",
    },
    somethingWentWrong: {
      message: 'Something went wrong!',
    },
    body_ExcludeThirdPartyPhaseout: {
      message:
        "Cookie is blocked when sent in cross-site context. Cookies marked with 'SameSite=None; Secure;' and not 'Partitioned' are blocked in cross-site requests. This behavior protects user data from cross-site tracking.",
    },
    totalFramesNote: {
      message: 'The total frames present inside the current page.',
    },
    framesWithCookiesNote: {
      message: 'The count of frames which have cookies in them',
    },
    framesWithBlockedCookiesNote: {
      message: 'The count of frames which have blocked cookies',
    },
    framesWithUnblockedCookiesNote: {
      message: 'The count of frames which have unblocked cookies',
    },
    fencedFramesNote: {
      message:
        'A fenced frames is a proposed HTML element for embedded content, similar to an iframe. Unlike iframes, a fenced frame restricts communication with its embedding context to allow the frame access to cross-site data without sharing it with the embedding context.',
    },
    functionalNote: {
      message:
        'Cookies necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size, etc.)',
    },
    marketingNote: {
      message:
        "Cookies used to track visitors across websites, gathering information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
    },
    analyticsNote: {
      message:
        'Cookies used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site.',
    },
    uncategorizedNote: {
      message:
        'Cookies that could not be categorized. You may check sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
    },
    hiddenIframe: {
      message: 'Hidden iframe',
    },
    nestedIframe: {
      message: 'Nested iframe',
    },
    mainFrame: {
      message: 'Main frame',
    },
    iframe: {
      message: 'iframe',
    },
    medium: {
      message: 'Medium',
    },
    uncateogorized: {
      message: 'Uncategorized',
    },
    notUsingCDP: {
      message: 'Enable PSAT to use CDP via the',
    },
    settingsPage: {
      message: 'Settings page',
    },
    visitPSAT: {
      message: 'For more information, visit the PSAT',
    },
    wiki: {
      message: 'Wiki',
    },
    cookiesBlockedNote: {
      message:
        'Cookies that have been blocked by the browser. (The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason).',
    },
    framesNote: {
      message:
        'The details regarding frames and associated cookies in this page.',
    },
    libraryDetection: {
      message: 'Library Detection',
    },
    priority: {
      message: 'Priority',
    },
    size: {
      message: 'Size',
    },
    mapping: {
      message: 'Mapping',
    },
    blockingStatus: {
      message: 'Blocking Status',
    },
    lookAtNetworkTab: {
      message:
        "Please take a look at the network tab to get this cookie's blocking information.",
    },
    undetermined: {
      message: 'Undetermined',
    },
    blocked: {
      message: 'Blocked',
    },
    set: {
      message: 'Set',
    },
    notSet: {
      message: 'Not Set',
    },
    setVia: {
      message: 'Set Via',
    },
    http: {
      message: 'HTTP',
    },
    jS: {
      message: 'JS',
    },
    refreshJSCookies: {
      message: 'Refresh Cookies Set via JavaScript',
    },
    unmapped: {
      message: 'Unmapped',
    },
    couldNotMapCookies: {
      message: 'Cookies that could not be mapped to any frame.',
    },
    orphanedCookies: {
      message:
        'Frames that set these cookies were removed from the DOM, leaving these cookies orphaned.',
    },
    orphaned: {
      message: 'Orphaned',
    },
    copyNetworkFilter: {
      message: 'Copy Network Filter String',
    },
    removeParentDomainFromAllowList: {
      message: 'Remove $parentDomain$ From Allow List',
      placeholders: {
        parentDomain: {
          content: '$1',
          example: 'example.com',
        },
      },
    },
    removeDomainFromAllowList: {
      message: 'Remove Domain From Allow List',
    },
    allowDomin: {
      message: 'Allow Domain During Session',
    },
    membershipInExperimentGroup: {
      message: 'Membership in Experiment Group',
    },
    openTabs: {
      message: 'Open Tabs',
    },
    activeExtensions: {
      message: 'Active Extensions',
    },
    chromeVersion: {
      message: 'Chrome Version',
    },
    pSATVersion: {
      message: 'PSAT Version',
    },
    systemArchitecture: {
      message: 'OS - System Architecture',
    },
    systemInformation: {
      message: 'System Information',
    },
    pSATSettings: {
      message: 'PSAT Extension Settings',
    },
    settings: {
      message: 'Settings',
    },
    loading: {
      message: 'Loading',
    },
    membership: {
      message: 'Related Website Sets Membership',
    },
    belongsToRWS: {
      message: 'This site belongs to a Related Website Set.',
    },
    primaryDomain: {
      message: 'Primary Domain',
    },
    associatedDomainIdx: {
      message: 'Associated Domain #$index$',
      placeholders: {
        index: {
          content: '$1',
          example: '1',
        },
      },
    },
    rationale: {
      message: 'Rationale',
    },
    rWSPrimaryDomain: {
      message: 'This site is the primary domain of the Related Website Sets.',
      placeholders: {
        rws: {
          content: '$1',
          example: 'Related Website Set',
        },
      },
    },
    associatedSites: {
      message: 'Associated Sites',
    },
    serviceSites: {
      message: 'Service Sites',
    },
    notBelongToRWS: {
      message: 'This site does not belong to any Related Website Set.',
    },
    associatedSubset: {
      message: 'Associated Subset',
    },
    associatedDomainsLimit: {
      message:
        "Browsers may enforce a limit on Associated Domains (e.g. Chrome's limit is 5)",
    },
    rationaleDomainCount: {
      message: 'Rationale Domain #$index$',
      placeholders: {
        index: {
          content: '$1',
          example: '1',
        },
      },
    },
    affiliationHeading: {
      message: 'Affiliation to primary domain',
    },
    affiliationNote: {
      message:
        'How is the affiliation across domains presented and why users would expect it',
    },
    contact: {
      message: 'Contact',
    },
    contactNote: {
      message: 'Email address or group alias if available',
    },
    countryCodeHeading: {
      message: 'Country Code Top-level Domains (ccTLDs)',
    },
    whichSiteccTLD: {
      message: 'For which site is this ccTLD?',
    },
    selectSite: {
      message: 'Select a site',
    },
    extccTLDIdx: {
      message: 'ccTLD #$index$',
      placeholders: {
        index: {
          content: '$1',
          example: '1',
        },
      },
    },
    countryCodeNote: {
      message: 'Country code top-level domain related to the site',
    },
    rWSJSONHeading: {
      message: 'Here are your JSON resources',
    },
    followInstructions: {
      message:
        'Please follow the steps below to submit your Related Website Set to the canonical list.',
    },
    createPR: {
      message: 'Create Pull Request',
    },
    pRGuide: {
      message: 'View Pull Request guide',
    },
    countrySites: {
      message: 'Country Sites',
    },
    setPrimaryDomain: {
      message: 'Set Primary Domain',
    },
    serviceSubset: {
      message: 'Service Subset',
    },
    serviceDomainIdx: {
      message: 'Service Domain #$index$',
      placeholders: {
        index: {
          content: '$1',
          example: '1',
        },
      },
    },
    shouldMatchFormat: {
      message: 'should be matching the format https://<example.com>',
    },
    settingsChanged: {
      message: 'Settings changed, please reload all tabs.',
    },
    cookiesUsedByFrame: {
      message: 'Cookies used by frames from $url$',
      placeholders: {
        url: {
          content: '$1',
          example: 'https://example.com',
        },
      },
    },
    disableCDP: {
      message: 'Disable CDP',
    },
    enableCDP: {
      message: 'Enable CDP',
    },
    noMoreAnalysis: {
      message: 'Not much to analyze here',
    },
    emptyCookieJar: {
      message: 'Its emptier than a cookie jar after a midnight snack!',
    },
    analyzeThisTab: {
      message: 'Analyze this tab',
    },
    inspectInPSATPanel: {
      message: 'Inspect cookies in the "Privacy Sandbox" panel of DevTools',
      placeholders: {
        PS: {
          content: '$1',
          example: 'PSAT',
        },
      },
    },
    PSPrivateStateToken: {
      message:
        "Allows websites and services to evaluate a user's authenticity without needing to know the user's identity.   With this API, a website/service can issue a batch of Private State Tokens (renamed to Private state tokens from Trust Tokens) to a user's browser. The tokens are stored on the user’s browser and can then be “redeemed” by other sites and services as a signal of the user's authenticity.",
    },
    PSTopics: {
      message:
        'Provide a way for advertising to reach users based on interests inferred from the sites or apps the user visits, without needing to know the specific sites or apps the user has visited',
    },
    PSProtectedAudience: {
      message:
        'A proposal to serve remarketing and custom audience use cases by allowing custom defined interested groups to be stored on-device and allowing an on-device auction that then matches appropriate ads with people in a desired interest group.',
    },
    PSAttributionReporting: {
      message:
        'Allow the recording and matching of ad events with conversion events to occur on-device. </br> Event-level: Determine the effectiveness of specific ad interactions to help drive optimization. </br>Summary Reporting: Allows for more detail about the overall conversions (e.g. region, revenue, time of day, etc) that their advertising has delivered, while minimizing details about individual conversions.',
    },
    PSRelatedWebsiteSets: {
      message:
        'A new web platform mechanism that would allow a company that owns multiple sites to declare a collection of related domains as being in a Related Website Sets. Sites that are part of a Related Website Set would be able to access cookies across the set of included domains.',
    },
    PSSharedStorage: {
      message:
        'The Shared Storage API allows sites to store and access unpartitioned cross-site data as to prevent cross-site user tracking, browsers are partitioning all forms of storage (cookies, localStorage, caches, etc). However, there are a number of legitimate use cases that rely on unpartitioned storage which would be impossible without help from new web APIs.',
    },
    PSChips: {
      message:
        'A new way to enable 3rd party developers to access cookies on sites where their services are embedded on a per-site basis (meaning a different cookie on each site), restricting the ability to track users across sites.',
    },
    PSFencedFrames: {
      message:
        'A fenced frame (<fencedframe>) is a proposed HTML element for embedded content, similar to an iframe. Unlike iframes, a fenced frame restricts communication with its embedding context to allow the frame access to cross-site data without sharing it with the embedding context.',
    },
    PSFedCM: {
      message:
        'FedCM is a proposal for a privacy-preserving approach to federated identity services (such as "Sign in with...") where users can log into sites without sharing their personal information with the identity service or the site.',
    },
    PSBounceTracking: {
      message:
        'Bounce Tracking Mitigation is a Privacy Sandbox proposal to mitigate bounce tracking, a technique used to track users across sites by abusing the referrer header.',
    },
    PSUserAgentReduction: {
      message:
        'User-Agent (UA) reduction minimizes the identifying information shared in the User-Agent string, which may be used for passive fingerprinting.',
    },
    extgdprPortal: {
      message: 'GDPR Portal',
    },
    unknownFrameNote: {
      message:
        'We are unable to detect this frame as it may be an iframe nested inside one or more iframes.',
    },
    '1stPartyCookies': {
      message: '1st Party Cookies',
    },
    '3rdPartyCookies': {
      message: '3rd Party Cookies',
    },
    exemptedCookies: {
      message: 'Exempted Cookies',
    },
    setUpEvaluationEnvironment: {
      message:
        'Please setup the $anchor_tag_start$ evaluation environment$anchor_tag_end$ before analyzing cookies.',
      placeholders: {
        anchor_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        anchor_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    exemptionReasons: {
      message: 'Exemption Reasons',
    },
    exemptionReasonsNote: {
      message:
        'Cookies that should have been blocked by the browser but was exempted.',
    },
    memberShipInExperimentGroup: {
      message: 'Membership in Experiment Group',
    },
    memberShipInExperimentGroupNote: {
      message:
        'To prepare for third-party cookie deprecation, we will be providing Chrome-facilitated testing modes that allow sites to preview how site behavior and functionality work without third-party cookies. Check $anchor_tag_start$this guide$anchor_tag_end$ to learn more.',
      placeholders: {
        anchor_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        anchor_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    requestAdditionalMigrationTime: {
      message: 'Request Additional Migration Time',
    },
    requestAdditionalMigrationTimeNote: {
      message:
        'For an easier transition through the deprecation process, Chrome is providing deprecation trials which allows top-level sites and embedded services to request additional time to migrate away from third-party cookie dependencies for non-advertising use cases. To learn more, please check this information regarding $a_tag_1_start$3P$a_tag_1_end$ and $a_tag_2_start$1P$a_tag_2_end$ deprecation trials.',
      placeholders: {
        a_tag_1_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_1_end: {
          content: '$2',
          example: '</a>',
        },
        a_tag_2_start: {
          content: '$3',
          example: "<a href='https://example.com'>",
        },
        a_tag_2_end: {
          content: '$4',
          example: '</a>',
        },
      },
    },
    attestationEnrollment: {
      message: 'Attestation Enrollment',
    },
    attestationEnrollmentNote: {
      message:
        'To access the Privacy Sandbox relevance and measurement APIs on Chrome and Android, developers need to enroll with the privacy sandbox as a mechanism to verify the entities that call these APIs, and to gather the developer-specific data needed for the proper configuration and use of the APIs. To learn more about this process and how to enroll please check this $a_tag_start$documentation$a_tag_end$.',
      placeholders: {
        a_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    reportingBreakages: {
      message: 'Reporting Breakages',
    },
    reportingBreakagesNote: {
      message:
        'If your site or a service you depend on is breaking with third-party cookies disabled, you should file an issue $a_tag_1_start$here$a_tag_1_end$. And if you have questions or feedback about Privacy Sandbox, you can raise a new issue $a_tag_2_start$here$a_tag_2_end$  using the third-party cookie deprecation.',
      placeholders: {
        a_tag_1_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_1_end: {
          content: '$2',
          example: '</a>',
        },
        a_tag_2_start: {
          content: '$3',
          example: "<a href='https://example.com'>",
        },
        a_tag_2_end: {
          content: '$4',
          example: '</a>',
        },
      },
    },
    partOfExperimentGroup: {
      message:
        'For browsers in the 1% group, users will get a new chrome://settings/trackingProtection page instead of chrome://settings/cookies',
    },
    version: {
      message: 'Version',
    },
    enableCDPNote: {
      message:
        'The Chrome DevTools Protocol allows for tools to instrument, inspect, debug and profile Chromium, Chrome and other Blink-based browsers. $a_tag_start$Learn More.$a_tag_end$',
      placeholders: {
        a_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    multitabDebugging: {
      message: 'Multitab Debugging',
    },
    multitabDebuggingNote: {
      message:
        "The PSAT tool is designed for efficient single-tab analysis. While $a_tag_start$multi-tab debugging$a_tag_end$ is available for more comprehensive analysis, it is intended for examining 2-3 tabs simultaneously. Using more tabs may impact the tool's responsiveness.",
      placeholders: {
        a_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    privacySandbox: {
      message: 'Privacy Sandbox',
    },
    siteBoundaries: {
      message: 'Site Boundaries',
    },
    chips: {
      message: 'CHIPS',
    },
    rws: {
      message: 'Related Website Sets',
    },
    privateAdvertising: {
      message: 'Private Advertising',
    },
    topics: {
      message: 'Topics',
    },
    attribution: {
      message: 'Attribution',
    },
    trackingProtection: {
      message: 'Tracking Protection',
    },
    bounceTracking: {
      message: 'Bounce Tracking',
    },
    fingerprinting: {
      message: 'Fingerprinting',
    },
    facilitatedTesting: {
      message: 'Facilitated Testing',
    },
    rwsJsonGenerator: {
      message: 'Related Website Sets JSON Generator',
    },
    rwsJsonGeneratorNote: {
      message:
        "This tool generates the JSON resources needed to make a Related Website Sets(RWS) submission. It 'does not' perform all the required technical validations (see full requirements $a_tag_start$here$a_tag_end$.)",
      placeholders: {
        a_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    enterRwsDetails: {
      message: 'Enter your Related Website Sets details below:',
    },
    submitPRForRws: {
      message:
        "Submit a GitHub PR with your Related Site Set to the $a_tag_start$canonical list$a_tag_end$ by adding the content below as a new item to the 'sets' list.",
      placeholders: {
        a_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    addToRws: {
      message:
        "Add the file 'related-website-set.json' in the directory '.well-known' of the primary domain with the following content:",
    },
    copy: {
      message: 'Copy',
    },
    copied: {
      message: 'Copied!',
    },
    addToRwsOtherDomains: {
      message:
        "Add the file'related-website-set.json' in the directory '.well-known' of all the other domains in your set with the following content:",
    },
    siteccTldOf: {
      message: 'This site is a ccTLD of',
    },
    chipsExpanded: {
      message: 'Cookies Having Independent Partitioned State (CHIPS)',
    },
    attributionReporting: {
      message: 'Attribution Reporting',
    },
    facilitateTesting: {
      message:
        'To facilitate testing, $a_tag_start$Chrome has restricted third-party cookies by default for 1% of users. $a_tag_end$',
      placeholders: {
        a_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    faciliatedTestingPeriod: {
      message:
        'During this testing period, it is important for sites and services to $a_tag_start$start preparing$a_tag_end$ for third-party cookie restrictions, including moving to more private alternatives.',
      placeholders: {
        a_tag_start: {
          content: '$1',
          example: "<a href='https://example.com'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    userAgentReduction: {
      message: 'User Agent Reduction',
    },
    bounceTrackingMitigation: {
      message: 'Bounce Tracking Mitigation',
    },
    knownBreakages: {
      message: 'Known Breakages',
    },
    noLibraries: {
      message: 'No libraries with known breakages found yet!',
    },
    errorOccurred: {
      message:
        'A library detection error occurred. Please reopen the DevTool on a valid URL.',
    },
    waitingPageLoad: {
      message: 'Waiting for the page to load..',
    },
    checkingLibraries: {
      message: 'Checking libraries for any known breakages on the page...',
    },
    detectionMessage: {
      message:
        '$library$ functionality may not work properly due to the phaseout of third-party cookies. For more information, please visit the $provider$ $a_tag_start$support forum$a_tag_end$.',
      placeholders: {
        library: {
          content: '$1',
          example: 'Google Analytics',
        },
        provider: {
          content: '$2',
          example: 'Google',
        },
        a_tag_start: {
          content: '$3',
          example:
            "<a href='https://support.google.com/analytics/answer/9976101'>",
        },
        a_tag_end: {
          content: '$4',
          example: '</a>',
        },
      },
    },
    disqusComments: {
      message: 'Disqus Comments',
    },
    disqus: {
      message: 'Disqus',
    },
    fBComments: {
      message: 'Facebook Comments',
    },
    fBCommentsPlugin: {
      message: 'Facebook comments plugin',
    },
    fB: {
      message: 'Facebook',
    },
    fBLike: {
      message: 'Facebook Like Button',
    },
    gISTitle: {
      message: 'Avoid use of unsupported Google Identity Services features.',
    },
    featureCount: {
      message: '$count$ features',
      placeholders: {
        count: {
          content: '$1',
          example: '2',
        },
      },
    },
    gISNote: {
      message:
        'Due to Privacy Sandbox enforcements some features are backward incompatible or deprecated. This report performs a page scan for script src elements and affected JavaScript objects and methods. Review the following features and $a_tag_start$migrate$a_tag_end$ if necessary.',
      placeholders: {
        a_tag_start: {
          content: '$1',
          example:
            "<a href='https://developers.google.com/identity/gsi/web/guides/migrate'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    gSITitle: {
      message: 'Avoid use of deprecated Google Sign-In functionality.',
    },
    gSInote: {
      message:
        'The Google Sign-In JavaScript library is deprecated and is no longer supported. Review the following features and consider $a_tag_start$migrating$a_tag_end$ to a newer library if necessary.',
      placeholders: {
        a_tag_start: {
          content: '$1',
          example:
            "<a href='https://developers.google.com/identity/sign-in/web/migration-guide'>",
        },
        a_tag_end: {
          content: '$2',
          example: '</a>',
        },
      },
    },
    jetpackComments: {
      message: 'Jetpack Comments',
    },
    jetpackCommentsWidget: {
      message: 'Jetpack comments widget',
    },
    jetpack: {
      message: 'Jetpack',
    },
    jetpackLikeButton: {
      message: 'Jetpack Like Button',
    },
    ldreCaptcha: {
      message: 'reCAPTCHA',
    },
    taskNotDefined: {
      message: 'Task not defined',
    },
    OCD_cookiePreferences_description: {
      message: 'Registers cookie preferences of a user',
    },
    OCD_retention_2_years: {
      message: '2 years',
    },
    OCD_td_description: {
      message:
        "Registers statistical data on users' behaviour on the website. Used for internal analytics by the website operator.",
    },
    OCD_retention_session: {
      message: 'session',
    },
    OCD_CookieConsent__description: {
      message: 'Registers cookie preferences of a user',
    },
    OCD_retention_1_year: {
      message: '1 year',
    },
    OCD_CookieConsentBulkTicket_description: {
      message: 'Enables sharing cookie preferences across domains / websites',
    },
    OCD_userlang__description: {
      message: 'Saves language preferences of user for a website',
    },
    OCD_consentUUID_description: {
      message:
        'This cookie is used as a unique identification for the users who has accepted the cookie consent box.',
    },
    OCD_cookieconsent_variant_description: {
      message: 'Stores the variant of shown cookie banner',
    },
    OCD_cookieconsent_system_description: {
      message:
        "Cookie consent system cookie for saving user's cookie opt-in/out choices.",
    },
    OCD_cookieconsent_level_description: {
      message:
        'Cookie consent system cookie for storing the level of cookie consent.',
    },
    OCD_cookieconsent_seen_description: {
      message: 'Used to support the GDPR / AVG compliant cookie consent system',
    },
    OCD_CookieConsent_description: {
      message: "Stores the user's cookie consent state for the current domain",
    },
    OCD__ga_description: {
      message: 'ID used to identify users',
    },
    OCD__ga___description: {
      message: 'ID used to identify users',
    },
    OCD__gid_description: {
      message: 'ID used to identify users for 24 hours after last activity',
    },
    OCD_retention_24_hours: {
      message: '24 hours',
    },
    OCD__gat__description: {
      message:
        'Used to monitor number of Google Analytics server requests when using Google Tag Manager',
    },
    OCD_retention_1_minute: {
      message: '1 minute',
    },
    OCD__dc_gtm___description: {
      message: 'Used to monitor number of Google Analytics server requests',
    },
    OCD_AMP_TOKEN_description: {
      message:
        'Contains a token code that is used to read out a Client ID from the AMP Client ID Service. By matching this ID with that of Google Analytics, users can be matched when switching between AMP content and non-AMP content.\n\nReference: https://support.google.com/analytics/answer/7486764?hl=en',
    },
    OCD_retention_30_seconds_till_1_year: {
      message: '30 seconds till 1 year',
    },
    OCD__gat_gtag___description: {
      message: 'Used to set and get tracking data',
    },
    OCD_retention_1_hour: {
      message: '1 hour',
    },
    OCD__gac___description: {
      message:
        'Contains information related to marketing campaigns of the user. These are shared with Google AdWords / Google Ads when the Google Ads and Google Analytics accounts are linked together.',
    },
    OCD_retention_90_days: {
      message: '90 days',
    },
    OCD___utma_description: {
      message: 'ID used to identify users and sessions',
    },
    OCD_retention_2_years_after_last_activity: {
      message: '2 years after last activity',
    },
    OCD___utmt_description: {
      message: 'Used to monitor number of Google Analytics server requests',
    },
    OCD_retention_10_minutes: {
      message: '10 minutes',
    },
    OCD___utmb_description: {
      message:
        'Used to distinguish new sessions and visits. This cookie is set when the GA.js javascript library is loaded and there is no existing __utmb cookie. The cookie is updated every time data is sent to the Google Analytics server.',
    },
    OCD_retention_30_minutes_after_last_activity: {
      message: '30 minutes after last activity',
    },
    OCD___utmc_description: {
      message:
        'Used only with old Urchin versions of Google Analytics and not with GA.js. Was used to distinguish between new sessions and visits at the end of a session.',
    },
    OCD_retention_End_of_session__browser_: {
      message: 'End of session (browser)',
    },
    OCD___utmz_description: {
      message:
        'Contains information about the traffic source or campaign that directed user to the website. The cookie is set when the GA.js javascript is loaded and updated when data is sent to the Google Anaytics server',
    },
    OCD_retention_6_months_after_last_activity: {
      message: '6 months after last activity',
    },
    OCD___utmv_description: {
      message:
        'Contains custom information set by the web developer via the _setCustomVar method in Google Analytics. This cookie is updated every time new data is sent to the Google Analytics server.',
    },
    OCD___utmx_description: {
      message:
        'Used to determine whether a user is included in an A / B or Multivariate test.',
    },
    OCD_retention_18_months: {
      message: '18 months',
    },
    OCD___utmxx_description: {
      message:
        'Used to determine when the A / B or Multivariate test in which the user participates ends',
    },
    OCD_FPAU_description: {
      message:
        'Assigns a specific ID to the visitor. This allows the website to determine the number of specific user-visits for analysis and statistics.',
    },
    OCD_FPID_description: {
      message:
        "Registers statistical data on users' behaviour on the website. Used for internal analytics by the website operator.",
    },
    OCD_FPLC_description: {
      message:
        'This FPLC cookie is the cross-domain linker cookie hashed from the FPID cookie. It’s not HttpOnly, which means it can be read with JavaScript. It has a relatively short lifetime, just 20 hours.',
    },
    OCD__GRECAPTCHA_description: {
      message:
        'Google reCAPTCHA sets a necessary cookie (_GRECAPTCHA) when executed for the purpose of providing its risk analysis.',
    },
    OCD_retention_179_days: {
      message: '179 days',
    },
    OCD___gsas_description: {
      message: 'Provides ad delivery or retargeting.',
    },
    OCD_retention_3_months: {
      message: '3 months',
    },
    OCD___gpi_description: {
      message:
        'Collects information on user behaviour on multiple websites. This information is used in order to optimize the relevance of advertisement on the website.',
    },
    OCD_retention_13_months: {
      message: '13 months',
    },
    OCD___gpi_optout_description: {
      message:
        'Collects information on user behaviour on multiple websites. This information is used in order to optimize the relevance of advertisement on the website.',
    },
    OCD_GED_PLAYLIST_ACTIVITY_description: {
      message: 'Improves targeting/advertising within the website',
    },
    OCD_ACLK_DATA_description: {
      message:
        "This cookie is used to help improve advertising. This targets advertising based on what's relevant to a user, to improve reporting on campaign performance.",
    },
    OCD_retention_5_minutes: {
      message: '5 minutes',
    },
    OCD_AEC_description: {
      message:
        "AEC cookies ensure that requests within a browsing session are made by the user, and not by other sites. These cookies prevent malicious sites from acting on behalf of a user without that user's knowledge.",
    },
    OCD_retention_6_months: {
      message: '6 months',
    },
    OCD_ADS_VISITOR_ID_description: {
      message: 'Cookie required to use the options and on-site web services',
    },
    OCD_retention_2_months: {
      message: '2 months',
    },
    OCD___Secure_3PSIDCC_description: {
      message:
        'Targeting cookie. Used to create a user profile and display relevant and personalised Google Ads to the user.',
    },
    OCD___Secure_3PSIDTS_description: {
      message:
        'Targeting cookie. Used to create a user profile and display relevant and personalised Google Ads to the user.',
    },
    OCD___Secure_1PSIDTS_description: {
      message:
        'Targeting cookie. Used to create a user profile and display relevant and personalised Google Ads to the user.',
    },
    OCD___Secure_1PAPISID_description: {
      message:
        'Targeting cookie. Used to create a user profile and display relevant and personalised Google Ads to the user.',
    },
    OCD___Secure_3PSID_description: {
      message:
        'Targeting cookie. Used to profile the interests of website visitors and display relevant and personalised Google ads.',
    },
    OCD___Secure_1PSID_description: {
      message:
        'Targeting cookie. Used to create a user profile and display relevant and personalised Google Ads to the user.',
    },
    OCD___Secure_1PSIDCC_description: {
      message:
        'Targeting cookie. Used to create a user profile and display relevant and personalised Google Ads to the user.',
    },
    OCD___Secure_3PAPISID_description: {
      message:
        'Profiles the interests of website visitors to serve relevant and personalised ads through retargeting.',
    },
    OCD_OGPC_description: {
      message:
        'These cookies are used by Google to store user preferences and information while viewing Google mapped pages.',
    },
    OCD_retention_1_month: {
      message: '1 month',
    },
    OCD_OGP_description: {
      message:
        'This cookie is used by Google to activate and track the Google Maps functionality.',
    },
    OCD_1P_JAR_description: {
      message:
        'These cookies are set via embedded youtube-videos. They register anonymous statistical data on for example how many times the video is displayed and what settings are used for playback.',
    },
    OCD_CONSENT_description: {
      message: 'Google cookie consent tracker',
    },
    OCD_retention_20_years: {
      message: '20 years',
    },
    OCD_SOCS_description: {
      message: "Stores a user's state regarding their cookies choices",
    },
    OCD_ACCOUNT_CHOOSER_description: {
      message: 'Used to sign in with Google account.',
    },
    OCD_SMSV_description: {
      message: 'Used to sign in with Google account.',
    },
    OCD___Host_1PLSID_description: {
      message: 'Used to sign in with Google account.',
    },
    OCD___Host_3PLSID_description: {
      message: 'Used to sign in with Google account.',
    },
    OCD___Host_GAPS_description: {
      message: 'Used to sign in with Google account.',
    },
    OCD_LSOLH_description: {
      message: 'This cookie is for authentication with your Google account',
    },
    OCD_g_enabled_idps_description: {
      message: 'Used for Google Single Sign On',
    },
    OCD_G_AUTHUSER_H_description: {
      message: 'Google Authentication',
    },
    OCD_SEARCH_SAMESITE_description: {
      message:
        'SameSite prevents the browser from sending this cookie along with cross-site requests. The main goal is mitigate the risk of cross-origin information leakage. It also provides some protection against cross-site request forgery attacks.',
    },
    OCD_AID_description: {
      message:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
    },
    OCD_SID_description: {
      message:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
    },
    OCD_HSID_description: {
      message:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
    },
    OCD_APISID_description: {
      message:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
    },
    OCD_SAPISID_description: {
      message:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
    },
    OCD_SSID_description: {
      message:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
    },
    OCD_SIDCC_description: {
      message:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
    },
    OCD_OTZ_description: {
      message: 'Aggregate analysis of website visitors',
    },
    OCD_retention_17_days: {
      message: '17 days',
    },
    OCD_A_description: {
      message:
        'Google uses this cookies to make advertising more engaging to users and more valuable to publishers and advertisers',
    },
    OCD_DV_description: {
      message:
        'This cookies is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD_NID_description: {
      message:
        'This cookies is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD_TAID_description: {
      message:
        "This cookie is used to link your activity across devices if you've previously signed in to your Google Account on another device. We do this to coordinate that the ads you see across devices and measure conversion events.",
    },
    OCD_retention_14_days: {
      message: '14 days',
    },
    OCD_FPGCLDC_description: {
      message:
        'Used to help advertisers determine how many times users who click on their ads end up taking an action on their site',
    },
    OCD__gcl_au_description: {
      message:
        'Used by Google AdSense for experimenting with advertisement efficiency across websites using their services.',
    },
    OCD__gcl_dc_description: {
      message:
        'Used by Google AdSense for experimenting with advertisement efficiency across websites using their services.',
    },
    OCD__gaexp_description: {
      message:
        "Used to determine a user's inclusion in an experiment and the expiry of experiments a user has been included in.",
    },
    OCD_GCLB_description: {
      message:
        'This cookie is used in context with load balancing - This optimizes the response rate between the visitor and the site, by distributing the traffic load on multiple network links or servers.',
    },
    OCD_retention_Session: {
      message: 'Session',
    },
    OCD_FCCDCF_description: {
      message:
        'Cookie for Google Funding Choices API which allows for functionality specific to consent gathering for things like GDPR consent and CCPA opt-out.',
    },
    OCD_FCNEC_description: {
      message:
        'Cookie for Google Funding Choices API which allows for functionality specific to consent gathering for things like GDPR consent and CCPA opt-out.',
    },
    OCD_receive_cookie_deprecation_description: {
      message:
        'This cookie ensures browers in an experiment group of the Chrome-facilitated testing period include the Sec-Cookie-Deprecation request header as soon as it becomes available.',
    },
    OCD_retention_180_days: {
      message: '180 days',
    },
    OCD__dcid_description: {
      message:
        'Collects information on user behaviour on multiple websites. This information is used in order to optimize the relevance of advertisement on the website.',
    },
    OCD_retention_400_days: {
      message: '400 days',
    },
    OCD_IDE_description: {
      message:
        'This cookie is used for targeting, analyzing and optimisation of ad campaigns in DoubleClick/Google Marketing Suite',
    },
    OCD_DSID_description: {
      message:
        'This cookie is used for targeting, analyzing and optimisation of ad campaigns in DoubleClick/Google Marketing Suite',
    },
    OCD_retention_2_weeks: {
      message: '2 weeks',
    },
    OCD_ID_description: {
      message:
        'This cookie is used for targeting, analyzing and optimisation of ad campaigns in DoubleClick/Google Marketing Suite',
    },
    OCD_RUL_description: {
      message:
        'Used by DoubleClick to determine if the website ad was properly displayed. This is done to make their marketing efforts more efficient.',
    },
    OCD_FLC_description: {
      message:
        'This cookie is used to link your activity across devices if you’ve previously signed in to your Google Account on another device. We do this to coordinate that the ads you see across devices and measure conversion events.',
    },
    OCD_retention_10_seconds: {
      message: '10 seconds',
    },
    OCD___gads_description: {
      message:
        'This cookie is used by Google for a variety of purposes (e.g., ensuring Frequency Caps work correctly). It includes AdSense if you have AdSense enabled. This cookie is associated with the DoubleClick for Publishers service from Google. Its purpose is to monitor the showing of advertisements on the site, for which the owner may earn some revenue. The main purpose of this cookie is targeting/advertising.',
    },
    OCD_retention_various: {
      message: 'various',
    },
    OCD_GoogleAdServingTest_description: {
      message: 'Used to register what ads have been displayed to the user.',
    },
    OCD_ar_debug_description: {
      message: 'Store and track conversions',
    },
    OCD_retention_Persistent: {
      message: 'Persistent',
    },
    OCD_test_cookie_description: {
      message:
        "This cookie is set by DoubleClick (which is owned by Google) to determine if the website visitor's browser supports cookies.",
    },
    OCD_APC_description: {
      message:
        'This cookie is used for targeting, analyzing and optimisation of ad campaigns in DoubleClick/Google Marketing Suite',
    },
    OCD_S1_description: {
      message: 'Comscore: statistical and analytical data',
    },
    OCD_retention_5_years: {
      message: '5 years',
    },
    OCD_C1_description: {
      message: 'Comscore: statistical and analytical data',
    },
    OCD_s_cc_description: {
      message: 'Used to determine if browser of user accepts cookies or not',
    },
    OCD_s_sq_description: {
      message: 'Used to register the previous link clicked by the user',
    },
    OCD_s_vi__description: {
      message: 'Contains a unique ID to identify a user',
    },
    OCD_s_fid_description: {
      message:
        'Alternative cookie with unique user ID / timestamp when the s_vi cookie can not be set for technical reasons',
    },
    OCD_fid_description: {
      message:
        'If other visitor ID methods fail, Adobe sets a fallback cookie or uses a combination of IP address and user agent to identify the visitor.',
    },
    OCD_s_ecid_description: {
      message:
        "This cookie is set by the customer's domain after the AMCV cookie is set by the client. The purpose of this cookie is to allow persistent ID tracking in the 1st-party state and is used as a reference ID if the AMCV cookie has expired.",
    },
    OCD_s_ppv_description: {
      message: 'Stores information on the percentage of the page displayed',
    },
    OCD_s_tp_description: {
      message: 'This lets us know how much of the page you viewed.',
    },
    OCD_sat_track_description: {
      message:
        'The sat_track cookie is a part of Adobe Analytics. It controls the enabling and disabling of cookies and whether they are loaded onto the site.',
    },
    OCD_demdex_description: {
      message:
        'Unique value with which Audience Manager can identify a user. Used, among others, for identification, segmentation, modeling and reporting purposes.',
    },
    OCD_retention_180_days_after_last_activity_or_10_years_when_opting_out: {
      message: '180 days after last activity or 10 years when opting out',
    },
    OCD_dextp_description: {
      message:
        'Registers the date plus time (timestamp) on which a data synchronization was last performed by the Audience Manager.',
    },
    OCD_retention_180_days_after_last_activity: {
      message: '180 days after last activity',
    },
    OCD_dst_description: {
      message:
        'Used to register a possible error message when sending data to a linked system.',
    },
    OCD__dp_description: {
      message: 'Used to determine if browser of user accepts cookies or not',
    },
    OCD_retention_30_seconds: {
      message: '30 seconds',
    },
    OCD_aam_uuid_description: {
      message:
        'Adobe Audience Manager - data management platform uses these cookies to assign a unique ID when users visit a website.',
    },
    OCD_AMCV___description: {
      message:
        'Adobe Experience Cloud uses a cookie to store a unique visitor ID that is used across Experience Cloud Solutions.',
    },
    OCD_AMCVS___description: {
      message:
        'The AMCVS cookie serves as a flag indicating that the session has been initialized. Its value is always 1 and discontinues when the session has ended.',
    },
    OCD_mbox_description: {
      message:
        'Adobe Target uses cookies to give website operators the ability to test which online content and offers are more relevant to visitors.',
    },
    OCD_at_check_description: {
      message:
        'A simple test value used to determine if a visitor supports cookies. Set each time a visitor requests a page.',
    },
    OCD_renderid_description: {
      message:
        'This cookie is needed by the dispatcher (webserver) to distinguish between the different publisher server.',
    },
    OCD_dpm_description: {
      message:
        'DPM is an abbreviation for Data Provider Match. It tells internal, Adobe systems that a call from Audience Manager or the Adobe Experience Cloud ID Service is passing in customer data for synchronization or requesting an ID.',
    },
    OCD_TPC_description: {
      message:
        'Used to determine if browser of user accepts third party cookies or not',
    },
    OCD_C_description: {
      message: 'Used to determine if browser of user accepts cookies or not',
    },
    OCD_retention_60_days_till_3650_days: {
      message: '60 days till 3650 days',
    },
    OCD_uid_description: {
      message: 'Contains a unique ID to identify a user',
    },
    OCD_retention_60_days: {
      message: '60 days',
    },
    OCD_cid_description: {
      message:
        'Unique value to be able to identify cookies from users (same as uid)',
    },
    OCD_GCM_description: {
      message: 'Checks if a new partner cookie synchronization is required',
    },
    OCD_retention_1_day: {
      message: '1 day',
    },
    OCD_CM_description: {
      message:
        'Checks if a new partner cookie synchronization is required (cookie set by ad server)',
    },
    OCD_CM14_description: {
      message:
        'Checks if a new partner cookie synchronization is required (cookie set during cookie synchronization )',
    },
    OCD_token_description: {
      message: 'Security token for opt out functionality',
    },
    OCD_otsid_description: {
      message: 'Opt out cookie for specific advertiser',
    },
    OCD_retention_365_days: {
      message: '365 days',
    },
    OCD_adtrc_description: {
      message:
        'Used to determine if browser related information has been collected',
    },
    OCD_retention_7_days: {
      message: '7 days',
    },
    OCD_SR__description: {
      message:
        'Unique value that records info about consecutive ads - includes: total impressions, daily impressions, total clicks, daily clicks, and last impression date',
    },
    OCD_CT__description: {
      message:
        "Identifies the last click membership for third-party pixels on advertiser's pages",
    },
    OCD_EBFCD__description: {
      message:
        'Registers daily max. number of impressions (frequency cap) for expanding advertisements (expandables)',
    },
    OCD_EBFC__description: {
      message:
        'Registers max. total number of impressions (frequency cap) for expanding advertisements (expandables)',
    },
    OCD_CFFC__description: {
      message:
        'Registers max. number of impressions (frequency cap) for compound banners',
    },
    OCD_DigiTrust_v1_identity_description: {
      message:
        'Unique value with which the user is identified by DigiTrust, an independent industrial body',
    },
    OCD_adformfrpid_description: {
      message:
        'Collects data on the user across websites - This data is used to make advertisement more relevant.',
    },
    OCD_retention_30_days: {
      message: '30 days',
    },
    OCD_lu_description: {
      message:
        'Used to record whether the person chose to remain logged in\n\nContents: User ID and miscellaneous log in information (e.g., number of logins per account, state of the "remember me" check box, etc.)',
    },
    OCD_retention_2_year: {
      message: '2 year',
    },
    OCD_xs_description: {
      message:
        'Used in conjunction with the c_user cookie to authenticate your identity to Facebook.\n\nContents: Session ID, creation time, authentication value, secure session state, caching group ID',
    },
    OCD_c_user_description: {
      message:
        'Used in conjunction with the xs cookie to authenticate your identity to Facebook.\n\nContents: User ID',
    },
    OCD_m_user_description: {
      message:
        "Used to authenticate your identity on Facebook's mobile website.\n\nContents: Email, User ID, authentication value, version, user agent capability, creation time, Facebook version indicator",
    },
    OCD_pl_description: {
      message:
        'Used to record that a device or browser logged in via Facebook platform.\n\nContents: Y/N',
    },
    OCD_dbln_description: {
      message:
        'Used to enable device-based logins\n\nContents: Login authentication values',
    },
    OCD_aks_description: {
      message:
        'Determines the login state of a person visiting accountkit.com\n\nContents: Account kit access token',
    },
    OCD_aksb_description: {
      message:
        'Authenticates logins using Account Kit\n\nContents: Request time value',
    },
    OCD_retention_30_minutes: {
      message: '30 minutes',
    },
    OCD_sfau_description: {
      message:
        'Optimizes recovery flow after failed login attempts\n\nContents: Encrypted user ID, contact point, time stamp, and other login information',
    },
    OCD_ick_description: {
      message: 'Stores an encryption key used to encrypt cookies',
    },
    OCD_csm_description: {
      message: 'Insecure indicator',
    },
    OCD_s_description: {
      message:
        '\nFacebook browser identification, authentication, marketing, and other Facebook-specific function cookies.',
    },
    OCD_datr_description: {
      message:
        'Used to prevent creation of fake / spammy accounts. Datr cookie is associated with a browser, not individual people.',
    },
    OCD_sb_description: {
      message:
        'Facebook browser identification, authentication, marketing, and other Facebook-specific function cookies.',
    },
    OCD_fr_description: {
      message:
        'Contains a unique browser and user ID, used for targeted advertising.',
    },
    OCD_oo_description: {
      message: 'Ad optout cookie',
    },
    OCD_ddid_description: {
      message:
        "Used to open a specific location in an advertiser's app upon installation",
    },
    OCD_retention_28_days: {
      message: '28 days',
    },
    OCD_locale_description: {
      message:
        'This cookie contains the display locale of the last logged in user on this browser. This cookie\nappears to only be set after the user logs out.\nThe locale cookie has a lifetime of one week.',
    },
    OCD__fbp_description: {
      message:
        'Used by Facebook to deliver a series of advertisement products such as real time bidding from third party advertisers',
    },
    OCD_retention_4_months: {
      message: '4 months',
    },
    OCD__fbc_description: {
      message:
        'Used by Facebook to deliver a series of advertisement products such as real time bidding from third party advertisers',
    },
    OCD_js_ver_description: {
      message: 'Records the age of Facebook javascript files.',
    },
    OCD_rc_description: {
      message: 'Used to optimize site performance for advertisers',
    },
    OCD_campaign_click_url_description: {
      message:
        'Records the Facebook URL that an individual landed on after clicking on an ad promoting Facebook',
    },
    OCD_wd_description: {
      message:
        'This cookie stores the browser window dimensions and is used by Facebook to optimise the rendering of the page.',
    },
    OCD_usida_description: {
      message:
        'Collects a combination of the user’s browser and unique identifier, used to tailor advertising to users.',
    },
    OCD_presence_description: {
      message: 'The presence cookie is used to contain the user’s chat state.',
    },
    OCD_fl_inst_description: {
      message: 'Used to check if Flash plugin is enabled in browser of user.',
    },
    OCD_pvc2_description: {
      message: 'Contains information related to ad impressions.',
    },
    OCD_pcc2_description: {
      message: 'Contains information related to ad impressions.',
    },
    OCD_trc_description: {
      message: 'Contains information related to ad impressions.',
    },
    OCD_tuuid_description: {
      message: 'Unique value to identify individual users.',
    },
    OCD_ad2_description: {
      message: 'Contains information related to ad impressions.',
    },
    OCD_MR_description: {
      message: 'Used to collect information for analytics purposes.',
    },
    OCD_MUID_description: {
      message:
        'Identifies unique web browsers visiting Microsoft sites. These cookies are used for advertising, site analytics, and other operational purposes.',
    },
    OCD_MUIDB_description: {
      message:
        'Identifies unique web browsers visiting Microsoft sites. These cookies are used for advertising, site analytics, and other operational purposes.',
    },
    OCD_MC1_description: {
      message:
        'Identifies unique web browsers visiting Microsoft sites. These cookies are used for advertising, site analytics, and other operational purposes.',
    },
    OCD_MSFPC_description: {
      message:
        'Identifies unique web browsers visiting Microsoft sites. These cookies are used for advertising, site analytics, and other operational purposes.',
    },
    OCD__uetsid_description: {
      message:
        'This cookie is used by Bing to determine what ads should be shown that may be relevant to the end user perusing the site.',
    },
    OCD__uetvid_description: {
      message:
        'This is a cookie utilised by Microsoft Bing Ads and is a tracking cookie. It allows us to engage with a user that has previously visited our website.',
    },
    OCD_retention_16_days: {
      message: '16 days',
    },
    OCD_ANON_description: {
      message:
        'Contains the A, a unique identifier derived from your Microsoft account, which is used for advertising, personalization, and operational purposes. It is also used to preserve your choice to opt out of interest-based advertising from Microsoft if you have chosen to associate the opt-out with your Microsoft account.',
    },
    OCD_ANONCHK_description: {
      message:
        'Used to store session ID for a users session to ensure that clicks from adverts on the Bing search engine are verified for reporting purposes and for personalisation',
    },
    OCD_CC_description: {
      message: 'Contains a country code as determined from your IP address.',
    },
    OCD_PPAuth_description: {
      message:
        'Helps to authenticate you when you sign in with your Microsoft account.',
    },
    OCD_MSPAuth_description: {
      message:
        'Helps to authenticate you when you sign in with your Microsoft account.',
    },
    OCD_MSNRPSAuth_description: {
      message:
        'Helps to authenticate you when you sign in with your Microsoft account.',
    },
    OCD_KievRPSAuth_description: {
      message:
        'Helps to authenticate you when you sign in with your Microsoft account.',
    },
    OCD_WLSSC_description: {
      message:
        'Helps to authenticate you when you sign in with your Microsoft account.',
    },
    OCD_MSPProf_description: {
      message:
        'Helps to authenticate you when you sign in with your Microsoft account.',
    },
    OCD_MC0_description: {
      message: 'Detects whether cookies are enabled in the browser.',
    },
    OCD_MS0_description: {
      message: 'Identifies a specific session.',
    },
    OCD_NAP_description: {
      message:
        'Contains an encrypted version of your country, postal code, age, gender, language and occupation, if known, based on your Microsoft account profile.',
    },
    OCD_MH_description: {
      message:
        'Appears on co-branded sites where Microsoft is partnering with an advertiser. This cookie identifies the advertiser, so the right ad is selected.',
    },
    OCD_childinfo_description: {
      message:
        'Contains information that Microsoft account uses within its pages in relation to child accounts.',
    },
    OCD_kcdob_description: {
      message:
        'Contains information that Microsoft account uses within its pages in relation to child accounts.',
    },
    OCD_kcrelid_description: {
      message:
        'Contains information that Microsoft account uses within its pages in relation to child accounts.',
    },
    OCD_kcru_description: {
      message:
        'Contains information that Microsoft account uses within its pages in relation to child accounts.',
    },
    OCD_pcfm_description: {
      message:
        'Contains information that Microsoft account uses within its pages in relation to child accounts.',
    },
    OCD_x_ms_gateway_slice_description: {
      message: 'Identifies a gateway for load balancing.',
    },
    OCD_ToptOut_description: {
      message:
        'Records your decision not to receive interest-based advertising delivered by Microsoft.',
    },
    OCD_ACH01_description: {
      message:
        'Maintains information about which ad and where the user clicked on the ad.',
    },
    OCD_AADSSO_description: {
      message: 'Microsoft Microsoft Online Authentication Cookie',
    },
    OCD_brcap_description: {
      message: 'Microsoft Microsoft Online Authentication Cookie',
    },
    OCD_SRM_B_description: {
      message:
        "Collected user data is specifically adapted to the user or device. The usercan also be followed outside of the loaded website, creating a picture of the visitor's behavior.",
    },
    OCD__RwBf_description: {
      message:
        'This cookie helps us to track the effectiveness of advertising campaigns on the Bing advertising network.',
    },
    OCD__HPVN_description: {
      message:
        'Analysis service that connects data from the Bing advertising network with actions performed on the website.',
    },
    OCD__UR_description: {
      message:
        'This cookie is used by the Bing advertising network for advertising tracking purposes.',
    },
    OCD_OID_description: {
      message:
        'This cookie is used by the Bing advertising network for advertising tracking purposes.',
    },
    OCD_OIDI_description: {
      message:
        'This cookie is used by the Bing advertising network for advertising tracking purposes.',
    },
    OCD_OIDR_description: {
      message:
        'This cookie is used by the Bing advertising network for advertising tracking purposes.',
    },
    OCD_BCP_description: {
      message: 'This cookie is used for advertisement tracking purposes.',
    },
    OCD_BFBUSR_description: {
      message: 'This cookie is used for advertisement tracking purposes.',
    },
    OCD_BFB_description: {
      message: 'This cookie is used for advertisement tracking purposes.',
    },
    OCD_ACL_description: {
      message: 'This cookie is used for advertisement tracking purposes.',
    },
    OCD_ACLUSR_description: {
      message: 'This cookie is used for advertisement tracking purposes.',
    },
    OCD_MSPTC_description: {
      message:
        'This cookie registers data on the visitor. The information is used to optimize advertisement relevance.',
    },
    OCD_buid_description: {
      message:
        'This cookie is used by Microsoft to securely verify your login information',
    },
    OCD_esctx_description: {
      message:
        'This cookie is used by Microsoft to securely verify your login information',
    },
    OCD_fpc_description: {
      message:
        'This cookie is used by Microsoft to securely verify your login information',
    },
    OCD_stsservicecookie_description: {
      message: 'Cookie for Azure Active Directory B2C-verification',
    },
    OCD_ARRAffinity_description: {
      message:
        "When using Microsoft Azure as a hosting platform and enabling load balancing, this cookie ensures that  requests from one visitor's browsing session are always handled by the same server in the cluster.",
    },
    OCD_ARRAffinitySameSite_description: {
      message:
        "When using Microsoft Azure as a hosting platform and enabling load balancing, this cookie ensures that  requests from one visitor's browsing session are always handled by the same server in the cluster.",
    },
    OCD___AntiXsrfToken_description: {
      message:
        "This cookie is used to prevent Cross-site request forgery (often abbreviated as CSRF) attacks of the website. CSRF attacks exploit the trust that a site has in a user's browser.",
    },
    OCD__ASPXANONYMOUS_description: {
      message:
        'Created by ASP.Net. This cookie configures anonymous identification for application authorization. This is required to identify entities that are not authenticated when authorization is required.',
    },
    OCD__ASPXAUTH_description: {
      message:
        "Created by ASP.Net. .ASPXAUTH is a cookie to identify if the user is authenticated( As user's identity has been verified)",
    },
    OCD_nSGt___description: {
      message:
        'This cookie is used by Microsoft to securely verify your Sharepoint login information',
    },
    OCD_RpsContextCookie_description: {
      message:
        'This cookie is used by Microsoft to securely verify your Sharepoint login information',
    },
    OCD_ASLBSACORS_description: {
      message:
        'Microsoft App Service and Front Door Affinity Cookies. These cookies are used to direct your browser to use the appropriate backend server.',
    },
    OCD_ASLBSA_description: {
      message:
        'Microsoft App Service and Front Door Affinity Cookies. These cookies are used to direct your browser to use the appropriate backend server.',
    },
    OCD_ASPSESSIO__description: {
      message:
        'Browsing session: the asterisks identify an alphanumerical code that varies from session to session in automatic mode.',
    },
    OCD_ApplicationGatewayAffinity_description: {
      message:
        'This cookie is used by Azure Apps to keep a user session on the same server.',
    },
    OCD_ApplicationGatewayAffinityCORS_description: {
      message:
        'This cookie is used by Azure Apps to keep a user session on the same server.',
    },
    OCD_VisitorStorageGuid_description: {
      message:
        'This cookie is used by Azure Apps to keep a user session on the same server.',
    },
    OCD_ai_session_description: {
      message: 'This is a unique anonymous session identifier cookie.',
    },
    OCD_ai_user_description: {
      message:
        'This is a unique user identifier cookie enabling counting of the number of users accessing the application over time.',
    },
    OCD_AADNonce_forms_description: {
      message:
        'Unique identifier of one authentication session to prevent replay.',
    },
    OCD_DcLcid_description: {
      message: 'Saves language preference.',
    },
    OCD__clck_description: {
      message:
        ' This cookie is installed by Microsoft Clarity to store information of how visitors use a website and help in creating an analytics report of how the website is doing. The data collected including the number visitors, the source where they have come from, and the pages visited in an anonymous form.',
    },
    OCD__clsk_description: {
      message:
        'This cookie is installed by Microsoft Clarity to store information of how visitors use a website and help in creating an analytics report of how the website is doing. The data collected including the number visitors, the source where they have come from, and the pages visited in an anonymous form.',
    },
    OCD_SM_description: {
      message:
        'This is a Microsoft cookie which we use to measure the use of the website for internal analytics',
    },
    OCD_CLID_description: {
      message:
        'The cookie is set by embedded Microsoft Clarity scripts. The purpose of this cookie is for heatmap and session recording.',
    },
    OCD_MicrosoftApplicationsTelemetryDeviceId_description: {
      message:
        'Used to store a unique device ID for tracking behavior and usage of the website',
    },
    OCD_esctx___description: {
      message:
        "This cookie is set by Microsoft for secure authentication of the users' login details",
    },
    OCD_ASP_NET_SessionId_description: {
      message:
        'ASP.Net_SessionId is a cookie which is used to identify the users session on the server. The session being an area on the server which can be used to store session state in between http requests.',
    },
    OCD_guest_id_description: {
      message:
        'This cookie is set by X to identify and track the website visitor. Registers if a users is signed in the X platform and collects information about ad preferences.',
    },
    OCD_personalization_id_description: {
      message:
        'Unique value with which users can be identified by X. Collected information is used to be personalize X services, including X trends, stories, ads and suggestions.',
    },
    OCD_ct0_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. They cookies do not provide us with any confidential information relating to your account.',
    },
    OCD_gt_description: {
      message:
        'Twitter uses these cookies to support plugin integration with our website. If you use the Tweet plugin and log into your X account, X will set some of these cookies to remember that you are logged in. X will also use cookies for their own analytics purposes.',
    },
    OCD_guest_id_marketing_description: {
      message: 'This cookie is for advertising when logged out',
    },
    OCD_guest_id_ads_description: {
      message: 'This cookie is for advertising when logged out',
    },
    OCD_muc_ads_description: {
      message:
        'These cookies are placed when you come to our website via X. A cookie from X is also placed on our website, with which we can later show a relevant offer on X',
    },
    OCD_retention_24_months: {
      message: '24 months',
    },
    OCD__twitter_sess_description: {
      message:
        'This cookie is set due to X integration and sharing capabilities for the social media.',
    },
    OCD_ads_prefs_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. They cookies do not provide us with any confidential information relating to your account.',
    },
    OCD_auth_token_description: {
      message: 'This cookie is used for authentication & authorization',
    },
    OCD_csrf_same_site_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. They cookies do not provide us with any confidential information relating to your account.',
    },
    OCD_csrf_same_site_set_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. They cookies do not provide us with any confidential information relating to your account.',
    },
    OCD_dnt_description: {
      message:
        'These are third party X cookies. These cookies enable users, if they wish, to login to their X account share content from our websites with their friends. These cookies do not allow us access to your accounts or provide us with any confidential information relating to your accounts. These cookies also allow a news feed of tweets to appear on the website.',
    },
    OCD_eu_cn_description: {
      message:
        'These are third party X cookies. These cookies enable users, if they wish, to login to their X account share content from our websites with their friends. These cookies do not allow us access to your accounts or provide us with any confidential information relating to your accounts. These cookies also allow a news feed of tweets to appear on the website.',
    },
    OCD_external_referer_description: {
      message:
        'Our Website uses X buttons to allow our visitors to follow our promotional X feeds, and sometimes embed feeds on our Website.',
    },
    OCD_kdt_description: {
      message:
        'These are third party X cookies. These cookies enable users, if they wish, to login to their X account share content from our websites with their friends. These cookies do not allow us access to your accounts or provide us with any confidential information relating to your accounts. These cookies also allow a news feed of tweets to appear on the website.',
    },
    OCD_remember_checked_on_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. These cookies do not provide us with any confidential information relating to your account.',
    },
    OCD_rweb_optin_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. These cookies do not provide us with any confidential information relating to your account.',
    },
    OCD_syndication_guest_id_description: {
      message:
        'Used to collect information about users browsing behaviour for marketing purposes including digital display and social media advertising.',
    },
    OCD_twid_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. They cookies do not provide us with any confidential information relating to your account.',
    },
    OCD_tfw_exp_description: {
      message:
        'These cookies enable us to track visitor activity from our X ads on our website, and also to allow users to share content from our websites. They cookies do not provide us with any confidential information relating to your account.',
    },
    OCD___insp_pad_description: {
      message: 'This cookie contains the page number of the session recording.',
    },
    OCD___insp_sid_description: {
      message:
        'This cookie contains the ID of the Inspectlet session that is being recorded.',
    },
    OCD___insp_ref_description: {
      message: 'The cookie contains the referrer source/URL',
    },
    OCD___insp_scpt_description: {
      message:
        'This cookie contains an integer that allows us to know if the screen capture was triggered or not.',
    },
    OCD___insp_nv_description: {
      message:
        'This cookie contains a value that allows Inspectlet to know if this user is a new visitor or a returning visitor.',
    },
    OCD___insp_wid_description: {
      message:
        'This cookie contains an uniqe user ID provided by the website if set up.',
    },
    OCD___insp_uid_description: {
      message: 'This cookie contains random ID assigned to a visitor.',
    },
    OCD___insp_dct_description: {
      message:
        "Registers statistical data on visitors' behaviour on the website. Used for internal analytics by the website operator.",
    },
    OCD_CTK_description: {
      message:
        'This cookie is used to provide a more consistent user experience across sessions by providing improved job recommendations and other services we offer on Indeed. This also helps Indeed analyze in aggregate the best way to help people get jobs. This cookie does not use 3rd party data and is not used for targeting.',
    },
    OCD_retention_17_years: {
      message: '17 years',
    },
    OCD_ctkgen_description: {
      message:
        'Contains information related to registering (counting) a job application via a job listing on indeed.com.',
    },
    OCD_INDEED_CSRF_TOKEN_description: {
      message:
        'This cookie is used by Cloudflare to identify trusted web traffic.',
    },
    OCD_jasx_pool_id_description: {
      message:
        'Contains information related to registering (counting) a job application via a job listing on indeed.com.',
    },
    OCD_pagead_conv__INTEGER__description: {
      message:
        'Contains information related to registering (counting) a job application via a job listing on indeed.com.',
    },
    OCD_tv_spot_tracker_description: {
      message: 'Contains information about the timeslot of a running TV ad',
    },
    OCD_cookie_consent_io_description: {
      message: 'Registers cookie preferences of a user',
    },
    OCD_cookie_consent_io_timestamp__description: {
      message: 'Registers user activity timestamp',
    },
    OCD_cookie_consent_io_gdpr_description: {
      message:
        'Register anonymous consent identifier for GDPR consent compliance',
    },
    OCD_ccec_user_description: {
      message: 'Contains information about the customer to allow retargeting.',
    },
    OCD_GPS_description: {
      message:
        'Registers a unique ID on mobile devices to enable tracking based on geographical GPS location.',
    },
    OCD_VISITOR_INFO1_LIVE_description: {
      message:
        "Tries to estimate the users' bandwidth on pages with integrated YouTube videos. Also used for marketing",
    },
    OCD_PREF_description: {
      message:
        'This cookie stores your preferences and other information, in particular preferred language, how many search results you wish to be shown on your page, and whether or not you wish to have Google’s SafeSearch filter turned on.',
    },
    OCD_retention_10_years_from_set__update: {
      message: '10 years from set/ update',
    },
    OCD_YSC_description: {
      message:
        'Registers a unique ID to keep statistics of what videos from YouTube the user has seen.',
    },
    OCD_DEVICE_INFO_description: {
      message:
        'Used to detect if the visitor has accepted the marketing category in the cookie banner. This cookie is necessary for GDPR-compliance of the website.',
    },
    OCD_LOGIN_INFO_description: {
      message:
        'This cookie is used to play YouTube videos embedded on the website.',
    },
    OCD_VISITOR_PRIVACY_METADATA_description: {
      message: 'Youtube visitor privacy metadata cookie',
    },
    OCD___adm_ui_description: {
      message:
        "Used to track visitors on multiple websites, in order to present relevant advertisement based on the visitor's preferences.",
    },
    OCD___adm_uiex_description: {
      message:
        "Used to track visitors on multiple websites, in order to present relevant advertisement based on the visitor's preferences.",
    },
    OCD___adm_usyncc_description: {
      message:
        'Used to identify the visitor across visits and devices. This allows the website to present the visitor with relevant advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_retention_5_days: {
      message: '5 days',
    },
    OCD_uids_description: {
      message:
        'Registers user behaviour and navigation on the website, and any interaction with active campaigns. This is used for optimizing advertisement and for efficient retargeting.',
    },
    OCD___cfduid_description: {
      message:
        "The '__cfduid' cookie is set by the CloudFlare service to identify trusted web traffic. It does not correspond to any user id in the web application, nor does the cookie store any personally identifiable",
    },
    OCD___cfruid_description: {
      message:
        'Used by the content network, Cloudflare, to identify trusted web traffic.',
    },
    OCD___cf_bm_description: {
      message:
        "Cloudflare's bot products identify and mitigate automated traffic to protect your site from bad bots. Cloudflare places the __cf_bm cookie on End User devices that access Customer sites that are protected by Bot Management or Bot Fight Mode. The __cf_bm cookie is necessary for the proper functioning of these bot solutions.",
    },
    OCD_cf_chl_2_description: {
      message:
        'Used by Cloudflare for the execution of Javascript or Captcha challenges. These cookies are not used for tracking or beyond the scope of the challenge.',
    },
    OCD___cflb_description: {
      message:
        'When enabling session affinity with Cloudflare Load Balancer, Cloudflare sets a __cflb cookie with a unique value on the first response to the requesting client. Cloudflare routes future requests to the same origin, optimizing network resource usage. In the event of a failover, Cloudflare sets a new __cflb cookie to direct future requests to the failover pool.',
    },
    OCD__cfuvid_description: {
      message:
        'The _cfuvid cookie is only set when a site uses this option in a Rate Limiting Rule, and is only used to allow the Cloudflare WAF to distinguish individual users who share the same IP address.',
    },
    OCD_cf_clearance_description: {
      message: 'Whether a CAPTCHA or Javascript challenge has been solved.',
    },
    OCD___uin_bw_description: {
      message:
        'Collects information on visitor behaviour on multiple websites. This information is used on the website, in order to optimize the relevance of advertisement.',
    },
    OCD___uir_bw_description: {
      message:
        "Collects data on visitors' behaviour and interaction - This is used to optimize the website and make advertisement on the website more relevant.",
    },
    OCD___uis_description: {
      message:
        "Used to track visitors on multiple websites, in order to present relevant advertisement based on the visitor's preferences.",
    },
    OCD_retention_29_days: {
      message: '29 days',
    },
    OCD_HAPLB5S_description: {
      message:
        "Used to track visitors on multiple websites, in order to present relevant advertisement based on the visitor's preferences.",
    },
    OCD__dbefe_description: {
      message:
        'Collects information on user preferences and/or interaction with web-campaign content - This is used on CRM-campaign-platform used by website owners for promoting events or products.',
    },
    OCD__hjid_description: {
      message:
        'Hotjar cookie. This cookie is set when the customer first lands on a page with the Hotjar script. It is used to persist the random user ID, unique to that site on the browser. This ensures that behavior in subsequent visits to the same site will be attributed to the same user ID.',
    },
    OCD__hjIncludedInSample_description: {
      message:
        'Hotjar cookie. This session cookie is set to let Hotjar know whether that visitor is included in the sample which is used to generate funnels.',
    },
    OCD__hjClosedSurveyInvites_description: {
      message:
        'Hotjar cookie. This cookie is set once a visitor interacts with a Survey invitation modal popup. It is used to ensure that the same invite does not re-appear if it has already been shown.',
    },
    OCD__hjDonePolls_description: {
      message:
        'Hotjar cookie. This cookie is set once a visitor completes a poll using the Feedback Poll widget. It is used to ensure that the same poll does not re-appear if it has already been filled in.',
    },
    OCD__hjMinimizedPolls_description: {
      message:
        'Hotjar cookie. This cookie is set once a visitor minimizes a Feedback Poll widget. It is used to ensure that the widget stays minimizes when the visitor navigates through your site.',
    },
    OCD__hjDoneTestersWidgets_description: {
      message:
        'Hotjar cookie. This cookie is set once a visitor submits their information in the Recruit User Testers widget. It is used to ensure that the same form does not re-appear if it has already been filled in.',
    },
    OCD__hjMinimizedTestersWidgets_description: {
      message:
        'Hotjar cookie. This cookie is set once a visitor minimizes a Recruit User Testers widget. It is used to ensure that the widget stays minimizes when the visitor navigates through your site.',
    },
    OCD__hjShownFeedbackMessage_description: {
      message:
        'This cookie is set when a visitor minimizes or completes Incoming Feedback. This is done so that the Incoming Feedback will load as minimized immediately if they navigate to another page where it is set to show.',
    },
    OCD__hjTLDTest_description: {
      message:
        'When the Hotjar script executes we try to determine the most generic cookie path we should use, instead of the page hostname. This is done so that cookies can be shared across subdomains (where applicable). To determine this, we try to store the _hjTLDTest cookie for different URL substring alternatives until it fails. After this check, the cookie is removed.',
    },
    OCD__hjUserAttributesHash_description: {
      message:
        'User Attributes sent through the Hotjar Identify API are cached for the duration of the session in order to know when an attribute has changed and needs to be updated.',
    },
    OCD__hjCachedUserAttributes_description: {
      message:
        'This cookie stores User Attributes which are sent through the Hotjar Identify API, whenever the user is not in the sample. These attributes will only be saved if the user interacts with a Hotjar Feedback tool.',
    },
    OCD__hjLocalStorageTest_description: {
      message:
        'This cookie is used to check if the Hotjar Tracking Script can use local storage. If it can, a value of 1 is set in this cookie. The data stored in_hjLocalStorageTest has no expiration time, but it is deleted immediately after creating it so the expected storage time is under 100ms.',
    },
    OCD_retention_: {
      message: '',
    },
    OCD__hjptid_description: {
      message:
        'This cookie is set for logged in users of Hotjar, who have Admin Team Member permissions. It is used during pricing experiments to show the Admin consistent pricing across the site.',
    },
    OCD__hjAbsoluteSessionInProgress_description: {
      message:
        "The cookie is set so Hotjar can track the beginning of the user's journey for a total session count. It does not contain any identifiable information.",
    },
    OCD__hjFirstSeen_description: {
      message:
        "The cookie is set so Hotjar can track the beginning of the user's journey for a total session count. It does not contain any identifiable information.",
    },
    OCD__hjIncludedInPageviewSample_description: {
      message:
        "This cookie is set to let Hotjar know whether that visitor is included in the data sampling defined by your site's page view limit.",
    },
    OCD__hjIncludedInSessionSample__description: {
      message:
        "This cookie is set to let Hotjar know whether that visitor is included in the data sampling defined by your site's daily session limit",
    },
    OCD__hjSession___description: {
      message:
        'A cookie that holds the current session data. This ensues that subsequent requests within the session window will be attributed to the same Hotjar session.',
    },
    OCD__hjSessionUser___description: {
      message:
        'Hotjar cookie that is set when a user first lands on a page with the Hotjar script. It is used to persist the Hotjar User ID, unique to that site on the browser. This ensures that behavior in subsequent visits to the same site will be attributed to the same user ID.',
    },
    OCD__hjSessionTooLarge_description: {
      message:
        'Causes Hotjar to stop collecting data if a session becomes too large. This is determined automatically by a signal from the WebSocket server if the session size exceeds the limit.',
    },
    OCD__hjSessionRejected_description: {
      message:
        'If present, this cookie will be set to 1 for the duration of a user’s session, if Hotjar rejected the session from connecting to our WebSocket due to server overload. This cookie is only applied in extremely rare situations to prevent severe performance issues.',
    },
    OCD__hjSessionResumed_description: {
      message:
        'A cookie that is set when a session/recording is reconnected to Hotjar servers after a break in connection.',
    },
    OCD_ac_enable_tracking_description: {
      message:
        'This cookie is associated with Active Campaign and is set to confirm that tracking has been enabled for the website. Tracking is used to create reports of our web traffic and improve the user experience of the website.',
    },
    OCD_prism___description: {
      message:
        'This cookie is used by Active Campaign for site tracking purposes.',
    },
    OCD_ASP_NET_Sessio_description: {
      message:
        'General purpose platform session cookie, used by sites written with Microsoft .NET based technologies. Usually used to maintain an anonymised user session by the server.',
    },
    OCD_ASP_NET_Sessio_Fallback_description: {
      message:
        "Fallback session cookie to support older browsers that haven't implemented the Secure flag, in modern evergreen browsers this cookie is never set as it haven't got the Secure flag.",
    },
    OCD_JSESSIO_description: {
      message:
        'JSESSIO is a platform session cookie and is used by sites with JavaServer Pages (JSP). The cookie is used to maintain an anonymous user session by the server.',
    },
    OCD_ORA_WWV_APP___description: {
      message: 'Security cookie for applications.',
    },
    OCD_ELOQUA_description: {
      message:
        'This cookies allow better understand how visitors use the website. This cookie data may be used to personalise the content or design of the website',
    },
    OCD_ELQSTATUS_description: {
      message:
        'This cookie is used to track individual visitors and their use of the site. It is set when you first visit the site and updated on subsequent visits.',
    },
    OCD_laravel_session_description: {
      message:
        'Internally laravel uses laravel_session to identify a session instance for a user',
    },
    OCD_PHPSESSID_description: {
      message:
        'Cookie generated by applications based on the PHP language. This is a general purpose identifier used to maintain user session variables. It is normally a random generated number, how it is used can be specific to the site, but a good example is maintaining a logged-in status for a user between pages.',
    },
    OCD_retention_Sessions: {
      message: 'Sessions',
    },
    OCD___Secure_PHPSESSID_description: {
      message:
        'Cookie generated by applications based on the PHP language. This is a general purpose identifier used to maintain user session variables. It is normally a random generated number, how it is used can be specific to the site, but a good example is maintaining a logged-in status for a user between pages.',
    },
    OCD_XSRF_TOKEN_description: {
      message:
        'This cookie is written to help with site security in preventing Cross-Site Request Forgery attacks.',
    },
    OCD_lidc_description: {
      message:
        'Used by the social networking service, LinkedIn, for tracking the use of embedded services.',
    },
    OCD_bcookie_description: {
      message: 'Used by LinkedIn to track the use of embedded services.',
    },
    OCD_bscookie_description: {
      message: 'Used by LinkedIn to track the use of embedded services.',
    },
    OCD_trkCode_description: {
      message:
        "This cookie is used by LinkedIn to support the functionality of adding a panel invite labeled 'Follow Us'",
    },
    OCD_trkInfo_description: {
      message:
        "This cookie is used by LinkedIn to support the functionality of adding a panel invite labeled 'Follow Us'",
    },
    OCD_li_oatml_description: {
      message: 'Collects information about how visitors use our site.',
    },
    OCD_liap_description: {
      message:
        'Cookie used for Sign-in with Linkedin and/or to allow for the Linkedin follow feature.',
    },
    OCD_lissc_description: {
      message: 'Pending',
    },
    OCD_spectroscopyId_description: {
      message:
        "These cookies are set by LinkedIn for advertising purposes, including: tracking visitors so that more relevant ads can be presented, allowing users to use the 'Apply with LinkedIn' or the 'Sign-in with LinkedIn' functions, collecting information about how visitors use the site, etc.",
    },
    OCD_UserMatchHistory_description: {
      message:
        "These cookies are set by LinkedIn for advertising purposes, including: tracking visitors so that more relevant ads can be presented, allowing users to use the 'Apply with LinkedIn' or the 'Sign-in with LinkedIn' functions, collecting information about how visitors use the site, etc.",
    },
    OCD_lang_description: {
      message: "Used to remember a user's language setting",
    },
    OCD_li_gc_description: {
      message:
        'Used to store guest consent to the use of cookies for non-essential purposes',
    },
    OCD_li_rm_description: {
      message:
        'Used as part of the LinkedIn Remember Me feature and is set when a user clicks Remember Me on the device to make it easier for him or her to sign in to that device',
    },
    OCD_AnalyticsSyncHistory_description: {
      message:
        'Used to store information about the time a sync with the lms_analytics cookie took place for users in the Designated Countries',
    },
    OCD_ln_or_description: {
      message:
        'Used to determine if Oribi analytics can be carried out on a specific domain',
    },
    OCD_li_sugr_description: {
      message:
        "Used to make a probabilistic match of a user's identity outside the Designated Countries",
    },
    OCD_sdsc_description: {
      message:
        'This cookie is used for signed data service context cookie used for database routing to ensure consistency across all databases when a change is made. Used to ensure that user-inputted content is immediately available to the submitting user upon submission',
    },
    OCD_li_mc_description: {
      message:
        "This cookie is used as a temporary cache to avoid database lookups for a member's consent for use of non-essential cookies and used for having consent information on the client side to enforce consent on the client side",
    },
    OCD_lms_ads_description: {
      message:
        'This cookie is used to identify LinkedIn Members off LinkedIn for advertising',
    },
    OCD__guid_description: {
      message:
        'This cookie is used to identify a LinkedIn Member for advertising through Google Ads',
    },
    OCD_BizographicsOptOut_description: {
      message:
        'This cookie is used to determine opt-out status for non-members',
    },
    OCD_retention_10_years: {
      message: '10 years',
    },
    OCD_IRLD_description: {
      message:
        'This cookie is used for Affiliate Marketing Cookie for LinkedIn',
    },
    OCD_l_page_description: {
      message:
        'This cookie is used for measuring conversion metrics on LinkedIn',
    },
    OCD_ABSELB_description: {
      message: 'This is Load Balancer Cookie for affiliate marketing',
    },
    OCD_brwsr_description: {
      message: 'This cookie is used to Affiliate Marketing Cookie for LinkedIn',
    },
    OCD_oribi_user_guid_description: {
      message: 'This cookie is used to identify a unique visitor',
    },
    OCD_oribi_cookie_test_description: {
      message:
        'This cookie is used To determine if tracking can be enabled on a current domain',
    },
    OCD_AWSALB_description: {
      message:
        'These cookies enable us to allocate server traffic to make the user experience as smooth as possible. A so-called load balancer is used to determine which server currently has the best availability. The information generated cannot identify you as an individual.',
    },
    OCD_AWSALBCORS_description: {
      message:
        'For continued stickiness support with CORS use cases after the Chromium update, we are creating additional stickiness cookies for each of these duration-based stickiness features named AWSALBCORS (ALB).',
    },
    OCD_AWSELBCORS_description: {
      message:
        'For continued stickiness support with CORS use cases after the Chromium update, we are creating additional stickiness cookies for each of these duration-based stickiness features named AWSELBCORS (ALB).',
    },
    OCD_AWSELB_description: {
      message:
        'AWS Classic Load Balancer Cookie: Load Balancing Cookie: Used to map the session to the instance.',
    },
    OCD_AWSALBTGCORS_description: {
      message:
        'For continued stickiness support with CORS use cases after the Chromium update, we are creating additional stickiness cookies for each of these duration-based stickiness features named AWSELBCORS (ALB).',
    },
    OCD_AWSALBTG_description: {
      message:
        'For continued stickiness support with CORS use cases after the Chromium update, we are creating additional stickiness cookies for each of these duration-based stickiness features named AWSELBCORS (ALB).',
    },
    OCD_aws_csds_token_description: {
      message: 'Anonymous metrics validation token',
    },
    OCD_aws_lang_description: {
      message: 'Stores the language used with AWS.',
    },
    OCD_aws_target_visitor_id_description: {
      message:
        'Used to collect anonymised information about how which web pages are visited, how long users spend on pages and what users search for.',
    },
    OCD_retention_1_Year: {
      message: '1 Year',
    },
    OCD_aws_priv_description: {
      message: 'Anonymous cookie for privacy regulations',
    },
    OCD_ad_id_description: {
      message:
        'Clickthroughs to Amazon websites: Noting how the user got to Amazon via this website',
    },
    OCD_retention_190_days: {
      message: '190 days',
    },
    OCD_ad_privacy_description: {
      message:
        'Provided by amazon-adsystem.com for tracking user actions on other websites to provide targeted content to the users.',
    },
    OCD_CMID_description: {
      message:
        "Collects visitor data related to the user's visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded, with the purpose of displaying targeted ads.",
    },
    OCD_CMPRO_description: {
      message:
        'Collects data on visitor behaviour from multiple websites, in order to present more relevant advertisement - This also allows the website to limit the number of times that the visitor is shown the same advertisement.',
    },
    OCD_CMPS_description: {
      message:
        "Collects visitor data related to the user's visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded, with the purpose of displaying targeted ads",
    },
    OCD_CMRUM3_description: {
      message:
        "Collects visitor data related to the user's visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded, with the purpose of displaying targeted ads.",
    },
    OCD_CMST_description: {
      message:
        "Collects visitor data related to the user's visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded, with the purpose of displaying targeted ads.",
    },
    OCD_cookieJartestCookie_description: {
      message: 'Pending',
    },
    OCD_obuid_description: {
      message:
        "Holds the anonymous user's ID. Used for tracking user actions, such as clicks on the recommendations",
    },
    OCD_apnxs_description: {
      message:
        'This cookie is set by Outbrain and it is used to analyse technical data about the website',
    },
    OCD_criteo_description: {
      message:
        'This cookie is set by Outbrain and it is used to analyse technical data about the website',
    },
    OCD_retention_1_months: {
      message: '1 months',
    },
    OCD_mdfrc_description: {
      message:
        'This cookie is set by Outbrain and it is used to analyse technical data about the website',
    },
    OCD_adrl_description: {
      message:
        'This cookie is set by Outbrain and it is used to analyse technical data about the website',
    },
    OCD_ttd_description: {
      message:
        'This cookie is set by Outbrain and it is used to analyse technical data about the website',
    },
    OCD_recs_description: {
      message:
        'Stores the recommendations we’re recommending so that we don’t show only the same recommendations on the same page',
    },
    OCD_obsessionid___description: {
      message:
        'Stores a unique identifier of the session so that we don’t show only the same recommendations on the same session',
    },
    OCD__cq_duid_description: {
      message:
        'Used by the website to protect against fraud in relation to its referral system.',
    },
    OCD__cq_suid_description: {
      message: 'This cookie is used to distinguish between humans and bots.',
    },
    OCD_jpxumaster_description: {
      message:
        'Used to present the visitor with relevant content and advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_jpxumatched_description: {
      message:
        'Used to present the visitor with relevant content and advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_PUBMDCID_description: {
      message:
        "Registers a unique ID that identifies the user's device during return visits across websites that use the same ad network. The ID is used to allow targeted ads.",
    },
    OCD_pp_description: {
      message:
        'This cookie tracks the last publisher website that you visited that contained an advertisement served by PubMatic.',
    },
    OCD_SPugT_description: {
      message:
        'This cookie is used to track when the server-side cookie store was last updated for the browser, and it is used in conjunction with the PugT cookie, described below.',
    },
    OCD_KADUSERCOOKIE_description: {
      message:
        "PubMatic UserId. this identifier to identify each user uniquely. Some of the uses of this anonymous identifier are to support frequency capping, perform UID sync ups with DSP's, DMP's. DMP's / DP's push audicne data against this ID. API publishers sends this ID while making API requests to PubMatic AdServer. UAS Ad Engine also uses this cookie for FCAP purposes.",
    },
    OCD_PUBRETARGET_description: {
      message:
        'Pixel expiry. Used to indicate if user must be considered for various re-targeting ad campaigns running in PubMatic system.',
    },
    OCD_KCCH_description: {
      message:
        'To avoid race condition in PubMatic userId generation, showad.js / universalpixel.js set this cookie first. if and only if not set already. Existence of this cookie means that current flow of the execution should not generate PubMatic userId cookie, as its already being set by other flow which has set KCCH.',
    },
    OCD_retention_30_secs: {
      message: '30 secs',
    },
    OCD_SyncRTB__description: {
      message:
        "Keeps list of DSP pixel Id's PubMatic synced with so far. PubMatic does userId sync up with DSP's. This cookie holds next sync up time for every pixel. Helps to maintain sync up frequency at DSP level.",
    },
    OCD_DPSync__description: {
      message:
        "Keeps list of DMP pixel Id's PubMatic synced with so far PubMatic does userId sync up with DMP's. This cookie holds next sync up time for every pixel. Helps to maintain sync up frequency at DMP level.",
    },
    OCD_ADUSERCOOKIE_description: {
      message:
        "PubMatic UserId. this identifier to identify each user uniquely. Some of the uses of this anonymous identifier are to support frequency capping, perform UID sync ups with DSP's, DMP's. DMP's / DP's push audicne data against this ID. API publishers sends this ID while making API requests to PubMatic AdServer. UAS Ad Engine also uses this cookie for FCAP purposes.",
    },
    OCD_PugT_description: {
      message:
        'It is used to track when the cookies were updated on the browser. It is used to limit the number of calls to server side cookie store',
    },
    OCD_KRTBCOOKIE___description: {
      message:
        "Registers a unique ID that identifies the user's device during return visits across websites that use the same ad network. The ID is used to allow targeted ads.",
    },
    OCD_f5_cspm_description: {
      message:
        'This cookie name is associated with the BIG-IP product suite from company F5. It is used to monitor page load speed, as part of site performance monitoring.',
    },
    OCD_KTPCACOOKIE_description: {
      message:
        'We use this cookie to check if third-party cookies are enabled on the user’s browser.',
    },
    OCD_COKENBLD_description: {
      message:
        'This cookie sets a flag to “true” if cookies are enabled on the user’s browser.',
    },
    OCD_USCC_description: {
      message:
        'This cookie enables PubMatic to sync user IDs properly in situations where multiple advertisements might appear on the same webpage.',
    },
    OCD_DPPIX_ON_description: {
      message:
        'These cookies enable PubMatic to properly sync cookie IDs with our partners by ensuring that our partners do not override each other during the sync process.',
    },
    OCD_retention_20_seconds: {
      message: '20 seconds',
    },
    OCD_SYNCUPPIX_ON_description: {
      message:
        'These cookies enable PubMatic to properly sync cookie IDs with our partners by ensuring that our partners do not override each other during the sync process.',
    },
    OCD_PUBUIDSYNCUPFQ_description: {
      message:
        'This cookie indicates the last time that we synced IDs with our partner.',
    },
    OCD_camfreq___description: {
      message:
        'This cookie is set for each campaign and indicates the number of times (e.g., frequency) that a particular advertisement may have been shown on the applicable publisher site.',
    },
    OCD_pubfreq___description: {
      message:
        'This cookie is set for each advertising network and indicates the number of times (e.g., frequency) that a particular advertisement may have been shown on the applicable publisher site.',
    },
    OCD_pubtime___description: {
      message:
        'This cookie stores the period of time after which ad frequency counters reset.',
    },
    OCD_PMFREQ_ON_description: {
      message:
        'This cookie ensures the proper functioning of the camfreq and pubfreq cookies, described above, in situations where one cookie may override the other.',
    },
    OCD_DPFQ_description: {
      message:
        'This cookie stores information regarding the number of times that a partner’s pixel is loaded by a user’s browser. This enables us to cap the number of times that a pixel is used to record a user’s visit to a website within a specific period of time.',
    },
    OCD_pi_description: {
      message:
        'This cookie enables us to determine which set of pixels needs to be executed on the browser.',
    },
    OCD_FPtrust_description: {
      message:
        'This cookie is a session cookie used to  support the opt-out process via the Network Advertising Initiative.',
    },
    OCD__curtime_description: {
      message: 'This cookie stores the current timestamp.',
    },
    OCD_PMDTSHR_description: {
      message:
        'This cookie is set for Komli ad server and is used for default impression when other data is not available.',
    },
    OCD_chk_description: {
      message:
        'This cookie is set on Google Chrome browsers that have a version less 67 or non-Chrome browsers, and is used for testing purposes.',
    },
    OCD_chkSecSet_description: {
      message:
        'This cookie is set on Google Chrome browsers that have a version less 67 or non-Chrome browsers, and is used for testing purposes.',
    },
    OCD_chkChromeAb67_description: {
      message:
        'This cookie is set on Google Chrome browsers that have a version above 67 and is used for testing purposes.',
    },
    OCD_chkChromeAb67Sec_description: {
      message:
        'This cookie is set on Google Chrome browsers that have a version above 67 and is used for testing purposes.',
    },
    OCD_pubsyncexp_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD_ipc_description: {
      message:
        'This cookie is a short-lived cookie that stores information needed to coordinate cookie syncing.',
    },
    OCD_Kiyohnl_description: {
      message:
        'Cookies are associated with the use of Kiyoh to collect and display customer reviews',
    },
    OCD_id5_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD_cip_description: {
      message:
        'Used to present the visitor with relevant content and advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_car_description: {
      message:
        'Used to present the visitor with relevant content and advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_callback_description: {
      message:
        'Collects data on visitor behaviour from multiple websites, in order to present more relevant advertisement - This also allows the website to limit the number of times that the visitor is shown the same advertisement.',
    },
    OCD_cnac_description: {
      message:
        'Used to present the visitor with relevant content and advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_cf_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD_gdpr_description: {
      message:
        'Determines whether the visitor has accepted the cookie consent box. This ensures that the cookie consent box will not be presented again upon re-en try.',
    },
    OCD_UIDR_description: {
      message:
        "Collects information of the user and his/her movement, such as timestamp for visits, most recently loaded pages and IP address. The data is used by the marketing research network, Scorecard Research, to analyse traffic patterns and carry out surveys to help their clients better understand the customer's preferences.",
    },
    OCD_UID_description: {
      message:
        "Collects information of the user and his/her movement, such as timestamp for visits, most recently loaded pages and IP address. The data is used by the marketing research network, Scorecard Research, to analyse traffic patterns and carry out surveys to help their clients better understand the customer's preferences.",
    },
    OCD_PID_description: {
      message:
        'Collects a code that identifies the specific website or advertiser participating in the ScorecardResearch data collection program.',
    },
    OCD_XID_description: {
      message:
        'Collects a unique identifier assigned to a device (computer, phone, tablet) to track the user across different websites.',
    },
    OCD_SEUNCY_description: {
      message:
        'Registers a unique ID that identifies the user’s device for return visits.',
    },
    OCD_ljt_reader_description: {
      message:
        'Collects data related to reader interests, context, demographics and other information on behalf of the Lijit platform with the purpose of finding interested users on websites with related content.',
    },
    OCD_rek_content_description: {
      message: 'Pending',
    },
    OCD_retention_6_days: {
      message: '6 days',
    },
    OCD_um_description: {
      message: 'To enable the bidding process.',
    },
    OCD_umeh_description: {
      message: 'To enable the bidding process.',
    },
    OCD_BSWtracker_description: {
      message:
        'Collects data on visitor behaviour from multiple websites, in order to present more relevant advertisement - This also allows the website to limit the number of times that the visitor is shown the same advertisement.',
    },
    OCD_retention_694_days: {
      message: '694 days',
    },
    OCD__rxuuid_description: {
      message:
        'Sets a unique ID for the visitor, with which external advertisers can target the visitor with relevant advertisements. This linking service is provided by third-party advertising hubs, facilitating real-time bidding for advertisers.',
    },
    OCD_AA003_description: {
      message:
        'Collects information on visitor behaviour on multiple websites. This information is used on the website, in order to optimize the relevance of advertisement.',
    },
    OCD_ATN_description: {
      message:
        'Collects information on visitor behaviour on multiple websites. This information is used on the website, in order to optimize the relevance of advertisement.',
    },
    OCD_tt_viewer_description: {
      message:
        'Teads uses a “tt_viewer” cookie to help personalize the video ads you see on our partner websites.',
    },
    OCD_tt_bluekai_description: {
      message:
        'Avoid calling to bluekai. This avoids unnecessary calls to bluekai.',
    },
    OCD_tt_exelate_description: {
      message:
        'Avoid calling to Exelate. This avoids unnecessary calls to Eleate.',
    },
    OCD_tt_liveramp_description: {
      message:
        'Avoid calling to Liveramp. This avoids unnecessary calls to Liveramp.',
    },
    OCD_tt_neustar_description: {
      message:
        'Avoid calling to Nuestar. This avoids unnecessary calls to Neustar.',
    },
    OCD_tt_salesforce_description: {
      message:
        'Avoid calling to Salesforce. This avoids unnecessary calls to Salesforce.',
    },
    OCD_cfid_description: {
      message:
        'This cookie is used to determine which type of device the visitor is using, so the website can be properly formatted',
    },
    OCD_cftoken_description: {
      message:
        'This cookie is used to determine which type of device the visitor is using, so the website can be properly formatted',
    },
    OCD_gckp_description: {
      message:
        "Registers a unique ID that identifies a returning user's device. The ID is used for targeted ads.",
    },
    OCD_um2_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD_tuuid_lu_description: {
      message:
        'Contains a unique visitor ID, which allows Bidswitch.com to track the visitor across multiple websites. This allows Bidswitch to optimize advertisement relevance and ensure that the visitor does not see the same ads multiple times.',
    },
    OCD_uu_description: {
      message:
        "Used to target ads by registering the user's movements across websites.",
    },
    OCD_cct_description: {
      message: 'Necessary for the shopping cart functionality on the website',
    },
    OCD_tu_description: {
      message:
        "Used to target ads by registering the user's movements across websites.",
    },
    OCD_betweendigital_com_description: {
      message:
        "Collects data on visitors' behaviour and interaction - This is used to optimize the website and make advertisement on the website more relevant.",
    },
    OCD_ss_description: {
      message:
        "Necessary for the functionality of the website's chat-box function.",
    },
    OCD_st_csd_description: {
      message: 'Date of the last cookie-syn',
    },
    OCD_st_cs_description: {
      message: 'Unique identifiers of DSPs',
    },
    OCD_st_uid_description: {
      message:
        'This cookie is used to store randomly generated unique browser identifier',
    },
    OCD_st_cnt_description: {
      message:
        'This cookie is used to store low precision geolocation (Country, City)',
    },
    OCD_st_chc_description: {
      message: 'This cookie is used to store Cookie-sync',
    },
    OCD_st_ssp_description: {
      message: 'This cookie is used to store low precision geolocation',
    },
    OCD_cnfq_description: {
      message:
        'Technical cookie used to trigger the injection of monitoring scripts from a CNAME',
    },
    OCD_retention_360_minutes: {
      message: '360 minutes',
    },
    OCD_lcsrc_description: {
      message: 'Technical cookie used to refresh date serialized in ISO format',
    },
    OCD_dyncdn_description: {
      message: 'End-point and traffic data',
    },
    OCD_gid_description: {
      message: 'Global unique ID cross domains associated with an end-user',
    },
    OCD_csfq_description: {
      message:
        'Technical cookie used to trigger the injection of monitoring scripts',
    },
    OCD_retention_6_hours: {
      message: '6 hours',
    },
    OCD_partner___description: {
      message: 'Labeling end-users with keywords defined by a client.',
    },
    OCD_vs_description: {
      message: 'Counting new visits',
    },
    OCD_Comp_description: {
      message: 'Labeling end-users with keywords defined by a client.',
    },
    OCD_Pwb_description: {
      message:
        'Allows for the display of ads in the correct format based on browser, screen size, and OS.',
    },
    OCD_retention_2_days: {
      message: '2 days',
    },
    OCD_Pdomid_description: {
      message:
        "Technical cookie used to distribute the traffic between Smart's servers",
    },
    OCD_sasd_description: {
      message: 'Geolocation collection',
    },
    OCD_sasd2_description: {
      message: 'Geolocation collection',
    },
    OCD_TestIfCookie_description: {
      message:
        'Technical cookie used to test if persistent cookies are accepted',
    },
    OCD_retention_session_cookie: {
      message: 'session cookie',
    },
    OCD_csync_description: {
      message:
        "Optimises ad display based on the user's movement combined and various advertiser bids for displaying user ads.",
    },
    OCD_TestIfCookieP_description: {
      message:
        'Technical cookie used to test if persistent cookies are accepted',
    },
    OCD_pid_description: {
      message:
        'Unique ID associated with an end-user (according to a domain and browser)',
    },
    OCD_pbw_description: {
      message:
        'This cookie collects cached data by browser ID, operating system ID and screen size',
    },
    OCD_lcsrd_description: {
      message:
        'This cookie is used to present the visitor with relevant content and advertisements',
    },
    OCD__AspNetCore_Antiforgery___description: {
      message:
        'Anti-forgery cookie is a security mechanism to defend against cross-site request forgery (CSRF) attacks.',
    },
    OCD_unruly_m__description: {
      message: 'Pending',
    },
    OCD_bdswch_description: {
      message:
        'Used to present the visitor with relevant content and advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_lidid_description: {
      message:
        "Collects data on visitors' behaviour and interaction - This is used to make advertisement on the website more relevant. The cookie also allows the website to detect any referrals from other websites.",
    },
    OCD__li_ss_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD_tluid_description: {
      message:
        'This cookie is used to identify the visitor and optimize ad-relevance by collecting visitor data from multiple websites – this exchange of visitor data is normally provided by a third-party data-center or ad-exchange.',
    },
    OCD_tluidp_description: {
      message:
        'This cookie is used to identify the visitor and optimize ad-relevance by collecting visitor data from multiple websites with – this exchange of visitor data is normally provided by a third-party data-center or ad-exchange.',
    },
    OCD_optout_description: {
      message:
        'This cookie is used to determine whether the visitor has accepted the cookie consent box.',
    },
    OCD_sync_description: {
      message:
        'This cookie is used in order to transact in digital advertising, TripleLift exchanges (or syncs) identifiers with other companies. This cookie keeps track of which companies have recently been synced in order to avoid syncing with the same companies repetitively.',
    },
    OCD_t_gid_description: {
      message:
        'This Partitioned cookie gives a user who interacts with Taboola Widget a User ID allowing us to target advertisements and content to this specific user ID.',
    },
    OCD_t_pt_gid_description: {
      message:
        'Assigns a unique User ID that Taboola uses for attribution and reporting purposes, and to tailor recommendations to this specific user.',
    },
    OCD_taboola_session_id_description: {
      message:
        'Creates a temporary session ID to avoid the display of duplicate recommendations on the page.',
    },
    OCD___zlcmid_description: {
      message: 'Live chat widget on Slack contact page (ZopIM)',
    },
    OCD_i_description: {
      message:
        'Registers user data, such as IP address, geographical location, websites visited and on which advertisements the user has clicked, with the aim of optimizing the display of advertisements based on user relocation on websites that use the same advertising network.',
    },
    OCD_univ_id_description: {
      message:
        'This cookie collects information about the visitor for the purpose of serving advertisements.',
    },
    OCD_retention_3_days: {
      message: '3 days',
    },
    OCD_pd_description: {
      message:
        'This cookie stores information about which other third parties the user cookie (‘i’ cookie) has been synced with to reduce the amount of user matching done on your device.',
    },
    OCD_retention_15_days: {
      message: '15 days',
    },
    OCD_OAID_description: {
      message:
        'This cookie is used by the ad server software to manage which ads are placed on our website, and to capture clicks on those ads. Information is collected in anonymous form, and we do not use this data to deliver specific content, advertising or otherwise, to your browser.',
    },
    OCD_OAGEO__description: {
      message:
        'Used to avoid the repeated display of the same ad. Contains information about the users location.',
    },
    OCD___atuvc_description: {
      message:
        'This cookie is associated with the AddThis social sharing widget, it stores an updated page share count.',
    },
    OCD___atuvs_description: {
      message:
        'This cookie is associated with the AddThis social sharing widget, which serves a similar purpose to other cookies set by the service.',
    },
    OCD_ssc_description: {
      message:
        'AddThis - Cookie related to an AddThis sharing button available on the website',
    },
    OCD_uvc_description: {
      message:
        'AddThis - Cookie related to an AddThis sharing button available on the website',
    },
    OCD_loc_description: {
      message:
        'AddThis - Cookie related to an AddThis sharing button available on the website',
    },
    OCD_na_id_description: {
      message:
        'AddThis - Cookie related to an AddThis sharing button available on the website',
    },
    OCD_na_tc_description: {
      message:
        'AddThis - Cookie related to an AddThis sharing button available on the website',
    },
    OCD_ouid_description: {
      message:
        'AddThis - Cookie related to an AddThis sharing button available on the website',
    },
    OCD_na_sc_x_description: {
      message:
        'Used by the social sharing platform AddThis to keep a record of parts of the site that has been visited in order to recommend other parts of the site.',
    },
    OCD_DG_HID_description: {
      message: 'Pending',
    },
    OCD_DG_IID_description: {
      message: 'Pending',
    },
    OCD_DG_SID_description: {
      message: 'Pending',
    },
    OCD_DG_UID_description: {
      message: 'Pending',
    },
    OCD_DG_ZID_description: {
      message: 'Pending',
    },
    OCD_DG_ZUID_description: {
      message: 'Pending',
    },
    OCD_fonts_loaded_description: {
      message:
        'This cookie checks and remembers whether you have the font used by funda. Remembering this check makes visiting the website faster.',
    },
    OCD_html_classes_description: {
      message:
        'Remembering how the website is displayed to adjust the appearance of the site to the environment and browser used by the user. This ensures that the site loads faster on a subsequent visit.',
    },
    OCD_SNLB2_description: {
      message: 'Pending',
    },
    OCD_lz_last_visit_description: {
      message:
        'Last Visit (Timestamp), used to determine when the website visitor browsed the website the last time.',
    },
    OCD_lz_userid_description: {
      message:
        "Sets up a unique ID which is used to generate statistical data about the website visitor's usage of the website.",
    },
    OCD_lz_visits_description: {
      message:
        'Number of visits, is used to identify how often the website visitor already visited the website.',
    },
    OCD__secureclient_description: {
      message: 'Pending',
    },
    OCD__securesession_description: {
      message: 'Pending',
    },
    OCD__stateflags_description: {
      message: 'Pending',
    },
    OCD__auth_description: {
      message: 'Pending',
    },
    OCD_advst_uid_11_description: {
      message: 'Pending',
    },
    OCD_DISPATCHER_description: {
      message: 'Pending',
    },
    OCD_DSP_UID_description: {
      message: 'Pending',
    },
    OCD_retention_9_days: {
      message: '9 days',
    },
    OCD_picreel_tracker__visited_description: {
      message:
        'Used for statistical purposes when counting the number of pages, the user visited',
    },
    OCD_retention_Unlimited: {
      message: 'Unlimited',
    },
    OCD_picreel_tracker__first_visit_description: {
      message:
        'Used for statistical purposes, keeping the date of the first visit',
    },
    OCD_picreel_tracker__page_views_description: {
      message: 'Pending',
    },
    OCD_picreel_new_price_description: {
      message: 'Pending',
    },
    OCD___auc_description: {
      message: 'Used to track and report information to the Alexa analytics',
    },
    OCD_ajs_user_id_description: {
      message:
        ' This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.',
    },
    OCD_ajs_anonymous_id_description: {
      message:
        'Used for Analytics and help count how many people visit a certain site by tracking if you have visited before',
    },
    OCD_ajs_group_id_description: {
      message: 'Track visitor usage and events within the website',
    },
    OCD___asc_description: {
      message: 'A cookie set by Trustpilot if you click the read more widget',
    },
    OCD___insp_norec_sess_description: {
      message:
        'Inspectlet uses cookies to keep track of session information. These cookies are needed to accurately understand how visitors are navigating the website.',
    },
    OCD___insp_slim_description: {
      message:
        'Inspectlet uses cookies to keep track of session information. These cookies are needed to accurately understand how visitors are navigating the website.',
    },
    OCD___insp_targlpt_description: {
      message:
        'Inspectlet uses cookies to keep track of session information. These cookies are needed to accurately understand how visitors are navigating the website.',
    },
    OCD___insp_targlpu_description: {
      message:
        'Inspectlet uses cookies to keep track of session information. These cookies are needed to accurately understand how visitors are navigating the website.',
    },
    OCD___RequestVerificationToken__description: {
      message:
        'This is an anti-forgery cookie set by web applications built using ASP.NET MVC technologies. It is designed to stop unauthorised posting of content to a website, known as Cross-Site Request Forgery.',
    },
    OCD___uin_mm_description: {
      message:
        'These cookies are used to deliver adverts more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign.',
    },
    OCD_retention_44_days: {
      message: '44 days',
    },
    OCD___uir_mm_description: {
      message:
        'These cookies are used to deliver adverts more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign.',
    },
    OCD__cc_aud_description: {
      message:
        "Collects anonymous statistical data related to the user's website visits, such as the number of visits, average time spent on the website and what pages have been loaded. The purpose is to segment the website's users according to factors such as demographics and geographical location, in order to enable media and marketing agencies to structure and understand their target groups to enable customised online advertising.",
    },
    OCD_retention_269_days: {
      message: '269 days',
    },
    OCD__cc_cc_description: {
      message:
        "Collects anonymous statistical data related to the user's website visits, such as the number of visits, average time spent on the website and what pages have been loaded. The purpose is to segment the website's users according to factors such as demographics and geographical location, in order to enable media and marketing agencies to structure and understand their target groups to enable customised online advertising.",
    },
    OCD__cc_id_description: {
      message:
        "Collects anonymous statistical data related to the user's website visits, such as the number of visits, average time spent on the website and what pages have been loaded. The purpose is to segment the website's users according to factors such as demographics and geographical location, in order to enable media and marketing agencies to structure and understand their target groups to enable customised online advertising.",
    },
    OCD_panoramaId_description: {
      message:
        'Registers data on visitors from multiple visits and on multiple websites. This information is used to measure the efficiency of advertisement on websites.',
    },
    OCD_panoramaId_expiry_description: {
      message:
        'Registers data on visitors from multiple visits and on multiple websites. This information is used to measure the efficiency of advertisement on websites.',
    },
    OCD_panoramaId_expiry_exp_description: {
      message:
        'Contains the expiry-date for the cookie with corresponding name.',
    },
    OCD__cc_domain_description: {
      message:
        'Registers data on visitors from multiple visits and on multiple websites. This information is used to measure the efficiency of advertisement on websites.',
    },
    OCD_ab_description: {
      message:
        'This cookie is used by the website’s operator in context with multi-variate testing. This is a tool used to combine or change content on the website. This allows the website to find the best variation/edition of the site.',
    },
    OCD_bkdc_description: {
      message:
        "Registers anonymised user data, such as IP address, geographical location, visited websites, and what ads the user has clicked, with the purpose of optimising ad display based on the user's movement on websites that use the same ad network.",
    },
    OCD_bku_description: {
      message:
        "Registers anonymised user data, such as IP address, geographical location, visited websites, and what ads the user has clicked, with the purpose of optimising ad display based on the user's movement on websites that use the same ad network.",
    },
    OCD_everest_g_v2_description: {
      message:
        "This cookie stores the browser and surfer ID.Created after a user initially clicks a client's ad, and used to map the current and subsequent clicks with other events on the client's website",
    },
    OCD_everest_session_v2_description: {
      message: 'This cookie stores the session ID',
    },
    OCD_ev_tm_description: {
      message:
        'This cookie stores the Adobe Advertising DSP (Demand Side Platform) ID. \tA third-party cookie that stores the DSP ID that corresponds to the surfer ID in the everest_g_v2 cookie',
    },
    OCD__tmae_description: {
      message:
        "This cookie stores Encoded IDs and time stamps for ad engagements using Adobe Advertising DSP tracking.A third-party cookie that stores user engagements with ads, such as 'last seen ad xyz123 on June 30, 2016'",
    },
    OCD__lcc_description: {
      message:
        'This cookie stores IDs and time stamps (in the format yyyymmdd) of display clicks. It is a third-party cookie used to determine if a click event on a display ad applies to an Adobe Analytics hit',
    },
    OCD_retention_15_minutes: {
      message: '15 minutes',
    },
    OCD_ev_sync_ax_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_bk_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_dd_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_fs_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_ix_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_nx_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_ox_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_pm_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_rc_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_tm_description: {
      message:
        "This cookie stores The date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_ev_sync_yh_description: {
      message:
        "This cookie stores the date when synchronization is performed, in the format yyyymmdd. A third-party, ad exchange-specific cookie that syncs the Adobe Advertising surfer ID with the partner ad exchange. It's created for new surfers and sends a synchronization request when it's expired.",
    },
    OCD_adcloud_description: {
      message:
        "This cookie stores The timestamps of the surfer's last visit to the advertiser’s website and the surfer's last search click, and the ef_id that was created when the user clicked an ad",
    },
    OCD_id_adcloud_description: {
      message: 'This cookie stores the surfer ID',
    },
    OCD_retention_91_days: {
      message: '91 days',
    },
    OCD_mt_misc_description: {
      message:
        'MediaMath uses this cookie to hold attributes about the browser for fraud prevention and other technical optimizations.',
    },
    OCD_mt_mop_description: {
      message:
        'MediaMath uses this cookie to synchronize the visitor ID with a limited number of trusted exchanges and data partners',
    },
    OCD_pl_user_id_description: {
      message:
        'This cookie registers data on the visitor. The information is used to optimize advertisement relevance.',
    },
    OCD_pxrc_description: {
      message:
        'This cookie registers non-personal data on the visitor. The information is used to optimize advertisement relevance.',
    },
    OCD_rlas3_description: {
      message:
        "Collects anonymous data related to the user's visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded, with the purpose of displaying targeted ads.",
    },
    OCD_TapAd_DID_description: {
      message:
        'Used to determine what type of devices (smartphones, tablets, computers, TVs etc.) is used by a user.',
    },
    OCD_TapAd_TS_description: {
      message:
        'Used to determine what type of devices (smartphones, tablets, computers, TVs etc.) is used by a user.',
    },
    OCD_TapAd_3WAY_SYNCS_description: {
      message: 'Used for data-synchronization with advertisement networks',
    },
    OCD_TDCPM_description: {
      message:
        "Registers a unique ID that identifies a returning user's device. The ID is used for targeted ads.",
    },
    OCD_TDID_description: {
      message:
        "Registers a unique ID that identifies a returning user's device. The ID is used for targeted ads.",
    },
    OCD_uid_bp___description: {
      message:
        'The uid cookie is used by FreeWheel to generate statistics to show how many people may have seen a particular ad. Whereas the other cookies recognize returning users for the purpose of presenting users with relevant advertisements.',
    },
    OCD_MRM_UID_description: {
      message: 'Used to track the visitor across multiple devices including TV',
    },
    OCD_uuidc_description: {
      message:
        "Collects data on the user's visits to the website, such as what pages have been loaded. The registered data is used for targeted ads.",
    },
    OCD_zc_description: {
      message:
        'Registers data on visitors from multiple visits and on multiple websites. This information is used to measure the efficiency of advertisement on websites.',
    },
    OCD_zsc_description: {
      message: 'Frequency capping for cookie syncing',
    },
    OCD_zi_description: {
      message: 'User Identification',
    },
    OCD_idp_description: {
      message: 'User Identification',
    },
    OCD_zuc_description: {
      message: 'User Identification',
    },
    OCD_amplitude_id__description: {
      message:
        'These cookies are used by the TrustPilot service to identify you and enable you to leave reviews of our products and services.',
    },
    OCD_csrf_canary_description: {
      message:
        'These cookies are used by the TrustPilot service to identify you and enable you to leave reviews of our products and services. ',
    },
    OCD_3pi_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD_am_uid_description: {
      message:
        'This cookie is used to identify the visitor and optimize ad-relevance by collecting visitor data from multiple websites – this exchange of visitor data is normally provided by a third-party data-center or ad-exchange.',
    },
    OCD__cc_dc_description: {
      message:
        "Collects anonymous statistical data related to the user's website visits, such as the number of visits, average time spent on the website and what pages have been loaded. The purpose is to segment the website's users according to factors such as demographics and geographical location, in order to enable media and marketing agencies to structure and understand their target groups to enable customised online advertising.",
    },
    OCD_bkpa_description: {
      message:
        'Used to present the visitor with relevant content and advertisement - The service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD__ljtrtb___description: {
      message:
        'These cookies are used temporarily when multiple partners pass us their ID simultaneously. To avoid technical conflicts that arise from accessing the ljtrtb cookie for multiple partners at the same time, we store each partner’s ID in a separate cookie and then consolidate these IDs into the ljtrtb cookie when it’s available.',
    },
    OCD_ljtrtb_description: {
      message:
        'Enables us to help our advertising partners make decisions about displaying an advertisement to you. We store the ID that each partner uses to identify you and pass that information to the partner when a website requests an advertisement from us.',
    },
    OCD_uuid_description: {
      message:
        "Collects data on the user's visits to the website, such as what pages have been loaded. The registered data is used for targeted ads.",
    },
    OCD__pinterest_cm_description: {
      message:
        "Pinterest cookie ensures that you can share our website pages via Pinterest by means of the 'share' button",
    },
    OCD_retention_347_days: {
      message: '347 days',
    },
    OCD__pinterest_sess_description: {
      message:
        "session cookie (expires after your session) which collects anonymous data about a user's visit to the website, such as the number of visits, average time spent on the site and which pages have been loaded in order to personalise and improve the Pinterest service.",
    },
    OCD__pin_unauth_description: {
      message:
        'Registers a unique ID that identifies and recognizes the user. Is used for targeted advertising.',
    },
    OCD__pinterest_ct_ua_description: {
      message:
        'This cookieis a third party cookie which groups actions for users who cannot be identified by Pinterest.',
    },
    OCD_sessionFunnelEventLogged_description: {
      message:
        'A generic technical cookie used for storing user session identifier in web applications',
    },
    OCD__routing_id_description: {
      message:
        'Allows users to share pictures via Pinterest / the Pin It button. Pinterest can collect statistical information about usage of their service.',
    },
    OCD__derived_epik_description: {
      message:
        'Cookie is placed by the Pinterest tag when a match is identified when no cookies are present, such as enhanced match.',
    },
    OCD__pinterest_ct_description: {
      message:
        'They contain a user ID and the timestamp at which the cookie was created.',
    },
    OCD__pinterest_ct_rt_description: {
      message:
        'They contain a user ID and the timestamp at which the cookie was created.',
    },
    OCD__epik_description: {
      message:
        'Cookie is placed by the JavaScript tag based on information sent from Pinterest with promoted traffic to help identify the user.',
    },
    OCD_Nop_customer_description: {
      message: 'Customer cookie. Used to identifier guest customers.',
    },
    OCD_NopCommerce_RecentlyViewedProducts_description: {
      message:
        'Recently viewed products cookie. Stores a list of the recently viewed products',
    },
    OCD_retention_10_days: {
      message: '10 days',
    },
    OCD_NOPCOMMERCE_AUTH_description: {
      message:
        'Forms authentication cookie. Used for authenticating registered customers.',
    },
    OCD_tsrvid_description: {
      message: 'Feedback company review cookie',
    },
    OCD_form_key_description: {
      message:
        'A security measure that appends a random string to all form submissions to protect the data from Cross-Site Request Forgery (CSRF).',
    },
    OCD_product_data_storage__description: {
      message:
        'Stores configuration for product data related to Recently Viewed / Compared Products.',
    },
    OCD_mage_cache_sessid_description: {
      message:
        'The value of this cookie triggers the cleanup of local cache storage. When the cookie is removed by the backend application, the Admin cleans up local storage, and sets the cookie value to true.',
    },
    OCD_mage_cache_storage__description: {
      message:
        'Local storage of visitor-specific content that enables ecommerce functions.',
    },
    OCD_mage_cache_storage_section_invalidation__description: {
      message:
        'Forces local storage of specific content sections that should be invalidated.',
    },
    OCD_mage_cache_timeout__description: {
      message:
        "This cookie is necessary for the cache function. A cache is used by the website to optimize the response time between the visitor and the website. The cache is usually stored on the visitor's browser.",
    },
    OCD_mage_messages_description: {
      message:
        'Tracks error messages and other notifications that are shown to the user, such as the cookie consent message, and various error messages. The message is deleted from the cookie after it is shown to the shopper.',
    },
    OCD_mage_translation_file_version_description: {
      message:
        'Tracks the version of translations in local storage. Used when Translation Strategy is configured as Dictionary (Translation on Storefront side).',
    },
    OCD_mage_translation_storage_description: {
      message:
        'Stores translated content when requested by the shopper. Used when Translation Strategy is configured as Dictionary (Translation on Storefront side).',
    },
    OCD_product_data_storage_description: {
      message:
        'Stores configuration for product data related to Recently Viewed / Compared Products.',
    },
    OCD_recently_compared_product__description: {
      message: 'Stores product IDs of recently compared products.',
    },
    OCD_recently_compared_product_previous__description: {
      message:
        'Stores product IDs of previously compared products for easy navigation.',
    },
    OCD_recently_viewed_product__description: {
      message:
        'Stores product IDs of recently viewed products for easy navigation.',
    },
    OCD_recently_viewed_product_previous__description: {
      message:
        'Stores product IDs of recently previously viewed products for easy navigation.',
    },
    OCD_user_allowed_save_cookie_description: {
      message: 'Indicates if a customer is allowed to use cookies.',
    },
    OCD_external_no_cache_description: {
      message: 'A flag that indicates if caching is disabled.',
    },
    OCD_persistent_shopping_cart_description: {
      message:
        'Stores the key (ID) of persistent cart to make it possible to restore the cart for an anonymous shopper.',
    },
    OCD_stf_description: {
      message:
        'Records the time messages are sent by the SendFriend (Email a Friend) module.',
    },
    OCD_pollN_description: {
      message: 'A poll ID that indicates if a vote has occurred.',
    },
    OCD_frontend_description: {
      message: 'Session ID',
    },
    OCD_guest_view_description: {
      message: 'Allows guests to edit their orders.',
    },
    OCD_mage_banners_cache_storage_description: {
      message: 'Stores banner content locally to improve performance.',
    },
    OCD_searchReport_log_description: {
      message: 'Magento, used to log information about searching',
    },
    OCD_private_content_version_description: {
      message:
        'Appends a random, unique number and time to pages with customer content to prevent them from being cached on the server.',
    },
    OCD_X_Magento_Vary_description: {
      message:
        'X-Magento-Vary cookie is used by Magento 2 system to highlight that version of a page requested by a user has been changed. It allows having different versions of the same page stored in cache e.g. Varnish.',
    },
    OCD_section_data_ids_description: {
      message:
        'Stores customer-specific information related to shopper-initiated actions such as display wish list, checkout information, etc.',
    },
    OCD_section_data_clean_description: {
      message:
        'Determines which products the user has viewed, allowing the website to promote related products.',
    },
    OCD_last_visited_store_description: {
      message:
        'This cookie keeps track of the last website you visited. This is necessary to enable the correct language on the website.',
    },
    OCD_store_description: {
      message:
        'This cookie keeps track of the last website you visited. This is necessary to enable the correct language on the website.',
    },
    OCD_login_redirect_description: {
      message:
        'Preserves the destination page that was loading before the customer was directed to log in.',
    },
    OCD_dsps___description: {
      message: 'Service to display targeted advertising to visitors.',
    },
    OCD__mb_description: {
      message:
        'Used in context with video-advertisement. The cookie limits the number of times a visitor is shown the same advertisement-content. The cookie is also used to ensure relevance of the video-advertisement to the specific visitor.',
    },
    OCD_wordpress_test_cookie_description: {
      message:
        'Cookie set by WordPress to check if the cookies are enabled on the browser to provide appropriate user experience to the users',
    },
    OCD_componentType_description: {
      message:
        'componentType is a session cookie, used for correct recording the type of the page (frontpage, single page, blog etc)',
    },
    OCD_componentStyle_description: {
      message:
        'componentStyle is a session cookie, used for setting the proper template in compliance with visited type of the page',
    },
    OCD_nrid_description: {
      message:
        "This cookie is used to remember a user's choice about cookies on the website. Where users have previously indicated a preference, that user’s preference will be stored in this cookie.",
    },
    OCD_koitk_description: {
      message:
        'Collects data on visitors behavior and interaction - This is used to optimize the website and make advertisement on the website more relevant.',
    },
    OCD_retention_3_years: {
      message: '3 years',
    },
    OCD___ss_referrer_description: {
      message:
        'This cookie contains information about where the visitor came from, called the source for the visit.',
    },
    OCD___ss_tk_description: {
      message:
        'This is Sharspring’s token cookie which enables user tracking. It ensures that the visit to website is connected to the user independent of the session and the source.',
    },
    OCD_retention_25_years: {
      message: '25 years',
    },
    OCD___ss_description: {
      message:
        'This cookie is storing the session ID for your visit. It is used in combination with _ss_tk to group website visits in reports for a single user.',
    },
    OCD__pk_id__description: {
      message:
        'Used to store a few details about the user such as the unique visitor ID',
    },
    OCD__pk_ref__description: {
      message:
        'Used to store the attribution information, the referrer initially used to visit the website',
    },
    OCD__pk_ses__description: {
      message:
        'Short lived cookies used to temporarily store data for the visit',
    },
    OCD__pk_cvar_description: {
      message:
        'Short lcts data on visitors behavior and interaction - This is used to optimize the website and make advertisement on the website more relevant.',
    },
    OCD__pk_hsr__description: {
      message:
        'Short lived cookies used to temporarily store data for the visit',
    },
    OCD__pk_testcookie__description: {
      message:
        'Cookie is created and should be then directly deleted (used to check whether the visitor’s browser supports cookies)',
    },
    OCD_mtm_consent_description: {
      message:
        'Cookie is created with no expiry date to forever remember that consent was given by the user.',
    },
    OCD_retention_forever: {
      message: 'forever',
    },
    OCD_datatrics_optin_description: {
      message: 'Saving opt-in preferences.',
    },
    OCD_retention_undefined: {
      message: 'undefined',
    },
    OCD_datatricsDebugger_description: {
      message: 'Saving Datatrics debugger preferences.',
    },
    OCD_datatrics_customData_description: {
      message: 'Saving defined custom data.',
    },
    OCD__wepublishGa_description: {
      message: 'ID used to identify users',
    },
    OCD__wepublishGa_gid_description: {
      message:
        'ID used to identify users for 24 hours after last activity 24 hours',
    },
    OCD_OptanonConsent_description: {
      message:
        'This cookie is set by the cookie compliance solution from OneTrust. It stores information about the categories of cookies the site uses and whether visitors have given or withdrawn consent for the use of each category. This enables site owners to prevent cookies in each category from being set in the user’s browser, when consent is not given. The cookie has a normal lifespan of one year, so that returning visitors to the site will have their preferences remembered. It contains no information that can identify the site visitor.',
    },
    OCD_OptanonAlertBoxClosed_description: {
      message:
        'This cookie is set by the cookie compliance solution from OneTrust. It stores information about the categories of cookies the site uses and whether visitors have given or withdrawn consent for the use of each category. This enables site owners to prevent cookies in each category from being set in the users browser, when consent is not given. The cookie has a normal lifespan of one year, so that returning visitors to the site will have their preferences remembered. It contains no information that can identify the site visitor.',
    },
    OCD_OptanonControl_description: {
      message:
        'This cookie is set by the cookie compliance solution from OneTrust. It stores information about the categories of cookies the site uses and whether visitors have given or withdrawn consent for the use of each category. This enables site owners to prevent cookies in each category from being set in the user’s browser, when consent is not given. The cookie has a normal lifespan of one year, so that returning visitors to the site will have their preferences remembered. It contains no information that can identify the site visitor.',
    },
    OCD_optimizelyEndUserId_description: {
      message:
        "Stores a visitor's unique Optimizely identifier. It's a combination of a timestamp and random number. No other information about you or your visitors is stored inside.",
    },
    OCD_optimizelyRedirectData_description: {
      message:
        'After Optimizely has executed a redirect experiment, stores various data from the original page so that Optimizely still has access to it on the new page.',
    },
    OCD_retention_5_seconds: {
      message: '5 seconds',
    },
    OCD_optimizelyDomainTestCookie_description: {
      message:
        'When Optimizely loads a URL, the snippet places the cookie to get the current domain, for the purpose of whether cross-domain syncing is possible. If successful, the cookie is immediately removed.',
    },
    OCD_optimizelyOptOut_description: {
      message:
        'Stores a boolean indicating whether the visitor has opted out of participating in Optimizely-powered experimentation.',
    },
    OCD_wwwchannelme_z_sid_description: {
      message: 'The cookie is used when using the co-browsing feature.',
    },
    OCD_app_ts_description: {
      message: 'Used by adscience.nl to display remarketing campaigns.',
    },
    OCD_viewer_description: {
      message:
        'Used by adscience.nl to measure visitor numbers and information and use it to optimize marketing campaigns.',
    },
    OCD_spx_ts_description: {
      message:
        'These cookies ensure that relevant advertisements are displayed on external websites.',
    },
    OCD_adx_ts_description: {
      message:
        'These cookies ensure that relevant advertisements are displayed on external websites.',
    },
    OCD_id_ts_description: {
      message:
        'These cookies ensure that relevant advertisements are displayed on external websites.',
    },
    OCD_euconsent_description: {
      message: 'Cookie compliance check',
    },
    OCD_SSR_caching_description: {
      message: 'Indicates how a site was rendered',
    },
    OCD_smSession_description: {
      message: 'Identifies logged in site members',
    },
    OCD_svSession_description: {
      message:
        'Identifies unique visitors and tracks a visitor’s sessions on a site',
    },
    OCD_ForceFlashSite_description: {
      message:
        'When viewing a mobile site (old mobile under m.domain.com) it will force the server to display the non-mobile version and avoid redirecting to the mobile site',
    },
    OCD_hs_description: {
      message: 'Security',
    },
    OCD_bSession_description: {
      message: 'Used for system effectiveness measurement',
    },
    OCD_TS01__description: {
      message: 'Used for security and anti-fraud reasons',
    },
    OCD_fedops_logger_sessionId_description: {
      message: 'Used for stability/effectiveness measurement',
    },
    OCD_retention_12_months: {
      message: '12 months',
    },
    OCD_wixLanguage_description: {
      message: 'Used on multilingual websites to save user language preference',
    },
    OCD__wixCIDX_description: {
      message: 'Used for system monitoring/debugging',
    },
    OCD__wix_browser_sess_description: {
      message: 'Used for system monitoring/debugging',
    },
    OCD_consent_policy_description: {
      message: 'Used for cookie banner parameters',
    },
    OCD__ab_description: {
      message: 'Used in connection with access to admin.',
    },
    OCD__secure_session_id_description: {
      message: 'Used in connection with navigation through a storefront.',
    },
    OCD_Cart_description: {
      message: 'Used in connection with shopping cart.',
    },
    OCD_cart_sig_description: {
      message: 'Used in connection with shopping cart.',
    },
    OCD_cart_ts_description: {
      message: 'Used in connection with checkout.',
    },
    OCD_checkout_token_description: {
      message: 'Used in connection with checkout.',
    },
    OCD_Secret_description: {
      message: 'Used in connection with checkout.',
    },
    OCD_Secure_customer_sig_description: {
      message: 'Used in connection with customer login.',
    },
    OCD_storefront_digest_description: {
      message: 'Used in connection with customer login.',
    },
    OCD__shopify_u_description: {
      message: 'Used to facilitate updating customer account information.',
    },
    OCD__tracking_consent_description: {
      message: 'Tracking preferences.',
    },
    OCD__landing_page_description: {
      message: 'Track landing pages.',
    },
    OCD__orig_referrer_description: {
      message: 'Track landing pages.',
    },
    OCD__s_description: {
      message: 'Shopify analytics.',
    },
    OCD__shopify_fs_description: {
      message: 'Shopify analytics.',
    },
    OCD__shopify_s_description: {
      message: 'Shopify analytics.',
    },
    OCD__shopify_sa_p_description: {
      message: 'Shopify analytics relating to marketing & referrals.',
    },
    OCD__shopify_sa_t_description: {
      message: 'Shopify analytics relating to marketing & referrals.',
    },
    OCD__shopify_uniq_description: {
      message: 'Shopify analytics.',
    },
    OCD__shopify_visit_description: {
      message: 'Shopify analytics.',
    },
    OCD__shopify_y_description: {
      message: 'Shopify analytics.',
    },
    OCD__y_description: {
      message: 'Shopify analytics.',
    },
    OCD_tracked_start_checkout_description: {
      message: 'Shopify analytics relating to checkout.',
    },
    OCD_ki_r_description: {
      message: 'Shopify analytics.',
    },
    OCD_ki_t_description: {
      message: 'Shopify analytics.',
    },
    OCD__Brochure_session_description: {
      message: 'Used in connection with browsing through site.',
    },
    OCD_shopify_pay_redirect_description: {
      message: 'Used in connection with checkout.',
    },
    OCD_retention_30_minutes__3w_or_1y_depending_on_value: {
      message: '30 minutes, 3w or 1y depending on value',
    },
    OCD_cart_currency_description: {
      message:
        'Set after a checkout is completed to ensure that new carts are in the same currency as the last checkout.',
    },
    OCD_dynamic_checkout_shown_on_cart_description: {
      message: 'Used in connection with checkout.',
    },
    OCD_keep_alive_description: {
      message: 'Used in connection with buyer localization.',
    },
    OCD_retention_14_weeks: {
      message: '14 weeks',
    },
    OCD_checkout_session_token__description: {
      message: 'Used in connection with checkout.',
    },
    OCD_retention_3_weeks: {
      message: '3 weeks',
    },
    OCD_checkout_session_lookup_description: {
      message: 'Used in connection with checkout.',
    },
    OCD_cart_ver_description: {
      message: 'Used in connection with shopping cart.',
    },
    OCD_localization_description: {
      message: 'Used in connection with checkout.',
    },
    OCD_locale_bar_accepted_description: {
      message:
        'This cookie is provided by app (BEST Currency Converter) and is used to secure currency chosen by the customer.',
    },
    OCD__cmp_a_description: {
      message: 'Used for managing customer privacy settings.',
    },
    OCD__shopify_country_description: {
      message:
        "For shops where pricing currency/country set from GeoIP, that cookie stores the country we've detected. This cookie helps avoid doing GeoIP lookups after the first request.",
    },
    OCD___hs_opt_out_description: {
      message:
        'This cookie is used by the opt-in privacy policy to remember not to ask the visitor to accept cookies again.',
    },
    OCD___hs_do_not_track_description: {
      message:
        'This cookie can be set to prevent the tracking code from sending any information to HubSpot.',
    },
    OCD___hs_initial_opt_in_description: {
      message:
        'This cookie is used to prevent the banner from always displaying when visitors are browsing in strict mode.',
    },
    OCD_hs_ab_test_description: {
      message:
        'This cookie is used to consistently serve visitors the same version of an A/B test page they’ve seen before.',
    },
    OCD_hs_messages_is_open_description: {
      message:
        'This cookie is used to determine and save whether the chat widget is open for future visits.',
    },
    OCD_hs_messages_hide_welcome_message_description: {
      message:
        'This cookie is used to prevent the chat widget welcome message from appearing again for one day after it is dismissed.',
    },
    OCD___hsmem_description: {
      message:
        'This cookie is set when visitors log in to a HubSpot-hosted site.',
    },
    OCD_hs_membership_csrf_description: {
      message:
        'This cookie is used to ensure that content membership logins cannot be forged.',
    },
    OCD_hs_langswitcher_choice_description: {
      message:
        "This cookie is used to save the visitor's selected language choice when viewing pages in multiple languages.",
    },
    OCD___hstc_description: {
      message: 'The main cookie for tracking visitors.',
    },
    OCD_hubspotutk_description: {
      message:
        "This cookie keeps track of a visitor's identity. It is passed to HubSpot on form submission and used when deduplicating contacts.",
    },
    OCD___hssc_description: {
      message: 'This cookie keeps track of sessions.',
    },
    OCD___hssrc_description: {
      message:
        'Whenever HubSpot changes the session cookie, this cookie is also set to determine if the visitor has restarted their browser.',
    },
    OCD_messagesUtk_description: {
      message:
        "This cookie is used to recognize visitors who chat with you via the chatflows tool. If the visitor leaves your site before they're added as a contact, they will have this cookie associated with their browser.",
    },
    OCD_hubspotapi_description: {
      message:
        'This cookie allows the user to access the app with the correct permissions.',
    },
    OCD_hubspotapi_prefs_description: {
      message:
        "This is used with the hubspotapi cookie to remember whether the user checked the 'remember me' box (controls the expiration of the main cookie's authentication).",
    },
    OCD_hubspotapi_csrf_description: {
      message:
        'This is used for CSRF prevention - preventing third party websites from accessing your data. Expires after a year.',
    },
    OCD_vuid_description: {
      message:
        'This first party cookie created by Vimeo is used to assign a Vimeo Analytics unique id.',
    },
    OCD_Player_description: {
      message:
        'This first party cookie created by Vimeo is used to remember user’s player mode preferences.',
    },
    OCD_continuous_play_v3_description: {
      message:
        'Used to keep track of whether continuous play is on or not for a user',
    },
    OCD_sd_identity_description: {
      message:
        'Collects analytical tracking information about videos and enables the player to function properly.',
    },
    OCD_sd_client_id_description: {
      message:
        'Collects analytical tracking information about videos and enables the player to function properly.',
    },
    OCD___stripe_mid_description: {
      message: 'Fraud prevention and detection',
    },
    OCD___stripe_sid_description: {
      message: 'Fraud prevention and detection',
    },
    OCD_m_description: {
      message: 'Set by payment provider stripe.com to process payments',
    },
    OCD__gat_pro_description: {
      message:
        'Allows Snapwidget to offer anonymous analytics about how the visitors are using your widgets',
    },
    OCD_woocommerce_cart_hash_description: {
      message: 'Helps WooCommerce determine when cart contents/data changes.',
    },
    OCD_woocommerce_items_in_cart_description: {
      message: 'Helps WooCommerce determine when cart contents/data changes.',
    },
    OCD_wp_woocommerce_session___description: {
      message:
        'Contains a unique code for each customer so that it knows where to find the cart data in the database for each customer.',
    },
    OCD_woocommerce_recently_viewed_description: {
      message: 'Powers the Recent Viewed Products widget',
    },
    OCD_store_notice__description: {
      message: 'Allows customers to dismiss the Store Notice.',
    },
    OCD_woocommerce_snooze_suggestions____description: {
      message:
        'Allows dashboard users to dismiss Marketplace suggestions, if enabled.',
    },
    OCD_woocommerce_dismissed_suggestions____description: {
      message: 'Count of suggestion dismissals, if enabled.',
    },
    OCD_tk_ai_description: {
      message:
        'Stores a randomly-generated anonymous ID. This is only used within the dashboard (/wp-admin) area and is used for usage tracking, if enabled.',
    },
    OCD_sbjs_session_description: {
      message:
        'The number of page views in this session and the current page path',
    },
    OCD_sbjs_udata_description: {
      message:
        'Information about the visitor’s user agent, such as IP, the browser, and the device type',
    },
    OCD_sbjs_first_description: {
      message:
        'Traffic origin information for the visitor’s first visit to your store (only applicable if the visitor returns before the session expires)',
    },
    OCD_sbjs_current_description: {
      message:
        'Traffic origin information for the visitor’s current visit to your store',
    },
    OCD_sbjs_first_add_description: {
      message:
        'Timestamp, referring URL, and entry page for your visitor’s first visit to your store (only applicable if the visitor returns before the session expires)',
    },
    OCD_sbjs_current_add_description: {
      message:
        'Timestamp, referring URL, and entry page for your visitor’s current visit to your store',
    },
    OCD_sbjs_migrations_description: {
      message:
        'Technical data to help with migrations between different versions of the tracking feature',
    },
    OCD_edgebucket_description: {
      message: 'Used by Reddit to deliver advertising',
    },
    OCD_initref_description: {
      message: 'Used by Reddit to deliver advertising',
    },
    OCD_incap_ses___description: {
      message:
        "This cookie is set to allow a visitor to receive site content from one out of multiple servers as the visitor browses the site. This allows the visitor's session to be maintained.",
    },
    OCD_nlbi___description: {
      message:
        'Incapsula DDoS Protection and Web Application Firewall: Load balancing cookie. To ensure requests by a client are sent to the same origin server.',
    },
    OCD_visid_incap___description: {
      message:
        'This cookie is from the incapsula CDN and helps us with reliability, security and the performance of our site.',
    },
    OCD_sp_t_description: {
      message:
        'Required to ensure the functionality of the integrated Spotify plugin. This does not result in any cross-site functionality.',
    },
    OCD_sp_landing_description: {
      message:
        'Required to ensure the functionality of the integrated Spotify plugin. This does not result in any cross-site functionality.',
    },
    OCD_anj_description: {
      message:
        'The anj cookie contains data denoting whether a cookie ID is synced with our partners. ID syncing enables our partners to use their data from outside the Platform on the Platform. ',
    },
    OCD_uuid2_description: {
      message:
        'This cookie contains a unique randomly-generated value that enables the Platform to distinguish browsers and devices.',
    },
    OCD_usersync_description: {
      message:
        'This cookie contains data denoting whether a cookie ID is synced with our partners. ID syncing enables our partners to use their data from outside the Platform on the Platform.',
    },
    OCD_icu_description: {
      message:
        'This cookie is used to select ads and limit the number of times a user sees a particular ad. It contains information such as the number of times an ad has been shown, how recently an ad has been shown, or how many total ads have been shown.',
    },
    OCD_pses_description: {
      message:
        'This cookie is used to measure the time a user spends on a site.',
    },
    OCD_sess_description: {
      message:
        'The sess cookie contains a single non-unique value: “1”.It is used by the Platform to test whether a browser is configured to accept cookies from Xandr.',
    },
    OCD_XANDR_PANID_description: {
      message:
        'This cookie registers data on the visitor. The information is used to optimize advertisement relevance.',
    },
    OCD_cc___description: {
      message: 'References a cart for anonymous users',
    },
    OCD_pgid_org___description: {
      message:
        'Hash of personalization information. Used to cache pages or snippets for users with same personalization information',
    },
    OCD_SecureSessionID___description: {
      message: 'Reference to authenticated user',
    },
    OCD_CMSCsrfCookie_description: {
      message:
        "Store's a security token that the system uses to validate all form data submitted via POST requests. Helps protect against Cross site request forgery.",
    },
    OCD_CMSCookieLevel_description: {
      message: 'Specifies which cookies are allowed by the visitor.',
    },
    OCD_CMSLandingPageLoaded_description: {
      message:
        'Indicates that the landing page has already been visited and the Landing page activity is not logged again for the current visitor. Expires after 20 minutes and the expiration period of the key is renewed every time the website is accessed again.',
    },
    OCD_retention_20_minutes: {
      message: '20 minutes',
    },
    OCD_CMSPreferredCulture_description: {
      message: "Stores the visitor's preferred content culture.",
    },
    OCD_CMSUserPage_description: {
      message:
        'Stores the IDs (DocumentID, NodeID) of the last visited page. Used for logging landing and exit page web analytics and activities.',
    },
    OCD_CurrentContact_description: {
      message:
        'Stores the GUID of the contact related to the current site visitor. Used to track activities on the website.',
    },
    OCD_retention_50_years: {
      message: '50 years',
    },
    OCD_VisitorStatus_description: {
      message:
        'Indicates if the visitor is new or returning. Used for tracking the visitors statistic in Web analytics.',
    },
    OCD_sc_at_description: {
      message: 'Used to identify a visitor across multiple domains.',
    },
    OCD_sc_a_nonce_description: {
      message: 'Nonce control. Used to encrypt session data.',
    },
    OCD__scid_description: {
      message: 'Used to help identify a visitor.',
    },
    OCD__schn_description: {
      message:
        'This cookies come from the Snapchat retargeting pixel. This pixel is used to retarget and attribute traffic coming from the social network.',
    },
    OCD_X_AB_description: {
      message:
        'This cookie is used by the website’s operator in context with multi-variate testing. This is a tool used to combine or change content on the website. This allows the website to find the best variation/edition of the site.',
    },
    OCD__scid_r_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD__vwo_uuid_v2_description: {
      message: 'Used to track visitor movements anonymously.',
    },
    OCD__vwo_uuid_description: {
      message: 'Used to track visitor movements anonymously.',
    },
    OCD__vis_opt_s_description: {
      message:
        'This cookie detects if you are new or returning to a particular test.',
    },
    OCD_retention_100_days: {
      message: '100 days',
    },
    OCD__vis_opt_test_cookie_description: {
      message:
        'This is a temporary session cookie generated to detect if the cookies are enabled on the user browser or not.',
    },
    OCD__vis_opt_exp___description: {
      message: 'This cookie is generated when a goal is created.',
    },
    OCD__vwo_sn_description: {
      message:
        "Collects statistics on the visitor's visits to the website, such as the number of visits, average time spent on the website and what pages have been read.",
    },
    OCD__vwo_ds_description: {
      message:
        "Collects data on the user's visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded with the purpose of generating reports for optimising the website content.",
    },
    OCD__vwo_referrer_description: {
      message:
        "Registers data on visitors' website-behaviour. This is used for internal analysis and website optimization.",
    },
    OCD__vwo_ssm_description: {
      message:
        'This cookie is used for testing and is created only on sites that use the HTTP protocol. This is used to check if VWO can create cookies on them, post which this cookie is deleted.',
    },
    OCD_zc_consent_description: {
      message:
        'Determines whether the user has accepted the cookie consent box.',
    },
    OCD_ZCAMPAIGN_CSRF_TOKEN_description: {
      message: 'This cookie is used to distinguish between humans and bots.',
    },
    OCD_zc_show_description: {
      message:
        "Collects data on visitors' preferences and behaviour on the website - This information is used make content and advertisement more relevant to the specific visitor.",
    },
    OCD_zc_cu_exp_description: {
      message: 'Contains the expiration date for the cookie with its name.',
    },
    OCD_zc_loc_description: {
      message:
        'Collects information on user preferences and/or interaction with web-campaign content - This is used on CRM-campaign-platform used by website owners for promoting events or products.',
    },
    OCD_uesign_description: {
      message:
        'This cookie is used to manage the security of the applications.',
    },
    OCD_wa_ul_description: {
      message: 'Used to access the service it provides.',
    },
    OCD_wa_lang_pref_description: {
      message: 'Used by WhatsApp to save language preferences',
    },
    OCD_pa_rubicon_ts_description: {
      message:
        'This cookie is set by Perfect Audience and is used for advertising purposes based on user behavior data.',
    },
    OCD_pa_google_ts_description: {
      message:
        'This cookie is set by Perfect Audience and is used for advertising purposes based on user behavior data.',
    },
    OCD_pa_twitter_ts_description: {
      message:
        'This cookie is set by Perfect Audience and is used for advertising purposes based on user behavior data.',
    },
    OCD_pa_yahoo_ts_description: {
      message:
        'This cookie is set by Perfect Audience and is used for advertising purposes based on user behavior data.',
    },
    OCD_pa_openx_ts_description: {
      message:
        'This cookie is set by Perfect Audience and is used for advertising purposes based on user behavior data.',
    },
    OCD_pa_uid_description: {
      message:
        'This cookie is set by Perfect Audience and is used for advertising purposes based on user behavior data.',
    },
    OCD_mailmunch_second_pageview_description: {
      message: 'Used for tracking by the Mailmunch mailing list software',
    },
    OCD__mailmunch_visitor_id_description: {
      message:
        'This cookie is set by MailMunch which is email collection and email marketing platform.',
    },
    OCD_tPHG_PS_description: {
      message:
        "Partnerize’s tracking cookie, deployed either upon a user’s clicking of a link on a partner website, or upon the loading of a customer's image to a partner website.",
    },
    OCD_digitalAudience_description: {
      message:
        'Digital Audience uses cookies to improve the effectiveness of digital platforms, thanks to online recognition mechanisms.',
    },
    OCD_has_js_description: {
      message:
        'Drupal uses this cookie to indicate whether or not the visitors browser has JavaScript enabled.',
    },
    OCD__omappvs_description: {
      message: 'Cookie is used to identify returning visitors',
    },
    OCD__omappvp_description: {
      message: 'Cookie is used to identify returning visitors',
    },
    OCD__lfa_description: {
      message:
        'Leadfeeder cookie collects the behavioral data of all website visitors. This includes; pages viewed, visitor source and time spent on the site',
    },
    OCD_SnapABugHistory_description: {
      message:
        'This cookie is associated with live chat software from SnapEngage. It identifies a visitor to enable a history of engagement to be recorded.',
    },
    OCD_SnapABugUserAlias_description: {
      message:
        'Stores a unique ID string for each chat-box session. This allows the website-support to see previous issues and reconnect with the previous supporter.',
    },
    OCD_SnapABugVisit_description: {
      message:
        'This cookie is associated with live chat software from SnapEngage. It identifies a new user session.',
    },
    OCD_SnapABugRef_description: {
      message:
        'This cookie is associated with live chat software from SnapEngage. It records the landing page and origin of a visitor.',
    },
    OCD_audience_description: {
      message: 'Sync audience data between buyers and sellers.',
    },
    OCD_yith_wcwl_session__description: {
      message:
        'YITH WooCommerce Wishlist plugin uses cookies in order to correctly store user wishlists',
    },
    OCD_A3_description: {
      message: 'Ads targeting cookie for Yahoo',
    },
    OCD_APID_description: {
      message:
        'Collects information on visitor behaviour on multiple websites. This information is used on the website, in order to optimize the relevance of advertisement.',
    },
    OCD_APIDTS_description: {
      message:
        'This is a Yahoo! Cookie used in the targeting of relevant adverts and content on the Yahoo! platform.',
    },
    OCD_IDSYNC_description: {
      message:
        "Identifies if the cookie-data needs to be updated in the visitor's browser - This is determined through third-party ad-serving-companies.",
    },
    OCD_A1_description: {
      message: 'Ads targeting cookie for Yahoo',
    },
    OCD_A1S_description: {
      message: 'Ads targeting cookie for Yahoo',
    },
    OCD_INGRESSCOOKIE_description: {
      message:
        'Registers which server-cluster is serving the visitor. This is used in context with load balancing, in order to optimize user experience.',
    },
    OCD_AlteonP_description: {
      message:
        'This cookie is set by the load balancers and allows us to evenly balance the number of users across the web servers that we use.',
    },
    OCD_cref_description: {
      message:
        'Contains data on user navigation, interaction and time spent on the website and its sub-pages – This data is used to optimise the relevance of advertisements and for statistical purposes.',
    },
    OCD_mc_description: {
      message:
        'Tracking of users and measure and improve performance and supports personalisation',
    },
    OCD_d_description: {
      message:
        'Tracking of users and measure and improve performance and supports personalisation',
    },
    OCD_iutk_description: {
      message:
        "Recognises the user's device and what Issuu documents have been read.",
    },
    OCD_cookielawinfo_checkbox_necessary_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The cookies is used to store the user consent for the cookies in the category 'Necessary'.",
    },
    OCD_retention_11_months: {
      message: '11 months',
    },
    OCD_cookielawinfo_checkbox_non_necessary_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The cookies is used to store the user consent for the cookies in the category 'Non Necessary'.",
    },
    OCD_viewed_cookie_policy_description: {
      message:
        'The cookie is set by the GDPR Cookie Consent plugin and is used to store whether or not user has consented to the use of cookies. It does not store any personal data.',
    },
    OCD_cookielawinfo_checkbox_marketing_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The purpose of this cookie is to check whether or not the user has given the consent to the usage of cookies under the category 'Marketing'.",
    },
    OCD_cookielawinfo_checkbox_analytics_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The purpose of this cookie is to check whether or not the user has given the consent to the usage of cookies under the category 'Analytics'.",
    },
    OCD_cookielawinfo_checkbox_performance_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The purpose of this cookie is to check whether or not the user has given the consent to the usage of cookies under the category 'Performance'.",
    },
    OCD_cookielawinfo_checkbox_others_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The cookie is used to store the user consent for the cookies in the category 'Other'.",
    },
    OCD_cookielawinfo_checkbox_functional_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The cookie is used to store the user consent for the cookies in the category 'Functional'.",
    },
    OCD_cookielawinfo_checkbox_advertisement_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The cookie is used to store the user consent for the cookies in the category 'Advertisement'.",
    },
    OCD_cli_user_preference_description: {
      message:
        'The cookie is set by the GDPR Cookie Consent plugin and is used to store whether or not user has consented to the use of cookies. It does not store any personal data.',
    },
    OCD_cookielawinfo_checkbox_preferences_description: {
      message:
        "This cookie is set by GDPR Cookie Consent plugin. The purpose of this cookie is to check whether or not the user has given the consent to the usage of cookies under the category 'Preferences'.",
    },
    OCD_CookieLawInfoConsent_description: {
      message:
        'The cookie is set by the GDPR Cookie Consent plugin and is used to store whether or not user has consented to the use of cookies. It does not store any personal data.',
    },
    OCD___qca_description: {
      message:
        'This cookie is set by Quantcast, who present targeted advertising. Stores browser and HTTP request information.',
    },
    OCD_stg_traffic_source_priority_description: {
      message:
        'Stores the type of traffic source that explains how the visitor reached your website.',
    },
    OCD_stg_last_interaction_description: {
      message:
        "Determines whether the last visitor's session is still in progress or a new session has started.",
    },
    OCD_stg_returning_visitor_description: {
      message:
        'Determines if the visitor has already been to your website — they are returning visitors.',
    },
    OCD_stg_externalReferrer_description: {
      message:
        'Stores an URL of a website that referred a visitor to your website.',
    },
    OCD___sqra_description: {
      message:
        "Tracks the user's interaction with the website's search-bar-function. This data can be used to present the user with relevant products or services.",
    },
    OCD___sqrb_description: {
      message:
        "Tracks the user's interaction with the website's search-bar-function. This data can be used to present the user with relevant products or services.",
    },
    OCD___sqrc_description: {
      message:
        "Tracks the user's interaction with the website's search-bar-function. This data can be used to present the user with relevant products or services.",
    },
    OCD_nmstat_description: {
      message:
        "This cookie is used to help record the visitor's use of the website. It is used to collect statistics about site usage such as when the visitor last visited the site. This information is then used to improve the user experience on the website. This Siteimprove Analytics cookie contains a randomly generated ID used to recognize the browser when a visitor reads a page. The cookie contains no personal information and is used only for web analytics. It is also used to track the sequence of pages a visitor looks at during a visit to the site. This information can be used to reduce user journeys, and enable visitors to find relevant information quicker.",
    },
    OCD_sp_description: {
      message:
        'Stores a server-side collector generated unique identifier for a user that is sent with all subsequent tracking event events. Can be used as a first party cookie is the collector is on the same domain as the site.',
    },
    OCD__sp_id___description: {
      message:
        'Stores user information that is created when a user first visits a site and updated on subsequent visits. It is used to identify users and track the users activity across a domain. This cookie stores a unique identifier for each user, a unique identifier for the users current session, the number of visits a user has made to the site, the timestamp of the users first visit, the timestamp of their previous visit and the timestamp of their current visit.',
    },
    OCD__sp_ses___description: {
      message:
        'Used to identify if the user is in an active session on a site or if this is a new session for a user (i.e. cookie doesn’t exist or has expired).',
    },
    OCD_AUTH_SESSION_ID_description: {
      message: 'ID of current authentication session.',
    },
    OCD_KC_RESTART_description: {
      message: 'Internal cookie from Keycloak.',
    },
    OCD_KC_START_description: {
      message: 'Internal cookie from Keycloak.',
    },
    OCD_KEYCLOAK_IDENTITY_description: {
      message: 'ID of the current user.',
    },
    OCD_KEYCLOAK_LOCALE_description: {
      message: 'Language of the interface.',
    },
    OCD_KEYCLOAK_REMEMBER_ME_description: {
      message: 'Internal cookie from Keycloak.',
    },
    OCD_KEYCLOAK_SESSION_description: {
      message: 'ID of the current browser session',
    },
    OCD__abck_description: {
      message:
        'This cookie is used to analyse traffic to determine if it is automated traffic generated by IT systems or a human user',
    },
    OCD_AKA_A2_description: {
      message:
        "Used for Akamai's Advanced Acceleration feature, intended to improve web performance",
    },
    OCD_retention_1_hour_or_longer: {
      message: '1 hour or longer',
    },
    OCD_ak_bmsc_description: {
      message:
        'Cookie used to optimize performance, and to improve the user experience, on Akamai websites',
    },
    OCD_bm_sv_description: {
      message:
        'Used by Akamai Botman Manager to help differentiate between web requests generated by humans and web requests generated by bots or other automated processes',
    },
    OCD_CRAFT_CSRF_TOKEN_description: {
      message:
        'Facilitates protection against cross-site request forgeries. This helps to safeguard data as it is submitted through forms on the website.',
    },
    OCD_CraftSessionId_description: {
      message:
        "Craft relies on PHP sessions to maintain sessions across web requests. That is done via the PHP session cookie. Craft names that cookie 'CraftSessionId' by default. This cookie will expire as soon as the session expires.",
    },
    OCD_ci_session_description: {
      message:
        'Cookie to track the users logged in state and access level to restricted pages.',
    },
    OCD___lc_cid_description: {
      message:
        "Necessary for the functionality of the website's chat-box function.",
    },
    OCD___lc_cst_description: {
      message:
        "Necessary for the functionality of the website's chat-box function.",
    },
    OCD___lc2_cid_description: {
      message:
        'Stores a unique ID string for each chat-box session. This allows the website-support to see previous issues and reconnect with the previous supporter.',
    },
    OCD___lc2_cst_description: {
      message:
        'Stores a unique ID string for each chat-box session. This allows the website-support to see previous issues and reconnect with the previous supporter.',
    },
    OCD___livechat_description: {
      message: "Used to hide the user's personal customisation of LiveChat.",
    },
    OCD_BVBRANDID_description: {
      message:
        'BVBRANDID is a persistent cookie that allows Bazaarvoice to track website analytics data such as how often you visit the site and allocate it to the same website visitor.',
    },
    OCD_BVBRANDSID_description: {
      message:
        'This cookie allows internal Bazaarvoice web analytics to be correlated to the same user browsing session for interactions within a particular client domain.',
    },
    OCD_BVID_description: {
      message:
        'Allows internal Bazaarvoice web analytics to be correlated to the same user for interactions across the Bazaarvoice network.',
    },
    OCD_BVSID_description: {
      message:
        'Allows internal Bazaarvoice web analytics to be correlated to the same user browsing session for interactions across the Bazaarvoice network.',
    },
    OCD__li_id__description: {
      message:
        'These cookies enable us to get insights about the business use of our website, based on IP addresses of the website visitors.',
    },
    OCD__li_ses__description: {
      message:
        'These cookies enable us to get insights about the business use of our website, based on IP addresses of the website visitors.',
    },
    OCD_CAKEPHP_description: {
      message: 'A cookie controller used to manage other Cookies',
    },
    OCD_wp_wpml_current_language_description: {
      message:
        'This cookie is used to track the language preference fo the user',
    },
    OCD__flowbox_description: {
      message:
        'Used to differentiate between users and sessions and collecting statistics on the viewing behaviour for Instagram posts displayed on the website.',
    },
    OCD_acalltracker_description: {
      message: 'Adcalls call tracking: ID, phone number',
    },
    OCD_acalltrackersession_description: {
      message:
        'This cookie stores a unique identifier, so that it can be tracked which session the visitor is in.',
    },
    OCD_acalltrackerreferrer_description: {
      message:
        'This cookie is set as soon as the AdCalls JavaScript is loaded. The cookie is used to store the referrer of the visitor as quickly as possible, so that it cannot be lost. As soon as the JavaScript has been executed, this cookie is immediately deleted.',
    },
    OCD_retention_60_minutes: {
      message: '60 minutes',
    },
    OCD_excludecalltracking_description: {
      message:
        'This cookie is set as soon as the visitor - for whatever reason - is not measured, so that we do not take any further actions.',
    },
    OCD_acalltrackernumber_description: {
      message:
        'This cookie stores the phone number for the session that is active.',
    },
    OCD_wordpress_google_apps_login_description: {
      message: 'Used for secure log in to the web site with a Google account.',
    },
    OCD_ckies_functional_description: {
      message: 'Opt-out for functional cookies',
    },
    OCD_ckies_necessary_description: {
      message: 'Confirms that other necessary cookies get set',
    },
    OCD_ckies_performance_description: {
      message: 'Opt-out for performance cookies',
    },
    OCD_ckies_marketing_description: {
      message: 'Opt-out for marketing/third party/consent based cookies',
    },
    OCD_ClickAndChange_description: {
      message: 'Session Cookie for Creator CMS',
    },
    OCD_pll_language_description: {
      message: 'Saves the chosen language.',
    },
    OCD_browserupdateorg_description: {
      message:
        'Stores information if user dismissed notification about outdated browser',
    },
    OCD_TawkConnectionTime_description: {
      message:
        'This cookie is used to determine the connection duration of tawk sessions.',
    },
    OCD_tawkUUID_description: {
      message:
        'This cookie is used to collect information about how the visitor handles the live chat function on the website.',
    },
    OCD_TawkCookie_description: {
      message: 'Main Tawk.to cookie.',
    },
    OCD___tawkuuid_description: {
      message: 'Tawk.to cookie used to distinguish users.',
    },
    OCD_stx_user_id_description: {
      message: 'Delivering targeted and relevant content',
    },
    OCD_dc_description: {
      message: 'This cookie is used for advertising purposes',
    },
    OCD_sqzl_abs_description: {
      message: 'A cookie used by Squeezely',
    },
    OCD_sqzl_consent_description: {
      message: "Stores the user's cookie consent state for the current domain",
    },
    OCD_sqzl_session_id_description: {
      message: 'A cookie used by Squeezely',
    },
    OCD_sqzl_vw_description: {
      message: 'A cookie used by Squeezely',
    },
    OCD_sqzllocal_description: {
      message:
        'This is a cookie from the service Squeezely. It helps us with registering which pages you have visited and with sending you personalized ads',
    },
    OCD_belco_anonymous_id_description: {
      message:
        'This cookie enables you to make use of the chat-function of our customer service-tool, so we can help you anytime.',
    },
    OCD_belco_cookies_description: {
      message:
        'This cookie enables you to make use of the chat-function of our customer service-tool, so we can help you anytime.',
    },
    OCD_ABTasty_description: {
      message:
        'This cookie sends all test data (visitorID, test and variant IDs, timestamps).',
    },
    OCD_ABTastySession_description: {
      message:
        'This cookie allows us to identify a unique session. It allows us to determine that a new session has begun for a given user.',
    },
    OCD_BCSessionID_description: {
      message: 'Unique identifier for the BlueConic profile.',
    },
    OCD_BCTempID_description: {
      message:
        'Temporary unique identifier for the BlueConic profile, removed after BCSessionID is created.',
    },
    OCD_BCPermissionLevel_description: {
      message: 'Opt-in level (PERSONAL|ANONYMOUS|DO_NOT_TRACK)',
    },
    OCD_BCReferrerOverrule_description: {
      message:
        'Stores a custom bcChannelIdentifier as referrer. For these channels the actual referrer points to the website and not the overrule. The overrule would be lost if not stored in this cookie.',
    },
    OCD_BCRefusedObjectives_description: {
      message:
        'Used to store the identifiers of BlueConic Objectives that were explicitly refused.',
    },
    OCD_BCRevision_description: {
      message:
        "Used to store requests that are sent to BlueConic, but haven't returned yet. On the next page view, if BCRevision still contains values, those requests are sent again, to prevent data loss. This information is now stored in localStorage; when this fails, the cookie solution is used as fallback.",
    },
    OCD_BCTracking_description: {
      message: 'Used for tracking the channel of an external tracker.',
    },
    OCD_bc_tstgrp_description: {
      message:
        'Gathers information on the user’s behavior, preferences and other personal data, which is sent to a third-party marketing and analysis service, for optimization of the website’s advertisement, analysis and general traffic.',
    },
    OCD___adal_ca_description: {
      message:
        'Stores which advertising campaign drove a user to visit, stores traffic source and campaign data.',
    },
    OCD___adal_cw_description: {
      message:
        'Ties back conversion events to earlier visits, stores a visit timestamp.',
    },
    OCD___adal_id_description: {
      message: 'Uniquely identify a device, stores a generated Device ID.',
    },
    OCD___adal_ses_description: {
      message:
        'Determines whether there is an active session and which conversions have taken place in this session to prevent duplicates, stores a list of events in this session.',
    },
    OCD_Pastease_passive_activated__description: {
      message:
        'The visitor is selected via this Mopinion cookie and the visitor sees the form.',
    },
    OCD_Pastease_passive_chance__description: {
      message:
        'This Mopinion cookie determines the chance that the visitor will see the form.',
    },
    OCD_AFFICHE_W_description: {
      message:
        'Used by the advertising platform Weborama to determine the visitor’s interests based on pages visits, content clicked and other actions on the website.',
    },
    OCD_matchadform_description: {
      message:
        'Presents the user with relevant content and advertisement. The service is provided by third-party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_wfivefivec_description: {
      message:
        "Collects data on the user's visits to the website, such as what pages have been loaded. The registered data is used for targeted ads.",
    },
    OCD_UserID1_description: {
      message:
        'Cookie sets a unique anonymous ID for a website visitor. This ID is used to recognize the user on different sessions and to track their activities on the website. The data collected is used for analysis purposes.',
    },
    OCD_arcki2_description: {
      message:
        'Collects data on user behaviour and interaction in order to optimize the website and make advertisement on the website more relevant.',
    },
    OCD_arcki2_adform_description: {
      message:
        'Presents the user with relevant content and advertisement. The service is provided by third-party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_arcki2_ddp_description: {
      message:
        'Presents the user with relevant content and advertisement. The service is provided by third-party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD__sn_a_description: {
      message:
        'This is the cookie used for visitor analytics tracking. It sets a visitor ID so that the visitor can be identified across sessions. This enables all visitor related analytics data to be shown on the analytics pages in your Dashboard. Note that if a visitor is opted out of this cookie, you will still be able to see how many views and conversions your campaigns had, just not any visitor-related data like referrer, location, and so on.',
    },
    OCD__sn_m_description: {
      message:
        ' This cookie contains information used for marketing related targeting options. Targeting options like the referrer, UTM, or geo-location. Note that if this cookie is opted out, the marketing targeting options will not work, and the campaign will default to not show.',
    },
    OCD__sn_n_description: {
      message:
        'This is the necessary cookie set by Sleeknote, as it contains technical information so that the campaigns can show properly and tracking works properly.',
    },
    OCD_apbct_antibot_description: {
      message:
        'This cookie is used to distinguish between humans and bots. This is beneficial for the website, in order to make valid reports on the use of their website.',
    },
    OCD_ct_check_js_description: {
      message:
        "Used in order to detect spam and improve the website's security.",
    },
    OCD_ct_fkp_timestamp_description: {
      message:
        "Used in order to detect spam and improve the website's security. Does not store visitor specific data.",
    },
    OCD_ct_has_scrolled_description: {
      message: 'This cookie is used to distinguish between humans and bots.',
    },
    OCD_ct_pointer_data_description: {
      message:
        "Used in order to detect spam and improve the website's security. Does not store visitor specific data.",
    },
    OCD_ct_ps_timestamp_description: {
      message:
        "Used in order to detect spam and improve the website's security. Does not store visitor specific data.",
    },
    OCD_ct_timezone_description: {
      message:
        "Used in order to detect spam and improve the website's security.",
    },
    OCD___kla_id_description: {
      message:
        'When Klaviyo’s JavaScript is enabled, the __kla_id cookie can track and identify site visitors through an auto-generated ID. This cookie can temporarily hold personally identifiable information. Once a visitor is identified, the cookie can pass their data into Klaviyo.',
    },
    OCD___trf_src_description: {
      message:
        'Registers how the user has reached the website to enable pay-out of referral commission fees to partners.',
    },
    OCD__ALGOLIA_description: {
      message:
        'Identifies users for your Search Analytics and Personalization.',
    },
    OCD__csrf_description: {
      message:
        'This cookie is used to prevent Cross-site request forgery (often abbreviated as CSRF) attacks of the website.',
    },
    OCD__tt_enable_cookie_description: {
      message: 'Tracking cookie used by TikTok to identify a visitor',
    },
    OCD_retention_389_days: {
      message: '389 days',
    },
    OCD__ttp_description: {
      message: 'Tracking cookie used by TikTok to identify a visitor',
    },
    OCD_MONITOR_WEB_ID_description: {
      message:
        'Used by the social networking service, TikTok, for tracking the use of embedded services.',
    },
    OCD_msToken_description: {
      message:
        'Collects information on user behaviour on multiple websites. This information is used in order to optimize the relevance of advertisement on the website.',
    },
    OCD_ttwid_description: {
      message:
        'Used by the social networking service, TikTok, for tracking the use of embedded services.',
    },
    OCD_ahoy_visit_description: {
      message:
        'Registers statistical data on visitors behaviour on the website. Used for internal analytics by the website operator.',
    },
    OCD_retention_239_days: {
      message: '239 days',
    },
    OCD_ahoy_visitor_description: {
      message:
        'Registers statistical data on visitors behaviour on the website. Used for internal analytics by the website operator.',
    },
    OCD_auth0_description: {
      message: 'Used to implement the Auth0 session layer.',
    },
    OCD_auth0_compat_description: {
      message:
        "Fallback cookie for single sign-on on browsers that don't support the sameSite=None attribute.",
    },
    OCD_auth0_mf_description: {
      message: 'Used to establish the trust level for a given device.',
    },
    OCD_auth0_mf_compat_description: {
      message:
        "Fallback cookie for multi-factor authentication on browsers that don't support the sameSite=None attribute.",
    },
    OCD_a0_users_sess_description: {
      message: 'Used for CSRF protection in Classic Universal Login flows.',
    },
    OCD_a0_users_sess_sig_description: {
      message: 'Used for CSRF protection in Classic Universal Login flows.',
    },
    OCD_did_description: {
      message: 'Device identification for attack protection.',
    },
    OCD_did_compat_description: {
      message:
        "Fallback cookie for anomaly detection on browsers that don't support the sameSite=None attribute.",
    },
    OCD_HAPLB8__description: {
      message: 'Sonobi sets this cookie for advertising purposes.',
    },
    OCD_atidvisitor_description: {
      message:
        'List of numsites encountered by the visitor and storage of identified visitor information',
    },
    OCD_retention_6_months_by_default__modifiable: {
      message: '6 months by default, modifiable',
    },
    OCD_atuserid_description: {
      message: 'Visitor ID for client-side cookie sites',
    },
    OCD_retention_13_months_by_default__modifiable: {
      message: '13 months by default, modifiable',
    },
    OCD_ja_purity_tpl_description: {
      message: 'Indicates the website uses a JoomlArt template',
    },
    OCD_retention_355_days: {
      message: '355 days',
    },
    OCD_ja_purity_ii_tpl_description: {
      message: 'Indicates the website uses a JoomlArt template',
    },
    OCD_BIGipServer__description: {
      message:
        "Used by the f5 BIG-IP load balancer to ensure one user's request is always handled by the same server to maintain a consistent user experience",
    },
    OCD_retention_Unknown: {
      message: 'Unknown',
    },
    OCD_active_template____description: {
      message: 'Used to store which template you are viewing on this website.',
    },
    OCD_ezds_description: {
      message:
        'Used to store the pixel size of your screen to help personalize your experience and ensure content fits.',
    },
    OCD_ezoab___description: {
      message: 'Used to split test different features and functionality.',
    },
    OCD_retention_2_hours: {
      message: '2 hours',
    },
    OCD_ezoadgid___description: {
      message: 'Stores an ID that connects you to an age and gender category.',
    },
    OCD_ezohw_description: {
      message:
        'Used to store the pixel size of your browser to help personalize your experience and ensure content fits.',
    },
    OCD_ezopvc___description: {
      message:
        'Used to store the number of pages that you have viewed on this site in this session.',
    },
    OCD_ezoref___description: {
      message:
        'Used to store the referring domain (the website you were at before you can to this website).',
    },
    OCD_ezostid___description: {
      message:
        'Used to test different features and functionality and to record which features and functionality are available to you so you receive a consistent experience.',
    },
    OCD_ezosuigeneris__description: {
      message:
        'Used to uniquely identify you across different websites on the internet so your experience can be customized.',
    },
    OCD_ezosuibasgeneris_1_description: {
      message:
        'Used to uniquely identify you across different websites on the internet so your experience can be customized.',
    },
    OCD_ezouid___description: {
      message:
        'Used to uniquely identify you as a visitor on this website. Used for analytics and personalization of your experience.',
    },
    OCD_ezovid___description: {
      message:
        'Used to uniquely identify a visit by you to this website. Used for analytics and personalization of your experience.',
    },
    OCD_ezovuuid___description: {
      message:
        'Used to uniquely identify a visit by you to this website. Used for analytics and personalization of your experience.',
    },
    OCD_ezovuuidtime___description: {
      message:
        'Used to record the time of your visit to this website so different visits can be differentiated from each other.',
    },
    OCD_ezux_et___description: {
      message:
        'Used to record the amount of time that you engaged with content on this website. Used for analytics purposes to improve user experience.',
    },
    OCD_ezux_ifep___description: {
      message:
        'Used to record whether you have engaged with the content on this site. Used for analytics purposes to improve user experience.',
    },
    OCD_ezux_lpl___description: {
      message:
        'Used to record the time that you loaded the last page on this website.',
    },
    OCD_ezux_tos___description: {
      message:
        'Used to record the amount of time you have spent on this website.',
    },
    OCD_ezoawesome___description: {
      message: 'Used for fraud and invalid activity detection.',
    },
    OCD_easysize_button_loaded_for_user_description: {
      message: 'Sizing display for products',
    },
    OCD_swym_email_description: {
      message:
        'This stores the email address when the shopper logs into the store or when the shopper authenticates their wishlist or subscribes for a back-in-stock alert.',
    },
    OCD_swym_session_id_description: {
      message:
        'This is a general-purpose platform session cookie used to maintain an anonymous user session.',
    },
    OCD_retention_30_mins: {
      message: '30 mins',
    },
    OCD_swym_pid_description: {
      message:
        'Unique identifier to track merchants and their wishlist settings.',
    },
    OCD_swym_swymRegid_description: {
      message:
        "This cookie is used to store an encrypted version of the user's device ID and information on the user’s session.",
    },
    OCD_swym_cu_ct_description: {
      message: 'Related to custom cart experience from Swym on the wishlist.',
    },
    OCD_swym_o_s_description: {
      message: 'Related to swym app versioning systems.',
    },
    OCD_swym_instrumentMap_description: {
      message: 'Related to Wishlist instrumentation for identification of API.',
    },
    OCD_swym_ol_ct_description: {
      message: 'Related to swym cart functionality.',
    },
    OCD_swym_v_ckd_description: {
      message: 'Related to swym app versioning systems.',
    },
    OCD_swym_tpermts_description: {
      message: 'Related to asking user permission for marketing',
    },
    OCD_swym_u_pref_description: {
      message: 'Related to user’s marketing preference.',
    },
    OCD_swym_weml_description: {
      message: 'Related to user’s email address for Swym apps',
    },
    OCD_enforce_policy_description: {
      message:
        'This cookie is provided by Paypal. The cookie is used in context with transactions on the website - The cookie is necessary for secure transactions.',
    },
    OCD_x_pp_s_description: {
      message:
        'This cookie is provided by PayPal and supports payment services in the website.',
    },
    OCD_ts_description: {
      message:
        'This cookie is generally provided by PayPal and supports payment services on the website',
    },
    OCD_ts_c_description: {
      message:
        'This cookie is provided by Paypal. The cookie is used in context with transactions on the website.',
    },
    OCD_tsrce_description: {
      message:
        'This cookie is generally provided by PayPal and supports payment services on the website.',
    },
    OCD_nsid_description: {
      message:
        'Cookie for fraud detection. When making a payment via PayPal these cookies are issued – PayPal session/security',
    },
    OCD_X_PP_SILOVER_description: {
      message:
        'This cookie is generally provided by PayPal and supports payment services on the website.',
    },
    OCD_X_PP_L7_description: {
      message:
        'Paypal - These cookies are essential in order to enable you to move around the website and use its features, such as accessing secure areas of the website. Without these cookies services you have asked for, like shopping baskets or e-billing, cannot be provided.',
    },
    OCD_l7_az_description: {
      message:
        'This cookie is necessary for the PayPal login-function on the website.',
    },
    OCD_SERVERID_description: {
      message: 'Load balancer cookie',
    },
    OCD_arcki2__description: {
      message:
        'Collects data on user behaviour and interaction in order to optimize the website and make advertisement on the website more relevant.',
    },
    OCD_v_usr_description: {
      message:
        "Collects data about the user's visit to the site, such as the number of returning visits and which pages are read. The purpose is to deliver targeted ads.",
    },
    OCD_retention_13_days: {
      message: '13 days',
    },
    OCD_idsync_bsw_uid_s_description: {
      message:
        'Presents the user with relevant content and advertisement. The service is provided by third-party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_done_redirects__description: {
      message: 'Used to monitor website performance for statistical purposes.',
    },
    OCD_vidoomy_uids_description: {
      message:
        'Used in context with video-advertisement. The cookie limits the number of times a user is shown the same advertisement. The cookie is also used to ensure relevance of the video-advertisement to the specific user.',
    },
    OCD_bbuserid_description: {
      message: 'Used to store the ID of the logged in user.',
    },
    OCD_bbpassword_description: {
      message: "Used to store a hash of the logged in user's password.",
    },
    OCD_bbsessionhash_description: {
      message: 'Used to track the current session from the database.',
    },
    OCD_bbcpsessionhash_description: {
      message:
        'Used to track the current administrator session from the database.',
    },
    OCD_bbnp_notices_displayed_description: {
      message: 'Used to keep track of notices to display to the client.',
    },
    OCD_bbsitebuilder_active_description: {
      message: 'Used to designate whether the Site Builder is active.',
    },
    OCD_bblastactivity_description: {
      message: 'Stores the time of the last activity.',
    },
    OCD_bblastvisit_description: {
      message: 'Stores the time of the last page view.',
    },
    OCD_viewer_token_description: {
      message:
        "This cookie is associated with csync.loopme.me. It is used to track visitors on multiple websites in order to present relevant advertising based on the visitor's preferences.",
    },
    OCD_retention_31_days: {
      message: '31 days',
    },
    OCD_wires_description: {
      message: 'ProcessWire session identifier.',
    },
    OCD_wires_challenge_description: {
      message:
        'ProcessWire session cookie used to verify the validity of a session.',
    },
    OCD_ab_storage_userId___description: {
      message:
        'Used to determine whether the currently logged-in user has changed and to associate events with the current user.',
    },
    OCD_ab_storage_sessionId___description: {
      message:
        'Randomly-generated string used to determine whether the user is starting a new or existing session to sync messages and calculate session analytics.',
    },
    OCD_ab_storage_deviceId___description: {
      message:
        'Randomly-generated string used to identify anonymous users, and to differentiate users’ devices and enables device-based messaging.',
    },
    OCD_ab_optOut_description: {
      message: 'Used to store a user’s opt-out preference.',
    },
    OCD_ab__gd_description: {
      message:
        'Temporarily created (and then deleted) to determine the root-level cookie domain, which allows the SDK to work properly across sub-domains.',
    },
    OCD_devicePixelRatio_description: {
      message: 'Used to make the site responsive to the visitor’s screen size.',
    },
    OCD_tk_qs_description: {
      message:
        'JetPack sets this cookie to store a randomly-generated anonymous ID which is used only within the admin area and for general analytics tracking.',
    },
    OCD_tk_lr_description: {
      message:
        'Jetpack - Stores the unique identifier for the publisher to enable Jetpack to collect data.',
    },
    OCD_tk_or_description: {
      message:
        'Jetpack - Stores the unique identifier for the publisher to enable Jetpack to collect data.',
    },
    OCD_retention_5_Years: {
      message: '5 Years',
    },
    OCD_tk_r3d_description: {
      message:
        'JetPack installs this cookie to collect internal metrics for user activity and in turn improve user experience.',
    },
    OCD_tk_tc_description: {
      message:
        "JetPack sets this cookie to record details on how user's use the website.",
    },
    OCD_wp_settings___description: {
      message: 'Used to persist a user’s wp-admin configuration.',
    },
    OCD_wporg_logged_in_description: {
      message:
        'Used to check whether the current visitor is a logged-in WordPress.org user.',
    },
    OCD_retention_14_days_if_you_select__Remember_Me__when_logging_in__Otherwise__Session_:
      {
        message:
          '14 days if you select “Remember Me” when logging in. Otherwise, Session.',
      },
    OCD_wporg_sec_description: {
      message:
        'Used to check whether the current visitor is a logged-in WordPress.org user.',
    },
    OCD_wporg_locale_description: {
      message: 'Used to persist a user’s locale configuration.',
    },
    OCD_welcome___description: {
      message:
        'Used to record if you’ve chosen to hide the “Welcome” message at the top of the corresponding blog.',
    },
    OCD_retention_permanent: {
      message: 'permanent',
    },
    OCD_showComments_description: {
      message:
        'Used to determine if you prefer comments to be shown or hidden when reading the site.',
    },
    OCD_trac_form_token_description: {
      message:
        'Used as a security token for cross-site request forgery protection.',
    },
    OCD_trac_session_description: {
      message: 'Used to keep anonymous session information.',
    },
    OCD_codexToken_description: {
      message:
        'Used to check whether the current visitor is a logged-in WordPress.org user. Only set if you select “Keep me logged in” when logging in.',
    },
    OCD_codexUserId_description: {
      message:
        'Used to check whether the current visitor is a logged-in WordPress.org user.',
    },
    OCD_codexUserName_description: {
      message:
        'Used to check whether the current visitor is a logged-in WordPress.org user.',
    },
    OCD_camptix_client_stats_description: {
      message:
        'Used to track unique visitors to tickets page on a WordCamp site',
    },
    OCD_wp_saving_post_description: {
      message:
        'Used to track if there is saved post exists for a post currently being edited. If exists then let user restore the data',
    },
    OCD_comment_author___description: {
      message:
        'Used to tracked comment author name, if “Save my name, email, and website in this browser for the next time I comment.” is checked',
    },
    OCD_comment_author_url___description: {
      message:
        'Used to track comment author url, if “Save my name, email, and website in this browser for the next time I comment.” checkbox is checked',
    },
    OCD_wp_postpass___description: {
      message: 'Used to maintain session if a post is password protected',
    },
    OCD_wp_settings_time___description: {
      message: 'Time at which wp-settings-{user} was set',
    },
    OCD_tix_view_token_description: {
      message: 'Used for session managing private CampTix content',
    },
    OCD_jetpackState_description: {
      message: 'Used for maintaining Jetpack State',
    },
    OCD_jpp_math_pass_description: {
      message:
        'Verifies that a user answered the math problem correctly while logging in.',
    },
    OCD_stnojs_description: {
      message: 'Remember if user do not want JavaScript executed',
    },
    OCD_wordpress_logged_in___description: {
      message: 'Remember User session',
    },
    OCD_cookiefirst_consent_description: {
      message:
        'This cookie saves your cookie preferences for this website. You can change these or withdraw your consent easily.',
    },
    OCD__iub_cs___description: {
      message:
        'This cookie is used to store cookie acceptance and register consent.',
    },
    OCD_didomi_token_description: {
      message:
        'This cookie contains consent information for personalized purposes and for personalized partners, as well as information specific to Didomi (e.g. user ID).',
    },
    OCD_euconsent_v2_description: {
      message:
        "This cookie contains the chain of consent for the IAB's Transparency and consent framework as well as the consent information for all IAB standards (partners and purposes).",
    },
    OCD__global_lucky_opt_out_description: {
      message: 'If set, will not run Lucky Orange. Set via our opt out links.',
    },
    OCD__lo_np___description: {
      message: 'Set if a user should no longer receive a particular poll.',
    },
    OCD__lo_bn_description: {
      message: 'Indicated this visitor has been banned from tracking.',
    },
    OCD__lo_cid_description: {
      message: "\tID of the visitor's current chat, if any.",
    },
    OCD__lo_uid_description: {
      message: 'Unique identifier for the visitor.',
    },
    OCD__lo_rid_description: {
      message: "ID of the visitor's current recording.",
    },
    OCD__lo_v_description: {
      message: "Total number of visitor's visits.",
    },
    OCD___lotl_description: {
      message: "URL of the visitor's original landing page, if any.",
    },
    OCD___lotr_description: {
      message: "URL of the visitor's original referrer, if any.",
    },
    OCD_axeptio_authorized_vendors_description: {
      message: 'Lists all cookies validated by the user',
    },
    OCD_axeptio_cookies_description: {
      message:
        'Cookie is set by a script that displays a banner allowing the user to accept Cookies on a case-by-case basis and is kept for 12 months, in order to determine for which Cookies the user has given his consent.',
    },
    OCD_axeptio_all_vendors_description: {
      message: "Lists all available vendors subject to the user's consent",
    },
    OCD_borlabs_cookie_description: {
      message:
        'Stores the user’s cookie consent state for embedded content on the current domain',
    },
    OCD_osano_consentmanager_description: {
      message: "Stores the user's current consent status.",
    },
    OCD_osano_consentmanager_expdate_description: {
      message: "Stores the expiration of the user's captured consent.",
    },
    OCD_osano_consentmanager_uuid_description: {
      message: "Stores the user's unique consent identifier.",
    },
    OCD_cookieconsent_status_description: {
      message:
        'This cookie is used to remember if you have consented to the use of cookies on this website.',
    },
    OCD_cookieconsent_page_description: {
      message: 'Page where the user complies to the cookie consent',
    },
    OCD___cmpconsent__description: {
      message:
        'Consent String of the IAB CMP Framework (TCF) v2 specific to a single account in our platform.',
    },
    OCD___cmpiab__description: {
      message:
        '(only if simplified format is enabled) List of IAB vendor IDs separated by underscore',
    },
    OCD___cmpcvc__description: {
      message:
        'List of custom vendor IDs separated by underscore specific to a single account in our platform',
    },
    OCD___cmpcpc__description: {
      message: 'List of custom purpose IDs separated by underscore',
    },
    OCD___cmpccc__description: {
      message: 'Consent information in custom consent format',
    },
    OCD___cmpwel__description: {
      message: 'Information on PUR (pay or accept) mode',
    },
    OCD___cmpiuid_description: {
      message: 'If enabled, a unique random ID per visitor',
    },
    OCD___cmpccx_description: {
      message:
        'Integer. Test if visitor left the website after seeing the consent layer.',
    },
    OCD___cmpcc_description: {
      message: 'Integer. Test if visitors browser supports cookies.',
    },
    OCD___cmpfcc_description: {
      message: 'Integer. Test if visitors browser supports cookies.',
    },
    OCD___cmpld_description: {
      message:
        '\tTimestamp. Contains the time when the visitor last saw the consent layer.',
    },
    OCD___cmpccpausps__description: {
      message: 'Consent information in IAB USP CCPA Format.',
    },
    OCD_hu_consent_description: {
      message:
        'Stores the permission to use cookies for the current domain by the user',
    },
    OCD_complianz_policy_id_description: {
      message: 'Stores the user’s cookie consent state for the current domain',
    },
    OCD_complianz_consent_status_description: {
      message: 'Stores the status of the cookie agreement of the current user',
    },
    OCD_cmplz_marketing_description: {
      message:
        'Stores the setting of the marketing/statistic level of the cookie agreement.',
    },
    OCD_cmplz_statistics_description: {
      message:
        'Stores the setting of the statistic level of the cookie agreement.',
    },
    OCD_cmplz_preferences_description: {
      message:
        'Stores the setting of the preferences level of the cookie agreement.',
    },
    OCD_cmplz_functional_description: {
      message:
        'Stores the setting of the functional level of the cookie agreement.',
    },
    OCD_cmplz_stats_description: {
      message: 'Stores the setting of the stats level of the cookie agreement.',
    },
    OCD_cmplz_choice_description: {
      message: 'Store if a message has been dismissed',
    },
    OCD_cmplz_id_description: {
      message: 'Store cookie consent preferences',
    },
    OCD_cmplz_user_data_description: {
      message: 'Read to determine which cookie banner to show',
    },
    OCD_cmplz_saved_services_description: {
      message: 'Store cookie consent preferences',
    },
    OCD_cmplz_consented_services_description: {
      message: 'Store cookie consent preferences',
    },
    OCD_cmplz_policy_id_description: {
      message: 'Store accepted cookie policy ID',
    },
    OCD_cmplz_saved_categories_description: {
      message: 'Store cookie consent preferences',
    },
    OCD_cmplz_banner_status_description: {
      message: 'This cookie stores if the cookie banner has been dismissed',
    },
    OCD_cookie_notice_accepted_description: {
      message:
        'Identifies whether the user has accepted the use of cookies on this web site',
    },
    OCD_moove_gdpr_popup_description: {
      message:
        'When this Cookie is enabled, these Cookies are used to save your Cookie Setting Preferences.',
    },
    OCD___tlbcpv_description: {
      message: 'Used to record the cookie consent preferences of visitors',
    },
    OCD___tltpl___description: {
      message: 'Used to record the policies that visitors consent to',
    },
    OCD___tluid_description: {
      message:
        'Assigns a random ID number to each visitor so that their policy consent and cookie consent preferences can be saved.',
    },
    OCD___stid_description: {
      message:
        'The __stid cookie is set as part of the ShareThis service and monitors user-activity, e.g. Web pages viewed, navigation from page to page, time spent on each page etc.',
    },
    OCD___stidv_description: {
      message: 'ShareThis cookie ID version.',
    },
    OCD_pubconsent__description: {
      message:
        'ShareThis cookie set to indicate user has made a declaration about GDPR data collection for IAB TCF v1 format.',
    },
    OCD_st_optout_description: {
      message:
        'ShareThis cookie set to indicate that user has opted out from data collection.',
    },
    OCD_pxcelBcnLcy_description: {
      message:
        'ShareThis Tag Management System cookie to track latency on reporting beacon.',
    },
    OCD_pxcelAcc3PC_description: {
      message:
        'ShareThis Tag Management System cookie to check whether third party cookies are accepted by the browser. This is only set if there is no incoming cookie in the request.',
    },
    OCD_pxcelPage__description: {
      message:
        'ShareThis Tag Management System cookie to track status of pixel rotation loading. ShareThis uses a different cookie for different groups of sites within the ShareThis network.',
    },
    OCD_usprivacy__description: {
      message:
        'ShareThis reads if the usprivacy cookie is present in the publisher domain.',
    },
    OCD_euconsent__description: {
      message:
        'ShareThis reads if the euconsent cookie is present in the publisher domain.',
    },
    OCD_fpestid_description: {
      message:
        'Fpestid is a ShareThis cookie ID set in the domain of the website operator.',
    },
    OCD_khaos_description: {
      message:
        'Rubicon Project cookie used for tracking advertising campaigns and collect anonymized user behavior statistics',
    },
    OCD_audit_description: {
      message: 'Set by Rubicon Project to record cookie consent data.',
    },
    OCD_put___description: {
      message:
        'Records anonymous user data, such as IP, geographical location, websites visited and ads clicked on, in order to optimise visualisation of ads according to user movement around websites using the same advertising network.',
    },
    OCD_rpb_description: {
      message:
        'Records anonymous user data, such as IP, geographical location, websites visited and ads clicked on, in order to optimise visualisation of ads according to user movement around websites using the same advertising network.',
    },
    OCD_rpx_description: {
      message:
        'Records anonymous user data, such as IP, geographical location, websites visited and ads clicked on, in order to optimise visualisation of ads according to user movement around websites using the same advertising network.',
    },
    OCD_c_description: {
      message:
        'Records anonymous user data, such as IP, geographical location, websites visited and ads clicked on, in order to optimise visualisation of ads according to user movement around websites using the same advertising network.',
    },
    OCD_apiDomain___description: {
      message:
        'The shared domain API calls for all sites in a group should be sent to.',
    },
    OCD_gac___description: {
      message: 'Used to trigger server initiated login.',
    },
    OCD__gig_APIProxy_enabled_description: {
      message: 'Used to indicate whether to use APIProxy or not.',
    },
    OCD_gig_bootstrap___description: {
      message: 'If declined, user may be intermittently logged out.',
    },
    OCD_gig_canary_description: {
      message:
        'Indicates whether the client is using the canary version of the WebSDK.',
    },
    OCD_gig_canary_3__description: {
      message:
        'Indicates whether the client is using the canary version of the WebSDK.',
    },
    OCD__gig_email_description: {
      message: 'Last used email address in share (when sending email).',
    },
    OCD_gig_canary_ver__description: {
      message: "The version name of the WebSDK's canary version.",
    },
    OCD_gig_hasGmid_description: {
      message: 'Internal cookie for the Web SDK',
    },
    OCD__gig_llu_description: {
      message: 'Last login provider username for Login Welcome back screen.',
    },
    OCD__gig_llp_description: {
      message: 'Last login provider username for Login Welcome back screen.',
    },
    OCD_glt___description: {
      message: 'Login Token for authentication.',
    },
    OCD__gig_lt_description: {
      message: 'Login Token for authentication.',
    },
    OCD_gig_last_ver___description: {
      message:
        'Last time of verification of the session when the site is using the verifyLoginInterval property of global CONF in order to trigger reverification.',
    },
    OCD_gig_loginToken___description: {
      message:
        "SAP Customer Data Cloud's Single Sign On (SSO) group login token.",
    },
    OCD__gig_shareUI_cb___description: {
      message: 'Login Token for authentication.',
    },
    OCD__gig_shareUI_lastUID_description: {
      message: 'Last logged in UID.',
    },
    OCD__gigRefUid___description: {
      message: 'Last referrer User ID.',
    },
    OCD_gig_toggles_description: {
      message:
        'This value is sent to SAP Customer Data Cloud in order to identify toggles that the back-end behavior depends on to process the specified toggle.',
    },
    OCD_gig3pc_description: {
      message:
        'Remembers if third-party cookies are blocked to avoid checking every time.',
    },
    OCD_gig3pctest_description: {
      message:
        'A temp cookie used to check if third-party cookies are blocked.',
    },
    OCD_glnk_description: {
      message: 'Ticket for second phase of login.',
    },
    OCD_gmid_description: {
      message: 'User cookie.',
    },
    OCD_gst_description: {
      message: 'Server ticket for second phase of login.',
    },
    OCD_retention_30_Minutes: {
      message: '30 Minutes',
    },
    OCD_GSLM___description: {
      message: 'Session magic cookie.',
    },
    OCD_hasGmid_description: {
      message: 'Internal cookie for the Web SDK',
    },
    OCD_SAML___description: {
      message:
        'This cookie is saved by SAML SP to manage the SAML session information and, specifically, the parameters needed for logout.',
    },
    OCD_gltexp___description: {
      message: 'Login Token Expiration.',
    },
    OCD__gig___description: {
      message: 'Callback for listener.',
    },
    OCD_ua___description: {
      message: 'COPPA (under age).',
    },
    OCD_ucid_description: {
      message:
        'Unique computer identifier used for generating reports, and used by the Web SDK to get saved response.',
    },
    OCD_ozone_uid_description: {
      message:
        'This cookie contains unique randomly-generated values that enable the Ozone Project to distinguish browsers and mobile devices.',
    },
    OCD_mc_cid_description: {
      message: 'Mailchimp campaign ID',
    },
    OCD_mc_eid_description: {
      message: 'Mailchimp email ID',
    },
    OCD_mc_landing_site_description: {
      message: 'Page visitor entered your site on',
    },
    OCD__BEAMER_FIRST_VISIT___description: {
      message:
        'Set by Beamer (hotjar.com) to store the date of the user’s first interaction with insights.',
    },
    OCD_retention_3000_days: {
      message: '3000 days',
    },
    OCD__BEAMER_USER_ID___description: {
      message: 'Set by Beamer (hotjar.com) to store an internal ID for a user.',
    },
    OCD_retention_300_days: {
      message: '300 days',
    },
    OCD__BEAMER_DATE___description: {
      message:
        'Set by Beamer (hotjar.com). Stores the latest date in which the feed or page was opened.',
    },
    OCD__BEAMER_LAST_POST_SHOWN___description: {
      message:
        'Set by Beamer (hotjar.com). Stores the timestamp for the last time the number of unread posts was updated for the user.',
    },
    OCD__BEAMER_FILTER_BY_URL___description: {
      message:
        'This cookie is set by Beamer to store whether to apply URL filtering on the feed',
    },
    OCD_adhese2_description: {
      message: 'Unique Reach reporting',
    },
    OCD_cap__description: {
      message: 'Frequency Capping',
    },
    OCD_pubmatic_uid_description: {
      message:
        'When Adhese is used as server connection to SSPs or DSPs with whom the Account holder has a contract, a user syncing process can be installed where the SSP user_uid is stored in an Adhese cookie. This is dependent of consent for all parties involved (Accountholder, SSP, Adhese)',
    },
    OCD_improvedigital_uid_description: {
      message:
        'When Adhese is used as server connection to SSPs or DSPs with whom the Account holder has a contract, a user syncing process can be installed where the SSP user_uid is stored in an Adhese cookie. This is dependent of consent for all parties involved (Accountholder, SSP, Adhese)',
    },
    OCD_rubicon_uid_description: {
      message:
        'When Adhese is used as server connection to SSPs or DSPs with whom the Account holder has a contract, a user syncing process can be installed where the SSP user_uid is stored in an Adhese cookie. This is dependent of consent for all parties involved (Accountholder, SSP, Adhese)',
    },
    OCD_adform_uid_description: {
      message:
        'When Adhese is used as server connection to SSPs or DSPs with whom the Account holder has a contract, a user syncing process can be installed where the SSP user_uid is stored in an Adhese cookie. This is dependent of consent for all parties involved (Accountholder, SSP, Adhese)',
    },
    OCD_appnexus_uid_description: {
      message:
        'When Adhese is used as server connection to SSPs or DSPs with whom the Account holder has a contract, a user syncing process can be installed where the SSP user_uid is stored in an Adhese cookie. This is dependent of consent for all parties involved (Accountholder, SSP, Adhese)',
    },
    OCD_triplelift_uid_description: {
      message:
        'When Adhese is used as server connection to SSPs or DSPs with whom the Account holder has a contract, a user syncing process can be installed where the SSP user_uid is stored in an Adhese cookie. This is dependent of consent for all parties involved (Accountholder, SSP, Adhese)',
    },
    OCD_adheseCustomer_description: {
      message:
        'When Adhese is used as server connection to SSPs or DSPs with whom the Account holder has a contract, a user syncing process can be installed where the SSP user_uid is stored in an Adhese cookie. This is dependent of consent for all parties involved (Accountholder, SSP, Adhese)',
    },
    OCD_pmaAuth___description: {
      message: 'Per server authentication',
    },
    OCD_phpMyAdmin_description: {
      message: 'Session identifier',
    },
    OCD_pmaUser___description: {
      message: 'Per server username',
    },
    OCD_pma_lang_description: {
      message: 'Language preference',
    },
    OCD_PLESKSESSID_description: {
      message: 'Keeps a Plesk session',
    },
    OCD_plesk_items_per_page_description: {
      message: 'Save the state of UI elements in Plesk',
    },
    OCD_plek_list_type_description: {
      message: 'Save the state of UI elements in Plesk',
    },
    OCD_plesk_sort_dir_description: {
      message: 'Save the state of UI elements in Plesk',
    },
    OCD_plesk_sort_field_description: {
      message: 'Save the state of UI elements in Plesk',
    },
    OCD_sites_active_list_state_collapsed_description: {
      message: 'Save the state of UI elements in Plesk',
    },
    OCD_lists_state_description: {
      message: 'Save the state of UI elements in Plesk',
    },
    OCD_fe_typo_user_description: {
      message:
        'Used to identify a session ID when logged-in to the TYPO3 Frontend',
    },
    OCD_be_typo_user_description: {
      message:
        'Used to identify a backend session when a Backend User logged in to TYPO3 Backend or Frontend',
    },
    OCD_Typo3InstallTool_description: {
      message:
        'Used to validate a session for the System Maintenance Area / Install Tool',
    },
    OCD_be_lastLoginProvider_description: {
      message:
        'Stores information about the last login provider when logging into TYPO3 Backend',
    },
    OCD_KelkooID_description: {
      message:
        'This cookie identifies the user for statistics and ad retargeting.',
    },
    OCD__cio_description: {
      message:
        'Used to identify visitors in order to send transactional and targeted email messages.',
    },
    OCD__cioid_description: {
      message:
        'Used to identify visitors in order to send transactional and targeted email messages.',
    },
    OCD__cioanonid_description: {
      message:
        'Used to identify visitors in order to send transactional and targeted email messages.',
    },
    OCD_cioFT_description: {
      message:
        'Used to identify visitors in order to send transactional and targeted email messages.',
    },
    OCD_cioLT_description: {
      message:
        'Used to identify visitors in order to send transactional and targeted email messages.',
    },
    OCD__chartbeat__description: {
      message:
        'Cookie is used to register if a person has visited the domain before (to calculate new vs returning users).',
    },
    OCD__SUPERFLY_nosample_description: {
      message:
        "Cookie is used only if you go over your plan's traffic limit. At that point the cookie is set and will disable the beacon from that visitor for one hour.",
    },
    OCD_Datadome_description: {
      message:
        'This a security cookie based upon detecting BOTS and malicious traffic.',
    },
    OCD_TXCSDMN___description: {
      message: 'This cookie is associated with Tappx, an AdTech platform.',
    },
    OCD_TXCD_description: {
      message: 'This cookie is associated with Tappx, an AdTech platform.',
    },
    OCD_rai_pltn_pl___description: {
      message: 'Ad-serving frequency control, optimization and Brand Safety.',
    },
    OCD_avcid___description: {
      message:
        'ID Syncing with DSP / SSP for communications using Open RTB protocol',
    },
    OCD_pdid_description: {
      message: 'Randomly generated user ID.',
    },
    OCD_data___description: {
      message:
        'Cookie used to record your browsing activity, with the purpose of displaying targeted ads.',
    },
    OCD_visitor_id_description: {
      message:
        'This cookie is used to collect information on the visitor, which we then use for analytics purposes.',
    },
    OCD_gdpr_status_description: {
      message:
        'Determines whether you have accepted the cookie consent box, to prevent it being shown the next time you visit',
    },
    OCD__pbjs_userid_consent_data_description: {
      message:
        "This cookie is used to know if the user's consent choices have changed since the last page load. It is a hashed (cyrb53Hash) value of the consent string with a 30 day expiration.",
    },
    OCD_DotomiUser_description: {
      message:
        'This cookie is set by the provider Dotomi. This cookie is used for sales/lead correlation and for targeting and marketing purposes. it is used to store unique surfer ID.',
    },
    OCD_cjae_description: {
      message:
        'The cookie is set by the provider Dotomi. This cookie is used to record visitor behaviour.',
    },
    OCD_DotomiStatus_description: {
      message: 'Used to honor device-level opt-out preferences.',
    },
    OCD_DotomiSession___description: {
      message: 'Pseudonymous session id',
    },
    OCD_DotomiSync_description: {
      message:
        'Used to identify which sync pixels we set on users via registration tags',
    },
    OCD_dtm_token_description: {
      message: 'Manage cookie level profile, freq. cap, retargeting',
    },
    OCD_dtm_token_exp_description: {
      message: 'Logs timestamp for dtm_token cookie',
    },
    OCD_dtm_tcdata_description: {
      message:
        'Stores consent for vendors that participate in the IAB Transparency and Consent Framework.',
    },
    OCD_dtm_tcdata_exp_description: {
      message: 'Logs timestamp for dtm_tcdata cookie',
    },
    OCD_dtm_token_sc_description: {
      message: 'Our first party cookie set via headers on registration tags',
    },
    OCD_dtm_user_id_description: {
      message: 'Used to identify users registration',
    },
    OCD_dtm_user_id_sc_description: {
      message: 'Used to identify users registration',
    },
    OCD_dtm_gdpr_delete_description: {
      message:
        'Set when GDPR data delete is executed. Life span is 30 days. When this cookie exists, GDPR consent is considered revoked.',
    },
    OCD_dtm_gpc_optout_description: {
      message:
        'Set when GPC Optout is initiated. Presence of this cookie helps us prevent multiple downstream optout requests for the same user',
    },
    OCD_pluto2_description: {
      message:
        'This is a temporary cookie that is created in the case when no PLUTO cookie is set AND the user hits the advertiser site where a Re-Targeting pixel has been executed.',
    },
    OCD_pluto_description: {
      message: 'The Session ID is used to track preference information.',
    },
    OCD_fastclick_description: {
      message:
        'Tells the delivery system that the browser had opted out of the network',
    },
    OCD_svid_description: {
      message: 'Used to relate preference information for marketing purposes',
    },
    OCD_rts_description: {
      message:
        'Used to track last time browser was redirected through Corporate Cookie Service / Dotomi.com domain',
    },
    OCD_lhc_per_description: {
      message:
        'Stores persistent information about chat id to be able to keep same chat while customer is navigating through pages.',
    },
    OCD_lhc_ldep_description: {
      message:
        'Stores required department id. To disable user to change department.',
    },
    OCD_lhc_ses_description: {
      message:
        'Stores temporary information about chat. Was invitation to chat shown or not.',
    },
    OCD__ym_metrika_enabled_description: {
      message:
        'Checks whether other Yandex.Metrica cookies are installed correctly',
    },
    OCD__ym_isad_description: {
      message: 'Determines whether a user has ad blockers',
    },
    OCD__ym_uid_description: {
      message: 'Used for identifying site users',
    },
    OCD__ym_d_description: {
      message: "Saves the date of the user's first site session",
    },
    OCD_yabs_sid_description: {
      message: 'Session ID',
    },
    OCD__ym_debug_description: {
      message: 'Indicates that debug mode is active',
    },
    OCD__ym_visorc___description: {
      message: 'Allows Session Replay to function correctly',
    },
    OCD__ym_hostIndex_description: {
      message: 'Limits the number of requests',
    },
    OCD_yandexuid_description: {
      message:
        "Registers data on visitors' website-behaviour. This is used for internal analysis and website optimization.",
    },
    OCD_retention_1_year__in_some_countries__the_period_may_be_longer_: {
      message: '1 year (in some countries, the period may be longer)',
    },
    OCD_yuidss_description: {
      message:
        "Registers data on visitors' website-behaviour. This is used for internal analysis and website optimization.",
    },
    OCD_ymex_description: {
      message:
        'Stores auxiliary information for Yandex.Metrica performance: ID creation time and their alternative values.',
    },
    OCD_retention_1_year_: {
      message: '1 year ',
    },
    OCD_usst_description: {
      message:
        'Stores auxiliary information for syncing site user IDs between different Yandex domains',
    },
    OCD_is_gdpr_b_description: {
      message:
        'Detecting users from regions where the General Data Protection Regulation (GDPR) applies',
    },
    OCD_is_gdpr_description: {
      message:
        'Detecting users from regions where the General Data Protection Regulation (GDPR) applies',
    },
    OCD_yabs_vdrf_description: {
      message:
        'Registers data on visitors from multiple visits and on multiple websites. This information is used to measure the efficiency of advertisement on websites.',
    },
    OCD_bh_description: {
      message:
        'Collects data on user behaviour and interaction in order to optimize the website and make advertisement on the website more relevant.',
    },
    OCD__yasc_description: {
      message:
        'Collects data on the user across websites - This data is used to make advertisement more relevant.',
    },
    OCD_retention_10_Years: {
      message: '10 Years',
    },
    OCD_yashr_description: {
      message:
        'Collects data on the user across websites - This data is used to make advertisement more relevant.',
    },
    OCD__KMPage__description: {
      message:
        'In Salesforce Classic, used to read the last user selection for Find in View, Article Language, {DataCategory}, and Validation Status in Article Management.',
    },
    OCD__KnowledgePageDispatcher__description: {
      message:
        'In Salesforce Classic, used to remember the user selection to determine whether to show Articles or My Drafts view in Knowledge.',
    },
    OCD__KnowledgePageFilter__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the data category filter in Knowledge.',
    },
    OCD__KnowledgePageFilterArticleArticleType__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the article type filter for Articles view in Knowledge.',
    },
    OCD__KnowledgePageFilterArticlePublishStatus__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the publish status filter for Articles view in Knowledge.',
    },
    OCD__KnowledgePageFilterArticleValidationStatus__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the validation status filter for Articles view in Knowledge.',
    },
    OCD__KnowledgePageFilterLanguage__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the language filter in Knowledge.',
    },
    OCD__KnowledgePageFilterMyDraftArticleType__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the article type filter for My Drafts view in Knowledge.',
    },
    OCD__KnowledgePageFilterMyDraftPublishStatus__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the publish status filter for My Drafts view in Knowledge.',
    },
    OCD__KnowledgePageFilterMyDraftValidationStatus__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for the validation status filter for My Drafts view in Knowledge.',
    },
    OCD__KnowledgePageSortFieldArticle__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for Sort by for the Articles view in Knowledge.',
    },
    OCD__KnowledgePageSortFieldMyDraft__description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for Sort by for the My Drafts view in Knowledge.',
    },
    OCD__spring_KmMlAnyoneDraftArticlesList__description: {
      message:
        'In Salesforce Classic, used to configure layout properties for the Draft Articles view in Article Management.',
    },
    OCD__spring_KmMlArchivedArticlesList__description: {
      message:
        'In Salesforce Classic, used to configure layout properties for Archived Articles in Article Management.',
    },
    OCD__spring_KmMlMyDraftArticlesList__description: {
      message:
        'In Salesforce Classic, used to configure layout properties for Draft Articles assigned to Me in Article Management.',
    },
    OCD__spring_KmMlMyDraftTranslationsList__description: {
      message:
        'In Salesforce Classic, used to configure layout properties for Draft Translations in Article Management.',
    },
    OCD__spring_KmMlPublishedArticlesList__description: {
      message:
        'In Salesforce Classic, used to configure layout properties for Published Articles in Article Management.',
    },
    OCD__spring_KmMlPublishedTranslationsList__description: {
      message:
        'In Salesforce Classic, used to configure layout properties for Published Translations in Article Management.',
    },
    OCD__sid__description: {
      message:
        'Identifies a Live Agent session. Stores a unique pseudonymous ID for a specific browser session over chat service.',
    },
    OCD_activeView_description: {
      message:
        'In Salesforce Classic, used to remember the last user selection for Articles or Translations tab in Article Management.',
    },
    OCD_apex__EmailAddress_description: {
      message: 'Caches contact IDs associated with email addresses.',
    },
    OCD_auraBrokenDefGraph_description: {
      message: 'Used to track when a Lightning page has malformed HTML.',
    },
    OCD_retention_1_week: {
      message: '1 week',
    },
    OCD_autocomplete_description: {
      message: 'Determines if the login page remembers the user’s username.',
    },
    OCD_BAYEAX_BROWSER_description: {
      message:
        'Identify a unique browser subscribed to CometD streaming channels.',
    },
    OCD_calViewState_description: {
      message:
        'Sets the inline calendar date state in Salesforce Classic (current week selected).',
    },
    OCD_caPanelState_description: {
      message:
        'Saves the open, closed, and height percent states of the calendar panel.',
    },
    OCD_renderCtx_description: {
      message:
        "Used to deliver requested pages and content based on a user's navigation.",
    },
    OCD_pctrk_description: {
      message:
        'Used to count page views by unauthenticated users against license usage.',
    },
    OCD_force_stream_description: {
      message:
        'Used to properly route server requests within Salesforce infrastructure for sticky sessions.',
    },
    OCD_retention_3_hours: {
      message: '3 hours',
    },
    OCD_sfdc_stream_description: {
      message:
        'Used to properly route server requests within Salesforce infrastructure for sticky sessions.',
    },
    OCD_BrowserId_sec_description: {
      message:
        'Used to log secure browser sessions/visits for internal-only product analytics.',
    },
    OCD_force_proxy_stream_description: {
      message:
        'Used to ensure client requests hit the same proxy hosts and are more likely to retrieve content from cache.',
    },
    OCD_BrowserId_description: {
      message:
        'Used to log browser sessions/visits for internal-only product analytics.',
    },
    OCD_QCQQ_description: {
      message:
        'Used to detect the official login page for Forced Login POST detection.',
    },
    OCD_sid_Client_description: {
      message: 'Used to validate orgid and userid on the client side.',
    },
    OCD_idccsrf_description: {
      message: 'Used for SSO authentication as CSRF protection.',
    },
    OCD_rsid_description: {
      message: "Used for an admin user to 'log in as' one of their org user.",
    },
    OCD_rsid2_description: {
      message:
        "Used for an admin user to 'log in as' one of their org portal user.",
    },
    OCD_RRetURL_description: {
      message: "Used for 'log in as' to return to original page.",
    },
    OCD_RRetURL2_description: {
      message: "Used for portal 'log in as' to return to original page.",
    },
    OCD_alohaEpt_description: {
      message:
        'Used to log page load EPT (Experience Page Time) for Visualforce (Classic UI) pages.',
    },
    OCD_retention_90_sec: {
      message: '90 sec',
    },
    OCD_clientSrc_description: {
      message: 'Used to validate the IP from where a user logs in.',
    },
    OCD_oinfo_description: {
      message:
        "Used to track the State, Edition and orgID of a customer's org.",
    },
    OCD_expid___description: {
      message: 'Used to render pages based on specified brand.',
    },
    OCD_oid_description: {
      message:
        'Used to redirect a user to the correct Salesforce org and assist the user for the next login.',
    },
    OCD_CookieConsentPolicy__description: {
      message:
        'Used to apply end-user cookie consent preferences set by our client-side utility.',
    },
    OCD__kuid__description: {
      message:
        "Registers a unique ID that identifies a returning user's device. The ID is used for targeted ads.",
    },
    OCD_visitor_id__description: {
      message:
        'The visitor cookie includes a unique visitor ID and the unique identifier for your account.',
    },
    OCD_cookieSettingVerified_description: {
      message:
        '\tUsed to create a popup message telling users that cookies are required.',
    },
    OCD_cordovaVersion_description: {
      message: 'Used for internal diagnostics with mobile applications.',
    },
    OCD_cqcid_description: {
      message: 'Used to track a guest shopper’s browsing activity.',
    },
    OCD_csssid_description: {
      message: 'Used to establish a request context in the correct tenant org.',
    },
    OCD_csssid_Client_description: {
      message: 'Enables user switching.',
    },
    OCD_devOverrideCsrfToken_description: {
      message: 'CSRF Token.',
    },
    OCD_disco_description: {
      message:
        'Tracks the last user login and active session for bypassing login. For example, OAuth immediate flow.',
    },
    OCD_FedAuth_description: {
      message:
        'For the SharePoint connector, used to authenticate to the top-level site in SharePoint.',
    },
    OCD_gTalkCollapsed_description: {
      message:
        'Controls whether the sidebar in Salesforce Classic is open for a user.',
    },
    OCD_guest_uuid_essential___description: {
      message:
        'Provides a unique ID for guest users in Salesforce Sites. Expires 1 year after the user’s last visit to the site.',
    },
    OCD_hideDevelopmentTools_description: {
      message: 'Used to determine whether to show the developer tools.',
    },
    OCD_hideFilesWarningModal_description: {
      message:
        'Stores the user acknowledgment that a public link to a Salesforce file is on email send. The warning window isn’t continually shown after the user acknowledges this action.',
    },
    OCD_hideIdentityDialog_description: {
      message:
        'Hides the dialog box that informs that the current user is logged out when switching to another user.',
    },
    OCD_Host_ERIC_PROD__description: {
      message:
        'Enterprise Request Infrastructure Cookie (ERIC) carries the cross-site request forgery (CSRF) security token between the server and the client. The cookie name indicates the server mode (PROD or PRODDEBUG) and a random number. A different token is generated for each Lightning app.',
    },
    OCD_ideaToggle_description: {
      message: 'Show the Ideas list view or the Feed list view.',
    },
    OCD_inst_description: {
      message:
        'Used to redirect requests to an instance when bookmarks and hardcoded URLs send requests to a different instance. This type of redirect can happen after an org migration, a split, or after any URL update.',
    },
    OCD_iotcontextsplashdisable_description: {
      message:
        'For the IoT product, stores user preference of whether to show Context Splash popup.',
    },
    OCD_lastlist_description: {
      message: 'Used to store the cookie name for the last list URL.',
    },
    OCD_liveagent_invite_rejected__description: {
      message:
        'Instructs Live Agent not to reissue an invitation on the same domain. Deletion of this cookie degrades the customer’s experience because they can get repeated invitations.',
    },
    OCD_liveagent_sid_description: {
      message:
        'Identifies a Live Agent session. Stores a unique pseudonymous ID for a specific browser session over chat service.',
    },
    OCD_lloopch_loid_description: {
      message:
        'Determines whether to send the user to a specific portal login or an app login.',
    },
    OCD_login_description: {
      message:
        'If the user’s session has expired, used to fetch the username and populate it on the main login page when using the process builder app.',
    },
    OCD_retention_60_Days: {
      message: '60 Days',
    },
    OCD_pc_unit_description: {
      message:
        'Sets a preference for displaying platform cache units to either MB or KB.',
    },
    OCD_PreferredLanguage_description: {
      message:
        'Stores the user language preference for language detection and localized user experience.',
    },
    OCD_promptTestMod_description: {
      message:
        'Stores whether test mode is in effect. This cookie is read-only.',
    },
    OCD_redirectionWarning_description: {
      message:
        'Enables the customer to store URLs that are exempt from setting a redirect warning interstitial page on an allowlist.',
    },
    OCD_schgtclose_description: {
      message: 'Deprecated feature, not used.',
    },
    OCD_sfdc_lv2_description: {
      message:
        'Stores identity confirmation details for users. If the cookie isn’t set or it expires, users must repeat the identity confirmation process the next time that they log in. Identity confirmation requires a verification method such as SMS, an authenticator app, or a security key.',
    },
    OCD_showNewBuilderWarningMessage_description: {
      message:
        'Used to show or hide a warning message for the new dashboard builder.',
    },
    OCD_retention_100_years: {
      message: '100 years',
    },
    OCD_sidebarPinned_description: {
      message: 'Controls the state of the Salesforce Classic sidebar.',
    },
    OCD_ssostartpage_description: {
      message:
        'Identifies the Identity Provider (IdP) location for single sign-on (SSO). Certain service provider initiated SSO requests can fail without this cookie.',
    },
    OCD_SUCSP_description: {
      message:
        'Used when the user identity that an administrator is assuming, via Log In as Another User, is a Customer Success Portal (CSP) user.',
    },
    OCD_SUPRM_description: {
      message:
        'Used when the user identity that an administrator is assuming, via Log In as Another User, is a Partner Relationship Management (PRM) portal user.',
    },
    OCD_t_description: {
      message: 'Used to avoid duplicate access checks.',
    },
    OCD_useStandbyUrl_description: {
      message:
        'Controls how quickly to set the standby URL when loading the softphone.',
    },
    OCD_waveUserPrefFinderLeftNav_description: {
      message: 'Preference for left navigation UI in CRM Analytics.',
    },
    OCD_waveUserPrefFinderListView_description: {
      message: 'Preference for displaying list views in CRM Analytics.',
    },
    OCD_webact_description: {
      message: 'Used to collect metrics per page view for personalization.',
    },
    OCD_WelcomePanel_description: {
      message: 'Stores Salesforce preferences.',
    },
    OCD_cookieyesID_description: {
      message:
        'CookieYes sets this cookie as a unique identifier for visitors according to their consent.',
    },
    OCD_cky_consent_description: {
      message:
        "The cookie is set by CookieYes to remember the users' consent settings so that the website recognizes the users the next time they visit.",
    },
    OCD_cookieyes_necessary_description: {
      message:
        "CookieYes sets this cookie to remember the consent of users for the use of cookies in the 'Necessary' category.",
    },
    OCD_cookieyes_functional_description: {
      message:
        "CookieYes sets this cookie to remember the consent of users for the use of cookies in the 'Functional' category.",
    },
    OCD_cookieyes_analytics_description: {
      message:
        "CookieYes sets this cookie to remember the consent of users for the use of cookies in the 'Analytics' category.",
    },
    OCD_cookieyes_advertisement_description: {
      message:
        "CookieYes sets this cookie to remember the consent of users for the use of cookies in the 'Advertisement' category.",
    },
    OCD_cookieyes_privacy_policy_generator_session_description: {
      message:
        'CookieYes sets this cookie to identify a session instance for a user.',
    },
    OCD_cookieyes_session_description: {
      message:
        'CookieYes sets this cookie to identify a session instance for a user.',
    },
    OCD_cky_action_description: {
      message:
        'This cookie is set by CookieYes and is used to remember the action taken by the user.',
    },
    OCD_cookieyes_performance_description: {
      message:
        "CookieYes sets this cookie to remember the user's consent for cookies in the 'Performance' category.",
    },
    OCD_cookieyes_consent_description: {
      message:
        "CookieYes sets this cookie to remember user's consent preferences so that their preferences are respected on their subsequent visits to this site. It does not collect or store any personal information of the site visitors.",
    },
    OCD_tv_U__description: {
      message:
        'Collects information on user behaviour on multiple websites. This information is used in order to optimize the relevance of advertisement on the website.',
    },
    OCD_tvid_description: {
      message:
        'Presents the user with relevant content and advertisement. The service is provided by third-party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_JSESSIONID__description: {
      message:
        'JSESSIONID is a cookie generated by Servlet containers and used for session management in J2EE web applications for HTTP protocol. If a Web server is using a cookie for session management, it creates and sends JSESSIONID cookie to the client and then the client sends it back to the server in subsequent HTTP requests. JSESSIONID is a platform session cookie and is used by sites with JavaServer Pages (JSP). The cookie is used to maintain an anonymous user session by the server.',
    },
    OCD_SSLB_description: {
      message:
        "Indicates to a downstream load balancer that subsequent requests by a user should be routed to or away from SiteSpect, depending on the cookie's value.",
    },
    OCD_SSPV_description: {
      message:
        'Used by the Preview feature and used when the Logging Level field on the Logging & Performance tab for the Domain is set to Debug.',
    },
    OCD_SSRT_description: {
      message:
        "Stores the date and time of the user's last request to determine if the visit has timed out. ",
    },
    OCD_SSSC_description: {
      message:
        "A session-only cookie used to send the user's Campaign assignment information to the backend webserver.",
    },
    OCD_ep201_description: {
      message: 'Load balancing site traffic and preventing site abuse',
    },
    OCD_ep202_description: {
      message:
        'Signup source attribution, event stitching, and assigning visitors to experiments',
    },
    OCD_usbls_description: {
      message:
        'Usabilla uses this cookie for campaigns targeted to visitors new or returning to the site. This cookie is used to track which category applies to users and to then show the campaign to the right users.',
    },
    OCD_xf_consent_description: {
      message:
        "This cookie is used to store a user's cookie consent preferences.",
    },
    OCD_xf_csrf_description: {
      message:
        "This cookie is used to store a user's cross-site request forgery token, preventing other applications from making malicious requests on the user's behalf.",
    },
    OCD_xf_dbWriteForced_description: {
      message:
        'This cookie is used to indicate that the request should be completed using the database write server.',
    },
    OCD_xf_inline_mod___description: {
      message:
        "These cookies are used to store a user's currently selected inline moderation items.",
    },
    OCD_xf_language_id_description: {
      message: "This cookie is used to store a user's selected language.",
    },
    OCD_xf_ls_description: {
      message:
        "This cookie is used to store a user's local storage contents in the event their browser does not support the native local storage mechanism.",
    },
    OCD_xf_notice_dismiss_description: {
      message: "This cookie is used to store a user's dismissed notices.",
    },
    OCD_xf_push_notice_dismiss_description: {
      message:
        'This cookie is used to determine whether or not a user has dismissed the push notification notice.',
    },
    OCD_xf_push_subscription_updated_description: {
      message:
        "This cookie is used to determine if a user's push subscription preferences have been updated.",
    },
    OCD_xf_session_description: {
      message: "This cookie is used to store a user's session identifier.",
    },
    OCD_xf_style_id_description: {
      message: "This cookie is used to store a user's selected style.",
    },
    OCD_xf_tfa_trust_description: {
      message:
        'This cookie is used to determine if a user has previously chosen to trust this device without requiring further two-step verification for a period of time.',
    },
    OCD_retention_45_days: {
      message: '45 days',
    },
    OCD_xf_toggle_description: {
      message:
        "This cookie and local storage item are used to store a user's preferences for toggling various controls open or closed.",
    },
    OCD_xf_user_description: {
      message:
        "This cookie is used to store a user's remember me token, allowing their credentials to persist across multiple sessions.",
    },
    OCD_xf_emoji_usage_description: {
      message:
        'This cookie is used to store which emojis a user has recently used when composing a message.',
    },
    OCD_xf_from_search_description: {
      message:
        'This cookie is used to track when a user has arrived on the site from a search engine.',
    },
    OCD_sailthru_content_description: {
      message:
        'Tracks recent pageviews for all visitors, and can be used to populate a new user profile.',
    },
    OCD_sailthru_pageviews_description: {
      message:
        'This cookie is set by Sailthru to tracks the number of page views for each user.',
    },
    OCD_sailthru_visitor_description: {
      message:
        "This cookie is set by Sailthru. The cookie contains an id that is used to identify a user's pageviews within a session.",
    },
    OCD_IMRID_description: {
      message:
        'This domain is owned by Nielsen. The main business activity is: Consumer Profiling for Online Advertising',
    },
    OCD_retention_390_days: {
      message: '390 days',
    },
    OCD_ud_description: {
      message:
        'Collects data related to the user’s visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded, with the purpose of displaying targeted ads.',
    },
    OCD_retention_119_days: {
      message: '119 days',
    },
    OCD_udo_description: {
      message:
        'Collects information on user behavior on multiple websites. This information is used in order to optimize the relevance of advertisement on the website.',
    },
    OCD_EE_description: {
      message:
        'Collects data related to the user’s visits to the website, such as the number of visits, average time spent on the website and what pages have been loaded, with the purpose of displaying targeted ads.',
    },
    OCD_i00_description: {
      message:
        "This cookie is used to share anonymous data about the use of online and mobile media players with the Broadcasters' Audience Research Board (BARB) to understand how many people watch online, and how much they watch.",
    },
    OCD_CookieScriptConsent_description: {
      message:
        'This cookie is used by Cookie-Script.com service to remember visitor cookie consent preferences. It is necessary for Cookie-Script.com cookie banner to work properly.',
    },
    OCD_rack_session_description: {
      message:
        'Cookie generated by the Ruby Rack app. This is a general purpose identifier used to maintain user session variables.',
    },
    OCD_pa_user_description: {
      message:
        'The pa_user cookie tracks an authenticated visitor (user) over time, even if the user does not log in again during subsequent visits. This cookie is managed by the customer who chooses its value and decides if the cookie should be set or not',
    },
    OCD_xbc_description: {
      message:
        'This cookie is used by Multiple Composer features, used for, metering, A/B testing, adblocker conversion tracking, credits, affiliates, first-visit segmentation, and AMP reader ID linking.',
    },
    OCD___tbc_description: {
      message:
        'This cookie is used for tracking conversion and external segmentation',
    },
    OCD___pls_description: {
      message:
        'This cookie is used to differentiate users has been subscribed to an ESP push list',
    },
    OCD___tac_description: {
      message:
        "This cookie is used to check access via JWT won't work and the Composer Cookies stop working",
    },
    OCD__pcus_description: {
      message: 'This cookie is used to User segmentation',
    },
    OCD_cX_P_description: {
      message:
        'This cookie contains the browserId that is used in Piano products for reporting and tracking purposes',
    },
    OCD_cX_G_description: {
      message:
        'This cookie is a Global ID mapping different IDs together into one ID. Used for building user profile information across all sites of a single customer where cx.js is implemented',
    },
    OCD_pnespsdk_visitor_description: {
      message: 'This cookie is used for tracking user visits',
    },
    OCD_pnespsdk_push_subscription_added_description: {
      message:
        'This cookie is used only in case the Push notifications feature in ESP is activated and allows correct tracking of Push notification subscription events',
    },
    OCD_pnespsdk_pnespid_description: {
      message:
        'This cookie is used to connect a user visit coming from an email campaign click with a visitor on the website',
    },
    OCD_pnespsdk_ssn_description: {
      message:
        'This session cookie is mandatory for the ESP service to be correctly running',
    },
    OCD___utp_description: {
      message:
        "This cookie is used for logged-in user's session, and contains details of a logged-in user. By default, this cookie is set on the top-level domain",
    },
    OCD___pil_description: {
      message:
        "This cookie is used to set the preferred language for the Piano templates. Value for example: de_DE. If not available, VX's LANG cookie is used.",
    },
    OCD___pid_description: {
      message:
        'This cookie stores the domain received on the frontend is used as a domain for other cookies (incl. __utp, __idr, __tae) Example value: .piano.io',
    },
    OCD___idr_description: {
      message:
        "The User Session Cookie is set when a user selects the option 'Stay logged in' when signing in. The expiration depends on the value configured in the Piano ID settings. Various browser restrictions and cookie rules affect the expiration as well.",
    },
    OCD___eea_description: {
      message:
        'This cookie is used to determine if the user token (stored in __utp) needs to be refreshed with the new expiration automatically every 24 hours.',
    },
    OCD___code_description: {
      message: 'This cookie is used for ID OAuth authorization.',
    },
    OCD___bid_description: {
      message: 'this cookie is used to Identifies the browser of the end user',
    },
    OCD___ut_description: {
      message:
        'This cookie is used to Store on your website, the User Token Cookie stores encrypted data used by all Piano User Accounts',
    },
    OCD___pvi_description: {
      message:
        'This cookie stores data about the last visit to the site including the AID, lastTrackedVisitId, domain and time of the visit. Used for reporting only.',
    },
    OCD___pat_description: {
      message:
        "This cookie stores difference between the client’s application time zone and UTC. At midnight, (application's local time), the previous visit is expired and a new one is created. The cookie is used for calculation.",
    },
    OCD___pnahc_description: {
      message:
        'This cookie stores the result of previous Adblock detection, removes false-positive AdBlock detection clauses.',
    },
    OCD_LANG_description: {
      message: 'This cookie stores the selected locale',
    },
    OCD_retention_1500_days: {
      message: '1500 days',
    },
    OCD_LANG_CHANGED_description: {
      message:
        'This cookie stores the temporarily selected locale (e.g. impersonation in Admin dashboard).',
    },
    OCD__pctx_description: {
      message:
        'This cookie is required to sync different Piano product scripts containing common data points. It contains data from different products,  for example for Composer Insights or Ad Revenue Insights, but only IF you have implemented any of these products.',
    },
    OCD__pprv_description: {
      message:
        'This cookie contains the property consent (linked to a product) the end-user has consented to. More information about Consent management can be found here.',
    },
    OCD__pcid_description: {
      message:
        'This cookie contains the browserId (BID) that is used in Piano products for reporting and tracking purposes.',
    },
    OCD_DotMetrics_SessionCookieTemp_description: {
      message:
        'This cookie DotMetrics obtain information about a general site visit collect in the DotMetrics Research Network.',
    },
    OCD_DotMetrics_UniqueUserIdentityCookie_description: {
      message:
        'This cookie contains information about the current user (unique ID, creation time, current tracking mode and version)',
    },
    OCD_DotMetrics_DeviceKey_description: {
      message:
        'This cookie collects information about your device. The purpose for which we use it is to provide a high quality view of the survey or some content on your device.',
    },
    OCD_DotMetrics_SessionCookieTempTimed_description: {
      message:
        'This cookie contains information about the current site from which you access the DotMetrics research network.',
    },
    OCD_ki_s_description: {
      message:
        'This cookie is used to store the current state of any survey the user has viewed or interacted with.',
    },
    OCD_ki_u_description: {
      message: 'This cookie is used to store a unique user identifier.',
    },
    OCD_barometric_cuid__description: {
      message:
        'This cookie is used to identify users for Veritone/Barometric Podcast Conversion.',
    },
    OCD_barometric_idfa__description: {
      message:
        'This cookie is used to to collect visitor statistics. This data is used to categorize users and improve the effectiveness of website advertising.',
    },
    OCD___gfp_64b_description: {
      message:
        'Stores data on the time spent on the website and its sub-pages, during the current session.',
    },
    OCD___gfp_s_64b_description: {
      message:
        'Registers data on the performance of the website’s embedded video-content.',
    },
    OCD_Gdyn_description: {
      message:
        "\tCollects statistics on the visitor's visits to the website, such as the number of visits, average time spent on the website and what pages have been read.",
    },
    OCD_opt_out_description: {
      message:
        'This cookie is used to remember not to serve that user targeted Ads if they opt out.',
    },
    OCD_visitor_description: {
      message: 'This cookie is used to identify a unique visitor to the site.',
    },
    OCD_tp_description: {
      message: 'This cookie is used to target the audience',
    },
    OCD_lkqdid_description: {
      message:
        'This cookie is used to identify the physical location of mobile devices and operating system device identifiers.',
    },
    OCD_lkqdidts_description: {
      message:
        'This cookie is used to identify the physical location of mobile devices and operating system device.',
    },
    OCD_33x_ps_description: {
      message:
        'This cookie is used targeted and behavioural advertising services.',
    },
    OCD_COOKIELAW_ADS_description: {
      message: 'Keeps track of whether marketing cookies are allowed',
    },
    OCD_COOKIELAW_SOCIAL_description: {
      message: 'Keeps track of whether social cookies are allowed',
    },
    OCD_COOKIELAW_STATS_description: {
      message: 'Keeps track of whether analytics cookies are allowed',
    },
    OCD_COOKIELAW_description: {
      message:
        'These cookies are used for platform stability and to store cookie preferences. They do not collect personally identifiable information and cannot be disabled.',
    },
    OCD_dm_timezone_offset_description: {
      message:
        'Cookie used by the hosting provider (duda.co), the cookie is set in order to enable and measure personalization rules and statistics.',
    },
    OCD_dm_last_visit_description: {
      message:
        'Cookie used by the hosting provider (duda.co), the cookie is set in order to enable and measure personalization rules and statistics.',
    },
    OCD_dm_total_visits_description: {
      message:
        'Cookie used by the hosting provider (duda.co), the cookie is set in order to enable and measure personalization rules and statistics.',
    },
    OCD_dm_last_page_view_description: {
      message:
        'Cookie used by the hosting provider (duda.co), the cookie is set in order to enable and measure personalization rules and statistics.',
    },
    OCD_dm_this_page_view_description: {
      message:
        'Cookie used by the hosting provider (duda.co), the cookie is set in order to enable and measure personalization rules and statistics.',
    },
    OCD_CookieControl_description: {
      message:
        "This cookie is used to remember the user's cookie consent preferences.",
    },
    OCD_intercom_id___description: {
      message:
        'Anonymous visitor identifier cookie. As people visit your site they get this cookie.',
    },
    OCD_retention_9_months: {
      message: '9 months',
    },
    OCD_intercom_session___description: {
      message:
        "Identifier for each unique browser session. This session cookie is refreshed on each successful logged-in ping, extending it one week from that moment. The user can access their conversations and have data communicated on logged-out pages for 1 week, as long as the session isn't intentionally terminated with Intercom('shutdown');, which usually happens on logout.",
    },
    OCD_intercom_device_id___description: {
      message:
        'Identifier for each unique device that interacts with the Messenger. It is refreshed on each successful ping, extending it another 9 months. We use this cookie to determine the unique devices interacting with the Intercom Messenger to prevent abuse.',
    },
    OCD_mp___description: {
      message: "This cookie is used to store a user's unique identifier.",
    },
    OCD_pvc_visits_0__description: {
      message:
        'It counts the number of visits to a post. The cookie is used to prevent repeat views of a post by a visitor.',
    },
    OCD_client_bslstaid_description: {
      message:
        'Registers statistical data about the behavior of visitors to the website. Used for internal analysis by the website administrator.',
    },
    OCD_retention_540_days: {
      message: '540 days',
    },
    OCD_client_bslstmatch_description: {
      message:
        'Registers statistical data about the behavior of visitors to the website. Used for internal analysis by the website administrator.',
    },
    OCD_client_bslstsid_description: {
      message: 'Unique identifier of the user session.',
    },
    OCD_client_bslstuid_description: {
      message:
        'Registers statistical data about the behavior of visitors to the website. Used for internal analysis by the website administrator.',
    },
    OCD_CGISESSID_description: {
      message:
        'Cookie generated by applications based on the Perl language. This is a general purpose identifier used to maintain user session variables.',
    },
    OCD_vglnk_Agent_p_description: {
      message:
        'Cookie set by Disqus. Used to collect visitor behaviour in order to present more relevant advertisements.',
    },
    OCD_vglnk_PartnerRfsh_p_description: {
      message:
        'This cookie is used to collect data from various website in order to present more relevant advertisement.',
    },
    OCD_deuxesse_uxid_description: {
      message:
        'Sets a unique ID for the visitor, that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs, which facilitates real-time bidding for advertisers.',
    },
    OCD_pid_short_description: {
      message:
        'This cookie is used by Xplosion/emetriq. Used to analyze the behavior of visitors to the website and derive preferences. These allow for interest-based advertising on third party websites.',
    },
    OCD_pid_signature_description: {
      message:
        'This cookie is used by Xplosion/emetriq. Used to analyze the behavior of visitors to the website and derive preferences. These allow for interest-based advertising on third party websites.',
    },
    OCD_ep_description: {
      message:
        'This cookie Is used by Xplosion / emetriq. Used to analyze the behavior of visitors to the website and derive preferences. These allow for interest-based advertising on third party websites.',
    },
    OCD__pangle_description: {
      message:
        "This cookie is to measure and improve the performance of your advertising campaigns and to personalize the user's ad experiences delivered by the Pangle ad network.",
    },
    OCD_u_description: {
      message: 'This cookie is Used for audience segmentation for advertising',
    },
    OCD__ssc_description: {
      message:
        'This is a cookie used for generating access and internet traffic statistics.',
    },
    OCD_NSC___description: {
      message:
        'This cookie name is associated with the Netscaler load balancing service from Citrix. This is a pattern type cookie with the root being NSC_ and the rest of the name being a unique encrypted alpha numeric identifier for the virtual server it originated from. The cookie is used to ensure traffic and user data is routed to the correct locations where a site is hosted on multiple servers, so that the end user has a consistent experience.',
    },
    OCD_retention_12_hours: {
      message: '12 hours',
    },
    OCD_bitoIsSecure_description: {
      message:
        'This cookie is associated with bidr.io. It allows third party advertisers to target the visitor with relevant advertising. This pairing service is provided by third party advertisement hubs, which facilitate real-time bidding for advertisers.',
    },
    OCD_bito_description: {
      message:
        'This cookie is generally provided by bidr.io and is used for advertising purposes.',
    },
    OCD_WMF_Last_Access_description: {
      message:
        'This cookie is used by the Wikimedia Foundation. It is used to determine the last time a user visited a page, and is used for various statistics.',
    },
    OCD_loginnotify_prevlogins_description: {
      message:
        'This cookie verifies that you are logging in from a known device. This affects the threshold for how many unsuccessful login attempts trigger a notification to the user..',
    },
    OCD_stopMobileRedirect_description: {
      message:
        'This cookie tells us not to redirect to the mobile site if you do not like that..',
    },
    OCD_centralnotice_bucket_description: {
      message:
        'This cookie helps us understand the effectiveness of notices provided to users through the CentralNotice extension..',
    },
    OCD_GeoIP_description: {
      message:
        "This cookie is used to try and understand the user's geographical location (country) based on their IP address.",
    },
    OCD_NetWorkProbeLimit_description: {
      message:
        'This cookie is used to set NetworkProbeLimit cookie to override the default network probe limit value.',
    },
    OCD_auid_description: {
      message:
        'This cookie is used to identify the visitor and cookie-tracking solutions and marketing and advertising services..',
    },
    OCD_aum_description: {
      message:
        'This cookie is used to identify the visitor and the company provides a range of cookie-tracking solutions and marketing and advertising services.',
    },
    OCD_ablyft_exps_description: {
      message:
        'Is set and updated when a visitor is bucketed into an experiment/variation.',
    },
    OCD_ablyft_queue_description: {
      message:
        'Is set when a visitor triggers an event/goal. After sending the event to ABlyft it is cleared.',
    },
    OCD_ablyft_uvs_description: {
      message:
        'Is set on the first pageview and update with every further pageview of a visitor.',
    },
    OCD_ablyft_tracking_consent_description: {
      message:
        'Is set when enableTrackingConsent or disableTrackingConsent is triggered via API.',
    },
    OCD__d2id_description: {
      message:
        'This cookie is required for shopping cart functionality on the website.',
    },
    OCD_edsid_description: {
      message:
        'This cookie is used to identify users to implement fraud prevention',
    },
    OCD_ftid_description: {
      message:
        'This cookie is used to identify users to implement fraud prevention',
    },
    OCD_aniC_description: {
      message:
        'This cookie is used in context with video-advertisement. The cookie limits the number of times a user is shown the same advertisement. The cookie is also used to ensure relevance of the video-advertisement to the specific user.',
    },
    OCD_retention_20_Days: {
      message: '20 Days',
    },
    OCD_version_description: {
      message:
        "This cookie is used by the website's operator in context with multi-variate testing. This is a tool used to combine or change content on the website. This allows the website to find the best variation/edition of the site.",
    },
    RWS_rationale_https___poalim_site: {
      message: 'one of 3rd party cookie solutions option',
    },
    RWS_rationale_https___lateja_cr: {
      message: 'Newspaper owned by Grupo Nación',
    },
    RWS_rationale_https___elfinancierocr_com: {
      message: 'Newspaper owned by Grupo Nación',
    },
    RWS_rationale_https___o2_pl: {
      message: 'News portal and email service',
    },
    RWS_rationale_https___pudelek_pl: {
      message: 'Special Interest Website - celebrity news and gossip',
    },
    RWS_rationale_https___money_pl: {
      message:
        'Special Interest Website - news and information on the stock market, currencies, business and economics',
    },
    RWS_rationale_https___abczdrowie_pl: {
      message: 'Special Interest Website - healthy living and medical health',
    },
    RWS_rationale_https___wpext_pl: {
      message: 'Content delivery domain for sensitive content websites',
    },
    RWS_rationale_https___cardsayings_net: {
      message: 'Co-branded content site',
    },
    RWS_rationale_https___nourishingpursuits_com: {
      message: 'Co-branded content site',
    },
    RWS_rationale_https___welt_de: {
      message: 'News Website welt.de',
    },
    RWS_rationale_https___autobild_de: {
      message: 'Special Interest Website Autobild',
    },
    RWS_rationale_https___computerbild_de: {
      message: 'Special Interest Website Computerbild',
    },
    RWS_rationale_https___wieistmeineip_de: {
      message: 'Internet speed Measurement Website of Computerbild',
    },
    RWS_rationale_https___www_asadcdn_com: {
      message: 'CDN for Ad Files - Frequency Capping',
    },
    RWS_rationale_https___salemoveadvisor_com: {
      message:
        'The domains are very clear that they are all a part of the SaleMove family of sites. These sites are used as demo sites to show how multiple sites can be linked together for the purpose of live chat linking across multiple domains. A user would expect the sites to be linked as they are all a part of the same demo family of sites to show how it works',
    },
    RWS_rationale_https___salemovefinancial_com: {
      message:
        'The domains are very clear that they are all a part of the SaleMove family of sites. These sites are used as demo sites to show how multiple sites can be linked together for the purpose of live chat linking across multiple domains. A user would expect the sites to be linked as they are all a part of the same demo family of sites to show how it works',
    },
    RWS_rationale_https___salemovetravel_com: {
      message:
        'The domains are very clear that they are all a part of the SaleMove family of sites. These sites are used as demo sites to show how multiple sites can be linked together for the purpose of live chat linking across multiple domains. A user would expect the sites to be linked as they are all a part of the same demo family of sites to show how it works',
    },
    RWS_rationale_https___teacherdashboard_com: {
      message: 'Portal for Hapara teachers',
    },
    RWS_rationale_https___mystudentdashboard_com: {
      message: 'Portal for Hapara students',
    },
    RWS_rationale_https___songshare_com: {
      message: 'Specialized Platform for Music Smart Links',
    },
    RWS_rationale_https___livemint_com: {
      message: 'https://livemint.com',
    },
    RWS_rationale_https___livehindustan_com: {
      message: 'https://livehindustan.com',
    },
    RWS_rationale_https___healthshots_com: {
      message: 'https://healthshots.com',
    },
    RWS_rationale_https___ottplay_com: {
      message: 'https://ottplay.com',
    },
    RWS_rationale_https___desimartini_com: {
      message: 'https://desimartini.com',
    },
    RWS_rationale_https___landyrev_ru: {
      message: "Same publisher's website in a different region",
    },
    RWS_rationale_https___gujaratijagran_com: {
      message: 'News Website for Gujarati audience',
    },
    RWS_rationale_https___punjabijagran_com: {
      message: 'News Website for Punjabi audience',
    },
    RWS_rationale_https___mercadolivre_com: {
      message: 'Mercado Libre in Brazil',
    },
    RWS_rationale_https___mercadopago_com: {
      message: "Mercado Libre's payments ecosystem",
    },
    RWS_rationale_https___mercadoshops_com: {
      message: "Mercado Libre's online ecommerce store builder",
    },
    RWS_rationale_https___portalinmobiliario_com: {
      message: "Mercado Libre's brand for real estate ecommerce in Chile",
    },
    RWS_rationale_https___tucarro_com: {
      message:
        "Mercado Libre's brand for motors ecommerce in Colombia and Venezuela",
    },
    RWS_rationale_https___reactor_cc: {
      message: 'Domain for fandomes, old version of site and mirror',
    },
    RWS_rationale_https___cookreactor_com: {
      message: 'Cooking fandome',
    },
    RWS_rationale_https___clarosports_com: {
      message: 'Member of AMX Contenido websites, as unotv',
    },
    RWS_rationale_https___cmxd_com_mx: {
      message:
        'Used for personalization purposes across AMX Contenido websites.',
    },
    RWS_rationale_https___idbs_dev_com: {
      message: 'Dev version of main application IDBS-cloud',
    },
    RWS_rationale_https___idbs_staging_com: {
      message: 'Staging version of main application IDBS-cloud',
    },
    RWS_rationale_https___idbs_eworkbook_com: {
      message: 'E-workbook services part of IDBS-cloud product',
    },
    RWS_rationale_https___eworkbookcloud_com: {
      message: 'E-workbook services part of IDBS-cloud product',
    },
    RWS_rationale_https___eworkbookrequest_com: {
      message: 'E-workbook request part of IDBS-cloud product',
    },
    RWS_rationale_https___textyserver_appspot_com: {
      message: 'API service for mightytext.net',
    },
    RWS_rationale_https___mighty_app_appspot_com: {
      message: 'alternative domain for API service for mightytext.net',
    },
    RWS_rationale_https___wingify_com: {
      message: 'Alias',
    },
    RWS_rationale_https___wildixin_com: {
      message: "Wildix PBX's domain",
    },
    RWS_rationale_https___indiatimes_com: {
      message:
        'Indiatimes.com is primary domain for Times Internet which publish stories on Indian Lifestyle, Culture, Relationships, Food, Travel, Entertainment, News and New Technology News. The connection to Times Internet Limited is reflected in the About Us Section and the footer of the website.',
    },
    RWS_rationale_https___timesofindia_com: {
      message:
        'Times of India (TOI) is Indias largest and most influential news publisher in English. Its digital platform timesofindia.com is powered by Times Internet Limited, aptly represented in the About Us section and footer of the website.',
    },
    RWS_rationale_https___economictimes_com: {
      message:
        "Economic Times is India's top business news platform, providing comprehensive coverage of the economy, stock markets, and personal finance to inspire and empower business leaders and entrepreneurs. This digital platform is powered by Times Internet Limited as is clear from the About Us section of the website.",
    },
    RWS_rationale_https___samayam_com: {
      message:
        'Samayam is a Regional News publisher powered by Times Internet Limited. Its relationship to Times Internet is reflected in the footer of the website.',
    },
    RWS_rationale_https___cricbuzz_com: {
      message:
        'Cricbuzz is an Indian cricket news & live score platform owned by Times Internet Limited which is aptly reflected in the footer on the website.',
    },
    RWS_rationale_https___growthrx_in: {
      message:
        'GrowthRx is a customer engagement platform powered by Times Internet',
    },
    RWS_rationale_https___clmbtech_com: {
      message:
        'This is a times-internet data and customer management platform for managing publisher data.',
    },
    RWS_rationale_https___tvid_in: {
      message:
        'TVID is an in-house video management platform powered by Times Internet',
    },
    RWS_rationale_https___hc1_global: {
      message: 'hc1 Insights Lab platform for UK.',
    },
    RWS_rationale_https___hc1cas_com: {
      message: 'hc1 Insights Lab platform authentication service for US.',
    },
    RWS_rationale_https___hc1cas_global: {
      message: 'hc1 Insight Lab platform authentication service for UK.',
    },
    RWS_rationale_https___tribunnews_com: {
      message: 'Indonesian local news by KG Media',
    },
    RWS_rationale_https___grid_id: {
      message: 'Indonesian entertainment & lifestyle news by KG Media ',
    },
    RWS_rationale_https___bolasport_com: {
      message: 'Indonesian sport news by KG Media ',
    },
    RWS_rationale_https___kompasiana_com: {
      message: 'Indonesian largest blog community by KG Media ',
    },
    RWS_rationale_https___kompas_tv: {
      message: 'Indonesian national news by KG Media ',
    },
    RWS_rationale_https___commentcamarche_net: {
      message: 'Centralized account for redactors, forums & real-time messages',
    },
    RWS_rationale_https___linternaute_com: {
      message: 'Centralized account for redactors, forums & real-time messages',
    },
    RWS_rationale_https___journaldunet_com: {
      message: 'Centralized account for redactors, forums & real-time messages',
    },
    RWS_rationale_https___phonandroid_com: {
      message: 'Centralized account for redactors, forums & real-time messages',
    },
    RWS_rationale_https___commentcamarche_com: {
      message: 'Centralized account for redactors, forums & real-time messages',
    },
    RWS_rationale_https___bonvivir_com: {
      message: 'Wine club for sell wine by La Nación',
    },
    RWS_rationale_https___chennien_com: {
      message: 'Alias domain for Nien Studio',
    },
    RWS_rationale_https___nien_org: {
      message: 'Campaign pages for Nien Studio',
    },
    RWS_rationale_https___nien_co: {
      message: 'URL shortener for Nien Studio',
    },
    RWS_rationale_https___hearty_app: {
      message: 'API endpoints for Hearty Journal',
    },
    RWS_rationale_https___hearty_gift: {
      message: 'Campaign pages for Hearty Journal',
    },
    RWS_rationale_https___hj_rs: {
      message: 'URL shortener for Hearty Journal',
    },
    RWS_rationale_https___heartymail_com: {
      message: 'Email service for Hearty Journal',
    },
    RWS_rationale_https___alice_tw: {
      message: "Alice's blog",
    },
    RWS_rationale_https___jiayi_life: {
      message: "Jiayi's blog",
    },
    RWS_rationale_https___miss_com_tw: {
      message: 'Company website',
    },
    RWS_rationale_https___trytalkdesk_com: {
      message: 'Specialized platform for CCaS',
    },
    RWS_rationale_https___gettalkdesk_com: {
      message: 'Specialized platform for CCaS',
    },
    RWS_rationale_https___fakt_pl: {
      message:
        'Special interest news website that is part of the Ringier Axel Springer Polska media group. It provides up-to-date news and covers a wide range of topics including politics, sports, entertainment, and lifestyle. Fakt.pl aims to deliver reliable and engaging content to its readers, keeping them informed about the latest events and trends.',
    },
    RWS_rationale_https___businessinsider_com_pl: {
      message:
        'Special interest news website within the Ringier Axel Springer Polska media group. It focuses on business, finance, technology, and related topics. The website provides in-depth analysis, market insights, and news articles tailored for professionals, entrepreneurs, and those interested in the business world.',
    },
    RWS_rationale_https___medonet_pl: {
      message:
        'Special interest news website within the Ringier Axel Springer Polska media group dedicated to health and medical topics. It offers a wide range of articles, news, and features related to various aspects of health, wellness, medical research, treatments, and lifestyle. Medonet.pl aims to provide reliable and accurate information to its readers, promoting healthy living and informed decision-making.',
    },
    RWS_rationale_https___ocdn_eu: {
      message:
        'Service dedicated to processing events that occur on websites, assists in managing and optimizing multimedia content, including images, videos, or other resources, for websites that rely on event-related functionality.',
    },
    RWS_rationale_https___plejada_pl: {
      message:
        'Special interest news website within the Ringier Axel Springer Polska media group dedicated to exclusive information, interviews, videos, and galleries from the world of show business.',
    },
    RWS_rationale_https___clubelpais_com_uy: {
      message: 'Domain from El Pais Uruguay',
    },
    RWS_rationale_https___paula_com_uy: {
      message: 'Domain from El Pais Uruguay',
    },
    RWS_rationale_https___gallito_com_uy: {
      message: 'Domain from El Pais Uruguay',
    },
    RWS_rationale_https___libero_it: {
      message: 'Web portal',
    },
    RWS_rationale_https___supereva_it: {
      message: 'Gossip web site',
    },
    RWS_rationale_https___iolam_it: {
      message: 'Used for personalization purposes',
    },
    RWS_rationale_https___rws2nvtvt_com: {
      message: 'Test 1',
    },
    RWS_rationale_https___rws3nvtvt_com: {
      message: 'Test 2',
    },
    RWS_rationale_https___stripecdn_com: {
      message:
        'Serves static assets accelerating page loads and sandboxes select Javascript',
    },
    RWS_rationale_https___stripe_network: {
      message: 'Receives telemetry preventing fraud across Stripe services',
    },
    RWS_rationale_https___reshim_org: {
      message: 'Silent login',
    },
    RWS_rationale_https___human_talk_org: {
      message: 'Silent login',
    },
    RWS_rationale_https___yandex_ru: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___yandex_net: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___yastatic_net: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___auto_ru: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___kinopoisk_ru: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___clck_ru: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___webvisor_com: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___turbopages_org: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___edadeal_ru: {
      message: 'Yandex owned website',
    },
    RWS_rationale_https___standardsandpraiserepurpose_com: {
      message: 'Publisher #1 for RWS Test',
    },
    RWS_rationale_https___technology_revealed_com: {
      message: 'Frequency Capping Domain #1 for RWS Test',
    },
    RWS_rationale_https___startupislandtaiwan_net: {
      message: 'Domain alias',
    },
    RWS_rationale_https___startupislandtaiwan_org: {
      message: 'Domain alias',
    },
    RWS_rationale_https___noticiascaracol_com: {
      message:
        'Informative news show that covers the most important events in Colombia and around the world, owned by Valorem business group.',
    },
    RWS_rationale_https___bluradio_com: {
      message:
        'Blu Radio is a Colombian radio network, owned by Valorem business group.',
    },
    RWS_rationale_https___shock_co: {
      message:
        'It is a media outlet that publishes specialized content daily about music, movies, and television series. Owned by Valorem business group.',
    },
    RWS_rationale_https___bumbox_com: {
      message:
        'Podcast platform from the media group of Caracol Televisión, El Espectador, and Blu Radio. Owned by Valorem business group.',
    },
    RWS_rationale_https___hjck_com: {
      message:
        "It's a private Colombian radio station with a cultural programming. It belongs to the Valorem business group.",
    },
    RWS_rationale_https___firstlook_biz: {
      message: 'Presents core reports and SSO auth flow',
    },
    RWS_rationale_https___wordle_at: {
      message:
        'We are migrating our domain and will soon redirect all traffic from here to the primary, both of which we own. The two sites are almost identical. For convenience we want to transfer session cookies so users stay logged in.',
    },
    RWS_rationale_https___blackrockadvisorelite_it: {
      message:
        'A site for Italian investment professionals. The branding is clearly visible on the site.',
    },
    RWS_rationale_https___cachematrix_com: {
      message:
        'Cachematrix is a cash management firm acquired by BlackRock. The relationship is described on the About Us page.',
    },
    RWS_rationale_https___efront_com: {
      message:
        "eFront is BlackRock's alternative solutions platform. The BlackRock branding is clearly visible on the site.",
    },
    RWS_rationale_https___etfacademy_it: {
      message:
        'An Italian language education site about ETFs. The iShares by BlackRock branding is clearly visible on the site.',
    },
    RWS_rationale_https___ishares_com: {
      message:
        "iShares is BlackRock's ETF brand. The branding is clearly visible on the site.",
    },
    RWS_rationale_https___zdrowietvn_pl: {
      message:
        'Educational service that is owned by TVN S.A.. Information about the connection with TVN is included in the footer of this website',
    },
    RWS_rationale_https___tvn24_pl: {
      message:
        'News service that is owned by TVN S.A.. Information about the connection with TVN is included in the footer of this website',
    },
    RWS_rationale_https___zingmp3_vn: {
      message: 'Music Website owned by Zalo Group, VNG',
    },
    RWS_rationale_https___baomoi_com: {
      message: 'News Website owned by Zalo Group, VNG',
    },
    RWS_rationale_https___smoney_vn: {
      message: 'News Website owned by Zalo Group, VNG',
    },
    OCD___eoi_description: {
      message:
        'This cookie is used for security authenticate users, prevent fraud, and protect users as they interact with a service.',
    },
    OCD_retention_3_Months: {
      message: '3 Months',
    },
    OCD_pm_sess_description: {
      message:
        "This cookie is used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user's choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user's session, such as the content of a shopping cart.",
    },
    OCD_pm_sess_NNN_description: {
      message:
        "This cookie is used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user's choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user's session, such as the content of a shopping cart.",
    },
    OCD_aboutads_sessNNN_description: {
      message:
        'This cookie is used for security authenticate users, prevent fraud, and protect users as they interact with a service.',
    },
    OCD_ANID_description: {
      message:
        "Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user's choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user's session, such as the content of a shopping cart.",
    },
    OCD_GA_OPT_OUT_description: {
      message:
        "Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user's choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user's session, such as the content of a shopping cart.",
    },
    OCD_retention_10_Nov_2030: {
      message: '10 Nov 2030',
    },
    OCD_Conversion_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD__opt_awkid_description: {
      message:
        "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
    },
    OCD__opt_awgid_description: {
      message:
        "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
    },
    OCD__opt_awmid_description: {
      message:
        "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
    },
    OCD__gaexp_rc_description: {
      message:
        "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
    },
    OCD__opt_awcid_description: {
      message:
        "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
    },
    OCD_PAIDCONTENT_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD_retention_30_Days: {
      message: '30 Days',
    },
    OCD__opt_expid_description: {
      message:
        "Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user's experience.",
    },
    OCD__gcl_ha_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD_retention_90_Days: {
      message: '90 Days',
    },
    OCD__gcl_gf_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD__gcl_aw_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD__gcl_gb_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD__gac_gb___description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD_FPGCLGB_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD_FPGCLAW_description: {
      message:
        'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at g.co/adsettings), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
    },
    OCD_SNID_description: {
      message:
        'This cookie is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD_cookies_accepted_description: {
      message:
        'This functionality cookie is simply to verify that you have allowed us to set cookies on your machine',
    },
    OCD_django_language_description: {
      message:
        'Cookie necessary for the use of the options and services of the website.',
    },
    OCD_retention_3_month: {
      message: '3 month',
    },
    OCD_GN_PREF_description: {
      message:
        'This cookie is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD_OSID_description: {
      message:
        'This cookie is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD___Secure_OSID_description: {
      message:
        'This cookie is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD_LSID_description: {
      message:
        'This cookie is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD_COMPASS_description: {
      message:
        'This cookie is used to collect website statistics and track conversion rates and Google ad personalisation',
    },
    OCD_UULE_description: {
      message:
        'sends precise location information from your browser to Googles servers so that Google can show you results that are relevant to your location. The use of this cookie depends on your browser settings and whether you have chosen to have location turned on for your browser.',
    },
    OCD_retention_1825_days: {
      message: '1825 days',
    },
    OCD_hjViewportId_description: {
      message:
        'This cookie stores user viewport details such as size and dimensions.',
    },
    OCD__hjSessionStorageTest_description: {
      message:
        'This cookie checks if the Hotjar Tracking Code can use Session Storage. If it can, a value of 1 is set.',
    },
    OCD__hjCookieTest_description: {
      message:
        'This cookie checks to see if the Hotjar Tracking Code can use cookies. If it can, a value of 1 is set.',
    },
    OCD_taboola_select_description: {
      message:
        'Maintains a record of whether the user performed an action in the “Taboola Select” feature.',
    },
    OCD_taboola_fp_td_user_id_description: {
      message:
        'Indicates that the user clicked on an item that was recommended by Taboola’s Services. This is used for reporting and analytics purposes.',
    },
    OCD_trc_cookie_storage_description: {
      message:
        'Assigns a unique User ID that is used for attribution and reporting purposes.',
    },
    OCD__tb_sess_r_description: {
      message:
        'Used on websites of our publisher Customers that utilize the Taboola Newsroom services. It maintains a session reference about the user’s visit to this particular website.',
    },
    OCD__tb_t_ppg_description: {
      message:
        'Used on websites of our publisher Customers that utilize the Taboola Newsroom services. This cookie is used to identify the referring website (i.e. the website that the user visited prior to arriving at this publisher’s website).',
    },
    OCD_abLdr_description: {
      message:
        'Supports routine technical and performance improvements for Taboola’s browser-based Services.',
    },
    OCD_abMbl_description: {
      message:
        '\tSupports routine technical and performance improvements for Taboola’s mobile SDK Services.',
    },
    OCD_tb_click_param_description: {
      message:
        'Used on websites of our publisher Customers that utilize the Taboola Newsroom services. It measures performance of the publisher’s homepage articles that are clicked.',
    },
    OCD_retention_50_seconds: {
      message: '50 seconds',
    },
    OCD_OneTrustWPCCPAGoogleOptOut_description: {
      message:
        'This cookie is set by OneTrust. It is used to honor IAB CCPA laws for consent.',
    },
    OCD_FunctionalCookie_description: {
      message:
        'This cookie works with the OneTrust Cookie Management Platform to activate scripts and cookies associated with the Functional Cookies category, when the user gives appropriate consent.',
    },
    OCD_retention_0_days: {
      message: '0 days',
    },
    OCD_adaptv_unique_user_cookie_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_cmp_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_adsrcvw1_description: {
      message:
        "These cookies are only used with your consent. You can give or withdraw your consent on the third party's site or app.",
    },
    OCD_migrated2y_description: {
      message:
        'These cookies are only used as migration indication for old cookies',
    },
    OCD_OTH_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_rtbData0_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_rxx_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_tearsheet_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_unique_ad_source_impression_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_axids_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_GUC_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_tbla_id_description: {
      message:
        'This cookie is used to collect information on a visitor. This information will become an ID string with information on a specific visitor – ID information strings can be used to target groups with similar preferences, or can be used by third-party domains or ad-exchanges.',
    },
    OCD_mics_vid_description: {
      message:
        'This Cookie is required by mediarithmics third-party cookie identifier',
    },
    OCD_mics_uaid_description: {
      message:
        'This cookie is an Legacy cookie added by mediarithmics that will be deprecated',
    },
    OCD_mics_lts_description: {
      message:
        'This cookie is added by mediarithmics which determines the last time the browser has been seen',
    },
    OCD_n360_thirtythreeacross_description: {
      message:
        'This cookie is used to pre-bid on 33Across by Nexx360 Header Bidding.',
    },
    OCD_n360_appnexus_description: {
      message:
        'This cookie is used to pre-bid on Xandr by Nexx360 Header Bidding.',
    },
    OCD_n360_bliink_description: {
      message:
        'This cookie is used to pre-bid on Bliink by Nexx360 Header Bidding.',
    },
    OCD_n360_amx_description: {
      message:
        'This cookie is used to pre-bid on AdaptMX by Nexx360 Header Bidding.',
    },
    OCD_n360_adform_description: {
      message:
        'This cookie is used to pre-bid on Adform by Nexx360 Header Bidding.',
    },
    OCD_n360_adnuntius_description: {
      message:
        'This cookie is used to pre-bid on Adnuntius by Nexx360 Header Bidding.',
    },
    OCD_n360_adot_description: {
      message:
        'This cookie is used to pre-bid on Adot by Nexx360 Header Bidding.',
    },
    OCD_n360_adyoulike_description: {
      message:
        'This cookie is used to pre-bid on Adyoulike by Nexx360 Header Bidding.',
    },
    OCD_n360_connectad_description: {
      message:
        'This cookie is used to pre-bid on ConnectAd by Nexx360 Header Bidding.',
    },
    OCD_n360_conversant_description: {
      message:
        'This cookie is used to pre-bid on Conversant by Nexx360 Header Bidding.',
    },
    OCD_n360_cwire_description: {
      message:
        'This cookie is used to pre-bid on Cwire by Nexx360 Header Bidding.',
    },
    OCD_n360_firstid_description: {
      message:
        'This cookie is used to pre-bid on First ID by Nexx360 Header Bidding.',
    },
    OCD_n360_freewheel_description: {
      message:
        'This cookie is used to pre-bid on Freewheel by Nexx360 Header Bidding.',
    },
    OCD_n360_fueldigitalmedia_description: {
      message:
        'This cookie is used to pre-bid on Fuel Digital Media by Nexx360 Header Bidding.',
    },
    OCD_n360_fueldigitalix_description: {
      message:
        'This cookie is used to pre-bid on Fuel Digital (IX) by Nexx360 Header Bidding.',
    },
    OCD_n360_fueldigital_description: {
      message:
        'This cookie is used to pre-bid on Fuel Digital (Smart)by Nexx360 Header Bidding.',
    },
    OCD_n360_gingerad_description: {
      message:
        'This cookie is used to pre-bid on GingerAd by Nexx360 Header Bidding.',
    },
    OCD_n360_goodad_description: {
      message:
        'This cookie is used to pre-bid on GoodAd by Nexx360 Header Bidding.',
    },
    OCD_n360_gravity_description: {
      message:
        'This cookie is used to pre-bid on Gravity by Nexx360 Header Bidding.',
    },
    OCD_n360_groupm_description: {
      message:
        'This cookie is used to pre-bid on GroupM by Nexx360 Header Bidding.',
    },
    OCD_n360_improve_description: {
      message:
        'This cookie is used to pre-bid on Improve by Nexx360 Header Bidding.',
    },
    OCD_n360_ix_description: {
      message:
        'This cookie is used to pre-bid on Index by Nexx360 Header Bidding.',
    },
    OCD_n360_medianet_description: {
      message:
        'This cookie is used to pre-bid on Media.net by Nexx360 Header Bidding.',
    },
    OCD_n360_moneytag_description: {
      message:
        'This cookie is used to pre-bid on Moneytag by Nexx360 Header Bidding.',
    },
    OCD_n360_nextmillennium_description: {
      message:
        'This cookie is used to pre-bid on NextMillennium by Nexx360 Header Bidding.',
    },
    OCD_n360_onetag_description: {
      message:
        'This cookie is used to pre-bid on OneTag by Nexx360 Header Bidding.',
    },
    OCD_n360_openx_description: {
      message:
        'This cookie is used to pre-bid on OpenX by Nexx360 Header Bidding.',
    },
    OCD_n360_outbrain_description: {
      message:
        'This cookie is used to pre-bid on Outbrain by Nexx360 Header Bidding.',
    },
    OCD_n360_plista_description: {
      message:
        'This cookie is used to pre-bid on Plista by Nexx360 Header Bidding.',
    },
    OCD_n360_pubmatic_description: {
      message:
        'This cookie is used to pre-bid on Pubmatic by Nexx360 Header Bidding.',
    },
    OCD_n360_pulsepoint_description: {
      message:
        'This cookie is used to pre-bid on PulsePoint by Nexx360 Header Bidding.',
    },
    OCD_n360_quantum_description: {
      message:
        'This cookie is used to pre-bid on Quantum by Nexx360 Header Bidding.',
    },
    OCD_n360_richaudience_description: {
      message:
        'This cookie is used to pre-bid on RichAudience by Nexx360 Header Bidding.',
    },
    OCD_n360_rtbhouse_description: {
      message:
        'This cookie is used to pre-bid on RTB House by Nexx360 Header Bidding.',
    },
    OCD_n360_rubicon_description: {
      message:
        'This cookie is used to pre-bid on Rubicon (Magnite) by Nexx360 Header Bidding.',
    },
    OCD_n360_sharethrough_description: {
      message:
        'This cookie is used to pre-bid on Sharethrough by Nexx360 Header Bidding.',
    },
    OCD_n360_smaato_description: {
      message:
        'This cookie is used to pre-bid on Smaato by Nexx360 Header Bidding.',
    },
    OCD_n360_smartadserver_description: {
      message:
        'This cookie is used to pre-bid on Smart (Equativ) by Nexx360 Header Bidding.',
    },
    OCD_n360_smartyads_description: {
      message:
        'This cookie is used to pre-bid on SmartyAds by Nexx360 Header Bidding.',
    },
    OCD_n360_smilewanted_description: {
      message:
        'This cookie is used to pre-bid on Smilewanted by Nexx360 Header Bidding.',
    },
    OCD_n360_staila_description: {
      message:
        'This cookie is used to pre-bid on Staila by Nexx360 Header Bidding.',
    },
    OCD_n360_tappx_description: {
      message:
        'This cookie is used to pre-bid on TappX by Nexx360 Header Bidding.',
    },
    OCD_n360_mediagrid_description: {
      message:
        'This cookie is used to pre-bid on The MediaGrid by Nexx360 Header Bidding.',
    },
    OCD_n360_ttd_description: {
      message:
        'This cookie is used to pre-bid on The Trade Desk by Nexx360 Header Bidding.',
    },
    OCD_n360_traffective_description: {
      message:
        'This cookie is used to pre-bid on Traffective by Nexx360 Header Bidding.',
    },
    OCD_n360_triplelift_description: {
      message:
        'This cookie is used to pre-bid on Triplelift by Nexx360 Header Bidding.',
    },
    OCD_n360_yahoo_description: {
      message:
        'This cookie is used to pre-bid on Verizon (Yahoo) by Nexx360 Header Bidding.',
    },
    OCD_n360_vidoomy_description: {
      message:
        'This cookie is used to pre-bid on Vidoomy by Nexx360 Header Bidding.',
    },
    OCD_n360_yieldlab_description: {
      message:
        'This cookie is used to pre-bid on Yieldlab by Nexx360 Header Bidding.',
    },
    OCD_mv_tokens_description: {
      message:
        'Sets a unique ID for the visitor that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs which facilitates real-time bidding for advertisers.',
    },
    OCD_mv_tokens_invalidate_verizon_pushes_description: {
      message:
        'Sets a unique ID for the visitor that allows third party advertisers to target the visitor with relevant advertisement. This pairing service is provided by third party advertisement hubs which facilitates real-time bidding for advertisers.',
    },
    OCD_am_tokens_description: {
      message:
        'Presents the user with relevant content and advertisement. The service is provided by third-party advertisement hubs which facilitate real-time bidding for advertisers.',
    },
    OCD_am_tokens_invalidate_verizon_pushes_description: {
      message:
        'Presents the user with relevant content and advertisement. The service is provided by third-party advertisement hubs which facilitate real-time bidding for advertisers.',
    },
    OCD__bit_description: {
      message:
        'This cookie is a unique identifier assigned to the user to track your use of bit.ly. Information collected includes your IP address.',
    },
    OCD_ptrcriteo_description: {
      message:
        'This cookie is used to establishes a unique identifier for the visitor that allows external advertisers (third parties) to target the visitor with relevant advertising. This combined service is provided by advertising hubs, which provide real-time offers to advertisers.',
    },
    OCD_ptrrhs_description: {
      message:
        'This cookie is used to identify, session length, IP address, location, time of usage, viewed pages and files, your advertising campaign selections, and other information regarding your use of the Website.',
    },
    OCD_yieldmo_id_description: {
      message:
        "Yieldmo only tracks using device identifiers and so all requests must include your device's Advertising ID or the 'yieldmo_id' cookie of the device related to the request. Requests submitted without a device identifier cannot be processed.",
    },
    OCD_ssid_description: {
      message:
        'This cookie is associated with SpringServe. It is used for serving video ads.',
    },
    OCD_sst_description: {
      message:
        'This cookie is associated with SpringServe. It is used for serving video ads.',
    },
    OCD_dgzsdl08v4_description: {
      message:
        'This cookie provides enhanced functionality and ads personalisation',
    },
    OCD_bounceClientVisit_description: {
      message:
        'This cookie is used to remember user web browsing activity and may be used to understand about your demographics, such as age and gender',
    },
    OCD__vfa_description: {
      message:
        'This cookie is used to stores user and session identifiers for analytics.',
    },
    OCD__vfb_description: {
      message:
        'This cookie is used to stores recirculation data for analytics.',
    },
    OCD__vfz_description: {
      message: 'This cookie is used to stores referral data for analytics',
    },
    OCD_retention_6_minutes: {
      message: '6 minutes',
    },
    OCD__vf_rd_test__description: {
      message:
        'This cookie is used to test best domain name (SLD+TLD) to set cookies at.',
    },
    OCD_retention_1_second: {
      message: '1 second',
    },
    OCD_VfSess_description: {
      message: 'This cookie is used to session identifier for authentication',
    },
    OCD_VfRefresh_description: {
      message: 'This cookie is used to refresh identifier for authentication',
    },
    OCD_VfAccess__description: {
      message: 'This cookie is used to access identifier for authentication',
    },
    OCD_vfThirdpartyCookiesEnabled_description: {
      message:
        'This cookie is used to testing if 3rd party cookies are supported',
    },
    OCD_ttbprf_description: {
      message: 'This cookie is used for user segmentation',
    },
    OCD_ttc_description: {
      message:
        'This cookie is used for user segmentation with user´s cache expiration',
    },
    OCD_ttnprf_description: {
      message: 'This cookie is used for user segmentation',
    },
    OCD_n_description: {
      message:
        'This cookie is used for user segmentation with timestamp from the latest access',
    },
    OCD_trk_description: {
      message: 'This cookie is used for deliver ads',
    },
    OCD_ttca_description: {
      message: "This cookie is used for deliver ads with users'conversion data",
    },
    OCD_tp__description: {
      message:
        'This cookie is used for deliver ads, using synchronous id for DSP',
    },
    OCD_ttgcm_description: {
      message: 'This cookie is used for sync with Google services',
    },
    OCD__ut__description: {
      message:
        'This cookie is used to uniquely identify the same user on the different domains',
    },
    OCD__u__description: {
      message:
        'This cookie is used to uniquely identify the same user on the different domains',
    },
    OCD__s__description: {
      message: 'This cookie is used to store for temporary session',
    },
    OCD__lv__description: {
      message: 'This cookie is used to store for last visit',
    },
    OCD__nrbi_description: {
      message:
        'This cookie is used to store user data for the Cookie Management Platform',
    },
    OCD_compass_sid_description: {
      message: 'This cookie is used to store Marfeel session id.',
    },
    OCD_compass_uid_description: {
      message: 'This cookie is used to store Marfeel user id',
    },
    OCD____m_rec_description: {
      message: 'This cookie is used to store data about recirculation module',
    },
    OCD_GRV_BHV_UID__description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_GRV_BHV_IDCC__description: {
      message: "This cookie is used to store the user's geographical location",
    },
    OCD_GRV_BHV_SKU__description: {
      message: 'This cookie is used to store SKU of user',
    },
    OCD_GRV_BHV_IDCAT__description: {
      message: 'This cookie is used to uniqiue identifier.',
    },
    OCD_GRV_BHV_DATE__description: {
      message: 'This cookie is used to store Date for user perfernces.',
    },
    OCD_GRV_IDU_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_retention_296_days: {
      message: '296 days',
    },
    OCD_NPA__description: {
      message: "This cookie is used to store the user's browsing history",
    },
    OCD_GRV_BHV_BRND___description: {
      message: "This cookie is used to brand of user's perfernces",
    },
    OCD_GRV_google_description: {
      message: "This cookie is used to store user's google search history",
    },
    OCD_duid_update_time_description: {
      message:
        "Registers a unique ID that identifies the user's device during return visits. Used for conversion tracking and to measure the efficacy of online ads.",
    },
    OCD__ssp_update_time__description: {
      message: 'This cookie is used to store unique identifiers timestamp',
    },
    OCD__dsp_uid__description: {
      message: 'This cookie is used to store unique identifiers',
    },
    OCD_connect_sid_description: {
      message:
        'This is used for user sessions and is strictly necessary for the Community. Session cookies allow websites to remember users within a website when they move between web pages. These cookies tell the server what pages to show the user so the user doesn’t have to remember where they left off or start navigating the site all over again.',
    },
    OCD__zendesk_cookie_description: {
      message:
        'This cookie saves arbitrary preference settings. Two factor authentication features and device tracking will not work without it.',
    },
    OCD_zte2095_description: {
      message:
        'This cookie is used to identify the domain/subdomain the Chat Widget is located on.',
    },
    OCD___zlcprivacy_description: {
      message: "This cookie store visitor's decision on CookieLaw",
    },
    OCD__answer_bot_service_session_description: {
      message:
        'This cookie stores unique session key for Answer Bot product. Used to uniquely identify a user session when using Answer Bot Article Recommendations.',
    },
    OCD_ZD_zE_oauth_description: {
      message:
        'This cookie stores the authentication token once the user has been authenticated.Web Widget (Classic) offers pre-built API functionality for cookie consent; see here: Web Widget (Classic) Cookie Permission in Developer Center. Alternatively, these Cookies respect external cookie bot functionality as well.',
    },
    OCD__zendesk_session_description: {
      message:
        'This cookie stores account ID, route for internal service calls and the cross-site request forgery token.',
    },
    OCD_retention_8_hours: {
      message: '8 hours',
    },
    OCD_zendesk_thirdparty_test_description: {
      message:
        'This cookie stores account ID, route for internal service calls and the cross-site request forgery token.',
    },
    OCD__zendesk_shared_session_description: {
      message: 'This cookie is used for authentication and set to be anonymous',
    },
    OCD__zendesk_authenticated_description: {
      message:
        'This is a flag set when a user is authenticated to display the most up to date content.',
    },
    OCD__help_center_session_description: {
      message:
        'This cookie stores unique session key for Help Center Functionality.',
    },
    OCD_help_center_data_description: {
      message:
        'This cookie stores the text string of an end-user’s search term in the Help Center Functionality. It stores this so that it can check whether a ticket was created after that term was searched. A user identifier is not stored so it is not possible to specify which user completed the search at the time of reporting.',
    },
    OCD_retention_48_hours: {
      message: '48 hours',
    },
    OCD__zdshared_user_session_analytics_description: {
      message:
        'This cookie is Used to track information about visits for analytics purposes.',
    },
    OCD__zendesk_nps_session_description: {
      message:
        'This cookie stores a unique key for a session, for landing page after responding to an NPS survey (if enabled)',
    },
    OCD_ZD_settings_description: {
      message:
        "This cookie stores a hash of settings so that we don't keep sending requests to our backend.",
    },
    OCD_ZD_suid_description: {
      message:
        'This cookie is used to create a sessionId and track analytics events for pages that load a Web Widget on them.',
    },
    OCD_ZD_buid_description: {
      message:
        'This cookie is used to create a deviceId and track analytics events for pages that load a Web Widget on them.',
    },
    OCD_ZD_store_description: {
      message:
        'This cookie ensures consistent presentation of the Web Widget (Classic) when an End-User navigates to a new web page.',
    },
    OCD_ZD_widgetOpen_description: {
      message:
        'This cookie maintains the open/closed state of the Web Widget across page visits.',
    },
    OCD_ZD_launcherLabelRemoved_description: {
      message:
        'If the end user chooses to dismiss the launcher label, then we store this value to ensure that the message is not displayed again on other pages.',
    },
    OCD__zdsession_talk_embeddables_service_description: {
      message: 'This cookie is used for load balancing.',
    },
    OCD_RT_description: {
      message:
        'This cookie is used to identify the visitor through an application. This allows the visitor to login to a website through their LinkedIn application for example.',
    },
    OCD_retention_399_days: {
      message: '399 days',
    },
    OCD_TADCID_description: {
      message:
        'This cookie is used for viewing embedded content from TripAdvisor, including payment of referral commission fees and user tracking across websites.',
    },
    OCD_ServerPool_description: {
      message:
        'This cookie is generally provided by TripAdvisor and is used for advertising purposes.',
    },
    OCD_TATravelInfo_description: {
      message:
        'This cookie is used to track visitors across websites to build a profile of search and browsing history.',
    },
    OCD_TAUnique_description: {
      message:
        'This cookie is used to track visitors across websites to build a profile of search and browsing history.',
    },
    OCD_TAReturnTo_description: {
      message:
        'This cookies is used by TripAdvisor to track the return-to URL after authentication',
    },
    OCD_dt_description: {
      message:
        'This cookie is set by AddThis to allow website visitors to share content on various social networks.',
    },
    OCD_rtbh_description: {
      message:
        "This cookie is used to  place digital advertising from their Marketing partners on their Publishers' websites via ad placements",
    },
    OCD_udmts_description: {
      message:
        "This cookie is used to  place digital advertising from their Marketing partners on their Publishers' websites via ad placements",
    },
    OCD_retention_89_days: {
      message: '89 days',
    },
    OCD_api_token_description: {
      message:
        'This cookies is necessary for the implementation of video-content on the website.',
    },
    OCD_retention_3652_days: {
      message: '3652 days',
    },
    OCD_unique_id_description: {
      message:
        'This cookie is associated with twitch.com. It preserves the user state across page requests.',
    },
    OCD_unique_id_durable_description: {
      message:
        'This cookie is associated with twitch.com. It allows the host domain to remember the choices you make on the Twitch Services and to provide enhanced and more personalized features, such as customising a webpage, remembering if the host domain has asked you to participate in a promotion and for other services you request, like watching a video or commenting on a blog.',
    },
    OCD_session_unique_id_description: {
      message:
        'This cookie is use for Twitch.tv which is an online service used for watching or broadcasting live or prerecorded videos across topics such as cooking, travel, art, sports, and video games.',
    },
    OCD_server_session_id_description: {
      message:
        'This cookie is associated with twitch.com. It allows the host domain to remember the choices you make on the Twitch Services and to provide enhanced and more personalized features, such as customising a webpage, remembering if the host domain has asked you to participate in a promotion and for other services you request, like watching a video or commenting on a blog.',
    },
    OCD_twitch_lohp_countryCode_description: {
      message: 'This cookie is used for country determination',
    },
    OCD_retention_3650_days: {
      message: '3650 days',
    },
    OCD_enable_compact_scene_listing_description: {
      message: 'This cookie is used to store user preference',
    },
    OCD_videoChat_notice_dismissed_description: {
      message: 'This cookie is used to store user preference',
    },
    OCD_chat_rules_shown_description: {
      message: 'This cookie is used to store user preference',
    },
    OCD_algoliasearch_client_js_description: {
      message: 'This cookie is used for search optimization',
    },
    OCD_device_id_description: {
      message:
        'This cookie is An ID that uniquely identifies the device the user is using.',
    },
    OCD_referrer_url_description: {
      message:
        'This cookie detects how the user reached the website by registering their last URL-address.',
    },
    OCD_sentry_device_id_description: {
      message: 'This cookie Preserves users states across page requests.',
    },
    OCD_session_storage_last_visited_twitch_url_description: {
      message:
        "This cookie stores the user's video player preferences using embedded Twitch video",
    },
    OCD_local_storage_app_session_id_description: {
      message: 'This cookie preserves users states across page requests.',
    },
    OCD__ceir_description: {
      message:
        'This cookie tracks whether a visitor has visited the site before',
    },
    OCD__CEFT_description: {
      message:
        'This cookie stores page variants assigned to visitors for A/B performance testing',
    },
    OCD__cer_v_description: {
      message:
        '(Old tracking script) Track whether a visitor has visited the site before',
    },
    OCD__ce_s_description: {
      message:
        'This cookie tracks a recording visitor session unique ID, tracking host and start time',
    },
    OCD__ce_cch_description: {
      message: 'This cookie is used to check if cookies can be added.',
    },
    OCD__ce_gtld_description: {
      message: 'This cookie is used to identify the top level domain.',
    },
    OCD_ce_need_secure_cookie_description: {
      message: 'This cookie is used to determine cookie security parameters.',
    },
    OCD_ce_successful_csp_check_description: {
      message:
        'This cookie is used to determine if the page has a Content Security Policy rule that would prevent tracking.',
    },
    OCD_cebs_description: {
      message:
        'This cookie is used to track the current user session internally.',
    },
    OCD_cebsp__description: {
      message:
        'This cookie is used to track the current user session internally.',
    },
    OCD__ce_clock_event_description: {
      message: 'This cookie prevents repeated requests to the Clock API.',
    },
    OCD_retention_1_Day: {
      message: '1 Day',
    },
    OCD__ce_clock_data_description: {
      message:
        "This cookie stores the difference in time from the server's time and the current browser.",
    },
    OCD__ce_irv_description: {
      message: 'This cookie used to store isReturning value during the session',
    },
    OCD_ceft_variant_override_description: {
      message: 'This cookie stores forced variant id',
    },
    OCD__crazyegg_description: {
      message:
        'This cookie remembers information related to marketing page features.',
    },
    OCD_ce_login_description: {
      message: 'This cookie remembers the last email address you used to login',
    },
    OCD_ce_signup_flow_description: {
      message: 'This cookie remembers the signup flow you saw',
    },
    OCD_ce_signup_partner_description: {
      message:
        'This cookie remembers the signup partner you were referred from',
    },
    OCD_ceac_description: {
      message: 'This cookie stores the Account ID number',
    },
    OCD_cean_description: {
      message: 'This cookie stores the Anonymous ID number',
    },
    OCD_cehc_description: {
      message:
        "This cookie shares user information with CrazyEgg's Help Center",
    },
    OCD_celi_description: {
      message: 'This cookie stores the logged-in Status',
    },
    OCD_cean_assoc_description: {
      message:
        'This cookie stores the associates Anonymous ID with logged-in user',
    },
    OCD_first_snapshot_url_description: {
      message:
        'This cookie stores the website URL used to create first Snapshot',
    },
    OCD_sharing___description: {
      message: 'This cookie stores the shared item code',
    },
    OCD_ce_sid_description: {
      message: 'This cookie stores the identify logged-in users',
    },
    OCD_cecu_description: {
      message: 'This cookie stores the identify logged-in users',
    },
    OCD_TiPMix_description: {
      message:
        'Registers which server-cluster is serving the visitor. This is used in context with load balancing, in order to optimize user experience.',
    },
    OCD_retention_0_day: {
      message: '0 day',
    },
    OCD_x_ms_routing_name_description: {
      message:
        'Registers which server-cluster is serving the visitor. This is used in context with load balancing, in order to optimize user experience.',
    },
    OCD__distillery_description: {
      message:
        'This cookie is used by the Wistia video player to remember where you are in a video so that if playback is interrupted (for example, by losing your internet connection) then you can get right back to where you left off.',
    },
    OCD_muxData_description: {
      message:
        'This cookie is used by the Wistia video player to remember where you are in a video so that if playback is interrupted (for example, by losing your internet connection) then you can get right back to where you left off.',
    },
    OCD_wistia_http2_push_disabled_description: {
      message:
        'This cookie supports performance tracking by Wistia for their Analytics, so we can see how often videos were watched and how users interacted with video functionality.',
    },
    OCD_retention_2_Weeks: {
      message: '2 Weeks',
    },
    OCD__simplex_description: {
      message:
        'Cookie by Wistia for storing user’s referrer and landing paged details.',
    },
    OCD_wistia_description: {
      message: 'This is a cookie required for the video player to work.',
    },
    OCD_wistia_video_progress___description: {
      message: 'This is a cookie required for the video player to work.',
    },
    OCD___uin_rh_description: {
      message:
        'This domain is owned by Sonobi, an automated online advertising buying and selling platform.',
    },
    OCD_retention_364_Days: {
      message: '364 Days',
    },
    OCD___uir_rh_description: {
      message:
        'This domain is owned by Sonobi, an automated online advertising buying and selling platform.',
    },
    OCD_retention_32_Days: {
      message: '32 Days',
    },
    OCD_HAPLB3A_description: {
      message:
        'This domain is owned by Sonobi, an automated online advertising buying and selling platform.',
    },
    OCD_SSPR___description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SSPZ_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_DSP2F___description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_ADKUID_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SCM_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SCMaps_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SCMsovrn_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SCMinf_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SCMo_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SCMg_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_SCM__description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_UID_EXT___description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_UTID_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_UTID_ENC_description: {
      message: "This cookie is used to store the user's unique identifier",
    },
    OCD_DYID_description: {
      message:
        'A Dynamic Yield unique identifier that operates as a key for personalization.',
    },
    OCD__dyid_description: {
      message:
        'A Dynamic Yield unique identifier that operates as a key for personalization.',
    },
    OCD__dyid_server_description: {
      message:
        'A Dynamic Yield unique identifier that operates as a key for personalization.',
    },
    OCD_DYSES_description: {
      message:
        'A Dynamic Yield unique identifier that operates as a key for personalization.',
    },
    OCD__dyjsession_description: {
      message:
        'A Dynamic Yield unique identifier that operates as a key for personalization.',
    },
    OCD__dy_csc_ses_description: {
      message: 'This cookie tracks when a user closes their browser.',
    },
    OCD__dycmc_description: {
      message:
        "This cookie maintains a simple heuristic that detects users who actively delete cookies (cookie deleters). The 'cookie deleter' markup is collected within the reported page visit data.",
    },
    OCD__dycnst_description: {
      message:
        'This cookie is used to remember user cookie consent preferences.',
    },
    OCD__dy_lu_ses_description: {
      message:
        'This cookie determines the first page URL a user comes from, and its validity.',
    },
    OCD__dy_df_geo_description: {
      message:
        'This cookie is used for audience creation purposes to store geographical location data (country, state, city).',
    },
    OCD__dy_geo_description: {
      message:
        'This cookie is for audience creation purposes to store geographical location data (country, continent, area, city).',
    },
    OCD__dycst_description: {
      message:
        'This cookie is used for audience creation purposes to collect data about the user-agent and associated window size.',
    },
    OCD__dy_ses_load_seq_description: {
      message:
        'This cookie is used for experimentation and A/B testing purposes, to detect browser sessions.',
    },
    OCD__dy_soct_description: {
      message:
        'This cookie controls the frequency of periodically-activated campaigns. Without this cookie, periodically-activated campaigns would be either disabled or executed upon every page load.',
    },
    OCD__dy_toffset_description: {
      message:
        "This cookie validates the user's clock drift (for computers that don't sync their clock with the internet).",
    },
    OCD_dy_fs_page_description: {
      message:
        'This cookie indicates the URL of the first page a user visits when they start a session on a website, and targets a user by the first page of their session.',
    },
    OCD__dy_cs_storage_items_description: {
      message:
        'This cookie is used for proprietary custom implementation on your website, for Dynamic Yield campaigns to operate correctly.',
    },
    OCD__dy_cs_cookie_items_description: {
      message:
        'This cookie is used for proprietary custom implementation on your website, for Dynamic Yield campaigns to operate correctly.',
    },
    OCD_ckid_description: {
      message:
        "‍This cookie is an identifier (ID) provided by the user's internet browser and is used to match the user with relevant products in marketing campaigns.",
    },
    OCD_hash_description: {
      message:
        '‍Is a randomly generated identifier (ID) that ensures the impossibility of identifying a user, precisely to maintain their anonymity. The ID is generated from the ckid.',
    },
    OCD_BLUEID_description: {
      message:
        '‍Identifier (ID) generated by Blue to ensure that a user is not identified more than once and generates duplication in the system, even if he/she leaves the internet browser and generates another browsing session.',
    },
    OCD_ig_did_description: {
      message:
        'This is a targeting cookie used to track Instagram user visits.',
    },
    OCD_retention_9_years: {
      message: '9 years',
    },
    OCD_ig_cb_description: {
      message:
        'This cookie enables the correct functionality of the Instagram plugins, such as embedded Instagram posts',
    },
    OCD_ds_user_id_description: {
      message:
        'This is a targeting cookie used to optimize advertising on Instagram.',
    },
    OCD_mid_description: {
      message:
        'This is a functionality cookie used to optimize the use of Instagram on the website',
    },
    OCD_fbm___description: {
      message:
        'This is a targeting cookie used to track Instagram user visits.',
    },
    OCD_shbid_description: {
      message:
        'This is a targeting cookie used to optimize advertising on Instagram.',
    },
    OCD_shbts_description: {
      message:
        'This is a targeting cookie used to optimize advertising on Instagram.',
    },
    OCD_sessionid_description: {
      message:
        'This is a performance cookie used to collect data about people logging in and out of the website.',
    },
    OCD__parsely_visitor_description: {
      message:
        'JSON document uniquely identifying a browser and counting its sessions',
    },
    OCD__parsely_tpa_blocked_description: {
      message:
        'JSON document storing a flag indicating whether pixel.parsely.com is not accessible by the tracker',
    },
    OCD__parsely_slot_click_description: {
      message:
        'explicitly cleared on some tracker loads, JSON document storing positional information about a clicked internal link',
    },
    OCD__parsely_session_description: {
      message:
        'JSON document storing information identifying a browsing session according to Parsely’s proprietary definition',
    },
    OCD_test_description: {
      message:
        'This cookie is used to discover cookie support, value undefined',
    },
    OCD___editor_layout_description: {
      message:
        'Used for Codepen, which in turn is used for some blog articles and documentation',
    },
    OCD_codepen_session_description: {
      message: 'Used by CodePen when embedding CodePen snippets.',
    },
    OCD_codepen_signup_referrer_description: {
      message: 'Used by Codepen to store the signup referral platform',
    },
    OCD_codepen_signup_referrer_date_description: {
      message:
        'Used by Codepen to store the latest date of signup referral platform',
    },
    OCD_rl_user_id_description: {
      message:
        'Stores the user ID set via the identify API. All the subsequent event payloads will contain this data unless cleared from the storage.',
    },
    OCD_rl_trait_description: {
      message:
        'Stores the user traits object set via the identify API. All the subsequent event payloads will contain this data unless cleared from the storage.',
    },
    OCD_rl_anonymous_id_description: {
      message:
        'Stores the anonymous ID. By default, it would be the auto-generated unique ID by SDK for each visitor unless overridden via setAnonymousId API. All the subsequent event payloads will contain this data unless cleared from the storage.',
    },
    OCD_rl_group_id_description: {
      message:
        'Stores the user group ID set via the group API. All the subsequent group event payloads will contain this data unless cleared from the storage.',
    },
    OCD_rl_group_trait_description: {
      message:
        'Stores the user group traits object set via the group API. All the subsequent group event payloads will contain this data unless cleared from the storage.',
    },
    OCD_rl_page_init_referrer_description: {
      message:
        'Stores the initial referrer of the page when a user visits a site for the first time. All the subsequent event payloads will contain this data.',
    },
    OCD_rl_page_init_referring_domain_description: {
      message:
        'Stores the initial referring domain of the page when a user visits a site for the first time. All the subsequent event payloads will contain this data.',
    },
    OCD_test_rudder_cookie_description: {
      message:
        'Checks whether the cookie storage of a browser is accessible or not. Once checked, the SDK removes the cookie immediately.',
    },
    OCD_rl_session_description: {
      message:
        'Stores the session-related information including sessionId if session tracking is enabled.',
    },
    OCD_rl_auth_token_description: {
      message: 'Stores the authentication token passed by the user.',
    },
    OCD__biz_uid_description: {
      message: 'Uniquely identify a user on the current domain.',
    },
    OCD__biz_nA_description: {
      message:
        'A sequence number that Marketo Measure includes for all requests for internal diagnostics purposes.',
    },
    OCD__biz_flagsA_description: {
      message:
        'A cookie that stores various user information, such as form submission, cross-domain migration, view-through pixel, tracking opt-out status, etc.',
    },
    OCD__biz_pendingA_description: {
      message:
        'Temporarily stores analytics data until successfully sent to Marketo Measure server.',
    },
    OCD__biz_ABTestA_description: {
      message:
        'List of checksums from Optimizely and Visual Web Optimizer ABTests data that have already been reported, preventing bizible.js from resending collected data.',
    },
    OCD__biz_su_description: {
      message:
        'Universal user ID to identify a user across multiple domains, only applicable to tenants with integration bypassing ITP limitations.',
    },
    OCD__biz_EventA_description: {
      message:
        'Universal user ID to identify a user across multiple domains, only applicable to tenants with integration bypassing ITP limitations.',
    },
    RWS_rationale_https___socket_to_me_vip: {
      message:
        'A headless server to augment application that has a primary serverless architecture.',
    },
    RWS_rationale_https___deere_com: {
      message:
        'Both johndeere.com and deere.com share branding, logos, and terms and conditions. They are used interchangeably. The names themselves are associated to Deere & Company in the marketplace.',
    },
    RWS_rationale_https___player_pl: {
      message:
        'Streaming service that is owned by TVN S.A.. Information about the connection with TVN is included in the footer of this website',
    },
    RWS_rationale_https___prisjakt_no: {
      message:
        "Site owned by Schibsted with shared SSO across Schibsted Norway's sites and common branding that clearly shows the relation between the sites.",
    },
    RWS_rationale_https___mittanbud_no: {
      message:
        "Site owned by Schibsted with shared SSO across Schibsted Norway's sites and common branding that clearly shows the relation between the sites.",
    },
    RWS_rationale_https___pdmp_apis_no: {
      message:
        "Site owned by Schibsted that provides APIs for users across Schibsted's sites.",
    },
    RWS_rationale_https___elgrafico_com: {
      message: 'News portal owned by La Prensa Grafica Group',
    },
    RWS_rationale_https___eleconomista_net: {
      message: 'News portal owned by La Prensa Grafica Group',
    },
    RWS_rationale_https___ella_sv: {
      message: 'News portal owned by La Prensa Grafica Group',
    },
    RWS_rationale_https___grupolpg_sv: {
      message: 'Domain owned by La Prensa Grafica Group',
    },
    RWS_rationale_https___nidhiacademyonline_com: {
      message:
        'This website is a subpart of kaksya.in and is used to host Nidhi Academy educational content videos/notes and more.',
    },
    RWS_rationale_https___dewarmsteweek_be: {
      message: 'domain for a yearly campaign',
    },
    RWS_rationale_https___sporza_be: {
      message: 'sub brand for sports news',
    },
    RWS_rationale_https___een_be: {
      message: 'sub brand site',
    },
    RWS_rationale_https___radio2_be: {
      message: 'sub brand site',
    },
    RWS_rationale_https___radio1_be: {
      message: 'sub brand site',
    },
    RWS_rationale_https___geforcenow_com: {
      message:
        'A site that represents the WEB client for NVIDIA GEFORCE NOW service. Players are able to instantly stream their PC game library. NVIDIA branding is clearly visible on this site.',
    },
    RWS_rationale_https___meo_pt: {
      message:
        'MEO is a prominent telecommunications and entertainment provider in Portugal, offering a wide range of services including television, internet, phone, and mobile.',
    },
    RWS_rationale_https___tolteck_app: {
      message: 'Tolteck application',
    },
    RWS_rationale_https___24_hu: {
      message: 'Hungarian news portal',
    },
    RWS_rationale_https___startlap_hu: {
      message: 'Hungarian news aggregator site and link collection',
    },
    RWS_rationale_https___nlc_hu: {
      message: "Hungarian women's online magazine",
    },
    RWS_rationale_https___hazipatika_com: {
      message: 'Hungarian health portal',
    },
    RWS_rationale_https___nosalty_hu: {
      message: 'Hungarian recipe portal',
    },
    RWS_rationale_https___cognitive_ai_ru: {
      message:
        'This domain is our backend service that needs to share cookies with the main user-facing domain for authentication and session management.',
    },
    RWS_rationale_https___thirdspace_org_au: {
      message:
        'Similar content served in slightly different formats to different audiences',
    },
    RWS_rationale_https___p106_net: {
      message: 'Indonesia Junior High School',
    },
    RWS_rationale_https___smpn106jkt_sch_id: {
      message: 'Indonesia Junior High School',
    },
    RWS_rationale_https___intoday_in: {
      message:
        "The one-stop destination for all of India Today Group's digital properties.",
    },
    RWS_rationale_https___aajtak_in: {
      message:
        'aajtak.in is the fastest, most reliable, and most popular website of news in Hindi. It provides readers with the news of India and worldwide along with every significant information related to everyday life with complete authenticity',
    },
    RWS_rationale_https___businesstoday_in: {
      message: 'Top destination for business news, markets,  economy and more',
    },
    RWS_rationale_https___indiatoday_in: {
      message:
        'IndiaToday.in brings you news, analysis, explainers and opinion on a variety of subjects including politics, crime, civic issues, business, sports, technology, science, heatlh, lifestyle, and much more',
    },
    RWS_rationale_https___gnttv_com: {
      message:
        ' Good News Today is a website that focuses on the bright side of life and showcases stories of triumphs and positivity.',
    },
    RWS_rationale_https___indiatodayne_in: {
      message:
        'India Today NE is dedicated to covering news and views of India’s north-eastern region which includes eight states—Assam, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, Meghalaya and Sikkim',
    },
    RWS_rationale_https___ambitionbox_com: {
      message: 'Ambition box associated url',
    },
    RWS_rationale_https___infoedgeindia_com: {
      message: 'InfoEdge India website',
    },
    OCD___hs_cookie_cat_pref_description: {
      message:
        'This cookie is used to record the categories a visitor consented to.',
    },
    OCD___hs_gpc_banner_dismiss_description: {
      message:
        'This cookie is used when the Global Privacy Control banner is dismissed.',
    },
    OCD___hs_notify_banner_dismiss_description: {
      message:
        'This cookie is used when the website uses a Notify consent banner type.',
    },
    OCD_g_description: {
      message:
        'This domain is associated with the delivery of advertising material or scripts for advertising content. It is a service used by advertising agencies to optimize their online ad campaigns.',
    },
    OCD_retention_364_days: {
      message: '364 days',
    },
  },
  appliedFilters: {
    'analytics.category': {
      title: 'Category',
      hasStaticFilterValues: true,
      hasPrecalculatedFilterValues: true,
      filterValues: {
        Functional: {
          selected: true,
        },
        Marketing: {
          selected: true,
        },
      },
      sortValues: true,
      useGenericPersistenceKey: true,
    },
    isFirstParty: {
      title: 'Scope',
      hasStaticFilterValues: true,
      hasPrecalculatedFilterValues: true,
      filterValues: {
        'Third Party': {
          selected: true,
        },
      },
      useGenericPersistenceKey: true,
    },
    blockedReasons: {
      title: 'Blocked Reasons',
      hasStaticFilterValues: true,
      hasPrecalculatedFilterValues: true,
      enableSelectAllOption: true,
      isSelectAllOptionSelected: false,
      filterValues: {
        ThirdPartyPhaseout: {
          selected: true,
        },
        SameSiteUnspecifiedTreatedAsLax: {
          selected: true,
        },
        DomainMismatch: {
          selected: true,
        },
        NotOnPath: {
          selected: true,
        },
      },
      sortValues: true,
      useGenericPersistenceKey: true,
    },
    exemptionReason: {
      title: 'Exemption Reasons',
      hasStaticFilterValues: true,
      hasPrecalculatedFilterValues: true,
      enableSelectAllOption: true,
      isSelectAllOptionSelected: false,
      filterValues: {},
      useGenericPersistenceKey: true,
    },
  },
  dateTime: '24 July, 2024, 12:12:04pm Asia/Calcutta',
  psatVersion: '0.10.1-1',
};
