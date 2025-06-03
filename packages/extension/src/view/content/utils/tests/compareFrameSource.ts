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
 * Internal dependencies.
 */
import compareFrameSource from '../compareFrameSource';

describe('compareFrameSource', () => {
  const expectedCases = [
    {
      origin: 'https://www.example.com', // from PS panel sidebar.
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'http://www.example.com',
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'www.example.com',
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'example.com',
      src: 'https://www.example.com/some/path',
      toBe: true,
    },
    {
      origin: 'https://bbc.com/',
      src: 'https://www.bbc.com',
      toBe: true,
    },
  ];

  it('should return true if frameSrc includes the cleaned frameOrigin', () => {
    expectedCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });

  const unexpectedCases = [
    {
      origin: 'https://www.different.com',
      src: 'https://www.example.com/some/path',
      toBe: false,
    },
    {
      origin: 'http://www.different.com',
      src: 'https://www.example.com/some/path',
      toBe: false,
    },
    {
      origin: 'www.different.com',
      src: 'https://www.example.com/some/path',
      toBe: false,
    },
  ];

  it('should return false if frameSrc does not include the cleaned frameOrigin', () => {
    unexpectedCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });

  const edgeCases = [
    {
      origin: '',
      src: '',
      toBe: true,
    },
    {
      origin: 'https://www.example.com',
      src: '',
      toBe: false,
    },
  ];

  it('should handle edge cases', () => {
    edgeCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });

  const realCases = [
    {
      origin: 'https://a4621041136.cdn.optimizely.com',
      src: 'https://a4621041136.cdn.optimizely.com/client_storage/a4621041136.html',
      toBe: true,
    },
    {
      origin:
        'https://05700d83f33eb7346a37437dfe41f3f9.safeframe.googlesyndication.com',
      src: 'https://05700d83f33eb7346a37437dfe41f3f9.safeframe.googlesyndication.com/safeframe/1-0-40/html/container.html',
      toBe: true,
    },
    {
      origin: 'https://elb.the-ozone-project.com',
      src: 'https://elb.the-ozone-project.com/static/load-cookie.html?gdpr=0&amp;gdpr_consent=&amp;usp_consent=1YNN&amp;pubcid=88e843a3-17fc-4662-a021-55d84c00c835&amp;publisherId=OZONEBBC4784&amp;siteId=8890582654&amp;cb=1696009943052&amp;bidder=ozone',
      toBe: true,
    },
    {
      origin: 'https://imasdk.googleapis.com',
      src: 'https://imasdk.googleapis.com/js/core/bridge3.593.1_debug_en.html#goog_2122308160',
      toBe: true,
    },
    {
      origin: 'https://ads.pubmatic.com',
      src: 'https://ads.pubmatic.com/AdServer/js/user_sync.html?kdntuid=1&amp;p=160262&amp;us_privacy=1---',
      toBe: true,
    },
    {
      origin: 'https://emp.bbc.com',
      src: '//emp.bbc.com/emp/SMPj/2.50.7/iframe.html',
      toBe: true,
    },
    {
      origin: 'https://pagead2.googlesyndication.com',
      src: 'https://pagead2.googlesyndication.com/pagead/s/cookie_push_onload.html#aHR0cHM6Ly9hLnRyaWJhbGZ1c2lvbi5jb20vaS5tYXRjaD9wPWI2JnU9Q0FFU0VGV2o1NXBDdnpPaXhUMTU3N09aYTBvJmdvb2dsZV9jdmVyPTEmZ29vZ2xlX3B1c2g9QVhjb09tU2plTnFoV0RWS3FQemdVTlAtXzdEandPTUp1dW5PNEdJeGlJczNvZ3BOb2g0YnhkZ3lBVWUwdWc0dGp0a01yVDZ0UHhVX05hZFRvbENzY3VPV1VEc2oycFY0Z1FYNndrQXpCanJZdzJ6ZklsNFNzTDFWWlE3eHcyVjNtalUzUmhSb3RPN0xQSmI5NlJERmJrRkhzRFUmcmVkaXJlY3Q9aHR0cHMlM0EvL2NtLmcuZG91YmxlY2xpY2submV0L3BpeGVsJTNGZ29vZ2xlX25pZCUzRGV4cCUyNmdvb2dsZV9wdXNoJTNEQVhjb09tU2plTnFoV0RWS3FQemdVTlAtXzdEandPTUp1dW5PNEdJeGlJczNvZ3BOb2g0YnhkZ3lBVWUwdWc0dGp0a01yVDZ0UHhVX05hZFRvbENzY3VPV1VEc2oycFY0Z1FYNndrQXpCanJZdzJ6ZklsNFNzTDFWWlE3eHcyVjNtalUzUmhSb3RPN0xQSmI5NlJERmJrRkhzRFUlMjZnb29nbGVfdWxhJTNEMjc4Njk1NCUyNmdvb2dsZV9obSUzRCUyNFRGX1VTRVJfSURfRU5DJTI0,aHR0cHM6Ly9jMS5hZGZvcm0ubmV0L3NlcnZpbmcvY29va2llL21hdGNoLz9wYXJ0eT0xJmdvb2dsZV9naWQ9Q0FFU0VDS1lIN2tpc3cwb0NqVEZHcnRqTEpnJmdvb2dsZV9jdmVyPTEmZ29vZ2xlX3B1c2g9QVhjb09tUTBBd1BzSzZXVmxYRExoVWJ4TmtWX0J2cEwyRnVKQkFmYjl6UHAyMzlXd3A2NE5FTHJiaDc3TlBDU0pfNm5tZkgtSDlSQVhQLUdkdHc4Y3R5QzFPSF9SNkJ2MUVoQ3pfNFp6TWJ5SkdFa3ZtR3FaVGNtSndjRWw0U1lMaV9ENFNkSlIxbk5YREtheDlyd3pMTkp3dw==,aHR0cHM6Ly9jcy5jaG9jb2xhdGVwbGF0Zm9ybS5jb20vcHViP3BpZD1lYmRhJmdvb2dsZV9naWQ9Q0FFU0VOc1lheFhJOVFzbEJwOUwzMkw4QVpnJmdvb2dsZV9jdmVyPTEmZ29vZ2xlX3B1c2g9QVhjb09tUVR5VEhZSGVQeHhCX1V2X0VmTlRpUlFMb1RQOGFmcUZaRHBuRUc4UDVEZ0hoU2VhdzZEakQ5eUF6SlJnVm5tTmphelgwR1NjbDVJQ2tiZm1mOFRfRmhySzUtdDVWQ0dYUnJBdFA2NWVuT092RHdQUjVoQVBaWkxrczlpR1lhTEFtRk0zS0tubl9YMUZFTmZpY0h3ZHM=,aHR0cHM6Ly9vbmV0YWctc3lzLmNvbS9tYXRjaC8_aW50X2lkPTEwNiZyZWRpcj0xJmdvb2dsZV9naWQ9Q0FFU0VDZkViSFY5R3Z3amlLU0pRM3BVeENZJmdvb2dsZV9jdmVyPTEmZ29vZ2xlX3B1c2g9QVhjb09tU1BEVXRPdGxSWWgtTFM0VVRRWGVGVl9YYlA0X0FpQng2R05LNWxLcWxwUUw5enRPbFZKNWhtQktZM1Z3OWVtN2dsb21MZzVHZmdDRDZLREFYVi1ad0J1LWRZX1ladXlmbzljRXhoZWU4U2VrUWJhSUlsWUZPWEtwMlpzX1RDUl9VY0MyTnAtVHRCdnBRQUxIMzJjSExX,aHR0cHM6Ly9jbS5nLmRvdWJsZWNsaWNrLm5ldC9waXhlbC9hdHRyP2Q9QUhORjEzS3F3Q0xDOE1tc19KSEpBOEFqX29uVjFPdDE1Q0xQSF9jbnluemU4YVozYTd6cms4N01HUQ==',
      toBe: true,
    },
  ];

  it('should handle real cases', () => {
    realCases.forEach((testCase) => {
      expect(compareFrameSource(testCase.origin, testCase.src)).toBe(
        testCase.toBe
      );
    });
  });
});
