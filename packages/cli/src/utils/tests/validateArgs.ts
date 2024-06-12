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
import fse from 'fs-extra';

/**
 * Internal dependencies.
 */
import validateArgs from '../validateArgs';

describe('validateArgs', () => {
  let mockExit: jest.SpyInstance;

  beforeAll(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (code?: string | number | null | undefined) => undefined as never
    );
  });

  it('works with one arg', () => {
    // Mock exists and return true.
    jest.spyOn(fse, 'exists').mockImplementation(() => {
      return true;
    });

    // Mock mkdir and do nothing.
    jest.spyOn(fse, 'mkdir').mockImplementation(() => {
      return;
    });

    validateArgs('https://example.com', '', '', '', '', '', 9000);

    expect(mockExit).toHaveBeenCalledTimes(0);
  });

  it('exits process with 0 args', () => {
    // Mock exists and return true.
    jest.spyOn(fse, 'exists').mockImplementation(() => {
      return true;
    });

    // Mock mkdir and do nothing.
    jest.spyOn(fse, 'mkdir').mockImplementation(() => {
      return;
    });
    validateArgs('', '', '', '', '', '', 9000);

    expect(mockExit).toHaveBeenCalled();
  });

  it('exits process with more than 1 args', () => {
    // Mock exists and return true.
    jest.spyOn(fse, 'exists').mockImplementation(() => {
      return true;
    });

    // Mock mkdir and do nothing.
    jest.spyOn(fse, 'mkdir').mockImplementation(() => {
      return;
    });
    validateArgs(
      'https://example.com',
      'https://example.com/sitmap.xml',
      '',
      '',
      '',
      '',
      9000
    );

    expect(mockExit).toHaveBeenCalled();
  });

  it('exits process xml path is invalid', () => {
    // Mock exists and return true.
    jest.spyOn(fse, 'exists').mockImplementation(() => {
      return false;
    });

    validateArgs('', '', '', './path/list.xml', '', '', 9000);

    expect(mockExit).toHaveBeenCalled();
  });

  it('exits process if numberOfUrls is not numeric', () => {
    // Mock exists and return true.
    jest.spyOn(fse, 'exists').mockImplementation(() => {
      return true;
    });

    validateArgs('', '', '', './path/list.xml', 'a', '', 9000);

    expect(mockExit).toHaveBeenCalled();
  });

  afterAll(() => {
    mockExit.mockRestore();
  });
});
