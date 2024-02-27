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
import filterMatchesBasedOnExceptions from '../filterMatchesBasedOnExceptions';

describe('Should filter signatures given in exception for the given domain only', () => {
  it('Should filter only the given signature from the given main domain', () => {
    const exceptions = {
      'linkedin.com': {
        signatures: ['opt_out_or_no_session'],
        subDomains: [],
      },
    };
    const domain = '.linkedin.com';

    const matches = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
      {
        feature: {
          type: 'link',
          text: 'opt_out_or_no_session',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    const expectedResult = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    expect(filterMatchesBasedOnExceptions(domain, exceptions, matches)).toEqual(
      expectedResult
    );
  });

  it("Shouldn't filter from the subdomain ", () => {
    const exceptions = {
      'linkedin.com': {
        signatures: ['opt_out_or_no_session'],
        subDomains: [],
      },
    };
    const domain = 'in.linkedin.com';

    const matches = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
      {
        feature: {
          type: 'link',
          text: 'opt_out_or_no_session',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    expect(filterMatchesBasedOnExceptions(domain, exceptions, matches)).toEqual(
      matches
    );
  });

  it('should filter from subdomain if subdomain is given in exception ', () => {
    const exceptions = {
      'linkedin.com': {
        signatures: ['opt_out_or_no_session'],
        subDomains: ['in'],
      },
    };
    const domain = 'in.linkedin.com';

    const matches = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
      {
        feature: {
          type: 'link',
          text: 'opt_out_or_no_session',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    const expectedResult = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    expect(filterMatchesBasedOnExceptions(domain, exceptions, matches)).toEqual(
      expectedResult
    );
  });

  it('should filter all signatures from subdomain if subdomain is given in exception ', () => {
    const exceptions = {
      'linkedin.com': {
        signatures: ['opt_out_or_no_session', 'GoogleAuth'],
        subDomains: ['in'],
      },
    };
    const domain = 'in.linkedin.com';

    const matches = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
      {
        feature: {
          type: 'link',
          text: 'opt_out_or_no_session',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    const expectedResult = [];

    expect(filterMatchesBasedOnExceptions(domain, exceptions, matches)).toEqual(
      expectedResult
    );
  });

  it('should filter nothing if its not specified in the exception ', () => {
    const exceptions = {};
    const domain = 'in.linkedin.com';

    const matches = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
      {
        feature: {
          type: 'link',
          text: 'opt_out_or_no_session',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    expect(filterMatchesBasedOnExceptions(domain, exceptions, matches)).toEqual(
      matches
    );
  });

  it('should from main domain even if subDomain is present and not given as input ', () => {
    const exceptions = {
      'linkedin.com': {
        signatures: ['opt_out_or_no_session', 'GoogleAuth'],
        subDomains: ['in'],
      },
    };
    const domain = 'linkedin.com';

    const matches = [
      {
        feature: {
          type: 'link',
          text: 'GoogleAuth',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
      {
        feature: {
          type: 'link',
          text: 'opt_out_or_no_session',
          url: 'https://developers.google.com/identity/gsi/web/guides/migration#object_migration_reference_for_user_sign-in',
        },
      },
    ];

    const expectedResult = [];

    expect(filterMatchesBasedOnExceptions(domain, exceptions, matches)).toEqual(
      expectedResult
    );
  });
});
