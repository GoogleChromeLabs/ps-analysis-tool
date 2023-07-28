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
import { checkIBCCompliance } from '../checkIBCCompliance';

describe('checkIBCCompliance: ', () => {
  it('Should be true when SameSite=None, Secure=True and cookie is not present in cookieStore', () => {
    expect(checkIBCCompliance('none', true, false)).toBe(false);
  });

  it('Should be false when SameSite=None, Secure=true and cookie is present in cookieStore', () => {
    expect(checkIBCCompliance('none', false, true)).toBe(false);
  });

  it('Should be true when SameSite=None, Secure=false and cookie not is present in cookieStore', () => {
    expect(checkIBCCompliance('none', false, false)).toBe(true);
  });

  it('Should be false when SameSite=None, Secure=false and cookie is present in cookieStore', () => {
    expect(checkIBCCompliance('none', false, true)).toBe(false);
  });

  it('Should be true when SameSite=Lax or Strict, Secure=false and cookie is present in cookieStore', () => {
    expect(checkIBCCompliance('lax', false, true)).toBe(true);
    expect(checkIBCCompliance('Strict', false, true)).toBe(true);
  });

  it('Should be false when SameSite=Lax or Strict, Secure=false and cookie not is present in cookieStore', () => {
    expect(checkIBCCompliance('lax', false, false)).toBe(false);
    expect(checkIBCCompliance('Strict', false, false)).toBe(false);
  });
});
